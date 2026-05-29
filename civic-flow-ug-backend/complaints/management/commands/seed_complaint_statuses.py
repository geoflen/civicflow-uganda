from django.core.management.base import BaseCommand

from complaints.models import ComplaintStatus


class Command(BaseCommand):
    help = "Seed default complaint statuses for CivicFlow."

    STATUS_DATA = [
        "Submitted",
        "Acknowledged",
        "Assigned",
        "In Progress",
        "Resolved",
        "Closed",
        "Escalated",
    ]

    def handle(self, *args, **options):
        created = 0
        for status_name in self.STATUS_DATA:
            status, created_flag = ComplaintStatus.objects.get_or_create(
                name=status_name,
                defaults={"is_active": True},
            )
            if created_flag:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created status: {status.name}"))
            else:
                self.stdout.write(self.style.NOTICE(f"Already exists: {status.name}"))

        if created:
            self.stdout.write(self.style.SUCCESS(f"Seeded {created} complaint statuses."))
        else:
            self.stdout.write(self.style.WARNING("No new complaint statuses were created."))
