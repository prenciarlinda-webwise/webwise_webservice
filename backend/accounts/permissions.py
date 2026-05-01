from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employee'


class IsClient(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'client'


class IsAdminOrEmployee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('admin', 'employee')


class IsSupervisor(BasePermission):
    """Admin OR employee whose EmployeeProfile.category == 'supervisor'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_supervisor


class IsEconomist(BasePermission):
    """Admin OR employee whose EmployeeProfile.category == 'economist'."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_economist


class IsSupervisorOrEconomist(BasePermission):
    """Admin OR supervisor OR economist."""
    def has_permission(self, request, view):
        u = request.user
        return u.is_authenticated and (u.is_supervisor or u.is_economist)


class IsAdminOrSupervisor(BasePermission):
    """Admin OR supervisor (alias of IsSupervisor; both currently include admin)."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_supervisor
