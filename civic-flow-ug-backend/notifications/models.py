import uuid

from django.conf import settings
from django.db import models


class Notification(models.Model):
    CHANNEL_CHOICES = [
        ("in_app", "In App"),
        ("sms", "SMS"),
        ("email", "Email"),
        ("whatsapp", "WhatsApp"),
    ]
    TYPE_CHOICES = [
        ("complaint_created", "Complaint Created"),
        ("status_updated", "Status Updated"),
        ("assigned", "Assigned"),
        ("escalated", "Escalated"),
        ("resolved", "Resolved"),
        ("general", "General"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="general")
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES, default="in_app")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type} notification for {self.recipient}"
