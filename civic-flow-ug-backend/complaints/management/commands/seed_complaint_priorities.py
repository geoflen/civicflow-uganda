from django.core.management.base import BaseCommand

from complaints.models import ComplaintPriority


class Command(BaseCommand):
    help = "Seed default complaint priorities for CivicFlow."

    PRIORITY_DATA = [
        {"name": "Low", "level": 10},
        {"name": "Medium", "level": 20},
        {"name": "High", "level": 30},
        {"name": "Critical", "level": 40},
    ]

    def handle(self, *args, **options):
        created = 0
        for priority_data in self.PRIORITY_DATA:
            priority, created_flag = ComplaintPriority.objects.get_or_create(
                name=priority_data["name"],
                defaults={"level": priority_data["level"], "is_active": True},
            )
            if created_flag:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created priority: {priority.name}"))
            else:
                self.stdout.write(self.style.NOTICE(f"Already exists: {priority.name}"))

        if created:
            self.stdout.write(self.style.SUCCESS(f"Seeded {created} complaint priorities."))
        else:
            self.stdout.write(self.style.WARNING("No new complaint priorities were created."))
