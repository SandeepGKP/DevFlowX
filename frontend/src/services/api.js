import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Add JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => localStorage.removeItem('token'),
};

export const releaseService = {
  getAll: () => api.get('/releases'),
  create: (data) => api.post('/releases', data),
  rollback: (id) => api.post(`/releases/${id}/rollback`),
  updateEnvVars: (id, envVars) => api.put(`/releases/${id}/env-vars`, envVars),
  delete: (id) => api.delete(`/releases/${id}`),
};

export const pipelineService = {
  resume: (id, runTests) => api.post(`/pipeline/resume/${id}?runTests=${runTests}`),
  getLogs: (id) => api.get(`/pipeline-logs/${id}`),
};

export const analyticsService = {
  getStats: () => api.get('/analytics/stats'),
};

export default api;
