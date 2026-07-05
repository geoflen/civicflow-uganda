from django.contrib.auth import get_user_model
from django.contrib.gis.geos import Point
from django.core.files.storage import default_storage
from django.utils.text import slugify
from rest_framework import serializers

from districts.models import District

from .models import (
    Complaint,
    ComplaintAttachment,
    ComplaintCategory,
    ComplaintPriority,
    ComplaintStatus,
)


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
            "contact_phone",
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



class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintAttachment
        fields = ["id", "file_url", "file_type", "uploaded_at"]


class PublicComplaintCreateSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField()
    category = serializers.CharField(max_length=150)
    district = serializers.CharField(max_length=200, required=False, allow_blank=True)
    address_text = serializers.CharField(required=False, allow_blank=True)
    latitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False, allow_null=True)
    longitude = serializers.DecimalField(max_digits=9, decimal_places=6, required=False, allow_null=True)
    contact_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    is_anonymous = serializers.BooleanField(required=False, default=False)
    attachments = serializers.ListField(
        child=serializers.FileField(),
        required=False,
        allow_empty=True,
        write_only=True,
    )

    def validate_attachments(self, files):
        for uploaded_file in files:
            content_type = uploaded_file.content_type or ""
            if not (content_type.startswith("image/") or content_type.startswith("video/")):
                raise serializers.ValidationError("Only image and video attachments are supported.")
        return files

    def create(self, validated_data):
        attachments = validated_data.pop("attachments", [])
        category_name = validated_data.pop("category").strip()
        district_name = validated_data.pop("district", "").strip()
        latitude = validated_data.get("latitude")
        longitude = validated_data.get("longitude")

        category, _ = ComplaintCategory.objects.get_or_create(
            name__iexact=category_name,
            defaults={"name": category_name, "slug": slugify(category_name), "is_active": True},
        )
        status, _ = ComplaintStatus.objects.get_or_create(name="Submitted", defaults={"is_active": True})
        priority, _ = ComplaintPriority.objects.get_or_create(
            name="Medium",
            defaults={"level": 20, "is_active": True},
        )
        district = None
        if district_name:
            district, _ = District.objects.get_or_create(name__iexact=district_name, defaults={"name": district_name})

        User = get_user_model()
        public_user, _ = User.objects.get_or_create(
            username="public-citizen",
            defaults={
                "first_name": "Public",
                "last_name": "Citizen",
                "role": "citizen",
                "is_active": False,
            },
        )

        if latitude is not None and longitude is not None:
            validated_data["location_geom"] = Point(float(longitude), float(latitude), srid=4326)

        complaint = Complaint.objects.create(
            **validated_data,
            category=category,
            status=status,
            priority=priority,
            district=district,
            created_by=public_user,
        )

        for uploaded_file in attachments:
            path = default_storage.save(
                f"complaint_attachments/{complaint.ticket_number}/{uploaded_file.name}",
                uploaded_file,
            )
            ComplaintAttachment.objects.create(
                complaint=complaint,
                file_url=default_storage.url(path),
                file_type=uploaded_file.content_type or "application/octet-stream",
            )

        return complaint


class PublicComplaintSerializer(serializers.ModelSerializer):
    category = ComplaintCategorySerializer(read_only=True)
    status = ComplaintStatusSerializer(read_only=True)
    priority = ComplaintPrioritySerializer(read_only=True)
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)
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
            "contact_phone",
            "is_anonymous",
            "attachments",
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
