from django.db.models import Count, Q
from django.contrib.auth import get_user_model

from .models import RoutingRule


class ComplaintRoutingService:
    @staticmethod
    def _find_best_rule(complaint):
        """Search routing rules from most-specific to least-specific."""
        # specificity order (category, district, priority)
        levels = [
            (complaint.category, complaint.district, complaint.priority),
            (complaint.category, complaint.district, None),
            (complaint.category, None, complaint.priority),
            (None, complaint.district, complaint.priority),
            (complaint.category, None, None),
            (None, complaint.district, None),
            (None, None, complaint.priority),
            (None, None, None),
        ]

        for cat, dist, prio in levels:
            qs = RoutingRule.objects.all()
            if cat is None:
                qs = qs.filter(category__isnull=True)
            else:
                qs = qs.filter(category=cat)

            if dist is None:
                qs = qs.filter(district__isnull=True)
            else:
                qs = qs.filter(district=dist)

            if prio is None:
                qs = qs.filter(priority__isnull=True)
            else:
                qs = qs.filter(priority=prio)

            rule = qs.select_related("agency", "assigned_team").first()
            if rule:
                return rule

        return None

    @staticmethod
    def _choose_agent_for_rule(rule):
        """Pick the best agent (user) for a routing rule.

        Strategy: pick an active officer in the assigned team (if any) and
        belonging to the rule's agency (if set) with the fewest open complaints.
        """
        if not rule.assigned_team:
            return None

        User = get_user_model()
        users = User.objects.filter(groups=rule.assigned_team, is_active=True)

        # prefer officers, but allow others if no officers exist
        officers = users.filter(role="officer")
        if officers.exists():
            users = officers

        if rule.agency:
            users = users.filter(agency=rule.agency)

        # annotate with count of open assigned complaints (not resolved/closed)
        users = users.annotate(
            open_count=Count(
                "assigned_complaints",
                filter=Q(assigned_complaints__resolved_at__isnull=True)
                & Q(assigned_complaints__closed_at__isnull=True),
            )
        ).order_by("open_count", "-date_joined")

        return users.first()

    @staticmethod
    def route_complaint(complaint):
        """Route a complaint to the best matching rule and assign an agent.

        Returns the applied `RoutingRule` or `None` if no rule matched.
        """
        rule = ComplaintRoutingService._find_best_rule(complaint)
        if not rule:
            return None

        # assign agency if present
        if rule.agency:
            complaint.agency = rule.agency

        # if rule targets a team, try to pick an agent
        agent = ComplaintRoutingService._choose_agent_for_rule(rule)
        if agent:
            complaint.assigned_to = agent

        complaint.save(update_fields=[f for f in ["agency", "assigned_to", "updated_at"] if getattr(complaint, f, None) is not None])
        return rule
