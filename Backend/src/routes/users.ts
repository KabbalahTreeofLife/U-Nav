import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { mapUserRow } from '../utils/mappers';
import { requireAdmin, canManageUser, type AuthRequest } from '../middleware/auth';

const router = Router();

const USER_SELECT_QUERY = `
    SELECT u.id, u.email, u.username, u.university_id, u.role, u.created_at, un.name as university_name
    FROM users u
    LEFT JOIN universities un ON u.university_id = un.id
`;

const USER_RETURN_QUERY = 'RETURNING id, email, username, university_id, role';

router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await query(`${USER_SELECT_QUERY} ORDER BY u.created_at DESC`);
        const users = result.rows.map((row) => mapUserRow(row));
        res.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await query(`${USER_SELECT_QUERY} WHERE u.id = $1`, [id]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const user = mapUserRow(result.rows[0]);
        res.json({ user });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/role', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { role, university_id } = req.body;
        const actorId = req.userId;
        const actorUniversityId = req.userUniversityId;
        const isGlobalAdmin = req.isGlobalAdmin;

        if (!role || !['user', 'admin', 'global'].includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be "user", "admin", or "global"' });
            return;
        }

        const userCheck = await query('SELECT id, role, university_id FROM users WHERE id = $1', [id]);
        if (userCheck.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const currentUser = userCheck.rows[0];

        const targetId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
        
        const permission = canManageUser(
            actorUniversityId ?? null,
            isGlobalAdmin ?? false,
            currentUser.university_id,
            targetId,
            actorId ?? 0
        );

        if (!permission.allowed) {
            res.status(403).json({ error: permission.error });
            return;
        }

        if (currentUser.role === 'admin' && currentUser.university_id === null) {
            res.status(403).json({ error: 'Cannot modify a global admin' });
            return;
        }

        let newRole = role;
        let newUniversityId = university_id !== undefined ? university_id : currentUser.university_id;

        if (role === 'global') {
            if (!isGlobalAdmin) {
                res.status(403).json({ error: 'Only global admins can promote to global admin' });
                return;
            }
            newRole = 'admin';
            newUniversityId = null;
        }

        const result = await query(
            `UPDATE users SET role = $1, university_id = $2 WHERE id = $3 ${USER_RETURN_QUERY}`,
            [newRole, newUniversityId, id]
        );
        res.json({ message: 'User role updated successfully', user: result.rows[0] });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const actorId = req.userId;
        const actorUniversityId = req.userUniversityId;
        const isGlobalAdmin = req.isGlobalAdmin;

        const userCheck = await query('SELECT role, university_id FROM users WHERE id = $1', [id]);
        if (userCheck.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userToDelete = userCheck.rows[0];

        const targetId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id);

        const permission = canManageUser(
            actorUniversityId ?? null,
            isGlobalAdmin ?? false,
            userToDelete.university_id,
            targetId,
            actorId ?? 0
        );

        if (!permission.allowed) {
            res.status(403).json({ error: permission.error });
            return;
        }

        if (userToDelete.role === 'admin' && userToDelete.university_id === null) {
            res.status(403).json({ error: 'Cannot delete the global admin' });
            return;
        }

        if (userToDelete.role === 'admin' && userToDelete.university_id !== null) {
            res.status(403).json({ error: 'Cannot delete an admin. Demote to user first.' });
            return;
        }

        await query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
