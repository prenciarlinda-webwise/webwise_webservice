from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'admin', 'Admin'
        EMPLOYEE = 'employee', 'Employee'
        CLIENT = 'client', 'Client'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.CLIENT)
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def is_admin_user(self):
        return self.role == self.Role.ADMIN

    @property
    def is_employee(self):
        return self.role == self.Role.EMPLOYEE

    @property
    def is_client(self):
        return self.role == self.Role.CLIENT

    @property
    def is_supervisor(self):
        # Admin always counts as supervisor. Employees count only if their
        # profile category is 'supervisor'. Avoid importing EmployeeProfile
        # here to keep accounts decoupled from employees.
        if self.role == self.Role.ADMIN:
            return True
        if self.role != self.Role.EMPLOYEE:
            return False
        try:
            return self.employee_profile.category == 'supervisor'
        except Exception:
            return False

    @property
    def is_economist(self):
        if self.role == self.Role.ADMIN:
            return True
        if self.role != self.Role.EMPLOYEE:
            return False
        try:
            return self.employee_profile.category == 'economist'
        except Exception:
            return False

    def can_supervise(self):
        return self.is_supervisor
