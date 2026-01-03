from rest_framework import serializers
from .models import Payment, AdminPaymentMethod


class AdminPaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for AdminPaymentMethod model."""
    method_type_display = serializers.CharField(source='get_method_type_display', read_only=True)

    class Meta:
        model = AdminPaymentMethod
        fields = [
            'id', 'method_type', 'method_type_display', 'name', 'details',
            'is_active', 'display_order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdminPaymentMethodListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing payment methods."""
    method_type_display = serializers.CharField(source='get_method_type_display', read_only=True)

    class Meta:
        model = AdminPaymentMethod
        fields = ['id', 'method_type', 'method_type_display', 'name', 'is_active', 'display_order']


class ClientPaymentMethodSerializer(serializers.ModelSerializer):
    """Serializer for client viewing available payment methods."""
    method_type_display = serializers.CharField(source='get_method_type_display', read_only=True)

    class Meta:
        model = AdminPaymentMethod
        fields = ['id', 'method_type', 'method_type_display', 'name', 'details']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True, default=None)
    payment_method_name = serializers.CharField(source='payment_method_used.name', read_only=True, default=None)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = [
            'id', 'client', 'client_name', 'plan', 'plan_name',
            'amount', 'currency', 'status', 'payment_method',
            'payment_method_used', 'payment_method_name', 'reference_number',
            'due_date', 'paid_date', 'invoice_number',
            'description', 'notes', 'is_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'invoice_number', 'created_at', 'updated_at']


class PaymentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing payments."""
    client_name = serializers.CharField(source='client.company_name', read_only=True)
    payment_method_name = serializers.CharField(source='payment_method_used.name', read_only=True, default=None)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = [
            'id', 'client', 'client_name', 'amount', 'currency',
            'status', 'due_date', 'paid_date', 'invoice_number',
            'payment_method_name', 'reference_number', 'is_overdue'
        ]


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments."""

    class Meta:
        model = Payment
        fields = [
            'client', 'plan', 'amount', 'currency', 'status',
            'payment_method', 'due_date', 'paid_date', 'description', 'notes'
        ]


class PaymentUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating payments."""

    class Meta:
        model = Payment
        fields = [
            'amount', 'currency', 'status', 'payment_method',
            'due_date', 'paid_date', 'description', 'notes'
        ]


class ClientPaymentSerializer(serializers.ModelSerializer):
    """Serializer for client viewing their own payments."""
    plan_name = serializers.CharField(source='plan.name', read_only=True, default=None)
    payment_method_name = serializers.CharField(source='payment_method_used.name', read_only=True, default=None)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = [
            'id', 'plan_name', 'amount', 'currency', 'status',
            'payment_method', 'payment_method_used', 'payment_method_name',
            'reference_number', 'due_date', 'paid_date',
            'invoice_number', 'description', 'is_overdue'
        ]


class ClientMarkPaidSerializer(serializers.Serializer):
    """Serializer for client marking a payment as paid."""
    payment_method_id = serializers.IntegerField()
    reference_number = serializers.CharField(max_length=100)
    paid_date = serializers.DateField(required=False)

    def validate_payment_method_id(self, value):
        try:
            AdminPaymentMethod.objects.get(id=value, is_active=True)
        except AdminPaymentMethod.DoesNotExist:
            raise serializers.ValidationError('Invalid payment method')
        return value
