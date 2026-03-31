import { Router, Request, Response } from 'express';
import { query } from '../config/database';

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
        res.json({ users: result.rows });
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

        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/role', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { role, university_id } = req.body;

        if (!role || !['user', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
            return;
        }

        const userCheck = await query('SELECT id FROM users WHERE id = $1', [id]);
        if (userCheck.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        let result;
        if (role === 'admin') {
            const uniId = university_id !== null && university_id !== undefined ? university_id : null;
            result = await query(
                `UPDATE users SET role = $1, university_id = $2 WHERE id = $3 ${USER_RETURN_QUERY}`,
                [role, uniId, id]
            );
            res.json({ message: university_id ? 'User role updated successfully' : 'User role updated to global admin', user: result.rows[0] });
        } else {
            if (!university_id) {
                res.status(400).json({ error: 'University ID is required for user role' });
                return;
            }
            result = await query(
                `UPDATE users SET role = $1, university_id = $2 WHERE id = $3 ${USER_RETURN_QUERY}`,
                [role, university_id, id]
            );
            res.json({ message: 'User role updated successfully', user: result.rows[0] });
        }
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const userCheck = await query('SELECT role, university_id FROM users WHERE id = $1', [id]);
        if (userCheck.rows.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (userCheck.rows[0].role === 'admin' && userCheck.rows[0].university_id === null) {
            res.status(403).json({ error: 'Cannot delete the global admin' });
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
