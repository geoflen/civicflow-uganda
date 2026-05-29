import uuid
from django.db import models
from django.contrib.gis.db import models as gis_models


class District(models.Model):
    """Administrative district / region geometry."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    region = models.CharField(max_length=100, blank=True)
    geo_boundary = gis_models.GeometryField(null=True, blank=True, srid=4326)

    class Meta:
        verbose_name = "District"
        verbose_name_plural = "Districts"

    def __str__(self):
        return f"{self.name} ({self.region})" if self.region else self.name
