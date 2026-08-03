from django.db import models


class Organisation(models.Model):
    """An organisation that can refer youth to, or receive referrals from, other organisations."""
    name = models.CharField(max_length=255)
    service_type = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return self.name


class Youth(models.Model):
    """A young person receiving services, who may be the subject of one or more referrals."""

    class Gender(models.TextChoices):
        MALE = 'Male', 'Male'
        FEMALE = 'Female', 'Female'
        OTHER = 'Other', 'Other'

    full_name = models.CharField(max_length=255)
    age = models.PositiveIntegerField()
    gender = models.CharField(max_length=10, choices=Gender.choices)
    location = models.CharField(max_length=255)
    primary_need = models.CharField(max_length=255)

    def __str__(self):
        return self.full_name


class Referral(models.Model):
    """A referral of a youth from one organisation to another for a specific service."""

    class Priority(models.TextChoices):
        LOW = 'Low', 'Low'
        MEDIUM = 'Medium', 'Medium'
        HIGH = 'High', 'High'
        EMERGENCY = 'Emergency', 'Emergency'

    class Status(models.TextChoices):
        SUBMITTED = 'Submitted', 'Submitted'
        ACCEPTED = 'Accepted', 'Accepted'
        IN_PROGRESS = 'In Progress', 'In Progress'
        COMPLETED = 'Completed', 'Completed'

    youth = models.ForeignKey(
        Youth, on_delete=models.CASCADE, related_name='referrals'
    )
    referring_organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name='referrals_made'
    )
    receiving_organisation = models.ForeignKey(
        Organisation, on_delete=models.CASCADE, related_name='referrals_received'
    )
    service_needed = models.CharField(max_length=255)
    priority = models.CharField(max_length=10, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.youth} → {self.receiving_organisation} ({self.status})"