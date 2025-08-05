from django.contrib import admin
from .models import User_Profile, skillassessment, Course, Enrollment, MentorProfile, mentorshipsession, JobPosting, NGO, Referral_services, Feedback, customer_support, system_logs
# Register your models here.
admin.site.register(User_Profile)
admin.site.register(skillassessment)
admin.site.register(Course)
admin.site.register(Enrollment)
admin.site.register(MentorProfile)
admin.site.register(mentorshipsession)
admin.site.register(JobPosting)
admin.site.register(NGO)
admin.site.register(Referral_services)
admin.site.register(Feedback)
admin.site.register(customer_support)
admin.site.register(system_logs)