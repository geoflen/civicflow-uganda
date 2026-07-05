# CivicFlowUG — GeoDjango + Docker PostGIS Setup

Clean setup guide for the geospatial stack (PostGIS via Docker + GDAL/GEOS
locally). Follow this top to bottom for a fresh machine setup — it reflects
the final working configuration, not the troubleshooting path that got us
here.

> **Note:** This project already has a `docker-compose.yml` that stands up
> the whole stack (backend, PostGIS, Redis, Celery) in one command — see
> §0 below. If you're setting up fresh, start there; it covers the database
> entirely and avoids the manual `docker run` steps in §2. Sections 2–3
> (manual `docker run`) are kept here for reference/troubleshooting, since
> that's the path this doc was originally built from.

---

## 0. Recommended path: `docker-compose.yml`

The repo includes a compose file that orchestrates the full stack:

```yaml
version: '3.9'

services:
  backend:
    build: .
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgis/postgis:16-3.4
    environment:
      POSTGRES_DB: civicflow
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres

  redis:
    image: redis:7

  celery:
    build: .
    command: celery -A config worker -l info
    depends_on:
      - redis
      - postgres
```

**What each service does:**

| Service | Purpose |
|---|---|
| `backend` | Runs the Django app via Gunicorn, mounts local code for live changes, exposes port 8000 |
| `postgres` | PostGIS 3.4 on Postgres 16, auto-creates the `civicflow` DB on first run via env vars — no manual `CREATE DATABASE`/`CREATE EXTENSION` step needed |
| `redis` | Message broker for Celery |
| `celery` | Background worker for async tasks (notifications, SLA escalation checks, etc.), matching `celery`/`redis`/`django-celery-beat` in `requirements.txt` |

**Start the whole stack:**

```bash
docker compose up -d
```

**Run migrations inside the running backend container:**

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

**View logs / stop:**

```bash
docker compose logs -f backend
docker compose down          # stops containers, keeps data volume
docker compose down -v       # stops and wipes the database volume too
```

**One gap to be aware of:** the `backend` and `celery` images build from your
project's own `Dockerfile`, which needs GDAL/GEOS installed **inside the
image** (via `apt-get install gdal-bin libgdal-dev libgeos-dev libproj-dev`,
per §9) for GeoDjango to work inside the container. This is separate from
installing GDAL on your Mac host (§4) — the host install is only needed if
you run `python manage.py ...` directly outside of Docker.

If you're running everything through Compose, you can skip straight to §5
(Django settings) and §6 (migrations), pointing `DATABASES` at the
`postgres` service name (not `localhost`) when running inside containers:

```python
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": "civicflow",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "postgres",  # service name from docker-compose.yml, not localhost
        "PORT": "5432",       # internal container port, not the host-mapped 5433 from §2
    }
}
```

---

## 1. Prerequisites (manual/non-Compose path)

- Docker Desktop installed and running (`docker ps` should return an empty
  table, not an error)
- Homebrew installed (macOS)
- Python 3.12 + project virtualenv already created

---

## 2. Database: Postgres + PostGIS via Docker

We run Postgres + PostGIS as a Docker container rather than relying on a
native Postgres install having a matching PostGIS build. This avoids version
mismatch issues entirely — the image ships both already compiled together.

**Start the container:**

```bash
docker run --name civicflow-postgis \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=civicflow \
  -p 5433:5432 \
  -d postgis/postgis:17-3.4
```

- Runs on host port **5433** (not 5432) to avoid clashing with any other
  local Postgres install.
- `postgis/postgis:17-3.4` = Postgres 17 + PostGIS 3.4, pre-built together.

**Check it's up:**

```bash
docker ps
docker logs civicflow-postgis
```

Look for `database system is ready to accept connections` in the logs.

**Verify PostGIS is active:**

```bash
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -d civicflow \
  -c "SELECT PostGIS_Version();"
```

Should return something like `3.4 USE_GEOS=1 USE_PROJ=1 USE_STATS=1`.

**Everyday container commands:**

```bash
docker stop civicflow-postgis     # stop it
docker start civicflow-postgis    # start it again (data persists)
docker rm -f civicflow-postgis    # remove entirely (data lost — see backups below)
```

---

## 3. Backing up / restoring the container's database

Docker containers are disposable — if you ever remove and recreate this
container, you'll lose the data unless you dump it first.

**Dump:**

```bash
PGPASSWORD=postgres pg_dump -h localhost -p 5433 -U postgres -d civicflow \
  -F c -f civicflow.dump
```

**Restore (into a fresh container):**

```bash
PGPASSWORD=postgres pg_restore -h localhost -p 5433 -U postgres \
  -d civicflow civicflow.dump
```

---

## 4. GDAL + GEOS (local install, not Dockerized)

GDAL and GEOS are installed natively via Homebrew — Django's GeoDjango layer
needs to `dlopen` these libraries directly from the host machine, so they
stay outside Docker.

```bash
brew install gdal
brew install geos
```

**Why you need to set explicit library paths in `settings.py`:** Django's
GDAL/GEOS loader guesses a hardcoded list of possible library names/versions.
Homebrew tracks newer GDAL releases faster than Django's guess-list gets
updated, and Homebrew's libraries also aren't always found automatically by
Python's library lookup on macOS. Setting the path explicitly skips the
guessing entirely.

**Find the actual paths:**

```bash
ls -la /usr/local/lib/libgdal.dylib
ls -la /usr/local/lib/libgeos_c.dylib
```

Both should resolve as symlinks into `/usr/local/Cellar/...`. If either is
missing, `brew install gdal` / `brew install geos` again, or `brew link gdal`
if it's installed but not linked.

**Add to `settings.py`:**

```python
GDAL_LIBRARY_PATH = "/usr/local/lib/libgdal.dylib"
GEOS_LIBRARY_PATH = "/usr/local/lib/libgeos_c.dylib"
```

**Sanity check GDAL loads independently of Django** (isolates GDAL problems
from Django/settings problems):

```bash
python3 -c "from ctypes import CDLL; CDLL('/usr/local/lib/libgdal.dylib')"
```

No output = success.

### Common Homebrew pitfall: dependency drift

If GDAL later throws something like:

```
OSError: dlopen(/usr/local/lib/libgdal.dylib, ...)
Library not loaded: /usr/local/opt/openjph/lib/libopenjph.0.27.dylib
```

this means a `brew upgrade` bumped a shared dependency (e.g. `openjph`,
used by `openexr`, used by `gdal`) without rebuilding everything that links
against it. Fix:

```bash
find /usr/local/Cellar -maxdepth 2 -type d -name "*.reinstall" -exec sudo rm -rf {} +
brew update && brew upgrade && brew cleanup
brew reinstall gdal
```

The `find ... -name "*.reinstall"` step clears out stale staging folders left
behind by any previously interrupted `brew upgrade` — these will otherwise
block future upgrades with errors like `is not a directory`.

---

## 5. Django settings

```python
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": "civicflow",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",
        "PORT": "5433",
    }
}

GDAL_LIBRARY_PATH = "/usr/local/lib/libgdal.dylib"
GEOS_LIBRARY_PATH = "/usr/local/lib/libgeos_c.dylib"

INSTALLED_APPS = [
    ...
    "django.contrib.gis",
    ...
]
```

---

## 6. Running migrations

```bash
python manage.py migrate
```

### Known gotcha: switching a model's `id` from integer to UUID

If a model's primary key is changed from the default auto-incrementing
integer to `UUIDField`, Django's autogenerated migration will try:

```python
migrations.AlterField(
    model_name="somemodel",
    name="id",
    field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
),
```

This **always fails** on Postgres, regardless of whether the table has data,
because Postgres has no cast from `bigint`/`integer` to `uuid`:

```
psycopg2.errors.CannotCoerce: cannot cast type bigint to uuid
```

**Fix:** in the migration file, replace the `AlterField` with a
`RemoveField` + `AddField` pair for that column:

```python
migrations.RemoveField(
    model_name="somemodel",
    name="id",
),
migrations.AddField(
    model_name="somemodel",
    name="id",
    field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False),
),
```

This drops and recreates the column rather than trying to cast it — fine for
early-stage dev data, but means any existing rows in that table are lost
(truncate related/dependent tables first if needed, and repopulate after).

This project had four migrations with this exact pattern: `agencies`,
`complaints` (three separate models in one file), `routing`, and
`notifications`. All were patched this way.

---

## 7. Resetting migrations cleanly (only if starting fresh dev data)

If migration history has accumulated patches like the above and you want a
clean baseline instead of carrying the patched migrations forward:

```bash
# ONLY run from inside your own app folders — never from repo root,
# to avoid deleting Django's own package files inside venv/
find ./agencies/migrations ./users/migrations ./complaints/migrations \
     ./routing/migrations ./notifications/migrations \
     ./districts/migrations ./analytics/migrations ./audit_logs/migrations \
     ./escalations/migrations -type f -not -name "__init__.py" -delete

# drop and recreate the database
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -c "DROP DATABASE civicflow;"
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -c "CREATE DATABASE civicflow;"
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -d civicflow -c "CREATE EXTENSION postgis;"

# regenerate clean migrations from current models
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

**⚠️ Never run a bulk `find ... -delete` from the project root.** A command
like `find . -path "*/migrations/*.py" -delete` will also match and delete
Django's own internal files inside `venv/lib/.../site-packages/django/`,
breaking your Django installation entirely. Always scope `find` to your own
app directories explicitly, as above.

If that happens by accident, restore your exact pinned dependency versions:

```bash
pip install -r requirements.txt --force-reinstall
pip check
```

---

## 8. Keeping `requirements.txt` authoritative

This project pins exact versions in `requirements.txt` (Django 4.2.30, etc.).
Never run a bare `pip install <package>` without a version — it silently
pulls latest and can drift the environment away from what's actually tested.

```bash
# correct way to install/reinstall matching the pinned versions
pip install -r requirements.txt

# after intentionally adding/upgrading a package, re-pin everything
pip freeze > requirements.txt
```

---

## 9. Production note

Don't replicate the Homebrew/native GDAL setup in production — Homebrew's
dependency tracking is prone to the drift issue described in §4. For
deployment, install GDAL via `apt` in a Docker image instead, and use a
managed Postgres with PostGIS enabled (or the `postgis/postgis` image):

```dockerfile
FROM python:3.12-slim
RUN apt-get update && apt-get install -y \
    gdal-bin \
    libgdal-dev \
    libgeos-dev \
    libproj-dev \
    postgresql-client
```

Pin exact GDAL/GEOS/PROJ versions once a known-good combination is confirmed.

---

## 10. Quick reference — full command list

```bash
# Start PostGIS container
docker run --name civicflow-postgis \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=civicflow \
  -p 5433:5432 \
  -d postgis/postgis:17-3.4

# Verify PostGIS
PGPASSWORD=postgres psql -h localhost -p 5433 -U postgres -d civicflow \
  -c "SELECT PostGIS_Version();"

# Install GDAL/GEOS locally
brew install gdal geos

# Verify GDAL loads
python3 -c "from ctypes import CDLL; CDLL('/usr/local/lib/libgdal.dylib')"

# Fix Homebrew dependency drift if it occurs
find /usr/local/Cellar -maxdepth 2 -type d -name "*.reinstall" -exec sudo rm -rf {} +
brew update && brew upgrade && brew cleanup && brew reinstall gdal

# Run migrations
python manage.py migrate

# Install exact pinned dependencies
pip install -r requirements.txt
```
