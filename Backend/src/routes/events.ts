import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { mapEventRow } from '../utils/mappers';
import { requireAdmin, canManageUniversity, type AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError, sendNotFound, sendBadRequest, HTTP_STATUS, ERROR_MESSAGES } from '../utils/responseHelpers';

const router = Router();

const EVENTS_SELECT_QUERY = 'SELECT * FROM events';
const EVENTS_RETURN_QUERY = 'RETURNING *';

router.get('/', async (req: Request, res: Response) => {
    try {
        const { university_id } = req.query;
        
        let sql = EVENTS_SELECT_QUERY;
        const params: number[] = [];
        
        if (university_id) {
            sql += ' WHERE university_id = $1';
            params.push(parseInt(university_id as string));
        }
        
        sql += ' ORDER BY is_pinned DESC, date ASC';
        
        const result = await query(sql, params);
        
        const events = result.rows.map((row) => mapEventRow(row));
        
        sendSuccess(res, HTTP_STATUS.OK, { events });
    } catch (error) {
        console.error('Error fetching events:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query(`${EVENTS_SELECT_QUERY} WHERE id = $1`, [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Event not found');
        }
        
        const event = mapEventRow(result.rows[0]);
        
        sendSuccess(res, HTTP_STATUS.OK, { event });
    } catch (error) {
        console.error('Error fetching event:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { universityId, title, description, room, date, time, organizer, category, isPinned } = req.body;
        
        if (!universityId || !title || !date) {
            return sendBadRequest(res, ERROR_MESSAGES.REQUIRED_FIELDS);
        }
        
        if (!canManageUniversity(req, universityId)) {
            return res.status(403).json({ error: 'Forbidden: You can only add events for your own university' });
        }
        
        const result = await query(
            `INSERT INTO events 
             (university_id, title, description, room, date, time, organizer, category, is_pinned)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ${EVENTS_RETURN_QUERY}`,
            [universityId, title, description || '', room || '', date, time || '', organizer || '', category || 'academic', isPinned || false]
        );
        
        const event = mapEventRow(result.rows[0]);
        
        sendSuccess(res, HTTP_STATUS.CREATED, { event });
    } catch (error) {
        console.error('Error creating event:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        const { title, description, room, date, time, organizer, category, isPinned } = req.body;
        
        const existingResult = await query('SELECT university_id FROM events WHERE id = $1', [parseInt(id)]);
        if (existingResult.rows.length === 0) {
            return sendNotFound(res, 'Event not found');
        }

        if (!canManageUniversity(req, existingResult.rows[0].university_id)) {
            return res.status(403).json({ error: 'Forbidden: You can only update events for your own university' });
        }

        const result = await query(
            `UPDATE events SET
             title = COALESCE($1, title),
             description = COALESCE($2, description),
             room = COALESCE($3, room),
             date = COALESCE($4, date),
             time = COALESCE($5, time),
             organizer = COALESCE($6, organizer),
             category = COALESCE($7, category),
             is_pinned = COALESCE($8, is_pinned),
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $9
             ${EVENTS_RETURN_QUERY}`,
            [title, description, room, date, time, organizer, category, isPinned, parseInt(id)]
        );
        
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Event not found');
        }
        
        const event = mapEventRow(result.rows[0]);
        
        sendSuccess(res, HTTP_STATUS.OK, { event });
    } catch (error) {
        console.error('Error updating event:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        
        const existingResult = await query('SELECT university_id FROM events WHERE id = $1', [parseInt(id)]);
        if (existingResult.rows.length === 0) {
            return sendNotFound(res, 'Event not found');
        }

        if (!canManageUniversity(req, existingResult.rows[0].university_id)) {
            return res.status(403).json({ error: 'Forbidden: You can only delete events for your own university' });
        }

        const result = await query(`DELETE FROM events WHERE id = $1 RETURNING id`, [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Event not found');
        }
        
        sendSuccess(res, HTTP_STATUS.OK, { message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

export default router;
