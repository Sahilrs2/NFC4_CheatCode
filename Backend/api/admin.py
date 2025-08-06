from django.contrib import admin
from .models import User_Profile, skillassessment, Course, Enrollment, MentorProfile, mentorshipsession, JobPosting, NGO, Referral_services, Feedback, customer_support, system_logs
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe

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

@admin.register(customer_support)
class CustomerSupportAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'email', 'subject', 'category', 'status', 'priority', 'assigned_to', 'created_at']
    list_filter = ['status', 'category', 'priority', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at']
    list_editable = ['status', 'priority', 'assigned_to']
    
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Ticket Details', {
            'fields': ('subject', 'message', 'category')
        }),
        ('Support Management', {
            'fields': ('status', 'priority', 'assigned_to')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
        ('Legacy Fields', {
            'fields': ('username', 'mail', 'query'),
            'classes': ('collapse',)
        })
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('assigned_to')
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editing an existing object
            return self.readonly_fields + ('name', 'email', 'phone', 'subject', 'message', 'category')
        return self.readonly_fields

admin.site.register(system_logs)