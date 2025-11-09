import axios from 'axios';

// Auto-detect production environment
const isProduction = window.location.hostname.includes('vercel.app') ||
                     window.location.hostname.includes('aghna-dental-care');

const API_URL = isProduction
  ? 'https://aghna-dental-care.onrender.com/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
