// Test script to verify AI quiz generation API
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testQuizGeneration() {
  try {
    console.log('Testing AI Quiz Generation API...');
    
    // Test 1: Generate quiz by category
    console.log('\n1. Testing quiz generation by category...');
    const categoryResponse = await axios.post(`${API_BASE_URL}/generate-quiz/`, {
      category: 'PROGRAMMING',
      difficulty: 'MEDIUM',
      num_questions: 5,
      time_limit: 15,
      passing_score: 70
    });
    
    console.log('✅ Category-based quiz generated successfully!');
    console.log('Quiz Title:', categoryResponse.data.quiz.title);
    console.log('Number of Questions:', categoryResponse.data.quiz.questions.length);
    
    const quizId = categoryResponse.data.quiz.id;
    
    // Test 2: Generate quiz by specific topic
    console.log('\n2. Testing quiz generation by specific topic...');
    const topicResponse = await axios.post(`${API_BASE_URL}/generate-quiz/`, {
      topic: 'Python Programming Basics',
      category: 'PROGRAMMING',
      difficulty: 'EASY',
      num_questions: 3,
      time_limit: 10,
      passing_score: 60
    });
    
    console.log('✅ Topic-based quiz generated successfully!');
    console.log('Quiz Title:', topicResponse.data.quiz.title);
    console.log('Number of Questions:', topicResponse.data.quiz.questions.length);
    
    // Test 3: Submit quiz answers
    console.log('\n3. Testing quiz submission...');
    const quiz = categoryResponse.data.quiz;
    const answers = {};
    
    // Create sample answers (all A's for testing)
    quiz.questions.forEach((question, index) => {
      answers[index] = 'A';
    });
    
    const submissionResponse = await axios.post(`${API_BASE_URL}/submit-quiz/${quizId}/`, {
      answers: answers
    });
    
    console.log('✅ Quiz submitted successfully!');
    console.log('Score:', submissionResponse.data.score + '%');
    console.log('Passed:', submissionResponse.data.passed);
    console.log('Correct Answers:', submissionResponse.data.correct_answers + '/' + submissionResponse.data.total_questions);
    
    // Test 4: Get all quizzes
    console.log('\n4. Testing get all quizzes...');
    const quizzesResponse = await axios.get(`${API_BASE_URL}/quizzes/`);
    
    console.log('✅ Quizzes retrieved successfully!');
    console.log('Total Quizzes:', quizzesResponse.data.length);
    
  } catch (error) {
    console.error('❌ Error testing quiz API:', error.response?.data || error.message);
  }
}

// Run the test
testQuizGeneration(); 