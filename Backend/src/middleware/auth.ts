import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';

export interface AuthRequest extends Request {
    userId?: number;
    isGlobalAdmin?: boolean;
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