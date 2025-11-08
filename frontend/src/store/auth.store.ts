import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  register: async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      const { user, token } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      set({ user, token, isAuthenticated: true });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
}));
