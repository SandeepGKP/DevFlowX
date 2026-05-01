import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Inject JWT token into every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const releaseService = {
  create: (data) => api.post('/releases', data),
  getAll: () => api.get('/releases'),
  getById: (id) => api.get(`/releases/${id}`),
  delete: (id) => api.delete(`/releases/${id}`),
  rollback: (id) => api.post(`/releases/rollback/${id}`),
};

export const pipelineService = {
  start: (id) => api.post(`/pipeline/start/${id}`),
  resume: (id, runTests) => api.post(`/pipeline/resume/${id}?runTests=${runTests}`),
  getLogs: (id) => api.get(`/pipeline/logs/${id}`),
};

export const analyticsService = {
  getStats: () => api.get('/analytics/stats'),
};

export default api;
