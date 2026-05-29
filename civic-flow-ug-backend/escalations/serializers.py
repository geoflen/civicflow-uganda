from rest_framework import serializers

from .models import EscalationRule


class EscalationRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EscalationRule
        fields = ["id", "name", "days_unresolved", "target_role", "active", "created_at"]
        read_only_fields = ["id", "created_at"]
