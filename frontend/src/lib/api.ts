import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 90000, // 90 seconds for analysis operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    return response.data;
  },

  me: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/api/auth/logout');
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    return response.data;
  }
};

// Upload API
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

// Reports API
export const reportsAPI = {
  getReports: async () => {
    const response = await api.get('/api/reports');
    return response.data;
  },

  getReport: async (id: string) => {
    const response = await api.get(`/api/reports/${id}`);
    return response.data;
  },

  deleteReport: async (id: string) => {
    const response = await api.delete(`/api/reports/${id}`);
    return response.data;
  }
};

// Analysis API
export const analysisAPI = {
  analyzeReport: async (imageUrl: string, title: string) => {
    const response = await api.post('/api/analyze', { imageUrl, title });
    return response.data;
  }
};

// Health check API
export const healthAPI = {
  check: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },

  fullDiagnosis: async () => {
    const response = await api.get('/api/full-diagnosis');
    return response.data;
  }
};

export default api;