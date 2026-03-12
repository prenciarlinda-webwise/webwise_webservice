from datetime import date
from decimal import Decimal
from calendar import monthrange
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Q

from .models import Payment, ProjectCost, BusinessExpense, ExchangeRate, PersonalIncome, PersonalExpense
from .serializers import (
    PaymentSerializer, ProjectCostSerializer, BusinessExpenseSerializer,
    PaymentSummarySerializer, ExchangeRateSerializer,
    PersonalIncomeSerializer, PersonalExpenseSerializer, PersonalSummarySerializer,
)
from accounts.permissions import IsAdmin
from clients.models import ClientProfile


class PaymentListCreateView(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'employee':
            return Payment.objects.none()
        if self.request.user.role == 'admin':
            qs = Payment.objects.all()
        else:
            qs = Payment.objects.filter(project_service__project__client__user=self.request.user)

        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_service__project_id=project)
        client = self.request.query_params.get('client')
        if client:
            qs = qs.filter(project_service__project__client_id=client)
        return qs.select_related('project_service__project__client')


class PaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role == 'employee':
            return Payment.objects.none()
        if self.request.user.role == 'admin':
            return Payment.objects.all()
        return Payment.objects.filter(project_service__project__client__user=self.request.user)


class ProjectCostListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectCostSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = ProjectCost.objects.all()
        project = self.request.query_params.get('project')
        if project:
            qs = qs.filter(project_id=project)
        return qs.select_related('project')


class ProjectCostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectCostSerializer
    permission_classes = [IsAdmin]
    queryset = ProjectCost.objects.all()


class BusinessExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = BusinessExpenseSerializer
    permission_classes = [IsAdmin]
    queryset = BusinessExpense.objects.all()


class BusinessExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessExpenseSerializer
    permission_classes = [IsAdmin]
    queryset = BusinessExpense.objects.all()


class ExchangeRateListView(APIView):
    """Get all exchange rates or create/update one."""
    permission_classes = [IsAdmin]

    def get(self, request):
        rates = ExchangeRate.objects.all()
        return Response(ExchangeRateSerializer(rates, many=True).data)

    def post(self, request):
        from_cur = request.data.get('from_currency', 'USD')
        to_cur = request.data.get('to_currency', 'LEK')
        rate_val = request.data.get('rate')
        obj, created = ExchangeRate.objects.update_or_create(
            from_currency=from_cur, to_currency=to_cur,
            defaults={'rate': rate_val},
        )
        return Response(ExchangeRateSerializer(obj).data)


class DashboardSummaryView(APIView):
    """Admin dashboard: payment + cost summary. Accepts ?month=YYYY-MM-01 to scope 'this month' calculations."""
    permission_classes = [IsAdmin]

    def get(self, request):
        payments = Payment.objects.all()
        total_paid = payments.filter(status='paid').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_pending = payments.filter(status='pending').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_upcoming = payments.filter(status='upcoming').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_overdue = payments.filter(status='overdue').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_planned = payments.filter(status='planned').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_project_costs = ProjectCost.objects.aggregate(s=Sum('amount'))['s'] or Decimal('0')

        active_expenses = BusinessExpense.objects.filter(is_active=True)
        monthly_tool_costs = sum(e.monthly_cost for e in active_expenses)
        total_costs = total_project_costs + monthly_tool_costs

        # Determine which month to use — ?month= param or today
        month_param = request.query_params.get('month')
        if month_param:
            ref = date.fromisoformat(month_param)
        else:
            ref = date.today()

        month_start = ref.replace(day=1)
        _, last_day = monthrange(ref.year, ref.month)
        month_end = ref.replace(day=last_day)

        this_month_revenue = payments.filter(
            due_date__gte=month_start, due_date__lte=month_end
        ).exclude(status='cancelled').aggregate(s=Sum('amount'))['s'] or Decimal('0')

        this_month_project_costs = ProjectCost.objects.filter(
            date__gte=month_start, date__lte=month_end
        ).aggregate(s=Sum('amount'))['s'] or Decimal('0')
        this_month_costs = this_month_project_costs + monthly_tool_costs
        this_month_profit = this_month_revenue - this_month_costs

        # Next month planned (relative to the selected month)
        if ref.month == 12:
            next_month_start = date(ref.year + 1, 1, 1)
            _, next_last = monthrange(ref.year + 1, 1)
            next_month_end = date(ref.year + 1, 1, next_last)
        else:
            next_month_start = date(ref.year, ref.month + 1, 1)
            _, next_last = monthrange(ref.year, ref.month + 1)
            next_month_end = date(ref.year, ref.month + 1, next_last)

        next_month_planned = payments.filter(
            due_date__gte=next_month_start, due_date__lte=next_month_end
        ).exclude(status='cancelled').aggregate(s=Sum('amount'))['s'] or Decimal('0')

        data = {
            'total_revenue': total_paid + total_pending + total_upcoming + total_overdue,
            'total_paid': total_paid,
            'total_pending': total_pending,
            'total_upcoming': total_upcoming,
            'total_overdue': total_overdue,
            'total_planned': total_planned,
            'total_costs': total_costs,
            'net_profit': total_paid - total_costs,
            'total_clients': ClientProfile.objects.count(),
            'this_month_revenue': this_month_revenue,
            'this_month_costs': this_month_costs,
            'this_month_profit': this_month_profit,
            'next_month_planned': next_month_planned,
            'monthly_tool_costs': monthly_tool_costs,
        }
        serializer = PaymentSummarySerializer(data)
        return Response(serializer.data)


# --- Personal Income ---

class PersonalIncomeListCreateView(generics.ListCreateAPIView):
    serializer_class = PersonalIncomeSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = PersonalIncome.objects.all()
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(month=month)
        return qs


class PersonalIncomeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PersonalIncomeSerializer
    permission_classes = [IsAdmin]
    queryset = PersonalIncome.objects.all()


# --- Personal Expenses ---

class PersonalExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = PersonalExpenseSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        qs = PersonalExpense.objects.all()
        month = self.request.query_params.get('month')
        if month:
            qs = qs.filter(month=month)
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs


class PersonalExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PersonalExpenseSerializer
    permission_classes = [IsAdmin]
    queryset = PersonalExpense.objects.all()


# --- Personal Finance Summary ---

class PersonalSummaryView(APIView):
    """Monthly personal finance summary with chronological timeline and running balance."""
    permission_classes = [IsAdmin]

    def get(self, request):
        month_str = request.query_params.get('month')
        if month_str:
            month = date.fromisoformat(month_str)
        else:
            today = date.today()
            month = today.replace(day=1)

        incomes = PersonalIncome.objects.filter(month=month)
        expenses = PersonalExpense.objects.filter(month=month)

        # --- Previous balance (carry-forward from all prior months) ---
        prev_income = PersonalIncome.objects.filter(month__lt=month).aggregate(s=Sum('amount'))['s'] or Decimal('0')
        prev_expense = PersonalExpense.objects.filter(month__lt=month).aggregate(s=Sum('amount'))['s'] or Decimal('0')
        previous_balance = prev_income - prev_expense

        # Actual totals (amount field)
        total_income = incomes.aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_expenses = expenses.exclude(category='savings').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_savings = expenses.filter(category='savings').aggregate(s=Sum('amount'))['s'] or Decimal('0')

        # Planned totals (planned_amount field)
        planned_income = incomes.aggregate(s=Sum('planned_amount'))['s'] or Decimal('0')
        planned_expenses = expenses.exclude(category='savings').aggregate(s=Sum('planned_amount'))['s'] or Decimal('0')
        planned_savings = expenses.filter(category='savings').aggregate(s=Sum('planned_amount'))['s'] or Decimal('0')

        savings_rate = Decimal('0')
        if total_income > 0:
            savings_rate = ((total_income - total_expenses) / total_income * 100).quantize(Decimal('0.1'))

        # End-of-month balances
        end_of_month_balance = previous_balance + total_income - total_expenses - total_savings
        planned_end_balance = previous_balance + planned_income - planned_expenses - planned_savings

        # --- Chronological timeline with running balance ---
        transactions = []
        for inc in incomes:
            tx_date = inc.date or month
            amount = inc.amount if inc.amount is not None else inc.planned_amount
            transactions.append({
                'id': inc.id,
                'type': 'income',
                'date': tx_date.isoformat(),
                'description': inc.description,
                'label': inc.get_source_display(),
                'planned_amount': str(inc.planned_amount) if inc.planned_amount is not None else None,
                'amount': str(inc.amount) if inc.amount is not None else None,
                'effective_amount': str(amount or Decimal('0')),
                'currency': inc.currency,
                'is_actual': inc.amount is not None,
                'is_recurring': inc.is_recurring,
                'recurring_day': inc.recurring_day,
            })
        for exp in expenses:
            tx_date = exp.date or month
            amount = exp.amount if exp.amount is not None else exp.planned_amount
            transactions.append({
                'id': exp.id,
                'type': 'savings' if exp.category == 'savings' else 'expense',
                'date': tx_date.isoformat(),
                'description': exp.description,
                'label': exp.get_category_display(),
                'planned_amount': str(exp.planned_amount) if exp.planned_amount is not None else None,
                'amount': str(exp.amount) if exp.amount is not None else None,
                'effective_amount': str(amount or Decimal('0')),
                'currency': exp.currency,
                'is_actual': exp.amount is not None,
                'is_recurring': exp.is_recurring,
                'recurring_day': exp.recurring_day,
                'category': exp.category,
            })

        # Sort by date, incomes first within same date
        type_order = {'income': 0, 'expense': 1, 'savings': 2}
        transactions.sort(key=lambda t: (t['date'], type_order.get(t['type'], 1)))

        # Add running balance
        running = previous_balance
        for tx in transactions:
            eff = Decimal(tx['effective_amount'])
            if tx['type'] == 'income':
                running += eff
            else:
                running -= eff
            tx['running_balance'] = str(running)

        # Breakdown by source / category — both planned and actual
        income_by_source = {}
        for inc in incomes:
            key = inc.get_source_display()
            entry = income_by_source.get(key, {'planned': Decimal('0'), 'actual': Decimal('0')})
            entry['planned'] += inc.planned_amount or Decimal('0')
            entry['actual'] += inc.amount or Decimal('0')
            income_by_source[key] = entry
        income_by_source = {k: {'planned': str(v['planned']), 'actual': str(v['actual'])} for k, v in income_by_source.items()}

        expenses_by_category = {}
        for exp in expenses:
            key = exp.get_category_display()
            entry = expenses_by_category.get(key, {'planned': Decimal('0'), 'actual': Decimal('0')})
            entry['planned'] += exp.planned_amount or Decimal('0')
            entry['actual'] += exp.amount or Decimal('0')
            expenses_by_category[key] = entry
        expenses_by_category = {k: {'planned': str(v['planned']), 'actual': str(v['actual'])} for k, v in expenses_by_category.items()}

        data = {
            'month': month,
            'month_display': month.strftime('%B %Y'),
            'previous_balance': previous_balance,
            'total_income': total_income,
            'total_expenses': total_expenses,
            'total_savings': total_savings,
            'savings_rate': savings_rate,
            'end_of_month_balance': end_of_month_balance,
            'planned_income': planned_income,
            'planned_expenses': planned_expenses,
            'planned_savings': planned_savings,
            'planned_end_balance': planned_end_balance,
            'income_by_source': income_by_source,
            'expenses_by_category': expenses_by_category,
            'transactions': transactions,
        }
        serializer = PersonalSummarySerializer(data)
        return Response(serializer.data)
