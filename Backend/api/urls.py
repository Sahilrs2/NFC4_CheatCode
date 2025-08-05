from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

# Register viewsets
router.register(r'users', views.UserProfileViewSet)
router.register(r'skill-assessment',views.SkillAssessmentViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'enrollments', views.EnrollmentViewSet)
router.register(r'mentor-profiles', views.MentorProfileViewSet)
router.register(r'mentor-sessions', views.MentorSessionViewSet)
router.register(r'job-postings', views.JobPostingViewSet)
router.register(r'ngos', views.NGOViewSet)  
router.register(r'referrals', views.ReferralViewSet)
router.register(r'feedback', views.FeedBackViewSet)
router.register(r'customer-support', views.CustomerSupportViewSet)
router.register(r'system-logs', views.SystemLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]