import { Router, Request, Response } from 'express';
import { query } from '../config/database';
import { mapDiningRow } from '../utils/mappers';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const { university_id } = req.query;
        
        let sql = 'SELECT * FROM dining_locations';
        const params: number[] = [];
        
        if (university_id) {
            sql += ' WHERE university_id = $1';
            params.push(parseInt(university_id as string));
        }
        
        sql += ' ORDER BY university_id, name';
        
        const result = await query(sql, params);
        
        const locations = result.rows.map((row) => mapDiningRow(row));
        
        res.json({ success: true, data: { locations } });
    } catch (error) {
        console.error('Error fetching dining locations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dining locations' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query('SELECT * FROM dining_locations WHERE id = $1', [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Dining location not found' });
        }
        
        const location = mapDiningRow(result.rows[0] as unknown as Record<string, unknown>);
        
        res.json({ success: true, data: { location } });
    } catch (error) {
        console.error('Error fetching dining location:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dining location' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { universityId, name, type, building, floor, operatingHours, priceRange, cuisine, rating, imageUrl, coordinates } = req.body;
        
        if (!universityId || !name || !type || !building) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        
        const result = await query(
            `INSERT INTO dining_locations 
             (university_id, name, type, building, floor, operating_hours, price_range, cuisine, rating, image_url, coordinates_x, coordinates_y)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING *`,
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
        
        const location = mapDiningRow(result.rows[0] as unknown as Record<string, unknown>);
        
        res.status(201).json({ success: true, data: { location } });
    } catch (error) {
        console.error('Error creating dining location:', error);
        res.status(500).json({ success: false, error: 'Failed to create dining location' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { name, type, building, floor, operatingHours, priceRange, cuisine, rating, imageUrl, coordinates } = req.body;
        
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
             RETURNING *`,
            [name, type, building, floor, operatingHours, priceRange, cuisine, rating, imageUrl, coordinates?.x, coordinates?.y, parseInt(id)]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Dining location not found' });
        }
        
        const location = mapDiningRow(result.rows[0] as unknown as Record<string, unknown>);
        
        res.json({ success: true, data: { location } });
    } catch (error) {
        console.error('Error updating dining location:', error);
        res.status(500).json({ success: false, error: 'Failed to update dining location' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const result = await query('DELETE FROM dining_locations WHERE id = $1 RETURNING id', [parseInt(id)]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Dining location not found' });
        }
        
        res.json({ success: true, message: 'Dining location deleted successfully' });
    } catch (error) {
        console.error('Error deleting dining location:', error);
        res.status(500).json({ success: false, error: 'Failed to delete dining location' });
    }
});

export default router;
