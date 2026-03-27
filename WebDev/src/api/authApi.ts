import { API_ENDPOINTS } from './config';
import type { LoginRequest, SignupRequest, AuthResponse, UniversitiesResponse, ApiError } from './types';

type ResponseResult<T> = 
    | { success: true; data: T }
    | { success: false; error: string };

async function handleResponse<T>(response: Response): Promise<ResponseResult<T>> {
    if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error: errorData.error };
    }
    
    const data: T = await response.json();
    return { success: true, data };
}

export const authApi = {
    async login(credentials: LoginRequest): Promise<ResponseResult<AuthResponse>> {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });
            return handleResponse<AuthResponse>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async signup(userData: SignupRequest): Promise<ResponseResult<AuthResponse>> {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.SIGNUP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return handleResponse<AuthResponse>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async getUniversities(): Promise<ResponseResult<UniversitiesResponse>> {
        try {
            const response = await fetch(API_ENDPOINTS.AUTH.UNIVERSITIES);
            return handleResponse<UniversitiesResponse>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },
};
