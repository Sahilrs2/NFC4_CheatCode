// Test script to verify API connection
const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000/api';

async function testAPI() {
  console.log('Testing API connection...\n');

  try {
    // Test 1: Check if Django server is running
    console.log('1. Testing server connection...');
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Server is running');
    console.log('Available endpoints:', Object.keys(response.data));
    console.log('');

    // Test 2: Test registration endpoint
    console.log('2. Testing registration endpoint...');
    const testUser = {
      username: 'testuser@example.com',
      email: 'testuser@example.com',
      password: 'testpass123',
      role: 'user',
      phone: '1234567890',
      gender: 'other',
      location: 'Test City',
      language_preference: 'English',
      age: 25
    };

    try {
      const regResponse = await axios.post(`${API_BASE_URL}/register/`, testUser);
      console.log('✅ Registration successful:', regResponse.data.success);
    } catch (error) {
      console.log('❌ Registration failed:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 3: Test login endpoint
    console.log('3. Testing login endpoint...');
    const loginData = {
      username: 'testuser@example.com',
      password: 'testpass123'
    };

    try {
      const loginResponse = await axios.post(`${API_BASE_URL}/login/`, loginData);
      console.log('✅ Login successful:', loginResponse.data.success);
      if (loginResponse.data.tokens) {
        console.log('✅ JWT tokens received');
      }
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.error || error.message);
    }
    console.log('');

    // Test 4: Test courses endpoint
    console.log('4. Testing courses endpoint...');
    try {
      const coursesResponse = await axios.get(`${API_BASE_URL}/courses/`);
      console.log('✅ Courses endpoint working');
      console.log('Number of courses:', coursesResponse.data.length || 0);
    } catch (error) {
      console.log('❌ Courses endpoint failed:', error.response?.data || error.message);
    }
    console.log('');

    // Test 5: Test jobs endpoint
    console.log('5. Testing jobs endpoint...');
    try {
      const jobsResponse = await axios.get(`${API_BASE_URL}/job-postings/`);
      console.log('✅ Jobs endpoint working');
      console.log('Number of jobs:', jobsResponse.data.length || 0);
    } catch (error) {
      console.log('❌ Jobs endpoint failed:', error.response?.data || error.message);
    }

  } catch (error) {
    console.log('❌ API connection failed:', error.message);
    console.log('Make sure your Django server is running on http://localhost:8000');
  }
}

testAPI(); 