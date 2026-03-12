from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    recipient_name = serializers.CharField(source='recipient.get_full_name', read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True, default=None)

    class Meta:
        model = Notification
        fields = [
            'id', 'sender', 'sender_name', 'recipient', 'recipient_name',
            'project', 'project_name', 'category', 'priority',
            'title', 'message', 'link', 'is_read', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'created_at']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)
