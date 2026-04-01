import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { mapEventRow } from '../utils/mappers';
import { requireAdmin, type AuthRequest } from '../middleware/auth';

const router = Router();

const EVENTS_SELECT_QUERY = 'SELECT * FROM events';
const EVENTS_RETURN_QUERY = 'RETURNING *';

const sendSuccess = (res: Response, status: number, data: unknown) => {
    res.status(status).json({ success: true, data });
};

const sendError = (res: Response, status: number, message: string) => {
    res.status(status).json({ success: false, error: message });
};

router.get('/', async (req: Request, res: Response) => {
    try {
        const { university_id } = req.query;
        
        let sql = EVENTS_SELECT_QUERY;
        const params: number[] = [];
        
        if (university_id) {
            sql += ' WHERE university_id = $1';
            params.push(parseInt(university_id as string));
        }
        
        sql += ' ORDER BY university_id, date ASC';
        
        const result = await query(sql, params);
        
        const events = result.rows.map((row) => mapEventRow(row as unknown as Record<string, unknown>));
        
        sendSuccess(res, 200, { events });
    } catch (error) {
        console.error('Error fetching events:', error);
        sendError(res, 500, 'Failed to fetch events');
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query(`${EVENTS_SELECT_QUERY} WHERE id = $1`, [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return sendError(res, 404, 'Event not found');
        }
        
        const event = mapEventRow(result.rows[0] as unknown as Record<string, unknown>);
        
        sendSuccess(res, 200, { event });
    } catch (error) {
        console.error('Error fetching event:', error);
        sendError(res, 500, 'Failed to fetch event');
    }
});

router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { universityId, title, description, room, date, time, organizer, category } = req.body;
        
        if (!universityId || !title || !date) {
            return sendError(res, 400, 'Missing required fields');
        }
        
        const result = await query(
            `INSERT INTO events 
             (university_id, title, description, room, date, time, organizer, category)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ${EVENTS_RETURN_QUERY}`,
            [universityId, title, description || '', room || '', date, time || '', organizer || '', category || 'academic']
        );
        
        const event = mapEventRow(result.rows[0] as unknown as Record<string, unknown>);
        
        sendSuccess(res, 201, { event });
    } catch (error) {
        console.error('Error creating event:', error);
        sendError(res, 500, 'Failed to create event');
    }
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
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
             ${EVENTS_RETURN_QUERY}`,
            [title, description, room, date, time, organizer, category, parseInt(id)]
        );
        
        if (result.rows.length === 0) {
            return sendError(res, 404, 'Event not found');
        }
        
        const event = mapEventRow(result.rows[0] as unknown as Record<string, unknown>);
        
        sendSuccess(res, 200, { event });
    } catch (error) {
        console.error('Error updating event:', error);
        sendError(res, 500, 'Failed to update event');
    }
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query(`DELETE FROM events WHERE id = $1 RETURNING id`, [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return sendError(res, 404, 'Event not found');
        }
        
        sendSuccess(res, 200, { message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        sendError(res, 500, 'Failed to delete event');
    }
});

export default router;
