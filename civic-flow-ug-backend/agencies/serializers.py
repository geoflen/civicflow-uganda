from rest_framework import serializers

from .models import Agency


class AgencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Agency
        fields = [
            "id",
            "name",
            "code",
            "type",
            "parent_agency",
            "district",
            "contact_email",
            "is_active",
            "created_at",
        ]
        read_only_fields = ["created_at"]
