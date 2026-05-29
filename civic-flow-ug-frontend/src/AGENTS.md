<!-- BEGIN:nextjs-agent-rules -->
#  Coding style
 - Write comments to document
 # 1. TECH STACK (FINALIZED)
Backend
Component	Choice
Framework	Django 5 + DRF
Database	PostgreSQL + PostGIS
Queue	Celery
Cache/Broker	Redis
Auth	JWT (SimpleJWT)
File Storage	S3-compatible
Background Tasks	Celery Beat
Frontend
Component	Choice
Framework	Next.js 15
Styling	TailwindCSS
UI Components	shadcn/ui
Charts	Recharts
Maps	Leaflet
Tables	TanStack Table

# 1. Exact Problem Statement
-Current Situation

-Citizens experience poor public service delivery but lack a structured, transparent, and accountable mechanism to report and track issues.

Complaints are currently fragmented across:

social media,
phone calls,
RDC offices,
WhatsApp groups,
paper forms,
and local leaders.

As a result:

issues go unresolved,
accountability is weak,
escalation is inconsistent,
and government lacks reliable operational data for decision-making.

# 2. Proposed Solution
CivicFlow (working name)

A centralized digital citizen engagement and service escalation platform enabling citizens to:

report public service issues,
track resolution progress,
receive updates,
escalate unresolved complaints,
and provide feedback after resolution.

Government agencies receive:

routed complaints,
resolution workflows,
analytics dashboards,
SLA monitoring,
and geographic service intelligence.


#CivicFlow — GovTech Platform Design

#Your UI must communicate:

trust,
accountability,
operational intelligence,
simplicity.

GovTech UX should feel:

clean,
institutional,
efficient,
mobile-friendly.

Not flashy startup aesthetics.

# 3. Primary Users
Citizens

People reporting:

water issues,
corruption,
road damage,
garbage,
school/service complaints,
utility failures.
Government Officers

Handle assigned cases.

Examples:

district engineers,
health inspectors,
municipal officers,
utility operators.
Supervisors

Monitor performance and escalations.

Examples:

CAOs,
ministry directors,

# 4. MVP Core Modules
A. Citizen Reporting Module

Features:

submit issue
attach photos/videos
GPS location
category selection
anonymous option
Example categories
Roads
Water
Health
Education
Sanitation
Corruption
Security
Electricity
B. Ticket Management System

Features:

issue tracking number
status updates
assignment
comments/internal notes
resolution logging
Status flow

New → Assigned → In Progress → Resolved → Closed

C. Escalation Engine

Rules-based escalation:

unresolved after X days,
auto-forward to supervisor,
overdue alerts,
SLA monitoring.

This is a major differentiator.

D. Analytics Dashboard

Metrics:

complaints by district
resolution time
unresolved backlog
hotspot maps
agency performance
category trends
E. Notification System

Channels:

SMS
Email
WhatsApp (future)

Citizens receive:

ticket created
updates
resolution notifications
RDC offices.

# DESIGN LANGUAGE
Recommended Style
Visual Personality
Modern government infrastructure
Clean dashboards
High readability
Data-centric
Operational clarity

Think:

Stripe dashboard meets government workflows.
Color Direction
Primary

Deep Blue
→ trust + institutional feel

Secondary

Teal/Green
→ service delivery & progress

Alert Colors
Amber = pending
Red = escalated
Green = resolved
Typography
Recommended
Inter

Why:

excellent readability,
dashboard-friendly,
modern.
UI Principles
Prioritize:
accessibility,
clarity,
mobile responsiveness,
low cognitive load.
# DESIGN SYSTEM STRUCTURE
Components You’ll Need
Inputs
text fields
dropdowns
text areas
location picker
Data Components
tables
charts
KPI cards
maps
timelines
Workflow Components
status badges
escalation indicators
SLA timers
activity feeds


# Dashboard KPI
-KPI row
    -Total complaints
    -Active Escalations
    -SLA compliance
    -district rankings
-Maps section
    -Heatmap
        - Complaint density
        -issue hotspots
- Trends
    -Complaints over time
    -agency performance
    -Category trends
    -Escaltion growth
# Complaint Detail Page

    -Complaint Summary
    --------------------------------
    -Ticket ID
    -Category
    -Priority
    -Location
    -Citizen Info

    Tabs:
    - Activity Timeline
    - Attachments
    - Escalations
    - Internal Notes
# Dashboard layout
------------------------------------------------
Sidebar
------------------------------------------------
Dashboard
Assigned Cases
Escalations
Map View
Reports
Notifications
------------------------------------------------

Main Content
------------------------------------------------
KPI Cards
- Assigned Today
- Overdue Cases
- Resolved Today
- SLA Compliance

Complaint Table

Recent Activity Feed
Map Widget
------------------------------------------------


# A. Landing Page
Purpose

Build trust immediately.

Layout
------------------------------------------------
HEADER
Logo | Report Issue | Track Issue | Help
------------------------------------------------

HERO SECTION
"Report Public Service Issues Transparently"

[ Report an Issue ] button

------------------------------------------------

SERVICE CATEGORIES
 Roads | Water | Health | Sanitation
------------------------------------------------

HOW IT WORKS
1. Report
2. Track
3. Resolve
------------------------------------------------

LIVE METRICS
- Issues resolved
- Active districts
- Avg response time
------------------------------------------------
FOOTER


# 2. HIGH-LEVEL SYSTEM ARCHITECTURE
Citizen Web App
        │
Officer/Admin Portal
        │
        ▼
API Gateway (Django DRF)
        │
 ┌───────────────┬──────────────┬──────────────┐
 │ Complaints    │ Routing      │ Escalation   │
 │ Module        │ Engine       │ Engine       │
 └───────────────┴──────────────┴──────────────┘
        │
 ┌───────────────┬──────────────┬──────────────┐
 │ Notifications │ Analytics    │ Audit Logs   │
 └───────────────┴──────────────┴──────────────┘
        │
        ▼
PostgreSQL + PostGIS
        │
        ▼
Redis + Celery
        │
        ▼
Email/SMS/WhatsApp Providers