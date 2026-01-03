from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    """Permission check for admin users."""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'admin'
        )


class IsClient(permissions.BasePermission):
    """Permission check for client users."""

    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'client'
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission check for object owners or admin users.
    The object must have a 'user' attribute or be a User instance.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True

        # Check if obj is the user or has a user attribute
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user


class IsClientOwner(permissions.BasePermission):
    """
    Permission check for client profile owners.
    Used for objects that have a 'client' ForeignKey to ClientProfile.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.role == 'admin':
            return True

        # Check if user has a client profile and if it matches
        if hasattr(request.user, 'client_profile') and hasattr(obj, 'client'):
            return obj.client == request.user.client_profile
        return False
