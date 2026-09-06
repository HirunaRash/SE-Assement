import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('token', token);
      else localStorage.removeItem('token');
    }
    set({ token });
  },
  setLoading: (loading) => set({ isLoading: loading }),
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));