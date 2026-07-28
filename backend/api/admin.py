from django.contrib import admin
from .models import Organisation, Youth, Referral


@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = ('name', 'service_type', 'location', 'phone', 'email')
    search_fields = ('name', 'location')


@admin.register(Youth)
class YouthAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'age', 'gender', 'location', 'primary_need')
    search_fields = ('full_name', 'location')


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = (
        'youth', 'referring_organisation', 'receiving_organisation',
        'priority', 'status', 'created_at',
    )
    list_filter = ('status', 'priority')
    search_fields = ('youth__full_name', 'service_needed')
