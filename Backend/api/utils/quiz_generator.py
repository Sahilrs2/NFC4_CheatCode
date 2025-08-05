import google.generativeai as genai
import json
from django.conf import settings
import re

genai.configure(api_key='AIzaSyD7Y_pcpGa0Mb8SSrQ9hlku0v6X1Nkc-Ng')

def generate_quiz_questions(topic, difficulty="MEDIUM", num_questions=10, category="GENERAL_KNOWLEDGE"):
    """
    Generate quiz questions using Gemini AI
    
    Args:
        topic (str): The topic/subject for the quiz
        difficulty (str): Difficulty level (EASY, MEDIUM, HARD)
        num_questions (int): Number of questions to generate
        category (str): Category of the quiz
    
    Returns:
        dict: Quiz data with questions and metadata
    """
    
    # Create system prompt for quiz generation
    system_prompt = f"""You are an expert quiz creator specializing in {category.lower().replace('_', ' ')} topics. 
    Create a {difficulty.lower()} level quiz about {topic} with exactly {num_questions} multiple choice questions.
    
    Each question should have:
    - A clear, well-formatted question
    - 4 answer options (A, B, C, D)
    - Only one correct answer
    - An explanation for the correct answer
    
    Format your response as a JSON object with this exact structure:
    {{
        "title": "Quiz Title",
        "description": "Brief description of the quiz",
        "questions": [
            {{
                "question": "Question text here?",
                "options": {{
                    "A": "Option A",
                    "B": "Option B", 
                    "C": "Option C",
                    "D": "Option D"
                }},
                "correct_answer": "A",
                "explanation": "Explanation of why this is the correct answer"
            }}
        ]
    }}
    
    Make sure the questions are appropriate for {difficulty.lower()} difficulty level.
    Ensure all questions are relevant to {topic} and {category.lower().replace('_', ' ')}.
    Return only the JSON object, no additional text."""
    
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(system_prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Try to find JSON in the response (in case there's extra text)
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group()
        
        # Parse the JSON response
        quiz_data = json.loads(response_text)
        
        # Validate the structure
        if not isinstance(quiz_data, dict):
            raise ValueError("Invalid response format")
        
        if 'questions' not in quiz_data or 'title' not in quiz_data:
            raise ValueError("Missing required fields in response")
        
        # Ensure we have the right number of questions
        if len(quiz_data['questions']) != num_questions:
            # If we got fewer questions, that's okay, but log it
            print(f"Warning: Generated {len(quiz_data['questions'])} questions instead of {num_questions}")
        
        # Add metadata
        quiz_data['category'] = category
        quiz_data['difficulty'] = difficulty
        quiz_data['topic'] = topic
        quiz_data['num_questions'] = len(quiz_data['questions'])
        
        return quiz_data
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Response text: {response_text}")
        raise ValueError("Failed to parse AI response as JSON")
        
    except Exception as e:
        print(f"Error generating quiz: {e}")
        raise ValueError(f"Failed to generate quiz: {str(e)}")

def generate_quiz_by_category(category, difficulty="MEDIUM", num_questions=10):
    """
    Generate a quiz based on category with appropriate topics
    
    Args:
        category (str): Quiz category
        difficulty (str): Difficulty level
        num_questions (int): Number of questions
    
    Returns:
        dict: Quiz data
    """
    
    # Define topics for each category
    category_topics = {
        'TECHNICAL': [
            'Web Development Fundamentals',
            'Database Management',
            'Network Security',
            'Cloud Computing',
            'Software Development Lifecycle'
        ],
        'SOFT_SKILLS': [
            'Communication Skills',
            'Leadership and Teamwork',
            'Problem Solving',
            'Time Management',
            'Conflict Resolution'
        ],
        'CAREER_GUIDANCE': [
            'Resume Writing',
            'Interview Preparation',
            'Career Planning',
            'Professional Networking',
            'Work-Life Balance'
        ],
        'PROGRAMMING': [
            'Python Programming',
            'JavaScript Fundamentals',
            'Data Structures and Algorithms',
            'Object-Oriented Programming',
            'Web APIs and REST'
        ],
        'DIGITAL_MARKETING': [
            'Social Media Marketing',
            'SEO Fundamentals',
            'Content Marketing',
            'Email Marketing',
            'Analytics and Metrics'
        ],
        'DATA_SCIENCE': [
            'Data Analysis Fundamentals',
            'Machine Learning Basics',
            'Statistical Analysis',
            'Data Visualization',
            'Big Data Concepts'
        ],
        'BUSINESS': [
            'Entrepreneurship',
            'Business Strategy',
            'Financial Management',
            'Marketing Principles',
            'Operations Management'
        ],
        'DESIGN': [
            'UI/UX Design Principles',
            'Graphic Design Fundamentals',
            'Color Theory',
            'Typography',
            'Design Thinking'
        ],
        'GENERAL_KNOWLEDGE': [
            'Current Technology Trends',
            'Professional Development',
            'Industry Best Practices',
            'Digital Literacy',
            'Innovation and Creativity'
        ]
    }
    
    import random
    
    # Get topics for the category
    topics = category_topics.get(category, ['General Knowledge'])
    selected_topic = random.choice(topics)
    
    return generate_quiz_questions(
        topic=selected_topic,
        difficulty=difficulty,
        num_questions=num_questions,
        category=category
    )

def validate_quiz_data(quiz_data):
    """
    Validate the structure of quiz data
    
    Args:
        quiz_data (dict): Quiz data to validate
    
    Returns:
        bool: True if valid, False otherwise
    """
    try:
        required_fields = ['title', 'description', 'questions']
        for field in required_fields:
            if field not in quiz_data:
                return False
        
        if not isinstance(quiz_data['questions'], list):
            return False
        
        for question in quiz_data['questions']:
            question_fields = ['question', 'options', 'correct_answer', 'explanation']
            for field in question_fields:
                if field not in question:
                    return False
            
            if not isinstance(question['options'], dict):
                return False
            
            if 'A' not in question['options'] or 'B' not in question['options'] or \
               'C' not in question['options'] or 'D' not in question['options']:
                return False
            
            if question['correct_answer'] not in ['A', 'B', 'C', 'D']:
                return False
        
        return True
        
    except Exception:
        return False 