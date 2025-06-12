import { create } from 'zustand';
import apiClient from '../api/client';
import type { AuthState } from '../types/User';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    
    login: async (email: string, password: string, remember: boolean = false) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
        if (remember) {
            localStorage.setItem('jwt_token', token);
        } else {
            sessionStorage.setItem('jwt_token', token);
        }
        
        set({ user });
    },
    
    register: async (email: string, password: string, username: string, nickname: string) => {
        const response = await apiClient.post('/auth/register', {
            email,
            password,
            username,
            nickname
        });
        const { token, user } = response.data;
        sessionStorage.setItem('jwt_token', token);
        set({ user });
    },
    
    logout: () => {
        localStorage.removeItem('jwt_token');
        sessionStorage.removeItem('jwt_token');
        set({ user: null });
    },
    
    restoreSession: async () => {
        try {
            const token = localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token');
            if (!token) {
                return;
            }
            
            const response = await apiClient.get('/auth/profile');
            set({ user: response.data });
        } catch (error: any) {
            console.error('Failed to restore session:', error);
            // Clear token and user state on 401 error
            if (error.response?.status === 401) {
                localStorage.removeItem('jwt_token');
                sessionStorage.removeItem('jwt_token');
            }
            set({ user: null });
        }
    }
}));