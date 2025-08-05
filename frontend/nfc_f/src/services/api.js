import axios from 'axios';

// Create axios instance with base configuration
const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/login/', credentials),
  register: (userData) => api.post('/register/', userData),
  refreshToken: (refreshToken) => api.post('/token/refresh/', { refresh: refreshToken }),
};

// User Profile API calls
export const userAPI = {
  getProfile: () => api.get('/users/'),
  updateProfile: (data) => api.put(`/users/${data.id}/`, data),
  createProfile: (data) => api.post('/users/', data),
};

// Course API calls
export const courseAPI = {
  getCourses: () => api.get('/courses/'),
  getCourse: (id) => api.get(`/courses/${id}/`),
  enrollCourse: (data) => api.post('/enrollments/', data),
  getEnrollments: () => api.get('/enrollments/'),
};

// Skill Assessment API calls
export const skillAPI = {
  getAssessments: () => api.get('/skill-assessment/'),
  getAssessment: (id) => api.get(`/skill-assessment/${id}/`),
  submitAssessment: (data) => api.post('/skill-assessment/', data),
};

// Mentor API calls
export const mentorAPI = {
  getMentors: () => api.get('/mentor-profiles/'),
  getMentor: (id) => api.get(`/mentor-profiles/${id}/`),
  getSessions: () => api.get('/mentor-sessions/'),
  bookSession: (data) => api.post('/mentor-sessions/', data),
};

// Job Posting API calls
export const jobAPI = {
  getJobs: () => api.get('/job-postings/'),
  getJob: (id) => api.get(`/job-postings/${id}/`),
  applyJob: (data) => api.post('/job-postings/', data),
};

// NGO API calls
export const ngoAPI = {
  getNGOs: () => api.get('/ngos/'),
  getNGO: (id) => api.get(`/ngos/${id}/`),
};

// Feedback API calls
export const feedbackAPI = {
  getFeedback: () => api.get('/feedback/'),
  submitFeedback: (data) => api.post('/feedback/', data),
};

// Customer Support API calls
export const supportAPI = {
  getSupport: () => api.get('/customer-support/'),
  createSupport: (data) => api.post('/customer-support/', data),
};

export default api; 