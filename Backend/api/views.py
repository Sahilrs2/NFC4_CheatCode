from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterUserSerializer
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from .utils.gemini_utils import Genai_response
from .utils.quiz_generator import generate_quiz_questions, generate_quiz_by_category, validate_quiz_data

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
    serializer_class = EnrollmentSerializer

class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.all()
    serializer_class = MentorProfileSerializer

class MentorSessionViewSet(viewsets.ModelViewSet):
    queryset = mentorshipsession.objects.all()
    serializer_class = MentorshipSessionSerializer

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

class RegisterUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'User registered successfully',
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_201_CREATED)
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'success': False,
            'error': 'Username and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'success': False,
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
class GeminiCareerMentorAPIView(APIView):
    def post(self, request):
        try:
            # Ensure data is parsed correctly
            user_question = request.data.get("question")

            if not user_question:
                return Response(
                    {"error": "Missing 'question' in request body."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            ai_response = Genai_response(user_question)
            return Response({"response": ai_response}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Something went wrong: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class QuizAttemptViewSet(viewsets.ModelViewSet):
    queryset = QuizAttempt.objects.all()
    serializer_class = QuizAttemptSerializer
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class AIQuizGenerationAPIView(APIView):
    """
    Generate AI-powered quizzes using Gemini
    """
    
    def post(self, request):
        try:
            serializer = QuizGenerationRequestSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {"error": "Invalid request data", "details": serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            data = serializer.validated_data
            
            # Generate quiz using AI
            if data.get('topic'):
                # Generate quiz for specific topic
                quiz_data = generate_quiz_questions(
                    topic=data['topic'],
                    difficulty=data['difficulty'],
                    num_questions=data['num_questions'],
                    category=data['category']
                )
            else:
                # Generate quiz by category
                quiz_data = generate_quiz_by_category(
                    category=data['category'],
                    difficulty=data['difficulty'],
                    num_questions=data['num_questions']
                )
            
            # Validate the generated quiz data
            if not validate_quiz_data(quiz_data):
                return Response(
                    {"error": "Generated quiz data is invalid"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Create quiz in database
            quiz = Quiz.objects.create(
                title=data.get('title', quiz_data['title']),
                description=data.get('description', quiz_data['description']),
                category=data['category'],
                difficulty=data['difficulty'],
                questions=quiz_data['questions'],
                created_by=request.user,
                time_limit=data['time_limit'],
                passing_score=data['passing_score']
            )
            
            # Return the created quiz
            quiz_serializer = QuizSerializer(quiz)
            return Response({
                "message": "Quiz generated successfully",
                "quiz": quiz_serializer.data
            }, status=status.HTTP_201_CREATED)
            
        except ValueError as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to generate quiz: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class QuizSubmissionAPIView(APIView):
    """
    Submit quiz answers and get results
    """
    
    def post(self, request, quiz_id):
        try:
            quiz = Quiz.objects.get(id=quiz_id, is_active=True)
            
            # Get user answers from request
            user_answers = request.data.get('answers', {})
            
            if not user_answers:
                return Response(
                    {"error": "No answers provided"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate score
            total_questions = len(quiz.questions)
            correct_answers = 0
            
            for i, question in enumerate(quiz.questions):
                question_key = str(i)
                if question_key in user_answers:
                    if user_answers[question_key] == question['correct_answer']:
                        correct_answers += 1
            
            score = (correct_answers / total_questions) * 100
            passed = score >= quiz.passing_score
            
            # Create or update quiz attempt
            attempt, created = QuizAttempt.objects.get_or_create(
                user=request.user,
                quiz=quiz,
                defaults={
                    'answers': user_answers,
                    'score': score,
                    'is_completed': True,
                    'passed': passed,
                    'completed_at': timezone.now()
                }
            )
            
            if not created:
                # Update existing attempt
                attempt.answers = user_answers
                attempt.score = score
                attempt.is_completed = True
                attempt.passed = passed
                attempt.completed_at = timezone.now()
                attempt.save()
            
            return Response({
                "message": "Quiz submitted successfully",
                "score": score,
                "passed": passed,
                "total_questions": total_questions,
                "correct_answers": correct_answers,
                "passing_score": quiz.passing_score,
                "attempt_id": attempt.id
            }, status=status.HTTP_200_OK)
            
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to submit quiz: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )