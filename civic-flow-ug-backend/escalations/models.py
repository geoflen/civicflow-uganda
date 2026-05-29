from django.conf import settings
from django.db import models


class EscalationRule(models.Model):
	name = models.CharField(max_length=255)
	days_unresolved = models.PositiveIntegerField(default=3)
	target_role = models.CharField(max_length=50, help_text="Role to escalate to")
	active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.name} (after {self.days_unresolved}d)"
