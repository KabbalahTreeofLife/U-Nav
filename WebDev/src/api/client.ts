import type { ResponseResult } from './responseTypes';

const handleJsonResponse = async <T>(response: globalThis.Response): Promise<ResponseResult<T>> => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Unknown error' };
        } catch {
            return { success: false, error: 'Unknown error' };
        }
    }
    
    try {
        const data = await response.json();
        return { success: true, data };
    } catch {
        return { success: false, error: 'Invalid response format' };
    }
};

export interface RequestOptions {
    headers?: Record<string, string>;
}

export const apiClient = {
    async get<T>(url: string, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                headers: options?.headers,
            });
            return handleJsonResponse<T>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...options?.headers },
                body: JSON.stringify(body),
            });
            return handleJsonResponse<T>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...options?.headers },
                body: JSON.stringify(body),
            });
            return handleJsonResponse<T>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },

    async delete<T>(url: string, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: options?.headers,
            });
            return handleJsonResponse<T>(response);
        } catch {
            return { success: false, error: 'Network error. Please check if the server is running.' };
        }
    },
};

export default apiClient;