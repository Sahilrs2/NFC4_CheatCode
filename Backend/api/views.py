from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from .serializers import RegisterUserSerializer

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = User_Profile.objects.all()
    serializer_class = UserProfileSerializer

class SkillAssessmentViewSet(viewsets.ModelViewSet):
    queryset = skillassessment.objects.all()
    serializer_class = SkillAssessmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = CourseSerializer

class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.all()
    serializer_class = MentorProfileSerializer

class MentorSessionViewSet(viewsets.ModelViewSet):
    queryset = mentorshipsession.objects.all()
    serializer_class = MentorProfileSerializer

class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer

class NGOViewSet(viewsets.ModelViewSet):
    queryset = NGO.objects.all()
    serializer_class = NGOProfileSerializer

class ReferralViewSet(viewsets.ModelViewSet):
    queryset = Referral_services.objects.all()
    serializer_class = ReferralServicesSerializer

class FeedBackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer

class CustomerSupportViewSet(viewsets.ModelViewSet):
    queryset = customer_support.objects.all()
    serializer_class = CustomerSupportSerializer

class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = system_logs.objects.all()
    serializer_class = SystemLogsSerializer

class RegisterUserView(generics.CreateAPIView):
    serializer_class = RegisterUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch()
