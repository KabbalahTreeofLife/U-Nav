import { Response } from 'express';

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
    REQUIRED_FIELDS: 'Missing required fields',
    INVALID_EMAIL: 'Invalid email format',
    EMAIL_EXISTS: 'Email already exists',
    STUDENT_ID_EXISTS: 'Student ID already exists',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    NOT_FOUND: 'Not found',
    FORBIDDEN: 'Access denied',
    UNAUTHORIZED: 'Unauthorized',
    INTERNAL_ERROR: 'Internal server error',
    NETWORK_ERROR: 'Network error. Please check if the server is running.',
    INVALID_RESPONSE: 'Invalid response format',
} as const;

interface ApiResponse {
    success: boolean;
    data?: unknown;
    error?: string;
}

export const sendSuccess = <T>(res: Response, status: number, data: T): void => {
    res.status(status).json({ success: true, data } as ApiResponse);
};

export const sendError = (res: Response, status: number, message: string): void => {
    res.status(status).json({ success: false, error: message } as ApiResponse);
};

export const sendNotFound = (res: Response, message: string = ERROR_MESSAGES.NOT_FOUND): void => {
    sendError(res, HTTP_STATUS.NOT_FOUND, message);
};

export const sendBadRequest = (res: Response, message: string = ERROR_MESSAGES.REQUIRED_FIELDS): void => {
    sendError(res, HTTP_STATUS.BAD_REQUEST, message);
};

export const sendUnauthorized = (res: Response, message: string = ERROR_MESSAGES.UNAUTHORIZED): void => {
    sendError(res, HTTP_STATUS.UNAUTHORIZED, message);
};

export const sendForbidden = (res: Response, message: string = ERROR_MESSAGES.FORBIDDEN): void => {
    sendError(res, HTTP_STATUS.FORBIDDEN, message);
};

export const sendConflict = (res: Response, message: string): void => {
    sendError(res, HTTP_STATUS.CONFLICT, message);
};

export const sendServerError = (res: Response, message: string = ERROR_MESSAGES.INTERNAL_ERROR): void => {
    sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message);
};
