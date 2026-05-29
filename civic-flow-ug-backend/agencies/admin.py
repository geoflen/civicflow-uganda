from django.contrib import admin

from .models import Agency


@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "type", "district", "is_active")
    list_filter = ("type", "is_active")
    search_fields = ("name", "code")
    raw_id_fields = ("parent_agency", "district")
