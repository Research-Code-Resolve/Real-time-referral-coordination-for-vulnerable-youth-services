from rest_framework import serializers
from .models import Organisation, Youth, Referral


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ['id', 'name', 'service_type', 'location', 'phone', 'email']


class YouthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Youth
        fields = ['id', 'full_name', 'age', 'gender', 'location', 'primary_need']

    def validate_age(self, value):
        if value < 0 or value > 24:
            raise serializers.ValidationError("Age must be between 0 and 24 for youth services.")
        return value


class ReferralSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral
        fields = [
            'id', 'youth', 'referring_organisation', 'receiving_organisation',
            'service_needed', 'priority', 'status', 'notes',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        referring = data.get('referring_organisation', getattr(self.instance, 'referring_organisation', None))
        receiving = data.get('receiving_organisation', getattr(self.instance, 'receiving_organisation', None))
        if referring == receiving:
            raise serializers.ValidationError(
                "Referring and receiving organisations must be different."
            )
        return data


class ReferralStatusUpdateSerializer(serializers.ModelSerializer):
    """Used specifically for the PATCH status-only endpoint."""
    class Meta:
        model = Referral
        fields = ['id', 'status']