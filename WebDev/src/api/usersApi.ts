import { API_ENDPOINTS } from './config';
import { apiClient } from './client';
import type { UsersResponse, User, UpdateRoleRequest } from './types';

export const usersApi = {
    getUsers: async () => apiClient.get<UsersResponse>(API_ENDPOINTS.USERS.LIST),

    getUser: async (id: number) => apiClient.get<{ user: User }>(API_ENDPOINTS.USERS.GET(id)),

    updateUserRole: async (id: number, data: UpdateRoleRequest, userId: number): Promise<{ success: boolean; error?: string }> => {
        const result = await apiClient.put<{ user: User }>(
            API_ENDPOINTS.USERS.UPDATE_ROLE(id), 
            data,
            { headers: { 'x-user-id': userId.toString() } }
        );
        if (result.success) {
            return { success: true };
        }
        return { success: false, error: 'Failed to update user role' };
    },

    deleteUser: async (id: number, userId: number): Promise<{ success: boolean; error?: string }> => {
        const result = await apiClient.delete<{ message: string }>(
            API_ENDPOINTS.USERS.DELETE(id),
            { headers: { 'x-user-id': userId.toString() } }
        );
        if (result.success) {
            return { success: true };
        }
        return { success: false, error: 'Failed to delete user' };
    },
};
