from django.contrib import admin

from .models import Complaint, ComplaintActivityLog, ComplaintAttachment, ComplaintCategory, ComplaintPriority, ComplaintStatus


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ("ticket_number", "title", "status", "priority", "created_by", "created_at")
    list_filter = ("status", "priority", "created_at")
    search_fields = ("ticket_number", "title", "description")


@admin.register(ComplaintCategory)
class ComplaintCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "is_active", "created_at")
    search_fields = ("name", "slug")
    list_filter = ("is_active",)


@admin.register(ComplaintStatus)
class ComplaintStatusAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(ComplaintPriority)
class ComplaintPriorityAdmin(admin.ModelAdmin):
    list_display = ("name", "level", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)


@admin.register(ComplaintAttachment)
class ComplaintAttachmentAdmin(admin.ModelAdmin):
    list_display = ("complaint", "file_type", "uploaded_by", "uploaded_at")
    search_fields = ("file_url", "file_type")
    raw_id_fields = ("complaint", "uploaded_by")


@admin.register(ComplaintActivityLog)
class ComplaintActivityLogAdmin(admin.ModelAdmin):
    list_display = ("complaint", "action", "performed_by", "created_at")
    search_fields = ("action",)
    raw_id_fields = ("complaint", "performed_by")
