export interface University {
    id: number;
    name: string;
}

export interface User {
    id: number;
    username: string;
    university_id: number;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    university_id: number;
    username: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    user?: User;
}

export interface UniversitiesResponse {
    universities: University[];
}

export interface ApiError {
    error: string;
}
