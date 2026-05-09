import { create } from 'zustand';
import { authApi } from '../api/auth';
import type { UserProfile } from '../api/auth';

interface AuthState {
  profile: UserProfile | null;
  loading: boolean;
  error: string;

  fetchProfile: () => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  logout: () => void;
  setToken: (token: string, username: string) => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  error: '',

  fetchProfile: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ loading: false });
      return false;
    }
    try {
      const res = await authApi.getProfile();
      set({ profile: res.data, loading: false, error: '' });
      return true;
    } catch {
      set({ error: 'Session expired', loading: false });
      localStorage.clear();
      return false;
    }
  },

  refreshProfile: async () => {
    try {
      const res = await authApi.getProfile();
      set({ profile: res.data });
    } catch (err) {
      console.error('Failed to refresh profile', err);
    }
  },

  logout: () => {
    localStorage.clear();
    set({ profile: null, loading: false, error: '' });
  },

  setToken: (token: string, username: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
}));
