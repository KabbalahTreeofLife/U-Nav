const API_BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        SIGNUP: `${API_BASE_URL}/auth/signup`,
        UNIVERSITIES: `${API_BASE_URL}/auth/universities`,
    },
};

export default API_BASE_URL;
