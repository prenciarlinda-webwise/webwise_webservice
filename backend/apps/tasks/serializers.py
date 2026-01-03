from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    """Full serializer for Task model."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'client', 'client_name', 'title', 'description',
            'status', 'priority', 'category', 'due_date', 'completed_date',
            'order', 'is_overdue', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing tasks."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'client', 'client_name', 'title', 'status',
            'priority', 'category', 'due_date', 'is_overdue'
        ]


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating tasks."""

    class Meta:
        model = Task
        fields = [
            'client', 'title', 'description', 'status',
            'priority', 'category', 'due_date', 'order'
        ]


class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating tasks."""

    class Meta:
        model = Task
        fields = [
            'title', 'description', 'status', 'priority',
            'category', 'due_date', 'completed_date', 'order'
        ]


class ClientTaskSerializer(serializers.ModelSerializer):
    """Serializer for client viewing their own tasks."""
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'status', 'priority',
            'category', 'due_date', 'is_overdue', 'created_at'
        ]
