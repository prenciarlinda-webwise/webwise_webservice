from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Notification
from .serializers import NotificationSerializer, NotificationAcknowledgeSerializer, OfferResponseSerializer


class AdminNotificationViewSet(viewsets.ModelViewSet):
    """Admin viewset for managing notifications."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_staff:
            return Notification.objects.none()
        queryset = Notification.objects.filter(target_audience='admin')

        # Filter by client if provided
        client_id = self.request.query_params.get('client')
        if client_id:
            queryset = queryset.filter(client_id=client_id)

        # Filter by type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)

        # Filter by read status
        is_read = self.request.query_params.get('is_read')
        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')

        return queryset

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all admin notifications as read."""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'success'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications."""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})

    @action(detail=False, methods=['post'])
    def send_offer(self, request):
        """Send a special offer to a client."""
        from apps.clients.models import ClientProfile
        from datetime import timedelta

        client_id = request.data.get('client_id')
        title = request.data.get('title')
        message = request.data.get('message')
        offer_details = request.data.get('offer_details', {})
        expires_in_days = request.data.get('expires_in_days', 7)

        if not client_id or not title or not message:
            return Response(
                {'error': 'client_id, title, and message are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client = ClientProfile.objects.get(id=client_id)
        except ClientProfile.DoesNotExist:
            return Response(
                {'error': 'Client not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        expires_at = timezone.now() + timedelta(days=expires_in_days) if expires_in_days else None

        notification = Notification.objects.create(
            client=client,
            notification_type='offer',
            target_audience='client',
            title=title,
            message=message,
            offer_details=offer_details,
            offer_expires_at=expires_at,
            changed_by=request.user
        )

        return Response(NotificationSerializer(notification).data, status=status.HTTP_201_CREATED)


class ClientNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Client viewset for viewing notifications."""
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Notification.objects.none()

        try:
            client_profile = self.request.user.client_profile
            queryset = Notification.objects.filter(
                client=client_profile,
                target_audience='client'
            )

            # Filter by type
            notification_type = self.request.query_params.get('type')
            if notification_type:
                queryset = queryset.filter(notification_type=notification_type)

            # Filter by read status
            is_read = self.request.query_params.get('is_read')
            if is_read is not None:
                queryset = queryset.filter(is_read=is_read.lower() == 'true')

            return queryset
        except AttributeError:
            return Notification.objects.none()

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """Acknowledge a profile change notification."""
        notification = self.get_object()
        if notification.notification_type not in ['profile_change', 'business_change']:
            return Response(
                {'error': 'Only profile/business changes can be acknowledged'},
                status=status.HTTP_400_BAD_REQUEST
            )
        notification.is_acknowledged = True
        notification.acknowledged_at = timezone.now()
        notification.is_read = True
        notification.save()
        return Response(NotificationSerializer(notification).data)

    @action(detail=True, methods=['post'])
    def respond_offer(self, request, pk=None):
        """Respond to an offer notification."""
        notification = self.get_object()
        if notification.notification_type != 'offer':
            return Response(
                {'error': 'Only offers can be responded to'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OfferResponseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        notification.offer_accepted = serializer.validated_data['accepted']
        notification.offer_responded_at = timezone.now()
        notification.is_read = True
        notification.save()

        # Create notification for admin
        Notification.objects.create(
            client=notification.client,
            notification_type='offer',
            target_audience='admin',
            title=f"Offer {'Accepted' if notification.offer_accepted else 'Declined'}",
            message=f"{notification.client.company_name} has {'accepted' if notification.offer_accepted else 'declined'} the offer: {notification.title}",
            offer_details=notification.offer_details,
            changed_by=request.user
        )

        return Response(NotificationSerializer(notification).data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read."""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'success'})

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications."""
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})
