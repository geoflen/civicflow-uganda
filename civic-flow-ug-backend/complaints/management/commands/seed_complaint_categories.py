from django.core.management.base import BaseCommand

from complaints.models import ComplaintCategory


class Command(BaseCommand):
    help = "Seed default complaint categories for CivicFlow."

    CATEGORY_DATA = [
        {
            "name": "Water",
            "description": "Issues related to water supply, water quality, sewage, and drainage.",
        },
        {
            "name": "Roads",
            "description": "Road condition complaints including potholes, signage, and street maintenance.",
        },
        {
            "name": "Health",
            "description": "Health service complaints such as public clinics, hospitals, and sanitation.",
        },
        {
            "name": "Corruption",
            "description": "Reports of corruption, bribery, misuse of public resources, or unethical behavior.",
        },
        {
            "name": "Education",
            "description": "Complaints about schools, learning materials, teachers, and educational services.",
        },
        {
            "name": "Electricity",
            "description": "Electric power issues such as outages, billing, meters, and unsafe wiring.",
        },
        {
            "name": "Sanitation",
            "description": "Sanitation and waste management issues including garbage collection and public hygiene.",
        },
    ]

    def handle(self, *args, **options):
        created = 0
        for category_data in self.CATEGORY_DATA:
            category, created_flag = ComplaintCategory.objects.get_or_create(
                name=category_data["name"], defaults=category_data
            )
            if created_flag:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"Created category: {category.name}"))
            else:
                self.stdout.write(self.style.NOTICE(f"Already exists: {category.name}"))

        if created:
            self.stdout.write(self.style.SUCCESS(f"Seeded {created} complaint categories."))
        else:
            self.stdout.write(self.style.WARNING("No new complaint categories were created."))
