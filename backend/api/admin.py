from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Organisation, Youth, Referral, ReferralNote, UserProfile, Notification


@admin.register(Organisation)
class OrganisationAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'service_type', 'location', 'phone', 'email')
    list_filter = ('category',)
    search_fields = ('name', 'location')


@admin.register(Youth)
class YouthAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'age', 'gender', 'location', 'priority', 'status')
    list_filter = ('status', 'priority')
    search_fields = ('full_name', 'location')


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = (
        'youth', 'referring_organisation', 'receiving_organisation',
        'priority', 'status', 'created_at',
    )
    list_filter = ('status', 'priority')
    search_fields = ('youth__full_name', 'service_needed')


@admin.register(ReferralNote)
class ReferralNoteAdmin(admin.ModelAdmin):
    list_display = ('referral', 'author', 'organisation', 'created_at')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'referral', 'message', 'is_read', 'is_urgent', 'created_at')
    list_filter = ('is_read', 'is_urgent')


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'


class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'get_role', 'get_organisation', 'is_active', 'is_staff')

    def get_role(self, obj):
        return obj.profile.role if hasattr(obj, 'profile') else '—'
    get_role.short_description = 'Role'

    def get_organisation(self, obj):
        return obj.profile.organisation if hasattr(obj, 'profile') else '—'
    get_organisation.short_description = 'Organisation'


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)