from rest_framework.routers import DefaultRouter
from .views import OrganisationViewSet, YouthViewSet, ReferralViewSet

router = DefaultRouter()
router.register('organisations', OrganisationViewSet, basename='organisation')
router.register('youth', YouthViewSet, basename='youth')
router.register('referrals', ReferralViewSet, basename='referral')

urlpatterns = router.urls