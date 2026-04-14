import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import usersRoutes from './routes/users';
import diningRoutes from './routes/dining';
import eventsRoutes from './routes/events';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * GLOBAL MIDDLEWARE
 */
// Enable Cross-Origin Resource Sharing for the React frontend
app.use(cors());
// Parse incoming JSON request bodies
app.use(express.json());

/**
 * SECURITY: RATE LIMITING
 * Prevents brute-force attacks on authentication endpoints by limiting
 * the number of requests a single IP can make within a 15-minute window.
 */
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests, please try again later.' }
});

// Apply rate limiting specifically to Auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

/**
 * BASE & HEALTH ROUTES
 */
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'U-Nav Backend API is running' });
});

app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * DOMAIN ROUTES
 */
// Authentication & University Management
app.use('/api/auth', authRoutes);
// User Profile & Admin management
app.use('/api/users', usersRoutes);
// Campus Dining data
app.use('/api/dining', diningRoutes);
// Campus Events data
app.use('/api/events', eventsRoutes);

/**
 * GLOBAL ERROR HANDLER
 * Catches all unhandled exceptions and prevents the server from crashing,
 * returning a generic 500 error to the client instead.
 */
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
    console.error('SERVER_ERROR:', err.stack);
    res.status(500).json({ error: 'Something went wrong on our end.' });
});

/**
 * SERVER START
 */
app.listen(PORT, () => {
    console.log(`🧭 U-Nav Server is active at http://localhost:${PORT}`);
});
