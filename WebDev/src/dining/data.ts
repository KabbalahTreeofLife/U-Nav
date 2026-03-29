export interface DiningLocation {
    id: string;
    name: string;
    type: 'restaurant' | 'cafe' | 'snack' | 'mess';
    building: string;
    floor: number;
    operatingHours: string;
    priceRange: '$' | '$$' | '$$$';
    cuisine: string[];
    rating: number;
    imageUrl?: string;
    coordinates?: { x: number; y: number };
}

export const diningLocations: DiningLocation[] = [
    {
        id: 'cpu-mess',
        name: 'CPU Main Mess Hall',
        type: 'mess',
        building: 'Administration Building',
        floor: 1,
        operatingHours: '6:00 AM - 8:00 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'International'],
        rating: 4.2,
        coordinates: { x: 0, y: 0 }
    },
    {
        id: 'cpu-cafeteria',
        name: 'University Cafeteria',
        type: 'restaurant',
        building: 'College of Engineering',
        floor: 1,
        operatingHours: '7:00 AM - 7:00 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'Fast Food', 'Snacks'],
        rating: 4.0,
        coordinates: { x: 10, y: 5 }
    },
    {
        id: 'cpu-coffee-shop',
        name: 'Campus Coffee Hub',
        type: 'cafe',
        building: 'Library Building',
        floor: 2,
        operatingHours: '6:00 AM - 10:00 PM',
        priceRange: '$$',
        cuisine: ['Coffee', 'Pastries', 'Sandwiches'],
        rating: 4.5,
        coordinates: { x: -5, y: 8 }
    },
    {
        id: 'cpu-food-court',
        name: 'Student Food Court',
        type: 'restaurant',
        building: 'Student Center',
        floor: 1,
        operatingHours: '8:00 AM - 8:00 PM',
        priceRange: '$',
        cuisine: ['Various Filipino Dishes', 'Snacks', 'Drinks'],
        rating: 3.8,
        coordinates: { x: 5, y: -3 }
    },
    {
        id: 'cpu-bake-shop',
        name: 'Sweet Delights Bakery',
        type: 'snack',
        building: 'College of Arts & Sciences',
        floor: 1,
        operatingHours: '7:00 AM - 6:00 PM',
        priceRange: '$$',
        cuisine: ['Baked Goods', 'Pastries', 'Coffee'],
        rating: 4.3,
        coordinates: { x: 8, y: 2 }
    },
    {
        id: 'cpu-convenience',
        name: 'Campus Convenience Store',
        type: 'snack',
        building: 'Dormitory Area',
        floor: 1,
        operatingHours: '24 Hours',
        priceRange: '$',
        cuisine: ['Snacks', 'Beverages', 'Basic Items'],
        rating: 4.1,
        coordinates: { x: -8, y: -5 }
    },
    {
        id: 'cpu-pizza',
        name: 'Pizza Place',
        type: 'restaurant',
        building: 'Sports Complex',
        floor: 1,
        operatingHours: '10:00 AM - 9:00 PM',
        priceRange: '$$',
        cuisine: ['Pizza', 'Pasta', 'Sandwiches'],
        rating: 4.4,
        coordinates: { x: 12, y: -2 }
    },
    {
        id: 'cpu-tea-house',
        name: 'Bubble Tea Station',
        type: 'cafe',
        building: 'College of Business',
        floor: 1,
        operatingHours: '9:00 AM - 7:00 PM',
        priceRange: '$$',
        cuisine: ['Bubble Tea', 'Snacks', 'Light Meals'],
        rating: 4.6,
        coordinates: { x: 3, y: 6 }
    }
];

export const getDiningIcon = (type: DiningLocation['type']): string => {
    switch (type) {
        case 'restaurant':
            return 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z';
        case 'cafe':
            return 'M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8zM6 2v2M10 2v2M14 2v2';
        case 'mess':
            return 'M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z';
        case 'snack':
            return 'M12 2a10 10 0 1 0 10 10H12V2zM8 14s1.5 2 4 2 4-2 4-2';
        default:
            return 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z';
    }
};

export const getTypeLabel = (type: DiningLocation['type']): string => {
    switch (type) {
        case 'restaurant':
            return 'Restaurant';
        case 'cafe':
            return 'Cafe';
        case 'mess':
            return 'Mess Hall';
        case 'snack':
            return 'Snacks & Drinks';
        default:
            return type;
    }
};
