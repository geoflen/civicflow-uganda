from django.contrib import admin

from .models import EscalationRule


@admin.register(EscalationRule)
class EscalationRuleAdmin(admin.ModelAdmin):
	list_display = ("name", "days_unresolved", "target_role", "active")
	search_fields = ("name", "target_role")
