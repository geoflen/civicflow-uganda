from django.db import models


class AnalyticsSnapshot(models.Model):
	name = models.CharField(max_length=255)
	data = models.JSONField()
	generated_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.name} @ {self.generated_at.isoformat()}"
