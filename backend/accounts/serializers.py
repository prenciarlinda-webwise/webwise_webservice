from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    is_supervisor = serializers.BooleanField(read_only=True)
    is_economist = serializers.BooleanField(read_only=True)
    employee_category = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone',
            'is_supervisor', 'is_economist', 'employee_category', 'date_joined',
        ]
        read_only_fields = ['id', 'date_joined', 'is_supervisor', 'is_economist', 'employee_category']

    def get_employee_category(self, obj):
        try:
            return obj.employee_profile.category
        except Exception:
            return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.CLIENT, required=False)
    business_name = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone', 'role', 'business_name']

    @transaction.atomic
    def create(self, validated_data):
        role = validated_data.pop('role', User.Role.CLIENT)
        business_name = validated_data.pop('business_name', '').strip()
        user = User.objects.create_user(role=role, **validated_data)
        # Create the matching profile so the rest of the app can rely on it.
        if role == User.Role.CLIENT:
            from clients.models import ClientProfile
            ClientProfile.objects.create(
                user=user,
                business_name=business_name or user.get_full_name() or user.username,
                business_email=user.email,
                business_phone=user.phone,
            )
        elif role == User.Role.EMPLOYEE:
            from employees.models import EmployeeProfile
            EmployeeProfile.objects.create(user=user)
        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
