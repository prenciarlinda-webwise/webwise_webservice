from rest_framework import serializers
from .models import Payment, ProjectCost, BusinessExpense, ExchangeRate


class PaymentSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project_service.project.name', read_only=True)
    service_name = serializers.CharField(source='project_service.name', read_only=True)
    client_name = serializers.CharField(source='project_service.project.client.business_name', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'project_service', 'monthly_plan', 'project_name', 'service_name', 'client_name',
            'amount', 'payment_type', 'status', 'description',
            'due_date', 'paid_date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        role = getattr(request.user, 'role', None) if request else None
        if role == 'client':
            # Clients only see due date and status, not amounts
            data.pop('amount', None)
            data.pop('paid_date', None)
            data.pop('payment_type', None)
        return data


class ProjectCostSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = ProjectCost
        fields = ['id', 'project', 'project_name', 'description', 'amount', 'date', 'created_at']
        read_only_fields = ['id', 'created_at']


class BusinessExpenseSerializer(serializers.ModelSerializer):
    monthly_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = BusinessExpense
        fields = [
            'id', 'name', 'amount', 'frequency', 'category',
            'start_date', 'end_date', 'notes', 'is_active', 'monthly_cost', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PaymentSummarySerializer(serializers.Serializer):
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_paid = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_pending = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_upcoming = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_overdue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_costs = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_clients = serializers.IntegerField()
    # Monthly planning
    this_month_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_month_costs = serializers.DecimalField(max_digits=12, decimal_places=2)
    this_month_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    next_month_planned = serializers.DecimalField(max_digits=12, decimal_places=2)
    monthly_tool_costs = serializers.DecimalField(max_digits=12, decimal_places=2)


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = ['id', 'from_currency', 'to_currency', 'rate', 'updated_at']
        read_only_fields = ['id', 'updated_at']
