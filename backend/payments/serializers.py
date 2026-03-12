from rest_framework import serializers
from .models import Payment, ProjectCost, BusinessExpense, ExchangeRate, PersonalIncome, PersonalExpense


class PaymentSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project_service.project.name', read_only=True)
    project_id = serializers.IntegerField(source='project_service.project.id', read_only=True)
    service_name = serializers.CharField(source='project_service.name', read_only=True)
    client_name = serializers.CharField(source='project_service.project.client.business_name', read_only=True)
    client_id = serializers.IntegerField(source='project_service.project.client.id', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'project_service', 'monthly_plan', 'project_name', 'project_id',
            'service_name', 'client_name', 'client_id',
            'amount', 'payment_type', 'status', 'description',
            'due_date', 'paid_date', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        role = getattr(request.user, 'role', None) if request else None
        if role == 'client':
            data.pop('amount', None)
            data.pop('paid_date', None)
            data.pop('payment_type', None)
        return data


class ProjectCostSerializer(serializers.ModelSerializer):
    project_name = serializers.CharField(source='project.name', read_only=True)

    class Meta:
        model = ProjectCost
        fields = ['id', 'project', 'project_name', 'description', 'planned_amount', 'amount', 'date', 'created_at']
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
    total_planned = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_costs = serializers.DecimalField(max_digits=12, decimal_places=2)
    net_profit = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_clients = serializers.IntegerField()
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


class PersonalIncomeSerializer(serializers.ModelSerializer):
    source_display = serializers.CharField(source='get_source_display', read_only=True)
    month_display = serializers.SerializerMethodField()

    class Meta:
        model = PersonalIncome
        fields = [
            'id', 'source', 'source_display', 'description',
            'planned_amount', 'amount', 'currency',
            'date', 'month', 'month_display', 'is_recurring', 'recurring_day', 'notes', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_month_display(self, obj):
        return obj.month.strftime('%B %Y')


class PersonalExpenseSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    month_display = serializers.SerializerMethodField()

    class Meta:
        model = PersonalExpense
        fields = [
            'id', 'category', 'category_display', 'description',
            'planned_amount', 'amount', 'currency',
            'date', 'month', 'month_display', 'is_recurring', 'recurring_day', 'notes', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def get_month_display(self, obj):
        return obj.month.strftime('%B %Y')


class PersonalSummarySerializer(serializers.Serializer):
    """Monthly personal finance summary with planned vs actual and chronological timeline."""
    month = serializers.DateField()
    month_display = serializers.CharField()
    # Carry-forward balance from previous months
    previous_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    # Actual totals
    total_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_savings = serializers.DecimalField(max_digits=12, decimal_places=2)
    savings_rate = serializers.DecimalField(max_digits=5, decimal_places=1)
    end_of_month_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    # Planned totals
    planned_income = serializers.DecimalField(max_digits=12, decimal_places=2)
    planned_expenses = serializers.DecimalField(max_digits=12, decimal_places=2)
    planned_savings = serializers.DecimalField(max_digits=12, decimal_places=2)
    planned_end_balance = serializers.DecimalField(max_digits=12, decimal_places=2)
    # Breakdowns
    income_by_source = serializers.DictField()
    expenses_by_category = serializers.DictField()
    # Chronological timeline with running balance
    transactions = serializers.ListField()
