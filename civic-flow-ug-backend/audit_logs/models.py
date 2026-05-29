from django.conf import settings
from django.db import models

# Create your models here.
class AuditLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    action = models.CharField(max_length=255)

    entity_type = models.CharField(max_length=100)

    entity_id = models.UUIDField()

    payload = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)
