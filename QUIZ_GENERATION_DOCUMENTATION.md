# AI Quiz Generation Documentation

## Overview
The AI Quiz Generation feature uses Gemini AI to automatically create educational quizzes on various topics. The system can generate quizzes by category or specific topics, with customizable difficulty levels and question counts.

## Backend Implementation

### Models

#### Quiz Model
```python
class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    questions = models.JSONField()  # Stores questions as JSON
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    time_limit = models.PositiveIntegerField(default=30)
    passing_score = models.PositiveIntegerField(default=70)
```

#### QuizAttempt Model
```python
class QuizAttempt(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.FloatField(null=True, blank=True)
    answers = models.JSONField()  # Stores user answers as JSON
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    passed = models.BooleanField(null=True, blank=True)
```

### Categories Available
- **TECHNICAL**: Web Development, Database Management, Network Security, etc.
- **SOFT_SKILLS**: Communication, Leadership, Problem Solving, etc.
- **CAREER_GUIDANCE**: Resume Writing, Interview Preparation, Career Planning, etc.
- **PROGRAMMING**: Python, JavaScript, Data Structures, Algorithms, etc.
- **DIGITAL_MARKETING**: Social Media Marketing, SEO, Content Marketing, etc.
- **DATA_SCIENCE**: Data Analysis, Machine Learning, Statistics, etc.
- **BUSINESS**: Entrepreneurship, Business Strategy, Financial Management, etc.
- **DESIGN**: UI/UX Design, Graphic Design, Color Theory, etc.
- **GENERAL_KNOWLEDGE**: Technology Trends, Professional Development, etc.

### Difficulty Levels
- **EASY**: Basic concepts, suitable for beginners
- **MEDIUM**: Intermediate concepts, suitable for learners with some experience
- **HARD**: Advanced concepts, suitable for experienced professionals

## API Endpoints

### 1. Generate Quiz
**POST** `/api/generate-quiz/`

Generate a new quiz using AI.

**Request Body:**
```json
{
    "topic": "Python Programming Basics",  // Optional: specific topic
    "category": "PROGRAMMING",            // Required: quiz category
    "difficulty": "MEDIUM",               // Required: difficulty level
    "num_questions": 10,                  // Required: number of questions (5-50)
    "title": "Custom Quiz Title",         // Optional: custom title
    "description": "Custom description",  // Optional: custom description
    "time_limit": 30,                     // Optional: time limit in minutes (5-120)
    "passing_score": 70                   // Optional: passing score percentage (50-100)
}
```

**Response:**
```json
{
    "message": "Quiz generated successfully",
    "quiz": {
        "id": 1,
        "title": "Python Programming Basics Quiz",
        "description": "Test your knowledge of Python programming fundamentals",
        "category": "PROGRAMMING",
        "difficulty": "MEDIUM",
        "questions": [
            {
                "question": "What is the correct way to create a function in Python?",
                "options": {
                    "A": "function myFunction():",
                    "B": "def myFunction():",
                    "C": "create myFunction():",
                    "D": "func myFunction():"
                },
                "correct_answer": "B",
                "explanation": "In Python, functions are defined using the 'def' keyword."
            }
        ],
        "time_limit": 30,
        "passing_score": 70,
        "created_by_username": "admin",
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

### 2. Submit Quiz
**POST** `/api/submit-quiz/{quiz_id}/`

Submit answers for a quiz and get results.

**Request Body:**
```json
{
    "answers": {
        "0": "B",  // Answer for question 0
        "1": "A",  // Answer for question 1
        "2": "C",  // Answer for question 2
        // ... more answers
    }
}
```

**Response:**
```json
{
    "message": "Quiz submitted successfully",
    "score": 80.0,
    "passed": true,
    "total_questions": 10,
    "correct_answers": 8,
    "passing_score": 70,
    "attempt_id": 1
}
```

### 3. Get All Quizzes
**GET** `/api/quizzes/`

Retrieve all available quizzes.

**Response:**
```json
[
    {
        "id": 1,
        "title": "Python Programming Basics Quiz",
        "description": "Test your knowledge of Python programming fundamentals",
        "category": "PROGRAMMING",
        "difficulty": "MEDIUM",
        "questions": [...],
        "time_limit": 30,
        "passing_score": 70,
        "created_by_username": "admin",
        "created_at": "2024-01-15T10:30:00Z"
    }
]
```

### 4. Get Quiz Attempts
**GET** `/api/quiz-attempts/`

Retrieve all quiz attempts for the authenticated user.

**Response:**
```json
[
    {
        "id": 1,
        "user_username": "john_doe",
        "quiz_title": "Python Programming Basics Quiz",
        "score": 80.0,
        "answers": {...},
        "started_at": "2024-01-15T10:30:00Z",
        "completed_at": "2024-01-15T10:35:00Z",
        "is_completed": true,
        "passed": true
    }
]
```

## AI Quiz Generation

### Quiz Generator Utility
The `quiz_generator.py` utility provides two main functions:

1. **`generate_quiz_questions(topic, difficulty, num_questions, category)`**
   - Generates quiz for a specific topic
   - Uses Gemini AI to create questions and answers
   - Returns structured JSON data

2. **`generate_quiz_by_category(category, difficulty, num_questions)`**
   - Generates quiz based on category with random topics
   - Automatically selects appropriate topics for each category
   - Returns structured JSON data

### AI Prompt Structure
The system uses carefully crafted prompts to ensure:
- Questions are relevant to the topic and category
- Difficulty level is appropriate
- All questions have 4 options (A, B, C, D)
- Only one correct answer per question
- Explanations are provided for correct answers
- Response is formatted as valid JSON

## Frontend Integration

### API Service Functions
Add these to your `api.js` file:

```javascript
// Quiz API calls
export const quizAPI = {
  generateQuiz: (data) => api.post('/generate-quiz/', data),
  submitQuiz: (quizId, answers) => api.post(`/submit-quiz/${quizId}/`, { answers }),
  getQuizzes: () => api.get('/quizzes/'),
  getQuiz: (id) => api.get(`/quizzes/${id}/`),
  getQuizAttempts: () => api.get('/quiz-attempts/'),
};
```

### Example Usage
```javascript
import { quizAPI } from '../services/api';

// Generate a quiz
const generateQuiz = async () => {
  try {
    const response = await quizAPI.generateQuiz({
      category: 'PROGRAMMING',
      difficulty: 'MEDIUM',
      num_questions: 10,
      time_limit: 30,
      passing_score: 70
    });
    
    console.log('Quiz generated:', response.data.quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
  }
};

// Submit quiz answers
const submitQuiz = async (quizId, answers) => {
  try {
    const response = await quizAPI.submitQuiz(quizId, answers);
    console.log('Quiz submitted:', response.data);
  } catch (error) {
    console.error('Error submitting quiz:', error);
  }
};
```

## Testing

### Run the Test Script
```bash
node test-quiz-generation.js
```

This will test:
1. Quiz generation by category
2. Quiz generation by specific topic
3. Quiz submission with answers
4. Retrieving all quizzes

### Manual Testing
1. Start the backend server: `python manage.py runserver`
2. Use Postman or curl to test the endpoints
3. Verify quiz generation and submission work correctly

## Error Handling

The system includes comprehensive error handling:
- Invalid request data validation
- AI response parsing errors
- Database operation errors
- Quiz submission validation

## Security Considerations

- All endpoints require authentication (except where noted)
- Input validation prevents malicious data
- JSON responses are properly sanitized
- User can only access their own quiz attempts

## Future Enhancements

Potential improvements:
- Quiz templates and themes
- Question randomization
- Time-based quiz sessions
- Quiz sharing and collaboration
- Advanced analytics and reporting
- Quiz difficulty adaptation based on user performance
- Multi-language support
- Quiz export/import functionality 