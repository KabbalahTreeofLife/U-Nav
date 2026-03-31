import { API_ENDPOINTS } from './config';
import type { UsersResponse, User, UpdateRoleRequest } from './types';
import { handleResponse, type ResponseResult } from './responseHelper';

export const usersApi = {
    async getUsers(): Promise<ResponseResult<UsersResponse>> {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.LIST);
            return handleResponse<UsersResponse>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async getUser(id: number): Promise<ResponseResult<{ user: User }>> {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.GET(id));
            return handleResponse<{ user: User }>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async updateUserRole(id: number, data: UpdateRoleRequest): Promise<ResponseResult<{ user: User }>> {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.UPDATE_ROLE(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            return handleResponse<{ user: User }>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async deleteUser(id: number): Promise<ResponseResult<{ message: string }>> {
        try {
            const response = await fetch(API_ENDPOINTS.USERS.DELETE(id), {
                method: 'DELETE',
            });
            return handleResponse<{ message: string }>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },
};
