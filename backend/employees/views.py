from datetime import date
from decimal import Decimal
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Sum

from .models import EmployeeProfile, TaskLog
from .serializers import EmployeeProfileSerializer, TaskLogSerializer
from accounts.permissions import IsAdmin, IsAdminOrEmployee, IsEmployee


class EmployeeListView(generics.ListCreateAPIView):
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAdmin]
    queryset = EmployeeProfile.objects.select_related('user').all()


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmployeeProfileSerializer
    permission_classes = [IsAdmin]
    queryset = EmployeeProfile.objects.all()

    def perform_destroy(self, instance):
        user = instance.user
        instance.delete()
        user.delete()


class TaskLogListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskLogSerializer
    permission_classes = [IsAdminOrEmployee]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            qs = TaskLog.objects.all()
        else:
            qs = TaskLog.objects.filter(employee__user=self.request.user)
        employee = self.request.query_params.get('employee')
        if employee:
            qs = qs.filter(employee_id=employee)
        client = self.request.query_params.get('client')
        if client:
            qs = qs.filter(client_id=client)
        return qs.select_related('employee__user', 'client')

    def perform_create(self, serializer):
        if self.request.user.role == 'employee':
            profile = self.request.user.employee_profile
            serializer.save(employee=profile)
        else:
            serializer.save()


class TaskLogDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskLogSerializer
    permission_classes = [IsAdminOrEmployee]

    def get_queryset(self):
        if self.request.user.role == 'admin':
            return TaskLog.objects.all()
        return TaskLog.objects.filter(employee__user=self.request.user)


class EmployeeMonthlySummaryView(APIView):
    """Monthly summary for the logged-in employee: hours, projects, tasks."""
    permission_classes = [IsAdminOrEmployee]

    def get(self, request):
        from clients.models import Deliverable, Project

        user = request.user
        # Determine which employee
        if user.role == 'admin':
            employee_id = request.query_params.get('employee')
            if not employee_id:
                return Response({'error': 'employee param required for admin'}, status=400)
            profile = EmployeeProfile.objects.get(id=employee_id)
            target_user = profile.user
        else:
            profile = user.employee_profile
            target_user = user

        month_str = request.query_params.get('month')
        if month_str:
            ref = date.fromisoformat(month_str)
        else:
            ref = date.today()
        month_start = ref.replace(day=1)

        # Hours this month
        logs = TaskLog.objects.filter(employee=profile, date__year=month_start.year, date__month=month_start.month)
        total_hours = logs.aggregate(s=Sum('hours'))['s'] or Decimal('0')

        # Projects where they have assigned deliverables
        project_ids = Deliverable.objects.filter(
            assigned_to=target_user
        ).values_list('monthly_plan__project_service__project_id', flat=True).distinct()
        projects = Project.objects.filter(id__in=project_ids).values('id', 'slug', 'name', 'status')

        # Active deliverables
        active_count = Deliverable.objects.filter(
            assigned_to=target_user
        ).exclude(status__in=['completed', 'published']).count()
        completed_count = Deliverable.objects.filter(
            assigned_to=target_user, status__in=['completed', 'published']
        ).count()

        return Response({
            'month': month_start.isoformat(),
            'total_hours': str(total_hours),
            'total_logs': logs.count(),
            'active_tasks': active_count,
            'completed_tasks': completed_count,
            'projects': list(projects),
        })
