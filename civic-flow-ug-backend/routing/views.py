from rest_framework import permissions, viewsets

from .models import RoutingRule
from .serializers import RoutingRuleSerializer


class RoutingRuleViewSet(viewsets.ModelViewSet):
    queryset = RoutingRule.objects.select_related(
        "category",
        "district",
        "agency",
        "priority",
        "assigned_team",
    ).all()
    serializer_class = RoutingRuleSerializer
    permission_classes = [permissions.IsAuthenticated]
