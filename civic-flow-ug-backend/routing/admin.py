from django.contrib import admin

from .models import RoutingRule


@admin.register(RoutingRule)
class RoutingRuleAdmin(admin.ModelAdmin):
    list_display = ("category", "district", "agency", "priority", "assigned_team", "created_at")
    list_filter = ("category", "district", "agency", "priority", "assigned_team")
    raw_id_fields = ("category", "district", "agency", "priority", "assigned_team")
