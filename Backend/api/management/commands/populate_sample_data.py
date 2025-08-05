from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from api.models import *
import random
from datetime import timedelta

class Command(BaseCommand):
    help = 'Populate database with sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create sample users
        users = []
        for i in range(5):
            user = User.objects.create_user(
                username=f'user{i+1}@example.com',
                email=f'user{i+1}@example.com',
                password='testpass123',
                first_name=f'User{i+1}',
                last_name='Test'
            )
            users.append(user)

        # Create user profiles
        for user in users:
            User_Profile.objects.create(
                user=user,
                age=random.randint(20, 50),
                gender=random.choice(['Male', 'Female', 'Other']),
                education='High School',
                disadvantaged=random.choice([True, False]),
                role='learner',
                location=f'City {random.randint(1, 5)}',
                phone=f'98765{random.randint(10000, 99999)}',
                language_preference='English',
                skill_set='Basic Computer Skills, Communication',
                goals='Find a better job and improve skills'
            )

        # Create sample courses
        courses = []
        course_titles = [
            'Digital Literacy Basics',
            'English Communication Skills',
            'Computer Fundamentals',
            'Data Entry Training',
            'Customer Service Skills'
        ]
        
        for i, title in enumerate(course_titles):
            course = Course.objects.create(
                title=title,
                description=f'Learn {title.lower()} through interactive modules',
                language='English',
                skill_tag='Communication, Computer Skills',
                content_url=f'https://example.com/course/{i+1}',
                duration=random.randint(2, 6),
                created_by=users[0]
            )
            courses.append(course)

        # Create sample enrollments
        for user in users[:3]:  # First 3 users get enrollments
            for course in random.sample(courses, random.randint(1, 3)):
                progress = random.randint(0, 100)
                Enrollment.objects.create(
                    user=user,
                    course=course,
                    progress=progress,
                    completed=progress == 100,
                    completed_at=timezone.now() if progress == 100 else None
                )

        # Create sample job postings
        job_titles = [
            'Data Entry Operator',
            'Customer Support Representative',
            'Administrative Assistant',
            'Sales Executive',
            'Content Writer'
        ]
        
        for i, title in enumerate(job_titles):
            JobPosting.objects.create(
                employer=users[0],
                title=title,
                description=f'We are looking for a {title.lower()} to join our team',
                location=f'City {random.randint(1, 5)}',
                skills_required='Communication, Computer Skills',
                category='Administrative',
                salary_range=f'₹{random.randint(10000, 25000)}-{random.randint(25000, 40000)}',
                job_type=random.choice(['FULL_TIME', 'PART_TIME', 'FREELANCE'])
            )

        # Create sample mentor profiles
        for user in users[1:3]:  # Users 2 and 3 become mentors
            MentorProfile.objects.create(
                mentor=user,
                bio=f'Experienced professional in {random.choice(["IT", "Sales", "Marketing", "HR"])}',
                sector=random.choice(['Technology', 'Sales', 'Marketing', 'Human Resources']),
                experience=random.randint(3, 15),
                skills='Leadership, Communication, Problem Solving',
                availability='Weekdays 6-8 PM',
                location=f'City {random.randint(1, 5)}'
            )

        # Create sample mentorship sessions
        for user in users[:2]:  # First 2 users get mentorship sessions
            mentor = random.choice(users[1:3])
            mentorshipsession.objects.create(
                mentor=mentor,
                mentee=user,
                sector=random.choice(['Technology', 'Sales', 'Marketing']),
                scheduled_on=timezone.now() + timedelta(days=random.randint(1, 30)),
                status=random.choice(['PENDING', 'ACCEPTED', 'COMPLETED']),
                session_url='https://meet.google.com/abc-defg-hij'
            )

        # Create sample feedback
        for user in users[:3]:
            Feedback.objects.create(
                user=user,
                feedback_text=f'Great experience with the platform. Very helpful for skill development.',
                rating=random.randint(3, 5)
            )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample data!')
        )
        self.stdout.write(f'Created {len(users)} users')
        self.stdout.write(f'Created {len(courses)} courses')
        self.stdout.write(f'Created {JobPosting.objects.count()} job postings')
        self.stdout.write(f'Created {mentorshipsession.objects.count()} mentorship sessions') 