import uuid
from django.db import models


class Agency(models.Model):
    """Government agency or institution."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=100, blank=True)
    parent_agency = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="children",
    )
    # optional link to District; may require districts migrations to be created first
    district = models.ForeignKey(
        "districts.District",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="agencies",
    )
    contact_email = models.EmailField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
