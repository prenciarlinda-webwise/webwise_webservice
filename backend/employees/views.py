from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import EmployeeProfile, TaskLog
from .serializers import EmployeeProfileSerializer, TaskLogSerializer
from accounts.permissions import IsAdmin, IsAdminOrEmployee


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
