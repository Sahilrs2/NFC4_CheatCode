// Test script to verify chatbot API integration
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testChatbotAPI() {
  try {
    console.log('Testing chatbot API integration...');
    
    const response = await axios.post(`${API_BASE_URL}/ai-mentor/`, {
      question: "What skills should I focus on for a career in web development?"
    });
    
    console.log('✅ API Response received successfully!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error testing chatbot API:', error.response?.data || error.message);
  }
}

// Run the test
testChatbotAPI(); 