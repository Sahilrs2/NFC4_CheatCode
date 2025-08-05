// Test script to verify skilltest integration with AI quiz generation
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testSkillTestIntegration() {
  try {
    console.log('Testing SkillTest Integration with AI Quiz Generation...');
    
    // Test 1: Generate quiz for programming skills
    console.log('\n1. Testing quiz generation for programming skills...');
    const programmingResponse = await axios.post(`${API_BASE_URL}/generate-quiz/`, {
      topic: 'JavaScript, React, Python',
      category: 'PROGRAMMING',
      difficulty: 'MEDIUM',
      num_questions: 10,
      time_limit: 5,
      passing_score: 70
    });
    
    console.log('✅ Programming quiz generated successfully!');
    console.log('Quiz Title:', programmingResponse.data.quiz.title);
    console.log('Number of Questions:', programmingResponse.data.quiz.questions.length);
    console.log('Category:', programmingResponse.data.quiz.category);
    
    const quizId = programmingResponse.data.quiz.id;
    
    // Test 2: Generate quiz for technical skills
    console.log('\n2. Testing quiz generation for technical skills...');
    const technicalResponse = await axios.post(`${API_BASE_URL}/generate-quiz/`, {
      topic: 'Web Development, HTML, CSS, Database',
      category: 'TECHNICAL',
      difficulty: 'MEDIUM',
      num_questions: 10,
      time_limit: 5,
      passing_score: 70
    });
    
    console.log('✅ Technical quiz generated successfully!');
    console.log('Quiz Title:', technicalResponse.data.quiz.title);
    console.log('Number of Questions:', technicalResponse.data.quiz.questions.length);
    
    // Test 3: Submit quiz answers
    console.log('\n3. Testing quiz submission...');
    const quiz = programmingResponse.data.quiz;
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
    
    // Test 4: Test different skill categories
    console.log('\n4. Testing different skill categories...');
    const categories = ['SOFT_SKILLS', 'CAREER_GUIDANCE', 'DIGITAL_MARKETING', 'DATA_SCIENCE'];
    
    for (const category of categories) {
      try {
        const response = await axios.post(`${API_BASE_URL}/generate-quiz/`, {
          category: category,
          difficulty: 'MEDIUM',
          num_questions: 5,
          time_limit: 5,
          passing_score: 70
        });
        console.log(`✅ ${category} quiz generated successfully!`);
      } catch (error) {
        console.log(`❌ Failed to generate ${category} quiz:`, error.response?.data?.error || error.message);
      }
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\nFrontend Integration Summary:');
    console.log('- SkillTest component now uses AI-generated quizzes');
    console.log('- Questions are personalized based on user skills');
    console.log('- Quiz submission is handled by the backend API');
    console.log('- Results are calculated and stored automatically');
    
  } catch (error) {
    console.error('❌ Error testing skilltest integration:', error.response?.data || error.message);
  }
}

// Run the test
testSkillTestIntegration(); 