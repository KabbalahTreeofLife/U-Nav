import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api';
import type { UserRole } from '../api/types';
import type { ResponseResult } from '../api';
import type { AuthUserResponse } from '../api';

type AuthApiResult = ResponseResult<AuthUserResponse>;

const isAuthApiSuccess = (result: AuthApiResult): result is AuthApiResult & { success: true } => {
    return result.success;
};

interface AuthUser {
    id: number;
    email: string;
    username?: string;
    university_id: number | null;
    university_name?: string;
    role?: UserRole;
    isGlobalAdmin?: boolean;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    isAdmin: boolean;
    isGlobalAdmin: boolean;
    universityId: number | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string, universityId: number) => Promise<boolean>;
    signup: (universityId: number, email: string, username?: string, password?: string) => Promise<boolean>;
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

    const login = useCallback(async (email: string, password: string, universityId: number): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const result = await authApi.login({ email, password, university_id: universityId });

        if (isAuthApiSuccess(result)) {
            const userData = result.data.user;
            const token = (result.data as any).token;
            
            if (token) {
                localStorage.setItem('u-nav-token', token);
            }

            const loggedInUser: AuthUser = {
                id: userData.id,
                email: userData.email,
                username: userData.username,
                university_id: userData.university_id,
                university_name: userData.university_name,
                role: userData.role as UserRole,
                isGlobalAdmin: userData.isGlobalAdmin,
            };
            setUser(loggedInUser);
            const effectiveUniversityId = userData.isGlobalAdmin ? universityId : (userData.university_id || null);
            setUniversityId(effectiveUniversityId);
            setIsGuest(false);
            setIsLoading(false);
            return true;
        }

        setError(result.error || 'Login failed');
        setIsLoading(false);
        return false;
    }, []);

    const signup = useCallback(async (universityId: number, email: string, username?: string, password?: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        if (!password) {
            setError('Password is required');
            setIsLoading(false);
            return false;
        }

        const result = await authApi.signup({ 
            university_id: universityId, 
            email, 
            username,
            password 
        });

        if (result.success) {
            const token = (result as any).data?.token;
            if (token) {
                localStorage.setItem('u-nav-token', token);
            }
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
            email: 'guest@guest.local',
            username: 'Guest',
            university_id: universityId,
            university_name: universityName,
            role: 'user',
        });
        setUniversityId(universityId);
        setIsGuest(true);
        localStorage.removeItem('u-nav-token');
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setIsGuest(false);
        setUniversityId(null);
        setError(null);
        localStorage.removeItem('u-nav-token');
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        isGuest,
        isAdmin: user?.role === 'admin',
        isGlobalAdmin: user?.isGlobalAdmin === true,
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

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
