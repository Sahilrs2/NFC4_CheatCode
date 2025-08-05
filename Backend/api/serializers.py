from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User

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

class RegisterUserSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=User_Profile.ROLE_CHOICES, default='')
    phone = serializers.CharField(required=False)
    age = serializers.IntegerField(required=False)
    gender = serializers.ChoiceField(choices=User_Profile.GENDER_CHOICES, required=False)
    location = serializers.CharField(required=False)
    language_preference = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone', 'age', 'gender', 'location', 'language_preference']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        profile_fields = {
            'role': validated_data.pop('role'),
            'phone': validated_data.pop('phone', ''),
            'age': validated_data.pop('age', None),
            'gender': validated_data.pop('gender', 'Other'),
            'location': validated_data.pop('location', ''),
            'language_preference': validated_data.pop('language_preference', '')
        }

        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()

        User_Profile.objects.create(
            user=user,
            **profile_fields
        )
        return user

class QuizSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Quiz
        fields = '__all__'
        read_only_fields = ['created_by', 'created_at']

class QuizAttemptSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    
    class Meta:
        model = QuizAttempt
        fields = '__all__'
        read_only_fields = ['user', 'started_at']

class QuizGenerationRequestSerializer(serializers.Serializer):
    topic = serializers.CharField(max_length=200, required=False)
    category = serializers.ChoiceField(choices=Quiz.CATEGORY_CHOICES, default='GENERAL_KNOWLEDGE')
    difficulty = serializers.ChoiceField(choices=Quiz.DIFFICULTY_CHOICES, default='MEDIUM')
    num_questions = serializers.IntegerField(min_value=5, max_value=50, default=10)
    title = serializers.CharField(max_length=200, required=False)
    description = serializers.CharField(required=False)
    time_limit = serializers.IntegerField(min_value=5, max_value=120, default=30)
    passing_score = serializers.IntegerField(min_value=50, max_value=100, default=70)