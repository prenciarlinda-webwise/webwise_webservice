from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from clients.models import ClientProfile

User = get_user_model()


class Command(BaseCommand):
    help = 'Create ClientProfile for any client-role users that are missing one'

    def handle(self, *args, **options):
        users = User.objects.filter(role='client').exclude(
            id__in=ClientProfile.objects.values_list('user_id', flat=True)
        )
        created = 0
        for user in users:
            ClientProfile.objects.create(
                user=user,
                business_name=user.get_full_name() or user.username,
            )
            created += 1
            self.stdout.write(f'  Created profile for: {user.email} ({user.get_full_name()})')

        if created:
            self.stdout.write(self.style.SUCCESS(f'Created {created} missing client profiles.'))
        else:
            self.stdout.write(self.style.SUCCESS('All client users already have profiles.'))
