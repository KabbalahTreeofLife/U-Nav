interface DiningRow {
    id: number;
    university_id: number;
    name: string;
    type: string;
    building: string;
    floor: number | null;
    operating_hours: string;
    price_range: string;
    cuisine: string[];
    rating: number | string;
    image_url: string | null;
    coordinates_x: number | null;
    coordinates_y: number | null;
}

interface EventRow {
    id: number;
    university_id: number;
    title: string;
    description: string;
    room: string;
    date: string | Date;
    time: string;
    organizer: string;
    category: string;
}

interface UserRow {
    id: number;
    email: string;
    username: string | null;
    university_id: number | null;
    role: string | null;
    created_at: string | Date;
    university_name?: string;
}

export const mapDiningRow = (row: DiningRow) => ({
    id: `db-${row.id}`,
    name: row.name,
    type: row.type,
    building: row.building,
    floor: row.floor,
    operatingHours: row.operating_hours,
    priceRange: row.price_range,
    cuisine: row.cuisine || [],
    rating: typeof row.rating === 'string' ? parseFloat(row.rating) : row.rating || 4.0,
    imageUrl: row.image_url || undefined,
    coordinates: row.coordinates_x !== null && row.coordinates_y !== null
        ? { x: row.coordinates_x, y: row.coordinates_y }
        : undefined,
    universityId: row.university_id,
    isFromDb: true,
});

export const mapEventRow = (row: EventRow) => ({
    id: `db-${row.id}`,
    title: row.title,
    description: row.description,
    room: row.room,
    date: typeof row.date === 'string' ? row.date : row.date.toString(),
    time: row.time,
    organizer: row.organizer,
    category: row.category,
    universityId: row.university_id,
    isFromDb: true,
});

export const mapUserRow = (row: UserRow) => ({
    id: row.id,
    email: row.email,
    username: row.username || undefined,
    university_id: row.university_id,
    university_name: row.university_name || undefined,
    role: row.role || undefined,
    isGlobalAdmin: row.role === 'admin' && row.university_id === null,
    created_at: typeof row.created_at === 'string' ? row.created_at : row.created_at.toString(),
});
