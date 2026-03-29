import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

interface SignupRequest {
    university_id: number;
    username: string;
    password: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

router.post('/signup', async (req: Request, res: Response) => {
    try {
        const { university_id, username, password }: SignupRequest = req.body;

        if (!university_id || !username || !password) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const existingUser = await query(
            'SELECT id FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            res.status(409).json({ error: 'Username already exists' });
            return;
        }

        const password_hash = `hashed_${password}`;

        const result = await query(
            'INSERT INTO users (university_id, username, password_hash) VALUES ($1, $2, $3) RETURNING id, username, university_id',
            [university_id, username, password_hash]
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
        const { username, password }: LoginRequest = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Missing username or password' });
            return;
        }

        const result = await query(
            'SELECT id, username, university_id FROM users WHERE username = $1 AND password_hash = $2',
            [username, `hashed_${password}`]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        res.json({
            message: 'Login successful',
            user: result.rows[0]
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
