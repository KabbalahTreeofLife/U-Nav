import { Router, Request, Response } from 'express';
import { query } from '../config/database';

const router = Router();

interface Event {
    id: number;
    university_id: number;
    title: string;
    description: string;
    room: string;
    date: string;
    time: string;
    organizer: string;
    category: string;
    created_at: string;
    updated_at: string;
}

router.get('/', async (req: Request, res: Response) => {
    try {
        const { university_id } = req.query;
        
        let sql = 'SELECT * FROM events';
        const params: number[] = [];
        
        if (university_id) {
            sql += ' WHERE university_id = $1';
            params.push(parseInt(university_id as string));
        }
        
        sql += ' ORDER BY university_id, date ASC';
        
        const result = await query(sql, params);
        
        const events = result.rows.map((row: Event) => ({
            id: `db-${row.id}`,
            title: row.title,
            description: row.description,
            room: row.room,
            date: row.date,
            time: row.time,
            organizer: row.organizer,
            category: row.category,
            universityId: row.university_id,
            isFromDb: true,
        }));
        
        res.json({ success: true, data: { events } });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query('SELECT * FROM events WHERE id = $1', [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        
        const row = result.rows[0] as Event;
        const event = {
            id: `db-${row.id}`,
            title: row.title,
            description: row.description,
            room: row.room,
            date: row.date,
            time: row.time,
            organizer: row.organizer,
            category: row.category,
            universityId: row.university_id,
            isFromDb: true,
        };
        
        res.json({ success: true, data: { event } });
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch event' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { universityId, title, description, room, date, time, organizer, category } = req.body;
        
        if (!universityId || !title || !date) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        const result = await query(
            `INSERT INTO events 
             (university_id, title, description, room, date, time, organizer, category)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [universityId, title, description || '', room || '', date, time || '', organizer || '', category || 'academic']
        );
        
        const row = result.rows[0] as Event;
        const event = {
            id: `db-${row.id}`,
            title: row.title,
            description: row.description,
            room: row.room,
            date: row.date,
            time: row.time,
            organizer: row.organizer,
            category: row.category,
            universityId: row.university_id,
            isFromDb: true,
        };
        
        res.status(201).json({ success: true, data: { event } });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ success: false, error: 'Failed to create event' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { title, description, room, date, time, organizer, category } = req.body;
        
        const result = await query(
            `UPDATE events SET
             title = COALESCE($1, title),
             description = COALESCE($2, description),
             room = COALESCE($3, room),
             date = COALESCE($4, date),
             time = COALESCE($5, time),
             organizer = COALESCE($6, organizer),
             category = COALESCE($7, category),
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $8
             RETURNING *`,
            [title, description, room, date, time, organizer, category, parseInt(id)]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        
        const row = result.rows[0] as Event;
        const event = {
            id: `db-${row.id}`,
            title: row.title,
            description: row.description,
            room: row.room,
            date: row.date,
            time: row.time,
            organizer: row.organizer,
            category: row.category,
            universityId: row.university_id,
            isFromDb: true,
        };
        
        res.json({ success: true, data: { event } });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ success: false, error: 'Failed to update event' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query('DELETE FROM events WHERE id = $1 RETURNING id', [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        
        res.json({ success: true, message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, error: 'Failed to delete event' });
    }
});

export default router;
