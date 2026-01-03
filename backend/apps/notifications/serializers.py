from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    changed_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'client', 'client_name', 'notification_type', 'target_audience',
            'title', 'message', 'changed_fields', 'old_values', 'new_values',
            'changed_by', 'changed_by_name', 'is_read', 'is_acknowledged',
            'acknowledged_at', 'offer_details', 'offer_expires_at', 'offer_accepted',
            'offer_responded_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_changed_by_name(self, obj):
        if obj.changed_by:
            return f"{obj.changed_by.first_name} {obj.changed_by.last_name}".strip() or obj.changed_by.email
        return None


class NotificationAcknowledgeSerializer(serializers.Serializer):
    """Serializer for acknowledging a notification."""
    pass


class OfferResponseSerializer(serializers.Serializer):
    """Serializer for responding to an offer."""
    accepted = serializers.BooleanField()
