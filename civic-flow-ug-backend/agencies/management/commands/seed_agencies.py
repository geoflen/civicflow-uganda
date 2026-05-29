from django.core.management.base import BaseCommand

from agencies.models import Agency


class Command(BaseCommand):
    help = "Seed example agencies"

    def handle(self, *args, **options):
        examples = [
            {
                "name": "National Water and Sewerage Corporation",
                "code": "NWSC",
                "type": "Utility",
                "contact_email": "info@nwsc.go.ug",
            },
            {
                "name": "Ministry of Health",
                "code": "MOH",
                "type": "Ministry",
                "contact_email": "contact@moh.go.ug",
            },
        ]

        for ex in examples:
            agency, created = Agency.objects.get_or_create(code=ex["code"], defaults=ex)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created agency {agency.name} ({agency.code})"))
            else:
                self.stdout.write(self.style.WARNING(f"Agency already exists: {agency.name} ({agency.code})"))
