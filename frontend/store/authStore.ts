// frontend/src/store/authStore.ts

import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string) => boolean;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,
  isLoading: false,

  setToken: (token: string) => {
    set({ token });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },

  setUser: (user: User) => {
    set({ user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  logout: () => {
    set({ token: null, user: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated: () => {
    const { token } = get();
    return !!token;
  },

  hasRole: (role: string) => {
    const { user } = get();
    return user?.roles?.includes(role) || false;
  },

  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          set({ token, user });
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
        }
      }
    }
  },
}));