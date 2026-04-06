import { API_ENDPOINTS } from './config';
import { apiClient } from './client';
import type { ResponseResult } from './responseTypes';

export interface University {
    id: number;
    name: string;
    email_domain: string;
}

interface UniversitiesResponse {
    universities: University[];
}

interface CreateUniversityResponse {
    message: string;
    university: University;
}

export interface AuthUserResponse {
    user: {
        id: number;
        email: string;
        username?: string;
        university_id: number | null;
        university_name?: string;
        role?: string;
        isGlobalAdmin?: boolean;
    };
    message?: string;
}

export const authApi = {
    async login(credentials: { email: string; password: string; university_id: number }): Promise<ResponseResult<AuthUserResponse>> {
        return apiClient.post<AuthUserResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },

    async signup(userData: { university_id: number; email: string; username?: string; password: string }): Promise<ResponseResult<{ message: string }>> {
        return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.SIGNUP, userData);
    },

    async getUniversities(): Promise<ResponseResult<UniversitiesResponse>> {
        return apiClient.get<UniversitiesResponse>(API_ENDPOINTS.AUTH.UNIVERSITIES);
    },

    async createUniversity(data: { name: string; email_domain: string }, userId: number): Promise<ResponseResult<CreateUniversityResponse>> {
        return apiClient.post<CreateUniversityResponse>(
            API_ENDPOINTS.AUTH.CREATE_UNIVERSITY,
            data,
            { headers: { 'x-user-id': userId.toString() } }
        );
    },

    async deleteUniversity(id: number, userId: number): Promise<ResponseResult<{ message: string }>> {
        return apiClient.delete<{ message: string }>(
            API_ENDPOINTS.AUTH.DELETE_UNIVERSITY(id),
            { headers: { 'x-user-id': userId.toString() } }
        );
    },
};
