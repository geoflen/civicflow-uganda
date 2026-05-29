import uuid

from django.contrib.auth.models import Group
from django.db import models


class RoutingRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Production hardening: make these routing dimensions required once seed data,
    # legacy rows, and admin workflows guarantee complete routing rules.
    category = models.ForeignKey(
        "complaints.ComplaintCategory",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="routing_rules",
    )
    district = models.ForeignKey(
        "districts.District",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="routing_rules",
    )
    agency = models.ForeignKey(
        "agencies.Agency",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="routing_rules",
    )
    priority = models.ForeignKey(
        "complaints.ComplaintPriority",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="routing_rules",
    )
    assigned_team = models.ForeignKey(
        Group,
        null=True,
        blank=True,
        on_delete=models.PROTECT,
        related_name="routing_rules",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "routing_rules"
        ordering = ["category__name", "district__name", "priority__level"]
        constraints = [
            models.UniqueConstraint(
                fields=["category", "district", "priority"],
                name="unique_routing_rule_category_district_priority",
            )
        ]

    def __str__(self):
        parts = [
            self.category.name if self.category else "Any category",
            self.district.name if self.district else "Any district",
            self.priority.name if self.priority else "Any priority",
        ]
        return " / ".join(parts)
