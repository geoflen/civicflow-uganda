from rest_framework import serializers

from .models import RoutingRule


class RoutingRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutingRule
        fields = [
            "id",
            "category",
            "district",
            "agency",
            "priority",
            "assigned_team",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
