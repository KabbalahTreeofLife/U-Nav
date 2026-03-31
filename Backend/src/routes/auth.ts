import { Router, Request, Response } from 'express';
import { query } from '../config/database';
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

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { university_id, email, username, password, student_id }: SignupRequest = req.body;

        if (!university_id || !email || !password) {
            res.status(400).json({ error: 'Missing required fields: university_id, email, password' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: 'Invalid email format' });
            return;
        }

        const existingEmail = await query(
            'SELECT id FROM users WHERE email = $1 AND university_id = $2',
            [email, university_id]
        );

        if (existingEmail.rows.length > 0) {
            res.status(409).json({ error: 'Email already exists at this university' });
            return;
        }

        if (student_id) {
            const existingStudentId = await query(
                'SELECT id FROM users WHERE student_id = $1 AND university_id = $2',
                [student_id, university_id]
            );

            if (existingStudentId.rows.length > 0) {
                res.status(409).json({ error: 'Student ID already exists at this university' });
                return;
            }
        }

        const password_hash = await bcrypt.hash(password, 10);

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
            res.status(400).json({ error: 'Missing email, password, or university_id' });
            return;
        }

        const userResult = await query(
            'SELECT id, email, username, university_id, password_hash, role FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = userResult.rows[0];

        if (user.role === 'admin' && user.university_id === null) {
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                res.status(401).json({ error: 'Invalid credentials' });
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
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            res.status(401).json({ error: 'Invalid credentials' });
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

export default router;
