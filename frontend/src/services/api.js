import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

// Interview API
export const interviewAPI = {
  start: (data) => api.post('/interviews/start', data),
  submitAnswer: (sessionId, data) => api.post(`/interviews/${sessionId}/answer`, data),
  complete: (sessionId) => api.post(`/interviews/${sessionId}/complete`),
  getSession: (sessionId) => api.get(`/interviews/${sessionId}`),
  getHistory: (params) => api.get('/interviews/history', { params })
};

// Questions API
export const questionsAPI = {
  getQuestions: (params) => api.get('/questions', { params }),
  getRandom: (params) => api.get('/questions/random', { params }),
  generate: (data) => api.post('/questions/generate', data)
};

// Progress API
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  getAnalytics: () => api.get('/progress/analytics'),
  getInsights: () => api.get('/progress/insights'),
  getAchievements: () => api.get('/progress/achievements'),
  getWeekly: () => api.get('/progress/weekly')
};

export default api;
