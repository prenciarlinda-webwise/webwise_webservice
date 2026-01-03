from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from apps.accounts.permissions import IsAdmin, IsClient
from .models import Payment, AdminPaymentMethod
from .serializers import (
    PaymentSerializer,
    PaymentListSerializer,
    PaymentCreateSerializer,
    PaymentUpdateSerializer,
    ClientPaymentSerializer,
    AdminPaymentMethodSerializer,
    AdminPaymentMethodListSerializer,
    ClientPaymentMethodSerializer,
    ClientMarkPaidSerializer,
)


class AdminPaymentViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing payments."""
    queryset = Payment.objects.select_related('client', 'plan').all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        if self.action == 'create':
            return PaymentCreateSerializer
        if self.action in ['update', 'partial_update']:
            return PaymentUpdateSerializer
        return PaymentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Filter by client
        client_id = self.request.query_params.get('client')
        if client_id:
            queryset = queryset.filter(client_id=client_id)
        # Filter by status
        payment_status = self.request.query_params.get('status')
        if payment_status:
            queryset = queryset.filter(status=payment_status)
        # Filter overdue
        overdue = self.request.query_params.get('overdue')
        if overdue and overdue.lower() == 'true':
            queryset = queryset.filter(
                status='pending',
                due_date__lt=timezone.now().date()
            )
        return queryset

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark a payment as paid."""
        payment = self.get_object()
        payment.status = Payment.Status.PAID
        payment.paid_date = request.data.get('paid_date', timezone.now().date())
        payment.payment_method = request.data.get('payment_method', payment.payment_method)
        payment.save()
        return Response(PaymentSerializer(payment).data)

    @action(detail=True, methods=['post'])
    def mark_cancelled(self, request, pk=None):
        """Mark a payment as cancelled."""
        payment = self.get_object()
        payment.status = Payment.Status.CANCELLED
        payment.save()
        return Response(PaymentSerializer(payment).data)

    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        """Admin confirms a client-reported payment."""
        payment = self.get_object()
        if payment.status != Payment.Status.PAID:
            return Response(
                {'error': 'Payment is not marked as paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        # Just update notes or mark confirmed if you want tracking
        payment.notes = f"{payment.notes}\nConfirmed by admin on {timezone.now().date()}"
        payment.save()
        return Response(PaymentSerializer(payment).data)


class AdminPaymentMethodViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing payment methods."""
    queryset = AdminPaymentMethod.objects.all()
    permission_classes = [IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.action == 'list':
            return AdminPaymentMethodListSerializer
        return AdminPaymentMethodSerializer


class ClientPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """Client view for viewing and updating their own payments."""
    serializer_class = ClientPaymentSerializer
    permission_classes = [IsAuthenticated, IsClient]

    def get_queryset(self):
        try:
            return Payment.objects.filter(
                client=self.request.user.client_profile
            ).select_related('plan', 'payment_method_used').order_by('-due_date')
        except AttributeError:
            return Payment.objects.none()

    @action(detail=False, methods=['get'])
    def payment_methods(self, request):
        """Get available payment methods from admin."""
        methods = AdminPaymentMethod.objects.filter(is_active=True)
        serializer = ClientPaymentMethodSerializer(methods, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Client marks a payment as paid with reference number."""
        payment = self.get_object()

        if payment.status == 'paid':
            return Response(
                {'error': 'This payment is already marked as paid'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = ClientMarkPaidSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        payment_method = AdminPaymentMethod.objects.get(
            id=serializer.validated_data['payment_method_id']
        )

        payment.status = Payment.Status.PAID
        payment.paid_date = serializer.validated_data.get('paid_date', timezone.now().date())
        payment.payment_method_used = payment_method
        payment.reference_number = serializer.validated_data['reference_number']
        payment.save()

        # Create notification for admin
        from apps.notifications.models import Notification
        Notification.objects.create(
            client=payment.client,
            notification_type='payment',
            target_audience='admin',
            title='Payment Marked as Paid',
            message=f"{payment.client.company_name} has marked invoice {payment.invoice_number} (${payment.amount}) as paid via {payment_method.name}. Reference: {payment.reference_number}",
            changed_by=request.user
        )

        return Response(ClientPaymentSerializer(payment).data)
