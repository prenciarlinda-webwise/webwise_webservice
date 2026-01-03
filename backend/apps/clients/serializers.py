from rest_framework import serializers
from django.contrib.auth import get_user_model

from apps.accounts.serializers import UserSerializer, UserCreateSerializer
from apps.plans.serializers import PlanListSerializer
from .models import ClientProfile

User = get_user_model()


class ClientProfileSerializer(serializers.ModelSerializer):
    """Serializer for ClientProfile model."""
    user = UserSerializer(read_only=True)
    plan = PlanListSerializer(read_only=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=PlanListSerializer.Meta.model.objects.all(),
        source='plan',
        write_only=True,
        required=False,
        allow_null=True
    )
    subscription_status = serializers.ReadOnlyField()

    class Meta:
        model = ClientProfile
        fields = [
            'id', 'user', 'company_name', 'website_url', 'industry',
            'address', 'city', 'state', 'country', 'postal_code',
            'notes', 'plan', 'plan_id', 'subscription_start_date',
            'subscription_end_date', 'subscription_status', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ClientProfileListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing clients."""
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True, default=None)
    subscription_status = serializers.ReadOnlyField()

    class Meta:
        model = ClientProfile
        fields = [
            'id', 'company_name', 'user_email', 'user_name',
            'plan_name', 'subscription_status', 'is_active', 'created_at'
        ]


class ClientCreateSerializer(serializers.Serializer):
    """Serializer for creating a new client with user account."""
    # User fields
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    phone = serializers.CharField(required=False, allow_blank=True)

    # Profile fields
    company_name = serializers.CharField()
    website_url = serializers.URLField(required=False, allow_blank=True)
    industry = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(required=False, allow_blank=True)
    postal_code = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    plan_id = serializers.IntegerField(required=False, allow_null=True)
    subscription_start_date = serializers.DateField(required=False, allow_null=True)
    subscription_end_date = serializers.DateField(required=False, allow_null=True)

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('A user with this email already exists.')
        return value

    def create(self, validated_data):
        from apps.plans.models import Plan

        # Extract user fields
        user_data = {
            'email': validated_data['email'],
            'username': validated_data['email'],  # Use email as username
            'first_name': validated_data.get('first_name', ''),
            'last_name': validated_data.get('last_name', ''),
            'phone': validated_data.get('phone', ''),
            'role': 'client',
        }

        # Create user
        user = User(**user_data)
        user.set_password(validated_data['password'])
        user.save()

        # Extract profile fields
        plan_id = validated_data.get('plan_id')
        plan = None
        if plan_id:
            try:
                plan = Plan.objects.get(id=plan_id)
            except Plan.DoesNotExist:
                pass

        profile_data = {
            'user': user,
            'company_name': validated_data['company_name'],
            'website_url': validated_data.get('website_url', ''),
            'industry': validated_data.get('industry', ''),
            'address': validated_data.get('address', ''),
            'city': validated_data.get('city', ''),
            'state': validated_data.get('state', ''),
            'country': validated_data.get('country', ''),
            'postal_code': validated_data.get('postal_code', ''),
            'notes': validated_data.get('notes', ''),
            'plan': plan,
            'subscription_start_date': validated_data.get('subscription_start_date'),
            'subscription_end_date': validated_data.get('subscription_end_date'),
        }

        profile = ClientProfile.objects.create(**profile_data)
        return profile


class ClientUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating client profile (admin)."""
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    phone = serializers.CharField(source='user.phone', required=False, allow_blank=True)
    plan_id = serializers.PrimaryKeyRelatedField(
        queryset=ClientProfile._meta.get_field('plan').related_model.objects.all(),
        source='plan',
        required=False,
        allow_null=True
    )

    class Meta:
        model = ClientProfile
        fields = [
            'id', 'email', 'first_name', 'last_name', 'phone',
            'company_name', 'website_url', 'industry',
            'address', 'city', 'state', 'country', 'postal_code',
            'notes', 'plan_id', 'subscription_start_date',
            'subscription_end_date', 'is_active'
        ]
        read_only_fields = ['id', 'email']

    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop('user', {})
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        # Update profile
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class ClientSelfUpdateSerializer(serializers.ModelSerializer):
    """Serializer for clients updating their own business data."""
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    phone = serializers.CharField(source='user.phone', required=False, allow_blank=True)

    class Meta:
        model = ClientProfile
        fields = [
            'first_name', 'last_name', 'phone',
            'company_name', 'website_url', 'industry',
            'address', 'city', 'state', 'country', 'postal_code'
        ]

    def update(self, instance, validated_data):
        # Handle nested user data
        user_data = validated_data.pop('user', {})
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()

        # Update profile (excluding admin-only fields)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        return instance


class ClientDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for admin viewing client with all nested data."""
    user = UserSerializer(read_only=True)
    plan = PlanListSerializer(read_only=True)
    subscription_status = serializers.ReadOnlyField()

    # Nested data
    keywords = serializers.SerializerMethodField()
    payments = serializers.SerializerMethodField()

    # Summary stats
    keyword_summary = serializers.SerializerMethodField()
    payment_summary = serializers.SerializerMethodField()

    class Meta:
        model = ClientProfile
        fields = [
            'id', 'user', 'company_name', 'website_url', 'industry',
            'address', 'city', 'state', 'country', 'postal_code',
            'notes', 'plan', 'subscription_start_date',
            'subscription_end_date', 'subscription_status', 'is_active',
            'created_at', 'updated_at',
            # Nested data
            'keywords', 'payments',
            # Summaries
            'keyword_summary', 'payment_summary'
        ]

    def get_keywords(self, obj):
        """Get all keywords with their latest rankings."""
        from apps.keywords.models import Keyword
        keywords = Keyword.objects.filter(client=obj).prefetch_related('rankings')
        result = []
        for kw in keywords:
            latest = kw.latest_ranking
            # Get ranking history (last 10)
            rankings = list(kw.rankings.all()[:10])
            position_change = None
            if len(rankings) >= 2:
                position_change = rankings[1].position - rankings[0].position

            result.append({
                'id': kw.id,
                'keyword': kw.keyword,
                'target_url': kw.target_url,
                'search_volume': kw.search_volume,
                'difficulty': kw.difficulty,
                'is_primary': kw.is_primary,
                'latest_position': latest.position if latest else None,
                'position_change': position_change,
                'ranking_history': [
                    {'date': r.recorded_date.isoformat(), 'position': r.position}
                    for r in reversed(rankings)
                ]
            })
        return result

    def get_payments(self, obj):
        """Get all payments for this client."""
        from apps.payments.models import Payment
        payments = Payment.objects.filter(client=obj).select_related('plan').order_by('-due_date')[:20]
        return [
            {
                'id': p.id,
                'amount': float(p.amount),
                'currency': p.currency,
                'status': p.status,
                'payment_method': p.payment_method,
                'due_date': p.due_date.isoformat(),
                'paid_date': p.paid_date.isoformat() if p.paid_date else None,
                'invoice_number': p.invoice_number,
                'description': p.description,
                'plan_name': p.plan.name if p.plan else None,
                'is_overdue': p.is_overdue
            }
            for p in payments
        ]

    def get_keyword_summary(self, obj):
        """Get keyword summary stats."""
        from apps.keywords.models import Keyword
        keywords = Keyword.objects.filter(client=obj).prefetch_related('rankings')
        total = keywords.count()
        primary = keywords.filter(is_primary=True).count()

        # Count keywords in top 10, 11-50, 51+
        top_10 = 0
        top_50 = 0
        not_ranking = 0

        for kw in keywords:
            latest = kw.latest_ranking
            if latest:
                if latest.position <= 10:
                    top_10 += 1
                elif latest.position <= 50:
                    top_50 += 1
            else:
                not_ranking += 1

        return {
            'total': total,
            'primary': primary,
            'in_top_10': top_10,
            'in_top_50': top_50,
            'not_ranking': not_ranking
        }

    def get_payment_summary(self, obj):
        """Get payment summary stats."""
        from apps.payments.models import Payment
        from django.db.models import Sum
        from django.utils import timezone

        payments = Payment.objects.filter(client=obj)
        today = timezone.now().date()

        total_paid = payments.filter(status='paid').aggregate(
            total=Sum('amount')
        )['total'] or 0

        total_pending = payments.filter(status='pending').aggregate(
            total=Sum('amount')
        )['total'] or 0

        overdue_count = payments.filter(
            status='pending',
            due_date__lt=today
        ).count()

        overdue_amount = payments.filter(
            status='pending',
            due_date__lt=today
        ).aggregate(total=Sum('amount'))['total'] or 0

        return {
            'total_paid': float(total_paid),
            'total_pending': float(total_pending),
            'overdue_count': overdue_count,
            'overdue_amount': float(overdue_amount)
        }
