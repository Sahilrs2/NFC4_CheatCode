from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class User_Profile(models.Model):

    GENDER_CHOICES = [
        ('Male','MALE'),
        ('Female','FEMALE'),
        ('Other','OTHER')
    ]

    ROLE_CHOICES = [
        ('LEARNER', 'learner'),
        ('MENTOR', 'mentor'),
        ('NGO_ADMIN', 'ngo_admin'),
        ('EMPLOYER', 'employer'),
        ('SUPER_ADMIN', 'super_admin')
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Other')
    education = models.CharField(max_length=100, null=True, blank=True)
    disadvantaged = models.BooleanField(max_length=30, null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='learner')
    location = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    language_preference = models.CharField(max_length=50, null=True, blank=True)
    skill_set = models.CharField(max_length=800, null=True, blank=True)
    goals = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
class skillassessment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    aptitude_score = models.FloatField(null=True, blank=True)
    skill_score = models.FloatField(null=True, blank=True)
    assessment_date = models.DateTimeField(default=timezone.now)
    interests = models.CharField(max_length=500, null=True, blank=True)
    recommmendations = models.TextField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.aptitude_score} - {self.skill_score}"
    
class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    language = models.CharField(max_length=100, null=True, blank=True)
    skill_tag = models.CharField(max_length=100, null=True, blank=True)
    content_url = models.URLField(null=True, blank=True)
    duration = models.PositiveIntegerField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courses_created')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.created_by.user.username}"
    
class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now_add=True)
    progress = models.FloatField(default=0.0)  
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} enrolled in {self.course.title}"
    
class MentorProfile(models.Model):
    mentor = models.ForeignKey(User, on_delete=models.CASCADE)
    bio = models.TextField(null=True, blank=True)
    sector = models.CharField(max_length=100, null=True, blank=True)
    experience = models.PositiveIntegerField(null=True, blank=True)  
    skills = models.CharField(max_length=200, null=True, blank=True)
    availability = models.CharField(max_length=100, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.mentor.user.username} - Mentor Profile"

class mentorshipsession(models.Model):

    STATUS = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled')
    ]

    mentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_sessions')
    mentee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mentorship_sessions_mentee')
    sector = models.CharField(max_length=100, null=True, blank=True)
    scheduled_on = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS, default='PENDING')
    session_url = models.URLField(null=True,blank=True)
    def __str__(self):
        return f"Session between {self.mentor.user.username} and {self.mentee.user.username} on {self.scheduled_on.strftime('%Y-%m-%d %H:%M:%S')} - Status: {self.status}"

class JobPosting(models.Model):

    JOB_TYPE_CHOICES = [
        ('FULL_TIME', 'Full Time'), 
        ('PART_TIME', 'Part Time'),
        ('INTERNSHIP', 'Internship'),
        ('FREELANCE', 'Freelance')
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_postings')
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100, null=True, blank=True)
    skills_required = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=100, null=True, blank=True)
    salary_range = models.CharField(max_length=100, null=True, blank=True)
    posted_on = models.DateTimeField(auto_now_add=True)
    application_deadline = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='FULL_TIME')

    def __str__(self):
        return f"{self.title} - {self.employer.user.username} - {self.job_type}"
    
class NGO(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100, null=True, blank=True)
    contact_info = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name

class Referral_services(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=100, null=True, blank=True)
    title = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    contact_info = models.CharField(max_length=200, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.user.username} - {self.type}"
    
class Feedback(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    feedback_text = models.TextField()
    rating = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback from {self.user.username} - Rating: {self.rating}"
    
class customer_support(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General Inquiry'),
        ('technical', 'Technical Support'),
        ('course', 'Course Related'),
        ('job', 'Job Assistance'),
        ('mentor', 'Mentorship')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed')
    ]
    
    # Form fields
    name = models.CharField(max_length=200, help_text="Full name of the person")
    email = models.EmailField(help_text="Email address for contact")
    phone = models.CharField(max_length=20, null=True, blank=True, help_text="Phone number")
    subject = models.CharField(max_length=200, help_text="Subject of the inquiry")
    message = models.TextField(help_text="Detailed message")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    
    # Support tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_support_tickets')
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')], default='medium')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Legacy fields for backward compatibility
    username = models.CharField(max_length=500, null=True, blank=True)
    mail = models.CharField(max_length=500, null=True, blank=True)
    query = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"Support ticket from {self.name} - {self.subject} ({self.status})"
    
    class Meta:
        ordering = ['-created_at']
    
class system_logs(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    action = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)
    details = models.TextField(null=True, blank=True)
    def __str__(self):
        return f"Log by {self.user.username if self.user else 'System'} - {self.action} at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

class Quiz(models.Model):
    DIFFICULTY_CHOICES = [
        ('EASY', 'Easy'),
        ('MEDIUM', 'Medium'),
        ('HARD', 'Hard')
    ]
    
    CATEGORY_CHOICES = [
        ('TECHNICAL', 'Technical'),
        ('SOFT_SKILLS', 'Soft Skills'),
        ('CAREER_GUIDANCE', 'Career Guidance'),
        ('GENERAL_KNOWLEDGE', 'General Knowledge'),
        ('PROGRAMMING', 'Programming'),
        ('DIGITAL_MARKETING', 'Digital Marketing'),
        ('DATA_SCIENCE', 'Data Science'),
        ('BUSINESS', 'Business'),
        ('DESIGN', 'Design'),
        ('OTHER', 'Other')
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='OTHER')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='MEDIUM')
    questions = models.JSONField()  # Store questions as JSON
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes_created')
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    time_limit = models.PositiveIntegerField(default=30, help_text="Time limit in minutes")
    passing_score = models.PositiveIntegerField(default=70, help_text="Passing score percentage")

    def __str__(self):
        return f"{self.title} - {self.category} - {self.difficulty}"

class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quiz_attempts')
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='attempts')
    score = models.FloatField(null=True, blank=True)
    answers = models.JSONField()  # Store user answers as JSON
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    passed = models.BooleanField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - Score: {self.score}"

    class Meta:
        unique_together = ['user', 'quiz']