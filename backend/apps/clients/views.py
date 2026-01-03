from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from django.db.models import Count, Sum, Q
from django.utils import timezone

from apps.accounts.permissions import IsAdmin, IsClient
from apps.notifications.models import Notification
from .models import ClientProfile
from .serializers import (
    ClientProfileSerializer,
    ClientProfileListSerializer,
    ClientCreateSerializer,
    ClientUpdateSerializer,
    ClientSelfUpdateSerializer,
    ClientDetailSerializer,
)

User = get_user_model()


def create_profile_change_notification(client, changed_fields, old_values, new_values, changed_by, target_audience):
    """Create a notification for profile changes."""
    # Determine notification type based on changed fields
    business_fields = ['company_name', 'website_url', 'industry', 'address', 'city', 'state', 'country', 'postal_code']
    personal_fields = ['first_name', 'last_name', 'phone']

    is_business_change = any(f in changed_fields for f in business_fields)
    notification_type = 'business_change' if is_business_change else 'profile_change'

    # Generate message
    field_labels = {
        'first_name': 'First Name',
        'last_name': 'Last Name',
        'phone': 'Phone',
        'company_name': 'Company Name',
        'website_url': 'Website URL',
        'industry': 'Industry',
        'address': 'Address',
        'city': 'City',
        'state': 'State',
        'country': 'Country',
        'postal_code': 'Postal Code',
    }

    changes_list = [field_labels.get(f, f) for f in changed_fields]
    changes_text = ', '.join(changes_list[:3])
    if len(changes_list) > 3:
        changes_text += f' and {len(changes_list) - 3} more'

    changer_name = f"{changed_by.first_name} {changed_by.last_name}".strip() or changed_by.email

    if target_audience == 'client':
        title = "Profile Updated by Admin"
        message = f"An administrator has updated your profile. Changed: {changes_text}. Please review and confirm the changes."
    else:
        title = f"Profile Updated by Client"
        message = f"{client.company_name} has updated their profile. Changed: {changes_text}."

    Notification.objects.create(
        client=client,
        notification_type=notification_type,
        target_audience=target_audience,
        title=title,
        message=message,
        changed_fields=changed_fields,
        old_values=old_values,
        new_values=new_values,
        changed_by=changed_by
    )


class AdminClientViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing clients."""
    queryset = ClientProfile.objects.select_related('user', 'plan').all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return ClientProfileListSerializer
        if self.action == 'create':
            return ClientCreateSerializer
        if self.action in ['update', 'partial_update']:
            return ClientUpdateSerializer
        if self.action == 'retrieve':
            return ClientDetailSerializer
        return ClientProfileSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        # Search by company name or email
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(company_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search)
            )
        return queryset

    def update(self, request, *args, **kwargs):
        """Override update to track changes and create notifications."""
        instance = self.get_object()

        # Store old values
        tracked_fields = ['company_name', 'website_url', 'industry', 'address', 'city', 'state', 'country', 'postal_code']
        user_fields = ['first_name', 'last_name', 'phone']

        old_values = {}
        for field in tracked_fields:
            old_values[field] = getattr(instance, field, '')
        for field in user_fields:
            old_values[field] = getattr(instance.user, field, '')

        # Perform the update
        response = super().update(request, *args, **kwargs)

        # Refresh instance
        instance.refresh_from_db()
        instance.user.refresh_from_db()

        # Check what changed
        new_values = {}
        changed_fields = []

        for field in tracked_fields:
            new_val = getattr(instance, field, '')
            if old_values[field] != new_val:
                changed_fields.append(field)
                new_values[field] = new_val

        for field in user_fields:
            new_val = getattr(instance.user, field, '')
            if old_values[field] != new_val:
                changed_fields.append(field)
                new_values[field] = new_val

        # Create notification for client if there were changes
        if changed_fields:
            create_profile_change_notification(
                client=instance,
                changed_fields=changed_fields,
                old_values={k: old_values[k] for k in changed_fields},
                new_values=new_values,
                changed_by=request.user,
                target_audience='client'
            )

        return response

    @action(detail=True, methods=['post'])
    def reset_password(self, request, pk=None):
        """Reset client password."""
        client = self.get_object()
        new_password = request.data.get('password')
        if not new_password:
            return Response(
                {'error': 'Password is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        client.user.set_password(new_password)
        client.user.save()
        return Response({'message': 'Password reset successfully'})

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get comprehensive dashboard statistics."""
        from apps.payments.models import Payment
        from apps.keywords.models import Keyword
        from apps.reports.models import Report
        from datetime import timedelta
        from django.db.models.functions import TruncMonth

        today = timezone.now().date()
        this_month_start = today.replace(day=1)
        last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)

        # Client stats
        total_clients = ClientProfile.objects.count()
        active_clients = ClientProfile.objects.filter(is_active=True).count()
        new_clients_this_month = ClientProfile.objects.filter(
            created_at__date__gte=this_month_start
        ).count()

        # Payment/Revenue stats
        all_payments = Payment.objects.all()

        total_revenue = all_payments.filter(
            status='paid'
        ).aggregate(total=Sum('amount'))['total'] or 0

        this_month_revenue = all_payments.filter(
            status='paid',
            paid_date__gte=this_month_start
        ).aggregate(total=Sum('amount'))['total'] or 0

        last_month_revenue = all_payments.filter(
            status='paid',
            paid_date__gte=last_month_start,
            paid_date__lt=this_month_start
        ).aggregate(total=Sum('amount'))['total'] or 0

        pending_amount = all_payments.filter(
            status='pending'
        ).aggregate(total=Sum('amount'))['total'] or 0

        pending_payments_count = all_payments.filter(status='pending').count()

        overdue_payments = all_payments.filter(
            status='pending',
            due_date__lt=today
        )
        overdue_count = overdue_payments.count()
        overdue_amount = overdue_payments.aggregate(total=Sum('amount'))['total'] or 0

        # Recent payments (last 10)
        recent_payments = all_payments.select_related('client').order_by('-created_at')[:10]
        recent_payments_data = [
            {
                'id': p.id,
                'client_name': p.client.company_name,
                'amount': float(p.amount),
                'currency': p.currency,
                'status': p.status,
                'due_date': p.due_date.isoformat(),
                'paid_date': p.paid_date.isoformat() if p.paid_date else None,
                'invoice_number': p.invoice_number,
                'is_overdue': p.is_overdue
            }
            for p in recent_payments
        ]

        # Monthly revenue for last 6 months (for chart)
        six_months_ago = today - timedelta(days=180)
        monthly_revenue = list(
            all_payments.filter(
                status='paid',
                paid_date__gte=six_months_ago
            ).annotate(
                month=TruncMonth('paid_date')
            ).values('month').annotate(
                total=Sum('amount')
            ).order_by('month')
        )
        monthly_revenue_data = [
            {
                'month': m['month'].strftime('%Y-%m') if m['month'] else None,
                'total': float(m['total']) if m['total'] else 0
            }
            for m in monthly_revenue
        ]

        # Keyword stats
        total_keywords = Keyword.objects.count()

        # Report stats
        total_reports = Report.objects.count()
        reports_this_month = Report.objects.filter(
            created_at__date__gte=this_month_start
        ).count()

        # Clients with upcoming payments due
        upcoming_due = all_payments.filter(
            status='pending',
            due_date__gte=today,
            due_date__lte=today + timedelta(days=7)
        ).select_related('client')[:5]
        upcoming_due_data = [
            {
                'client_id': p.client.id,
                'client_name': p.client.company_name,
                'amount': float(p.amount),
                'due_date': p.due_date.isoformat()
            }
            for p in upcoming_due
        ]

        return Response({
            # Client stats
            'total_clients': total_clients,
            'active_clients': active_clients,
            'new_clients_this_month': new_clients_this_month,

            # Revenue stats
            'total_revenue': float(total_revenue),
            'this_month_revenue': float(this_month_revenue),
            'last_month_revenue': float(last_month_revenue),
            'pending_amount': float(pending_amount),

            # Payment stats
            'pending_payments': pending_payments_count,
            'overdue_payments': overdue_count,
            'overdue_amount': float(overdue_amount),

            # Activity data
            'recent_payments': recent_payments_data,
            'monthly_revenue': monthly_revenue_data,
            'upcoming_due': upcoming_due_data,

            # Other stats
            'total_keywords': total_keywords,
            'total_reports': total_reports,
            'reports_this_month': reports_this_month,
        })


class ClientProfileView(generics.RetrieveUpdateAPIView):
    """Client view for their own profile."""
    permission_classes = [IsAuthenticated, IsClient]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ClientSelfUpdateSerializer
        return ClientProfileSerializer

    def get_object(self):
        return self.request.user.client_profile

    def update(self, request, *args, **kwargs):
        """Override update to track changes and create notifications."""
        instance = self.get_object()

        # Store old values - only fields clients can edit
        tracked_fields = ['company_name', 'website_url', 'industry', 'address', 'city', 'state', 'country', 'postal_code']
        user_fields = ['first_name', 'last_name', 'phone']

        old_values = {}
        for field in tracked_fields:
            old_values[field] = getattr(instance, field, '')
        for field in user_fields:
            old_values[field] = getattr(instance.user, field, '')

        # Perform the update
        response = super().update(request, *args, **kwargs)

        # Refresh instance
        instance.refresh_from_db()
        instance.user.refresh_from_db()

        # Check what changed
        new_values = {}
        changed_fields = []

        for field in tracked_fields:
            new_val = getattr(instance, field, '')
            if old_values[field] != new_val:
                changed_fields.append(field)
                new_values[field] = new_val

        for field in user_fields:
            new_val = getattr(instance.user, field, '')
            if old_values[field] != new_val:
                changed_fields.append(field)
                new_values[field] = new_val

        # Create notification for admin if there were changes
        if changed_fields:
            create_profile_change_notification(
                client=instance,
                changed_fields=changed_fields,
                old_values={k: old_values[k] for k in changed_fields},
                new_values=new_values,
                changed_by=request.user,
                target_audience='admin'
            )

        return response
