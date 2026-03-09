from datetime import date
from decimal import Decimal
from calendar import monthrange
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum, Q

from .models import Payment, ProjectCost, BusinessExpense, ExchangeRate
from .serializers import PaymentSerializer, ProjectCostSerializer, BusinessExpenseSerializer, PaymentSummarySerializer, ExchangeRateSerializer
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
    """Admin dashboard: payment + cost summary with monthly planning."""
    permission_classes = [IsAdmin]

    def get(self, request):
        payments = Payment.objects.all()
        total_paid = payments.filter(status='paid').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_pending = payments.filter(status='pending').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_upcoming = payments.filter(status='upcoming').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_overdue = payments.filter(status='overdue').aggregate(s=Sum('amount'))['s'] or Decimal('0')
        total_project_costs = ProjectCost.objects.aggregate(s=Sum('amount'))['s'] or Decimal('0')

        # Monthly tool/subscription costs
        active_expenses = BusinessExpense.objects.filter(is_active=True)
        monthly_tool_costs = sum(e.monthly_cost for e in active_expenses)

        total_costs = total_project_costs + monthly_tool_costs

        # This month planning
        today = date.today()
        month_start = today.replace(day=1)
        _, last_day = monthrange(today.year, today.month)
        month_end = today.replace(day=last_day)

        this_month_revenue = payments.filter(
            due_date__gte=month_start, due_date__lte=month_end
        ).exclude(status='cancelled').aggregate(s=Sum('amount'))['s'] or Decimal('0')

        this_month_project_costs = ProjectCost.objects.filter(
            date__gte=month_start, date__lte=month_end
        ).aggregate(s=Sum('amount'))['s'] or Decimal('0')
        this_month_costs = this_month_project_costs + monthly_tool_costs
        this_month_profit = this_month_revenue - this_month_costs

        # Next month planned
        if today.month == 12:
            next_month_start = date(today.year + 1, 1, 1)
            _, next_last = monthrange(today.year + 1, 1)
            next_month_end = date(today.year + 1, 1, next_last)
        else:
            next_month_start = date(today.year, today.month + 1, 1)
            _, next_last = monthrange(today.year, today.month + 1)
            next_month_end = date(today.year, today.month + 1, next_last)

        next_month_planned = payments.filter(
            due_date__gte=next_month_start, due_date__lte=next_month_end
        ).exclude(status='cancelled').aggregate(s=Sum('amount'))['s'] or Decimal('0')

        data = {
            'total_revenue': total_paid + total_pending + total_upcoming + total_overdue,
            'total_paid': total_paid,
            'total_pending': total_pending,
            'total_upcoming': total_upcoming,
            'total_overdue': total_overdue,
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
