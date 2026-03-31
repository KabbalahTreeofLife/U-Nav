export type UserRole = 'user' | 'admin';

export interface University {
    id: number;
    name: string;
    email_domain: string;
}

export interface User {
    id: number;
    email: string;
    username?: string;
    university_id: number | null;
    university_name?: string;
    role?: UserRole;
    isGlobalAdmin?: boolean;
    created_at?: string;
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

export interface UsersResponse {
    users: User[];
}

export interface UpdateRoleRequest {
    role: UserRole;
    university_id?: number | null;
}

export interface ApiError {
    error: string;
}
