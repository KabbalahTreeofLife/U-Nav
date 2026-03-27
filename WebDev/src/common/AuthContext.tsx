import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { authApi } from '../api';

interface AuthUser {
    id: number;
    username: string;
    university_id: number;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    signup: (universityId: number, username: string, password: string) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (username: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        const result = await authApi.login({ username, password });

        if (result.success) {
            setUser(result.data.user || null);
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

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        error,
        login,
        signup,
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
