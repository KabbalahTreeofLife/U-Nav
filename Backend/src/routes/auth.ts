import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import bcrypt from 'bcryptjs';

const router = Router();

interface SignupRequest {
    university_id: number;
    username: string;
    password: string;
}

interface LoginRequest {
    username: string;
    password: string;
    university_id: number;
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

        const password_hash = await bcrypt.hash(password, 10);

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
        const { username, password, university_id }: LoginRequest = req.body;

        if (!username || !password || !university_id) {
            res.status(400).json({ error: 'Missing username, password, or university_id' });
            return;
        }

        const result = await query(
            'SELECT id, username, university_id, password_hash FROM users WHERE username = $1',
            [username]
        );

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = result.rows[0];
        
        // Validate that the user belongs to the selected university
        if (user.university_id !== university_id) {
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
            user: { id: user.id, username: user.username, university_id: user.university_id }
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
