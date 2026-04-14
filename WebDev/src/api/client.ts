import type { ResponseResult } from './responseTypes';

const handleJsonResponse = async <T>(response: globalThis.Response): Promise<ResponseResult<T>> => {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Unknown error' };
        } catch (error) {
            console.error('API Error parsing error response:', error);
            return { success: false, error: 'Unknown error' };
        }
    }
    
    try {
        const data = await response.json();
        return { success: true, data };
    } catch (error) {
        console.error('API Error parsing success response:', error);
        return { success: false, error: 'Invalid response format' };
    }
};

export interface RequestOptions {
    headers?: Record<string, string>;
}

const getHeaders = (optionsHeaders?: Record<string, string>) => {
    const headers: Record<string, string> = { ...optionsHeaders };
    const token = localStorage.getItem('u-nav-token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const apiClient = {
    async get<T>(url: string, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                headers: getHeaders(options?.headers),
            });
            return handleJsonResponse<T>(response);
        } catch (error) {
            console.error('API Network Error (GET):', error);
            return { success: false, error: 'Network error' };
        }
    },

    async post<T>(url: string, body: unknown, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: getHeaders({ 'Content-Type': 'application/json', ...options?.headers }),
                body: JSON.stringify(body),
            });
            return handleJsonResponse<T>(response);
        } catch (error) {
            console.error('API Network Error (POST):', error);
            return { success: false, error: 'Network error' };
        }
    },

    async put<T>(url: string, body: unknown, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: getHeaders({ 'Content-Type': 'application/json', ...options?.headers }),
                body: JSON.stringify(body),
            });
            return handleJsonResponse<T>(response);
        } catch (error) {
            console.error('API Network Error (PUT):', error);
            return { success: false, error: 'Network error' };
        }
    },

    async delete<T>(url: string, options?: RequestOptions): Promise<ResponseResult<T>> {
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: getHeaders(options?.headers),
            });
            return handleJsonResponse<T>(response);
        } catch (error) {
            console.error('API Network Error (DELETE):', error);
            return { success: false, error: 'Network error' };
        }
    },
};

export default apiClient;