import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { requireGlobalAdmin, type AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';

const router = Router();

interface SignupRequest {
    university_id: number;
    email: string;
    username?: string;
    password: string;
    student_id?: string;
}

interface LoginRequest {
    email: string;
    password: string;
    university_id: number;
}

interface UserRow {
    id: number;
    email: string;
    username?: string;
    university_id: number | null;
    password_hash: string;
    role: string;
}

const sendError = (res: Response, status: number, message: string) => {
    res.status(status).json({ error: message });
    return;
};

const validateSignupInput = (data: SignupRequest): string | null => {
    if (!data.university_id || !data.email || !data.password) {
        return 'Missing required fields: university_id, email, password';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return 'Invalid email format';
    }
    return null;
};

const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

const checkEmailExists = async (email: string, universityId: number): Promise<boolean> => {
    const result = await query('SELECT id FROM users WHERE email = $1 AND university_id = $2', [email, universityId]);
    return result.rows.length > 0;
};

const checkStudentIdExists = async (studentId: string, universityId: number): Promise<boolean> => {
    const result = await query('SELECT id FROM users WHERE student_id = $1 AND university_id = $2', [studentId, universityId]);
    return result.rows.length > 0;
};

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { university_id, email, username, password, student_id }: SignupRequest = req.body;

        const validationError = validateSignupInput({ university_id, email, password });
        if (validationError) {
            sendError(res, 400, validationError);
            return;
        }

        if (await checkEmailExists(email, university_id)) {
            sendError(res, 409, 'Email already exists at this university');
            return;
        }

        if (student_id && await checkStudentIdExists(student_id, university_id)) {
            sendError(res, 409, 'Student ID already exists at this university');
            return;
        }

        const password_hash = await hashPassword(password);

        const result = await query(
            'INSERT INTO users (university_id, email, username, password_hash, student_id, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, username, university_id, student_id, role',
            [university_id, email, username || null, password_hash, student_id || null, 'user']
        );

        res.status(201).json({
            message: 'User created successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password, university_id }: LoginRequest = req.body;

        if (!email || !password || !university_id) {
            sendError(res, 400, 'Missing email, password, or university_id');
            return;
        }

        const userResult = await query(
            'SELECT id, email, username, university_id, password_hash, role FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            sendError(res, 401, 'Invalid credentials');
            return;
        }

        const user = userResult.rows[0] as UserRow;

        if (user.role === 'admin' && user.university_id === null) {
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                sendError(res, 401, 'Invalid credentials');
                return;
            }

            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    university_id: 0,
                    university_name: 'Global Admin',
                    role: 'admin',
                    isGlobalAdmin: true
                }
            });
            return;
        }

        if (user.university_id !== null && user.university_id !== university_id) {
            sendError(res, 401, 'Invalid credentials');
            return;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            sendError(res, 401, 'Invalid credentials');
            return;
        }

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, username: user.username, university_id: user.university_id, role: user.role }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/universities', async (_req: Request, res: Response) => {
    try {
        const result = await query('SELECT id, name, email_domain FROM universities ORDER BY name');
        res.json({ universities: result.rows });
    } catch (error) {
        console.error('Universities error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/universities', requireGlobalAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { name, email_domain } = req.body;

        if (!name || !email_domain) {
            res.status(400).json({ error: 'Missing required fields: name, email_domain' });
            return;
        }

        const existingUni = await query(
            'SELECT id FROM universities WHERE name = $1 OR email_domain = $2',
            [name, email_domain]
        );

        if (existingUni.rows.length > 0) {
            res.status(409).json({ error: 'University with this name or email domain already exists' });
            return;
        }

        const result = await query(
            'INSERT INTO universities (name, email_domain) VALUES ($1, $2) RETURNING id, name, email_domain',
            [name, email_domain]
        );

        res.status(201).json({
            message: 'University created successfully',
            university: result.rows[0]
        });
    } catch (error) {
        console.error('Create university error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const checkRelatedRecords = async (universityId: number): Promise<{ hasRelated: boolean; message: string }> => {
    const tables = [
        { table: 'users', column: 'university_id', message: 'Cannot delete university with existing users. Remove users first.' },
        { table: 'dining_locations', column: 'university_id', message: 'Cannot delete university with dining locations. Remove locations first.' },
        { table: 'events', column: 'university_id', message: 'Cannot delete university with events. Remove events first.' },
    ];

    for (const { table, column, message } of tables) {
        const result = await query(`SELECT COUNT(*) as count FROM ${table} WHERE ${column} = $1`, [universityId]);
        if (parseInt(result.rows[0].count) > 0) {
            return { hasRelated: true, message };
        }
    }

    return { hasRelated: false, message: '' };
};

router.delete('/universities/:id', requireGlobalAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        const universityId = parseInt(id);

        if (isNaN(universityId)) {
            res.status(400).json({ error: 'Invalid university ID' });
            return;
        }

        const { hasRelated, message } = await checkRelatedRecords(universityId);
        
        if (hasRelated) {
            res.status(409).json({ error: message });
            return;
        }

        await query('DELETE FROM universities WHERE id = $1', [universityId]);

        res.json({ message: 'University deleted successfully' });
    } catch (error) {
        console.error('Delete university error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;