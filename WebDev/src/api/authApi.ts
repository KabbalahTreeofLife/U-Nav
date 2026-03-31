import { API_ENDPOINTS } from './config';
import type { LoginRequest, SignupRequest, AuthResponse, UniversitiesResponse } from './types';
import { handleResponse, type ResponseResult } from './responseHelper';

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
