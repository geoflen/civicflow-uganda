from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ("citizen", "Citizen"),
        ("officer", "Officer"),
        ("supervisor", "Supervisor"),
    ]

    phone = models.CharField(max_length=20, blank=True)
    agency = models.ForeignKey(
        "agencies.Agency",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="users"
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="citizen")

    def __str__(self):
        return self.get_full_name() or self.username
