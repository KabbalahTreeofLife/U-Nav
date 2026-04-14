import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { mapDiningRow } from '../utils/mappers';
import { requireAdmin, canManageUniversity, type AuthRequest } from '../middleware/auth';
import { sendSuccess, sendError, sendNotFound, sendBadRequest, HTTP_STATUS, ERROR_MESSAGES } from '../utils/responseHelpers';

const router = Router();

const DINING_SELECT_QUERY = 'SELECT * FROM dining_locations';
const DINING_RETURN_QUERY = 'RETURNING *';

router.get('/', async (req: Request, res: Response) => {
    try {
        const { university_id } = req.query;
        
        let sql = DINING_SELECT_QUERY;
        const params: number[] = [];
        
        if (university_id) {
            sql += ' WHERE university_id = $1';
            params.push(parseInt(university_id as string));
        }
        
        sql += ' ORDER BY university_id, name';
        
        const result = await query(sql, params);
        
        const locations = result.rows.map((row) => mapDiningRow(row));
        
        sendSuccess(res, HTTP_STATUS.OK, { locations });
    } catch (error) {
        console.error('Error fetching dining locations:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query(`${DINING_SELECT_QUERY} WHERE id = $1`, [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Dining location not found');
        }
        
        const location = mapDiningRow(result.rows[0]);
        
        sendSuccess(res, HTTP_STATUS.OK, { location });
    } catch (error) {
        console.error('Error fetching dining location:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const { universityId, name, type, building, floor, operatingHours, priceRange, cuisine, rating, imageUrl, coordinates } = req.body;
        
        if (!universityId || !name || !type || !building) {
            return sendBadRequest(res, ERROR_MESSAGES.REQUIRED_FIELDS);
        }
        
        if (!canManageUniversity(req, universityId)) {
            return res.status(403).json({ error: 'Forbidden: You can only add dining locations for your own university' });
        }
        
        const result = await query(
            `INSERT INTO dining_locations 
             (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, image_url, coordinates_x, coordinates_y)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ${DINING_RETURN_QUERY}`,
            [
                universityId,
                name,
                type,
                building,
                floor || 1,
                operatingHours || '',
                priceRange || '$',
                cuisine || [],
                rating || 4.0,
                imageUrl || null,
                coordinates?.x ?? null,
                coordinates?.y ?? null,
            ]
        );
        
        const location = mapDiningRow(result.rows[0]);
        
        sendSuccess(res, HTTP_STATUS.CREATED, { location });
    } catch (error) {
        console.error('Error creating dining location:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        const { name, type, building, floor, operatingHours, priceRange, cuisine, rating, imageUrl, coordinates } = req.body;
        
        const existingResult = await query('SELECT university_id FROM dining_locations WHERE id = $1', [parseInt(id)]);
        if (existingResult.rows.length === 0) {
            return sendNotFound(res, 'Dining location not found');
        }

        if (!canManageUniversity(req, existingResult.rows[0].university_id)) {
            return res.status(403).json({ error: 'Forbidden: You can only update dining locations for your own university' });
        }

        const result = await query(
            `UPDATE dining_locations SET
             name = COALESCE($1, name),
             type = COALESCE($2, type),
             building = COALESCE($3, building),
             floor = COALESCE($4, floor),
             operating_hours = COALESCE($5, operating_hours),
             price_range = COALESCE($6, price_range),
             cuisine = COALESCE($7, cuisine),
             rating = COALESCE($8, rating),
             image_url = COALESCE($9, image_url),
             coordinates_x = COALESCE($10, coordinates_x),
             coordinates_y = COALESCE($11, coordinates_y),
             updated_at = CURRENT_TIMESTAMP
             WHERE id = $12
             ${DINING_RETURN_QUERY}`,
            [name, type, building, floor, operatingHours, priceRange, cuisine, rating, imageUrl, coordinates?.x, coordinates?.y, parseInt(id)]
        );
        
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Dining location not found');
        }
        
        const location = mapDiningRow(result.rows[0]);
        
        sendSuccess(res, HTTP_STATUS.OK, { location });
    } catch (error) {
        console.error('Error updating dining location:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
    try {
        const id = String(req.params.id);
        
        const existingResult = await query('SELECT university_id FROM dining_locations WHERE id = $1', [parseInt(id)]);
        if (existingResult.rows.length === 0) {
            return sendNotFound(res, 'Dining location not found');
        }

        if (!canManageUniversity(req, existingResult.rows[0].university_id)) {
            return res.status(403).json({ error: 'Forbidden: You can only delete dining locations for your own university' });
        }

        const result = await query(`DELETE FROM dining_locations WHERE id = $1 RETURNING id`, [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return sendNotFound(res, 'Dining location not found');
        }
        
        sendSuccess(res, HTTP_STATUS.OK, { message: 'Dining location deleted successfully' });
    } catch (error) {
        console.error('Error deleting dining location:', error);
        sendError(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.INTERNAL_ERROR);
    }
});

export default router;
