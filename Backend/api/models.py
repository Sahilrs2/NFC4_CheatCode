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
    