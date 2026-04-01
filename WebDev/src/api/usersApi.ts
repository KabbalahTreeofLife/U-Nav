import { API_ENDPOINTS } from './config';
import { apiClient } from './client';
import type { UsersResponse, User, UpdateRoleRequest } from './types';

export const usersApi = {
    getUsers: async () => apiClient.get<UsersResponse>(API_ENDPOINTS.USERS.LIST),

    getUser: async (id: number) => apiClient.get<{ user: User }>(API_ENDPOINTS.USERS.GET(id)),

    updateUserRole: async (id: number, data: UpdateRoleRequest) => 
        apiClient.put<{ user: User }>(API_ENDPOINTS.USERS.UPDATE_ROLE(id), data),

    deleteUser: async (id: number) => 
        apiClient.delete<{ message: string }>(API_ENDPOINTS.USERS.DELETE(id)),
};