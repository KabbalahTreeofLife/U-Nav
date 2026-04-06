export { API_ENDPOINTS, default as API_BASE_URL } from './config';
export type {
    University,
    User,
    UserRole,
    LoginRequest,
    SignupRequest,
    AuthResponse,
    UniversitiesResponse,
    UsersResponse,
    UpdateRoleRequest,
    ApiError,
} from './types';
export { authApi, type AuthUserResponse } from './authApi';
export { usersApi } from './usersApi';
export { diningApi, type DiningLocation, type CreateDiningRequest, type UpdateDiningRequest } from './diningApi';
export { eventsApi, type Event, type CreateEventRequest, type UpdateEventRequest } from './eventsApi';
export { apiClient } from './client';
export type { ResponseResult } from './responseTypes';
