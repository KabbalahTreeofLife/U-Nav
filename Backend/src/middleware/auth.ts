import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined');
}

export interface AuthRequest extends Request {
    userId?: number;
    isGlobalAdmin?: boolean;
    userUniversityId?: number | null;
}

interface JwtPayload {
    id: number;
    email: string;
    role: string;
    university_id: number | null;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
            res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
            return;
        }

        const payload = decoded as JwtPayload;
        req.userId = payload.id;
        req.userUniversityId = payload.university_id;
        req.isGlobalAdmin = payload.role === 'admin' && payload.university_id === null;
        next();
    });
};

export const requireGlobalAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
        if (!req.isGlobalAdmin) {
            res.status(403).json({ error: 'Forbidden: Global admin access required' });
            return;
        }
        next();
    });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
        const isUniAdmin = req.userUniversityId !== null;
        const isGlobalAdmin = req.isGlobalAdmin;

        if (!isGlobalAdmin && !isUniAdmin) {
            res.status(403).json({ error: 'Forbidden: Admin access required' });
            return;
        }
        next();
    });
};

export const canManageUniversity = (req: AuthRequest, universityId: number): boolean => {
    if (req.isGlobalAdmin) return true;
    return req.userUniversityId === universityId;
};

export const canManageUser = (actorUniversityId: number | null, isGlobalAdmin: boolean, targetUniversityId: number | null, targetUserId: number, actorUserId: number): { allowed: boolean; error?: string } => {
    if (targetUserId === actorUserId) {
        return { allowed: false, error: 'Cannot modify your own account' };
    }
    if (targetUniversityId === null) {
        return { allowed: false, error: 'Cannot modify a global admin' };
    }
    if (isGlobalAdmin) {
        return { allowed: true };
    }
    if (actorUniversityId !== null && actorUniversityId === targetUniversityId) {
        return { allowed: true };
    }
    return { allowed: false, error: 'You can only manage users from your university' };
};