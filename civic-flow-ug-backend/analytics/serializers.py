from rest_framework import serializers

from .models import AnalyticsSnapshot


class AnalyticsSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalyticsSnapshot
        fields = ["id", "name", "data", "generated_at"]
        read_only_fields = ["id", "generated_at"]
