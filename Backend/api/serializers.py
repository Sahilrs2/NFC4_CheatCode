from rest_framework import serializers
from .models import * 

# The `UserProfileSerializer` class is a Django REST framework serializer for the `User_Profile` model
# with all fields included.
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Profile
        fields = '__all__'

class SkillAssessmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = skillassessment
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enrollment
        fields = '__all__'

class MentorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = MentorProfile
        fields = '__all__'

class MentorshipSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = mentorshipsession
        fields = '__all__'

class JobPostingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = '__all__'

class NGOProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NGO
        fields = '__all__'

class ReferralServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Referral_services
        fields = '__all__'

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = '__all__'

class CustomerSupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = customer_support
        fields = '__all__'

class SystemLogsSerializer(serializers.ModelSerializer):
    class Meta:
        model = system_logs
        fields = '__all__'