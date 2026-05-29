from rest_framework import permissions, viewsets

from .models import AnalyticsSnapshot
from .serializers import AnalyticsSnapshotSerializer


class AnalyticsSnapshotViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = AnalyticsSnapshot.objects.all().order_by("-generated_at")
	serializer_class = AnalyticsSnapshotSerializer
	permission_classes = [permissions.IsAuthenticated]
