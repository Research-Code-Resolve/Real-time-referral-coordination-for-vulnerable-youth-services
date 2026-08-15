from django.contrib.auth.models import User
from .models import Notification


def notify_organisation(organisation, referral, message, urgent=False):
    """Create a notification for every user belonging to the given organisation."""
    if not organisation:
        return
    recipients = User.objects.filter(profile__organisation=organisation)
    Notification.objects.bulk_create([
        Notification(recipient=user, referral=referral, message=message, is_urgent=urgent)
        for user in recipients
    ])


def create_notification_for_status_change(referral, actor_profile):
    message = f"Referral #{referral.id} status changed to {referral.status}"
    urgent = referral.priority == 'Emergency'
    if actor_profile and actor_profile.organisation_id == referral.receiving_organisation_id:
        notify_organisation(referral.referring_organisation, referral, message, urgent)
    else:
        notify_organisation(referral.receiving_organisation, referral, message, urgent)


def create_notification_for_note(note):
    referral = note.referral
    message = f"New note on Referral #{referral.id}"
    if note.organisation_id == referral.receiving_organisation_id:
        notify_organisation(referral.referring_organisation, referral, message)
    else:
        notify_organisation(referral.receiving_organisation, referral, message)