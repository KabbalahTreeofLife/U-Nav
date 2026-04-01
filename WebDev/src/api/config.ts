const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        UNIVERSITIES: `${API_BASE_URL}/auth/universities`,
    },
    USERS: {
        LIST: `${API_BASE_URL}/users`,
        GET: (id: number) => `${API_BASE_URL}/users/${id}`,
        UPDATE_ROLE: (id: number) => `${API_BASE_URL}/users/${id}/role`,
        DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
    },
    DINING: {
        LIST: `${API_BASE_URL}/dining`,
        GET: (id: number) => `${API_BASE_URL}/dining/${id}`,
        CREATE: `${API_BASE_URL}/dining`,
        UPDATE: (id: number) => `${API_BASE_URL}/dining/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/dining/${id}`,
    },
    EVENTS: {
        LIST: `${API_BASE_URL}/events`,
        GET: (id: number) => `${API_BASE_URL}/events/${id}`,
        CREATE: `${API_BASE_URL}/events`,
        UPDATE: (id: number) => `${API_BASE_URL}/events/${id}`,
        DELETE: (id: number) => `${API_BASE_URL}/events/${id}`,
    },
};

export default API_BASE_URL;
