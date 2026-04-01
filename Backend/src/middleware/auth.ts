import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export interface AuthRequest extends Request {
    userId?: number;
    isGlobalAdmin?: boolean;
    userUniversityId?: number | null;
}

export const requireGlobalAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: No user ID provided' });
        return;
    }

    try {
        const result = await query(
            'SELECT role, university_id FROM users WHERE id = $1',
            [parseInt(userId)]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }

        const user = result.rows[0];
        if (user.role !== 'admin' || user.university_id !== null) {
            res.status(403).json({ error: 'Forbidden: Global admin access required' });
            return;
        }

        req.userId = parseInt(userId);
        req.isGlobalAdmin = true;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.headers['x-user-id'] as string;

    if (!userId) {
        res.status(401).json({ error: 'Unauthorized: No user ID provided' });
        return;
    }

    try {
        const result = await query(
            'SELECT role, university_id FROM users WHERE id = $1',
            [parseInt(userId)]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Unauthorized: User not found' });
            return;
        }

        const user = result.rows[0];
        if (user.role !== 'admin') {
            res.status(403).json({ error: 'Forbidden: Admin access required' });
            return;
        }

        req.userId = parseInt(userId);
        req.userUniversityId = user.university_id;
        req.isGlobalAdmin = user.university_id === null;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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