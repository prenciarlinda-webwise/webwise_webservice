from rest_framework import serializers
from .models import Plan


class PlanSerializer(serializers.ModelSerializer):
    """Serializer for Plan model."""

    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'plan_type', 'description', 'price',
            'is_recurring', 'features', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PlanListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Plan listing."""

    class Meta:
        model = Plan
        fields = ['id', 'name', 'plan_type', 'price', 'is_recurring', 'is_active']
