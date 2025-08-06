from rest_framework import viewsets
from .models import *
from .serializers import *
from rest_framework import generics, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterUserSerializer
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from .utils.gemini_utils import Genai_response
from .utils.quiz_generator import generate_quiz_questions, generate_quiz_by_category, validate_quiz_data
from django.db.models import Q, Count, Avg
from django.db import models
from datetime import datetime, timedelta
import uuid

# Basic Viewsets
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = User_Profile.objects.all()
    serializer_class = UserProfileSerializer

class SkillAssessmentViewSet(viewsets.ModelViewSet):
    queryset = skillassessment.objects.all()
    serializer_class = SkillAssessmentSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_queryset(self):
        queryset = Course.objects.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        difficulty = self.request.query_params.get('difficulty', None)
        language = self.request.query_params.get('language', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if difficulty:
            queryset = queryset.filter(difficulty_level=difficulty)
        if language:
            queryset = queryset.filter(language=language)
            
        return queryset

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class MentorProfileViewSet(viewsets.ModelViewSet):
    queryset = MentorProfile.objects.all()
    serializer_class = MentorProfileSerializer
    
    def get_queryset(self):
        queryset = MentorProfile.objects.filter(is_available=True)
        sector = self.request.query_params.get('sector', None)
        location = self.request.query_params.get('location', None)
        languages = self.request.query_params.get('languages', None)
        
        if sector:
            queryset = queryset.filter(sector=sector)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if languages:
            queryset = queryset.filter(languages_spoken__icontains=languages)
            
        return queryset.order_by('-rating', '-total_sessions')

class MentorSessionViewSet(viewsets.ModelViewSet):
    queryset = mentorshipsession.objects.all()
    serializer_class = MentorshipSessionSerializer

class JobPostingViewSet(viewsets.ModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = JobPostingSerializer
    
    def get_queryset(self):
        queryset = JobPosting.objects.filter(is_active=True)
        job_type = self.request.query_params.get('job_type', None)
        location = self.request.query_params.get('location', None)
        remote = self.request.query_params.get('remote', None)
        experience_level = self.request.query_params.get('experience_level', None)
        
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if remote:
            queryset = queryset.filter(remote_work=remote.lower() == 'true')
        if experience_level:
            queryset = queryset.filter(experience_level=experience_level)
            
        return queryset.order_by('-posted_on')



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
    
    def get_queryset(self):
        """Filter support tickets based on query parameters"""
        queryset = customer_support.objects.all()
        
        # Filter by status
        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by priority
        priority = self.request.query_params.get('priority', None)
        if priority:
            queryset = queryset.filter(priority=priority)
        
        # Filter by assigned user
        assigned_to = self.request.query_params.get('assigned_to', None)
        if assigned_to:
            queryset = queryset.filter(assigned_to__username=assigned_to)
        
        # Search by name, email, or subject
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                models.Q(name__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(subject__icontains=search) |
                models.Q(message__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Create a new support ticket and log the action"""
        support_ticket = serializer.save()
        
        # Log the action
        system_logs.objects.create(
            user=self.request.user if self.request.user.is_authenticated else None,
            action='Support ticket created',
            details=f'New support ticket created: {support_ticket.subject} from {support_ticket.name}'
        )
        
        return support_ticket
    
    def perform_update(self, serializer):
        """Update support ticket and log changes"""
        old_status = serializer.instance.status if serializer.instance else None
        support_ticket = serializer.save()
        
        # Log status changes
        if old_status and old_status != support_ticket.status:
            system_logs.objects.create(
                user=self.request.user,
                action='Support ticket status updated',
                details=f'Ticket {support_ticket.id} status changed from {old_status} to {support_ticket.status}'
            )
        
        return support_ticket
    
    @action(detail=True, methods=['post'])
    def assign_to_me(self, request, pk=None):
        """Assign support ticket to current user"""
        support_ticket = self.get_object()
        support_ticket.assigned_to = request.user
        support_ticket.status = 'in_progress'
        support_ticket.save()
        
        serializer = self.get_serializer(support_ticket)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_resolved(self, request, pk=None):
        """Mark support ticket as resolved"""
        support_ticket = self.get_object()
        support_ticket.status = 'resolved'
        support_ticket.resolved_at = timezone.now()
        support_ticket.save()
        
        serializer = self.get_serializer(support_ticket)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get support ticket statistics"""
        total_tickets = customer_support.objects.count()
        pending_tickets = customer_support.objects.filter(status='pending').count()
        in_progress_tickets = customer_support.objects.filter(status='in_progress').count()
        resolved_tickets = customer_support.objects.filter(status='resolved').count()
        
        # Category breakdown
        category_stats = customer_support.objects.values('category').annotate(
            count=models.Count('id')
        ).order_by('-count')
        
        # Priority breakdown
        priority_stats = customer_support.objects.values('priority').annotate(
            count=models.Count('id')
        ).order_by('-count')
        
        return Response({
            'total_tickets': total_tickets,
            'pending_tickets': pending_tickets,
            'in_progress_tickets': in_progress_tickets,
            'resolved_tickets': resolved_tickets,
            'category_breakdown': category_stats,
            'priority_breakdown': priority_stats
        })

class SystemLogViewSet(viewsets.ModelViewSet):
    queryset = system_logs.objects.all()
    serializer_class = SystemLogsSerializer

class RegisterUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer

# Quiz Viewsets
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

# Authentication APIs
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

# Enhanced Dashboard API
@api_view(['GET'])
def dashboard_data(request):
    """Get comprehensive dashboard data for the current user"""
    try:
        user = request.user
        user_profile = User_Profile.objects.get(user=user)
        
        # Calculate profile completion
        profile_fields = ['age', 'gender', 'education', 'location', 'phone', 'skill_set', 'goals']
        completed_fields = sum(1 for field in profile_fields if getattr(user_profile, field))
        profile_completion = (completed_fields / len(profile_fields)) * 100
        
        # Course statistics
        enrollments = Enrollment.objects.filter(user=user)
        total_courses = enrollments.count()
        completed_courses = enrollments.filter(completed=True).count()
        active_courses = enrollments.filter(completed=False).count()
        
        # Mentor session statistics
        mentor_sessions = mentorshipsession.objects.filter(mentee=user)
        total_mentor_sessions = mentor_sessions.count()
        upcoming_sessions = mentor_sessions.filter(
            status='ACCEPTED',
            scheduled_on__gte=timezone.now()
        ).count()
        
        
        # Upcoming mentor sessions
        next_session = mentor_sessions.filter(
            status='ACCEPTED',
            scheduled_on__gte=timezone.now()
        ).first()
    except : 
        pass
        
# Career Advisor AI Chat
@api_view(['POST'])
def ai_career_chat(request):
    """Enhanced AI career advisor chat with context awareness"""
    try:
        user = request.user
        message = request.data.get('message')
        session_id = request.data.get('session_id')
        
        if not message:
            return Response({
                'error': 'Message is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        

    except Exception as e:
        return Response({
            'error': f'Failed to process chat: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Barrier Management
@api_view(['POST'])
def identify_barrier(request):
    """Identify and create a new barrier for the user"""
    try:
        user = request.user
        barrier_type = request.data.get('barrier_type')
        description = request.data.get('description')
        priority = request.data.get('priority', 'MEDIUM')
        
        if not barrier_type or not description:
            return Response({
                'error': 'Barrier type and description are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        barrier = Barrier.objects.create(
            user=user,
            barrier_type=barrier_type,
            description=description,
            priority=priority
        )
        
        # Log the barrier identification
        system_logs.objects.create(
            user=user,
            action='BARRIER_IDENTIFIED',
            details=f'Barrier type: {barrier_type}, Priority: {priority}'
        )
        
        return Response({
            'message': 'Barrier identified successfully',
            'barrier_id': barrier.id
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({
            'error': f'Failed to identify barrier: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Social Service Referrals
@api_view(['GET'])
def get_nearby_services(request):
    """Get social services near the user's location"""
    try:
        user = request.user
        user_profile = User_Profile.objects.get(user=user)
        user_location = user_profile.location
        
        if not user_location:
            return Response({
                'error': 'User location not set'
            }, status=status.HTTP_400_BAD_REQUEST)
        

    except Exception as e:
        return Response({
            'error': f'Failed to fetch nearby services: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Community Mobilization
@api_view(['POST'])
def join_community(request):
    """Join an NGO community"""
    try:
        user = request.user
        ngo_id = request.data.get('ngo_id')
        role = request.data.get('role', 'MEMBER')
        
        if not ngo_id:
            return Response({
                'error': 'NGO ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        ngo = NGO.objects.get(id=ngo_id)
    except NGO.DoesNotExist:
        return Response({
            'error': 'NGO not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': f'Failed to join community: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Multilingual Support

# Legacy AI Mentor API
class GeminiCareerMentorAPIView(APIView):
    def post(self, request):
        try:
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

# Quiz APIs
class AIQuizGenerationAPIView(APIView):
    """Generate AI-powered quizzes using Gemini"""
    
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
                quiz_data = generate_quiz_questions(
                    topic=data['topic'],
                    difficulty=data['difficulty'],
                    num_questions=data['num_questions'],
                    category=data['category']
                )
            else:
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
    """Submit quiz answers and get results"""
    
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