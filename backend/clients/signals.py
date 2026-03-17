from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_client_profile(sender, instance, **kwargs):
    """Auto-create a ClientProfile when a User with role 'client' is saved."""
    if instance.role == 'client':
        from clients.models import ClientProfile
        ClientProfile.objects.get_or_create(
            user=instance,
            defaults={
                'business_name': instance.get_full_name() or instance.username,
            },
        )
