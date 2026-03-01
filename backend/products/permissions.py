from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrReadOnly(BasePermission):
    """Allow read access to all, write access to admins only."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_admin_user


class IsAdmin(BasePermission):
    """Only admin users can access."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin_user
