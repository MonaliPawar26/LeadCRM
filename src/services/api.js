import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Clear stale tokens on 401 errors
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

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const leadService = {
  getAll: async () => {
    const response = await api.get('/leads');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },
  submit: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/leads/${id}`, { status });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },
  addNote: async (id, note) => {
    const response = await api.post(`/leads/${id}/notes`, { note });
    return response.data;
  },
};

export default api;
