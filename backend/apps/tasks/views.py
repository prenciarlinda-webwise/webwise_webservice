from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.accounts.permissions import IsAdmin, IsClient
from .models import Task
from .serializers import (
    TaskSerializer,
    TaskListSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer,
    ClientTaskSerializer,
)


class AdminTaskViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing tasks."""
    queryset = Task.objects.select_related('client').all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        if self.action == 'create':
            return TaskCreateSerializer
        if self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by client
        client_id = self.request.query_params.get('client')
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        # Filter by status
        task_status = self.request.query_params.get('status')
        if task_status:
            queryset = queryset.filter(status=task_status)
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        # Filter by priority
        priority = self.request.query_params.get('priority')
        if priority:
            queryset = queryset.filter(priority=priority)
        # Filter overdue
        overdue = self.request.query_params.get('overdue')
        if overdue and overdue.lower() == 'true':
            queryset = queryset.exclude(
                status='completed'
            ).filter(
                due_date__lt=timezone.now().date()
            )
        return queryset

    @action(detail=True, methods=['post'])
    def mark_completed(self, request, pk=None):
        """Mark a task as completed."""
        task = self.get_object()
        task.status = Task.Status.COMPLETED
        task.completed_date = request.data.get('completed_date', timezone.now().date())
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=True, methods=['post'])
    def mark_in_progress(self, request, pk=None):
        """Mark a task as in progress."""
        task = self.get_object()
        task.status = Task.Status.IN_PROGRESS
        task.save()
        return Response(TaskSerializer(task).data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get task statistics."""
        queryset = self.get_queryset()
        today = timezone.now().date()

        total = queryset.count()
        pending = queryset.filter(status='pending').count()
        in_progress = queryset.filter(status='in_progress').count()
        completed = queryset.filter(status='completed').count()
        overdue = queryset.exclude(status='completed').filter(
            due_date__lt=today
        ).count()

        return Response({
            'total': total,
            'pending': pending,
            'in_progress': in_progress,
            'completed': completed,
            'overdue': overdue,
        })


class ClientTaskListView(generics.ListAPIView):
    """Client view for listing their own tasks."""
    serializer_class = ClientTaskSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        return Task.objects.filter(
            client=self.request.user.client_profile
        ).order_by('order', '-priority', 'due_date')
