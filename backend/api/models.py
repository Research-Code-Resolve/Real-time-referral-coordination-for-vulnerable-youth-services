from django.db import models
from django.contrib.auth.models import User


class Organisation(models.Model):
    class Category(models.TextChoices):
        HEALTH = 'Health', 'Health'
        MENTAL_HEALTH = 'Mental Health', 'Mental Health'
        SHELTER = 'Shelter', 'Shelter'
        LEGAL = 'Legal', 'Legal'
        GBV = 'GBV', 'GBV'
        EDUCATION = 'Education', 'Education'
        VOCATIONAL_TRAINING = 'Vocational Training', 'Vocational Training'
        PSYCHOSOCIAL_SUPPORT = 'Psychosocial Support', 'Psychosocial Support'
        LIVELIHOOD = 'Livelihood', 'Livelihood'

    name = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=Category.choices)
    service_type = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    contact_person = models.CharField(max_length=255, blank=True)
    target_age_group = models.CharField(max_length=100, blank=True)
    target_gender = models.CharField(max_length=20, blank=True)
    availability = models.CharField(max_length=255, blank=True)
    requirements = models.TextField(blank=True)
    operating_details = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Youth(models.Model):
    class Gender(models.TextChoices):
        MALE = 'Male', 'Male'
        FEMALE = 'Female', 'Female'
        OTHER = 'Other', 'Other'

    class Priority(models.TextChoices):
        LOW = 'Low', 'Low'
        MEDIUM = 'Medium', 'Medium'
        HIGH = 'High', 'High'
        EMERGENCY = 'Emergency', 'Emergency'

    class Status(models.TextChoices):
        OPEN = 'Open', 'Open'
        IN_PROGRESS = 'In Progress', 'In Progress'
        CLOSED = 'Closed', 'Closed'

    full_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    location = models.CharField(max_length=255)
    primary_need = models.CharField(max_length=255)
    immediate_needs = models.TextField(blank=True)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)

    def __str__(self):
        return self.full_name


class Referral(models.Model):
    class Priority(models.TextChoices):
        LOW = 'Low', 'Low'
        MEDIUM = 'Medium', 'Medium'
        HIGH = 'High', 'High'
        EMERGENCY = 'Emergency', 'Emergency'  # displayed as "Urgent" in the UI

    class Status(models.TextChoices):
        SUBMITTED = 'Submitted', 'Submitted'
        RECEIVED = 'Received', 'Received'
        ACCEPTED = 'Accepted', 'Accepted'
        DECLINED = 'Declined', 'Declined'
        INFO_REQUESTED = 'Information Requested', 'Information Requested'
        APPOINTMENT_SCHEDULED = 'Appointment Scheduled', 'Appointment Scheduled'
        CLIENT_ARRIVED = 'Client Arrived', 'Client Arrived'
        SERVICE_IN_PROGRESS = 'Service In Progress', 'Service In Progress'
        SERVICE_COMPLETED = 'Service Completed', 'Service Completed'
        CLOSED = 'Closed', 'Closed'

    youth = models.ForeignKey(Youth, on_delete=models.CASCADE, related_name='referrals')
    referring_organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name='referrals_made'
    )
    receiving_organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name='referrals_received'
    )
    service_needed = models.CharField(max_length=255)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.SUBMITTED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.youth} → {self.receiving_organisation} ({self.status})"


class ReferralNote(models.Model):
    """A dated update on a referral, attributed to the user/organisation who wrote it."""
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE, related_name='notes_log')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='referral_notes')
    organisation = models.ForeignKey(
        Organisation, on_delete=models.SET_NULL, null=True, blank=True
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Note on Referral #{self.referral_id} by {self.author}"


class UserProfile(models.Model):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        SOCIAL_WORKER = 'SOCIAL_WORKER', 'Social Worker'
        PARTNER = 'PARTNER', 'Partner Organisation'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=Role.choices)
    organisation = models.ForeignKey(
        Organisation, on_delete=models.SET_NULL, null=True, blank=True, related_name='staff'
    )

    def __str__(self):
        return f"{self.user.username} ({self.role})"


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    referral = models.ForeignKey(Referral, on_delete=models.CASCADE, related_name='notifications')
    message = models.CharField(max_length=255)
    is_urgent = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"To {self.recipient}: {self.message}"