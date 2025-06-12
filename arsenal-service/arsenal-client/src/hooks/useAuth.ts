import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
    const store = useAuthStore();
    const { user, restoreSession } = store;

    useEffect(() => {
        restoreSession();
    }, [restoreSession]);

    return {
        user,
        isAuthenticated: !!user,
    };
}; 