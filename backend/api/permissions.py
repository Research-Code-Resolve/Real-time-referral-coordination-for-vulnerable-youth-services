from rest_framework.permissions import BasePermission


def get_profile(user):
    return getattr(user, 'profile', None)


class ReferralAccessPermission(BasePermission):
    """
    Super Admin / Social Worker: full access to referrals, notes, and status.
    Partner: list/retrieve/status-update/notes only, and only for referrals
    where their organisation is the receiving_organisation.
    """

    def has_permission(self, request, view):
        profile = get_profile(request.user)
        if not profile:
            return False

        if profile.role in (profile.Role.SUPER_ADMIN, profile.Role.SOCIAL_WORKER):
            return True

        if profile.role == profile.Role.PARTNER:
            return view.action in ('list', 'retrieve', 'update_status', 'notes')

        return False

    def has_object_permission(self, request, view, obj):
        profile = get_profile(request.user)
        if profile.role in (profile.Role.SUPER_ADMIN, profile.Role.SOCIAL_WORKER):
            return True

        if profile.role == profile.Role.PARTNER:
            return obj.receiving_organisation_id == profile.organisation_id

        return False


class YouthAccessPermission(BasePermission):
    """Social Worker / Super Admin: full access. Partner: read-only."""

    def has_permission(self, request, view):
        profile = get_profile(request.user)
        if not profile:
            return False
        if profile.role in (profile.Role.SUPER_ADMIN, profile.Role.SOCIAL_WORKER):
            return True
        if profile.role == profile.Role.PARTNER:
            return view.action in ('list', 'retrieve')
        return False


class OrganisationAccessPermission(BasePermission):
    """All authenticated roles can read. Only Super Admin can write."""

    def has_permission(self, request, view):
        profile = get_profile(request.user)
        if not profile:
            return False
        if view.action in ('list', 'retrieve'):
            return True
        return profile.role == profile.Role.SUPER_ADMIN