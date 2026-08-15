from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    OrganisationViewSet, YouthViewSet, ReferralViewSet,
    NotificationViewSet, CurrentUserView,
)

router = DefaultRouter()
router.register('organisations', OrganisationViewSet, basename='organisation')
router.register('youth', YouthViewSet, basename='youth')
router.register('referrals', ReferralViewSet, basename='referral')
router.register('notifications', NotificationViewSet, basename='notification')

urlpatterns = router.urls + [
    path('me/', CurrentUserView.as_view(), name='current-user'),
]