from rest_framework import serializers
from .models import Organisation, Youth, Referral, ReferralNote, Notification


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = [
            'id', 'name', 'category', 'service_type', 'location', 'phone', 'email',
            'contact_person', 'target_age_group', 'target_gender', 'availability',
            'requirements', 'operating_details',
        ]


class YouthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Youth
        fields = [
            'id', 'full_name', 'age', 'gender', 'location',
            'primary_need', 'immediate_needs', 'priority', 'status',
        ]

    def validate_age(self, value):
        if value < 0 or value > 24:
            raise serializers.ValidationError("Age must be between 0 and 24 for youth services.")
        return value


class ReferralSerializer(serializers.ModelSerializer):
    youth_name = serializers.CharField(source='youth.full_name', read_only=True)
    referring_organisation_name = serializers.CharField(source='referring_organisation.name', read_only=True)
    receiving_organisation_name = serializers.CharField(source='receiving_organisation.name', read_only=True)

    class Meta:
        model = Referral
        fields = [
            'id', 'youth', 'youth_name',
            'referring_organisation', 'referring_organisation_name',
            'receiving_organisation', 'receiving_organisation_name',
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
    class Meta:
        model = Referral
        fields = ['id', 'status']


class ReferralNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    organisation_name = serializers.CharField(source='organisation.name', read_only=True)

    class Meta:
        model = ReferralNote
        fields = ['id', 'author', 'author_name', 'organisation', 'organisation_name', 'text', 'created_at']
        read_only_fields = ['author', 'organisation', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    referral_service = serializers.CharField(source='referral.service_needed', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'referral', 'referral_service', 'message', 'is_urgent', 'is_read', 'created_at']
        read_only_fields = ['referral', 'referral_service', 'message', 'is_urgent', 'created_at']


class CurrentUserSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.SerializerMethodField()
    organisation = serializers.SerializerMethodField()
    organisation_id = serializers.SerializerMethodField()

    def get_role(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.role if profile else None

    def get_organisation(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.organisation.name if profile and profile.organisation else None

    def get_organisation_id(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.organisation_id if profile else None