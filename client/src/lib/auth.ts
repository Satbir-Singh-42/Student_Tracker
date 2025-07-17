import { create } from 'zustand';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from './queryClient';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { loginSchema, registerSchema, studentRegisterSchema, User } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: z.infer<typeof studentRegisterSchema>) => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  login: async (email, password) => {
    const response = await apiRequest('POST', '/api/auth/login', { email, password });
    const data = await response.json();
    localStorage.setItem('auth', JSON.stringify(data));
    set({ user: data.user, token: data.token, isLoading: false });
  },
  register: async (data) => {
    const response = await apiRequest('POST', '/api/auth/register', data);
    const responseData = await response.json();
    localStorage.setItem('auth', JSON.stringify(responseData));
    set({ user: responseData.user, token: responseData.token, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('auth');
    set({ user: null, token: null, isLoading: false });
  },
}));

// Initialize auth state from localStorage
const initAuth = () => {
  try {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData = JSON.parse(storedAuth);
      if (authData.user && authData.token) {
        useAuthStore.setState({ 
          user: authData.user, 
          token: authData.token, 
          isLoading: false 
        });
        return;
      }
    }
  } catch (e) {
    console.error('Failed to parse auth data:', e);
  }
  useAuthStore.setState({ isLoading: false });
};

// Initialize on load
if (typeof window !== 'undefined') {
  initAuth();
}

export const useAuth = () => useAuthStore();

export const useLogin = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof loginSchema>) => {
      try {
        await login(data.email, data.password);
        return true;
      } catch (error: any) {
        throw new Error(error.message || 'Login failed');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Login successful',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useRegister = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: z.infer<typeof studentRegisterSchema>) => {
      try {
        await register(data);
        return true;
      } catch (error: any) {
        throw new Error(error.message || 'Registration failed');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Registration successful',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Registration failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async () => {
      try {
        // Call server to logout first (in case we need to clear server-side session in the future)
        await apiRequest('POST', '/api/auth/logout');
        logout();
        queryClient.clear();
        return true;
      } catch (error: any) {
        console.error("Logout failed with error:", error);
        // Still logout locally even if server call fails
        logout();
        queryClient.clear();
        return true;
      }
    },
    onSuccess: () => {
      toast({
        title: 'Successfully logged out',
        variant: 'success',
      });
    }
  });
};
