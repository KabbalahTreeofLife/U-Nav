import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { requireGlobalAdmin, type AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is not defined');
}

const generateToken = (user: { id: number; email: string; role: string; university_id: number | null }) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role, university_id: user.university_id },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        console.error('Bcrypt compare error:', error);
        return false;
    }
};

const sendError = (res: Response, status: number, message: string) => {
    res.status(status).json({ error: message });
    return;
};

const createUserResponse = (user: UserRow, isGlobalAdminUser: boolean) => {
    if (isGlobalAdminUser) {
        return {
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
        };
    }
    return {
        message: 'Login successful',
        user: { id: user.id, email: user.email, username: user.username, university_id: user.university_id, role: user.role }
    };
};

const isGlobalAdminUser = (user: UserRow): boolean => {
    return user.role === 'admin' && user.university_id === null;
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

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { university_id, email, username, password, student_id }: SignupRequest = req.body;

        const validationError = validateSignupInput({ university_id, email, password });
        if (validationError) {
            return sendError(res, 400, validationError);
        }

        if (await checkEmailExists(email, university_id)) {
            return sendError(res, 409, 'Email already exists at this university');
        }

        if (student_id && await checkStudentIdExists(student_id, university_id)) {
            return sendError(res, 409, 'Student ID already exists at this university');
        }

        const password_hash = await hashPassword(password as string);

        const result = await query(
            'INSERT INTO users (university_id, email, username, password_hash, student_id, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, username, university_id, role',
            [university_id, email, username || null, password_hash, student_id || null, 'user']
        );

        const user = result.rows[0];
        const token = generateToken(user);

        res.status(201).json({
            message: 'User created successfully',
            user: user,
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password, university_id }: LoginRequest = req.body;

    if (!email || !password || university_id === undefined) {
        return res.status(400).json({ error: 'Missing email, password, or university_id' });
    }

    try {
        const userResult = await query(
            'SELECT id, email, username, university_id, password_hash, role FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = userResult.rows[0] as UserRow;
        const isGlobalAdmin = isGlobalAdminUser(user);

        if (isGlobalAdmin) {
            const isValid = await verifyPassword(password, user.password_hash);
            if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

            const token = generateToken(user);
            const response = createUserResponse(user, true);
            return res.json({ ...response, token });
        }

        if (user.university_id !== null && user.university_id !== university_id) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await verifyPassword(password, user.password_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = generateToken(user);
        const response = createUserResponse(user, false);
        return res.json({ ...response, token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Something went wrong!' });
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

router.delete('/universities/:id', requireGlobalAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const universityId = parseInt(req.params.id as string);
        if (isNaN(universityId)) return res.status(400).json({ error: 'Invalid ID' });

        const { hasRelated, message } = await checkRelatedRecords(universityId);
        if (hasRelated) {
            return res.status(409).json({ error: message });
        }

        await query('DELETE FROM universities WHERE id = $1', [universityId]);
        res.json({ message: 'University deleted successfully' });
    } catch (error) {
        console.error('Delete university error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;