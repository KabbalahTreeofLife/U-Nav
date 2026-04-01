export const mapDiningRow = (row: Record<string, unknown>) => ({
    id: `db-${row.id}`,
    name: row.name as string,
    type: row.type as string,
    building: row.building as string,
    floor: row.floor as number,
    operatingHours: row.operating_hours as string,
    priceRange: row.price_range as string,
    cuisine: (row.cuisine as string[]) || [],
    rating: typeof row.rating === 'string' ? parseFloat(row.rating) : (row.rating as number) || 4.0,
    imageUrl: row.image_url as string | undefined,
    coordinates: row.coordinates_x !== null && row.coordinates_y !== null
        ? { x: row.coordinates_x as number, y: row.coordinates_y as number }
        : undefined,
    universityId: row.university_id as number,
    isFromDb: true,
});

export const mapEventRow = (row: Record<string, unknown>) => ({
    id: `db-${row.id}`,
    title: row.title as string,
    description: row.description as string,
    room: row.room as string,
    date: row.date as string,
    time: row.time as string,
    organizer: row.organizer as string,
    category: row.category as string,
    universityId: row.university_id as number,
    isFromDb: true,
});

export const mapUserRow = (row: Record<string, unknown>) => ({
    id: row.id as number,
    email: row.email as string,
    username: row.username as string | undefined,
    university_id: row.university_id as number | null,
    university_name: row.university_name as string | undefined,
    role: row.role as string | undefined,
    isGlobalAdmin: row.role === 'admin' && row.university_id === null,
    created_at: row.created_at as string | undefined,
});