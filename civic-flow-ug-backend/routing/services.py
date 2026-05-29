from .models import RoutingRule


class ComplaintRoutingService:
    @staticmethod
    def route_complaint(complaint):
        """Apply the most specific routing rule available for a complaint."""
        rule = (
            RoutingRule.objects.filter(
                category=complaint.category,
                district=complaint.district,
                priority=complaint.priority,
            )
            .select_related("agency", "assigned_team")
            .first()
        )

        if not rule:
            return None

        complaint.agency = rule.agency
        complaint.save(update_fields=["agency", "updated_at"])
        return rule
