import { API_ENDPOINTS } from './config';
import { apiClient } from './client';
import type { ResponseResult } from './responseTypes';

/**
 * Data structures for University information.
 */
export interface University {
    id: number;
    name: string;
    /** The official email suffix used for student validation (e.g., student.cpu.edu.ph) */
    email_domain: string;
}

interface UniversitiesResponse {
    universities: University[];
}

interface CreateUniversityResponse {
    message: string;
    university: University;
}

/**
 * The normalized user structure returned after a successful login.
 */
export interface AuthUserResponse {
    user: {
        id: number;
        email: string;
        username?: string;
        university_id: number | null;
        university_name?: string;
        role?: string;
        /** Flag indicating if the user has global system management permissions */
        isGlobalAdmin?: boolean;
    };
    message?: string;
}

/**
 * authApi centralizes all authentication and university management network requests.
 * It uses the 'apiClient' wrapper to handle standard response formatting and error catching.
 */
export const authApi = {
    /**
     * Authenticates a user with their university-specific credentials.
     */
    async login(credentials: { email: string; password: string; university_id: number }): Promise<ResponseResult<AuthUserResponse>> {
        return apiClient.post<AuthUserResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
    },

    /**
     * Registers a new user account. Note: This requires a valid university ID.
     */
    async signup(userData: { university_id: number; email: string; username?: string; password: string }): Promise<ResponseResult<{ message: string }>> {
        return apiClient.post<{ message: string }>(API_ENDPOINTS.AUTH.SIGNUP, userData);
    },

    /**
     * Retrieves the list of all supported universities for selection in the login/signup forms.
     */
    async getUniversities(): Promise<ResponseResult<UniversitiesResponse>> {
        return apiClient.get<UniversitiesResponse>(API_ENDPOINTS.AUTH.UNIVERSITIES);
    },

    /**
     * (Admin Only) Creates a new university entry in the database.
     */
    async createUniversity(data: { name: string; email_domain: string }, _userId?: number): Promise<ResponseResult<CreateUniversityResponse>> {
        return apiClient.post<CreateUniversityResponse>(
            API_ENDPOINTS.AUTH.CREATE_UNIVERSITY,
            data
        );
    },

    /**
     * (Admin Only) Deletes a university entry.
     */
    async deleteUniversity(id: number, _userId?: number): Promise<ResponseResult<{ message: string }>> {
        return apiClient.delete<{ message: string }>(
            API_ENDPOINTS.AUTH.DELETE_UNIVERSITY(id)
        );
    },
};
