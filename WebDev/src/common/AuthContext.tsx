import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api';

interface AuthUser {
    id: number;
    username: string;
    university_id: number;
    university_name?: string;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    universityId: number | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    signup: (universityId: number, username: string, password: string) => Promise<boolean>;
    loginAsGuest: (universityId: number, universityName: string) => void;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isGuest, setIsGuest] = useState(false);
    const [universityId, setUniversityId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const result = await authApi.login({ username, password });

        if (result.success) {
            setUser(result.data.user || null);
            setUniversityId(result.data.user?.university_id || null);
            setIsGuest(false);
            setIsLoading(false);
            return true;
        }

        setError(result.error);
        setIsLoading(false);
        return false;
    }, []);

    const signup = useCallback(async (universityId: number, username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const result = await authApi.signup({ university_id: universityId, username, password });

        if (result.success) {
            setIsLoading(false);
            return true;
        }

        setError(result.error);
        setIsLoading(false);
        return false;
    }, []);

    const loginAsGuest = useCallback((universityId: number, universityName: string) => {
        setUser({
            id: 0,
            username: 'Guest',
            university_id: universityId,
            university_name: universityName,
        });
        setUniversityId(universityId);
        setIsGuest(true);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setIsGuest(false);
        setUniversityId(null);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        isGuest,
        universityId,
        isLoading,
        error,
        login,
        signup,
        loginAsGuest,
        logout,
        clearError,
    };

    return React.createElement(AuthContext.Provider, { value }, children);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
