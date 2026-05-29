"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from agencies.views import AgencyViewSet
from complaints.views import (
    ComplaintCategoryViewSet,
    ComplaintStatusViewSet,
    ComplaintViewSet,
    TicketTrackAPIView,
)
from users.views import UserViewSet
from routing.views import RoutingRuleViewSet
from escalations.views import EscalationRuleViewSet
from notifications.views import NotificationViewSet
from analytics.views import AnalyticsSnapshotViewSet
from audit_logs.views import AuditLogViewSet

router = DefaultRouter()
router.register("complaints", ComplaintViewSet, basename="complaint")
router.register("complaint-categories", ComplaintCategoryViewSet, basename="complaint-category")
router.register("complaint-statuses", ComplaintStatusViewSet, basename="complaint-status")
router.register("agencies", AgencyViewSet, basename="agency")
router.register("users", UserViewSet, basename="user")
router.register("routing-rules", RoutingRuleViewSet, basename="routing-rule")
router.register("escalations", EscalationRuleViewSet, basename="escalation-rule")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("analytics", AnalyticsSnapshotViewSet, basename="analytics")
router.register("audit-logs", AuditLogViewSet, basename="auditlog")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(router.urls)),
    path("api/v1/complaints/track/<str:ticket_number>/", TicketTrackAPIView.as_view(), name="ticket_track"),
    path("api/v1/auth/", include("authentication.urls")),
]
