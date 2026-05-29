from rest_framework import serializers

from .models import Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus


class ComplaintCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintCategory
        fields = ["id", "name", "slug", "description", "is_active", "created_at"]


class ComplaintStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintStatus
        fields = ["id", "name", "is_active"]


class ComplaintPrioritySerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintPriority
        fields = ["id", "name", "level", "is_active"]


class ComplaintSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Complaint
        fields = [
            "id",
            "ticket_number",
            "title",
            "description",
            "category",
            "status",
            "priority",
            "created_by",
            "assigned_to",
            "agency",
            "district",
            "latitude",
            "longitude",
            "address_text",
            "is_anonymous",
            "sla_due_at",
            "resolved_at",
            "closed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["ticket_number", "created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)



class PublicComplaintSerializer(serializers.ModelSerializer):
    category = ComplaintCategorySerializer(read_only=True)
    status = ComplaintStatusSerializer(read_only=True)
    priority = ComplaintPrioritySerializer(read_only=True)
    created_by = serializers.SerializerMethodField()
    assigned_to = serializers.SerializerMethodField()

    class Meta:
        model = Complaint
        fields = [
            "id",
            "ticket_number",
            "title",
            "description",
            "category",
            "status",
            "priority",
            "created_by",
            "assigned_to",
            "latitude",
            "longitude",
            "address_text",
            "is_anonymous",
            "created_at",
            "updated_at",
        ]

    def get_created_by(self, obj):
        if obj.is_anonymous:
            return None
        return obj.created_by.get_full_name() or obj.created_by.username

    def get_assigned_to(self, obj):
        if not obj.assigned_to:
            return None
        return obj.assigned_to.get_full_name() or obj.assigned_to.username
