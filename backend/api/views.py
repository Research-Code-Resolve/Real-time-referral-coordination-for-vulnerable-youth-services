from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from .models import Organisation, Youth, Referral, Notification
from .serializers import (
    OrganisationSerializer,
    YouthSerializer,
    ReferralSerializer,
    ReferralStatusUpdateSerializer,
    ReferralNoteSerializer,
    NotificationSerializer,
    CurrentUserSerializer,
)
from .permissions import ReferralAccessPermission, YouthAccessPermission, OrganisationAccessPermission
from .notifications import create_notification_for_status_change, create_notification_for_note


class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = [OrganisationAccessPermission]


class YouthViewSet(viewsets.ModelViewSet):
    queryset = Youth.objects.all()
    serializer_class = YouthSerializer
    permission_classes = [YouthAccessPermission]


class ReferralViewSet(viewsets.ModelViewSet):
    serializer_class = ReferralSerializer
    permission_classes = [ReferralAccessPermission]

    def get_queryset(self):
        queryset = Referral.objects.all().select_related(
            'youth', 'referring_organisation', 'receiving_organisation'
        )
        profile = getattr(self.request.user, 'profile', None)
        if profile and profile.role == profile.Role.PARTNER:
            queryset = queryset.filter(receiving_organisation=profile.organisation)
        youth_id = self.request.query_params.get('youth')
        if youth_id:
            queryset = queryset.filter(youth_id=youth_id)
        return queryset

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """PATCH /referrals/{id}/status/ — update only the status field."""
        referral = self.get_object()
        serializer = ReferralStatusUpdateSerializer(referral, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        profile = getattr(request.user, 'profile', None)
        create_notification_for_status_change(referral, profile)
        return Response(ReferralSerializer(referral).data)

    @action(detail=True, methods=['get', 'post'], url_path='notes')
    def notes(self, request, pk=None):
        """GET /referrals/{id}/notes/ — list dated notes. POST — add a new one."""
        referral = self.get_object()

        if request.method == 'GET':
            notes = referral.notes_log.all()
            return Response(ReferralNoteSerializer(notes, many=True).data)

        serializer = ReferralNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        profile = getattr(request.user, 'profile', None)
        note = serializer.save(
            referral=referral,
            author=request.user,
            organisation=profile.organisation if profile else None,
        )
        create_notification_for_note(note)
        return Response(ReferralNoteSerializer(note).data, status=201)


class NotificationViewSet(viewsets.ModelViewSet):
    """Read + mark-as-read only. Notifications are system-generated, never created via the API directly."""
    serializer_class = NotificationSerializer
    http_method_names = ['get', 'patch']

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)