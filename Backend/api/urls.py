from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


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
router.register(r'register', views.RegisterUserViewSet)
router.register(r'quizzes', views.QuizViewSet)
router.register(r'quiz-attempts', views.QuizAttemptViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register_user, name='register_user'),
    path('login/', views.login_user, name='login_user'),
    path('ai-mentor/',views.GeminiCareerMentorAPIView.as_view(),name='ai-mentor'),
    path('generate-quiz/', views.AIQuizGenerationAPIView.as_view(), name='generate-quiz'),
    path('submit-quiz/<int:quiz_id>/', views.QuizSubmissionAPIView.as_view(), name='submit-quiz')
]