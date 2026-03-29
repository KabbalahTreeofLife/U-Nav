export interface University {
    id: number;
    name: string;
    email_domain: string;
}

export interface User {
    id: number;
    email: string;
    username?: string;
    university_id: number;
}

export interface LoginRequest {
    email: string;
    password: string;
    university_id: number;
}

export interface SignupRequest {
    university_id: number;
    email: string;
    username?: string;
    password: string;
    student_id?: string;
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
