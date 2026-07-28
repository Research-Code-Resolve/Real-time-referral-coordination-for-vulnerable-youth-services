from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Organisation, Youth, Referral
from .serializers import (
    OrganisationSerializer,
    YouthSerializer,
    ReferralSerializer,
    ReferralStatusUpdateSerializer,
)


class OrganisationViewSet(viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer


class YouthViewSet(viewsets.ModelViewSet):
    queryset = Youth.objects.all()
    serializer_class = YouthSerializer


class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral.objects.all().select_related(
        'youth', 'referring_organisation', 'receiving_organisation'
    )
    serializer_class = ReferralSerializer

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        """PATCH /referrals/{id}/status/ — update only the status field."""
        referral = self.get_object()
        serializer = ReferralStatusUpdateSerializer(
            referral, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ReferralSerializer(referral).data)
