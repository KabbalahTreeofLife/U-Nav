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

// University-specific dining locations
const CPU_DINING: DiningLocation[] = [
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

// ISATU (ID: 6) Dining Locations
const ISATU_DINING: DiningLocation[] = [
    {
        id: 'isatu-cafeteria',
        name: 'ISATU Main Cafeteria',
        type: 'restaurant',
        building: 'Admin Building',
        floor: 1,
        operatingHours: '7:00 AM - 8:00 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'Asian', 'Snacks'],
        rating: 4.1,
        coordinates: { x: 0, y: 0 }
    },
    {
        id: 'isatu-coffee',
        name: 'ISATU Tech Cafe',
        type: 'cafe',
        building: 'Engineering Building',
        floor: 1,
        operatingHours: '6:30 AM - 9:00 PM',
        priceRange: '$$',
        cuisine: ['Coffee', 'Pastries', 'Light Meals'],
        rating: 4.3,
        coordinates: { x: 8, y: -3 }
    },
    {
        id: 'isatu-snack',
        name: 'Resource Center Snack Bar',
        type: 'snack',
        building: 'Resource Center',
        floor: 1,
        operatingHours: '8:00 AM - 6:00 PM',
        priceRange: '$',
        cuisine: ['Snacks', 'Beverages', 'Sandwiches'],
        rating: 3.9,
        coordinates: { x: -6, y: 5 }
    }
];

// WVSU (ID: 2) Dining Locations
const WVSU_DINING: DiningLocation[] = [
    {
        id: 'wvsu-mess',
        name: 'WVSU Student Mess',
        type: 'mess',
        building: 'Main Campus Building',
        floor: 1,
        operatingHours: '6:00 AM - 8:00 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'International'],
        rating: 4.0,
        coordinates: { x: 0, y: 0 }
    },
    {
        id: 'wvsu-cafe',
        name: 'Campus Coffee Lounge',
        type: 'cafe',
        building: 'Student Center',
        floor: 2,
        operatingHours: '7:00 AM - 8:00 PM',
        priceRange: '$$',
        cuisine: ['Coffee', 'Pastries', 'Smoothies'],
        rating: 4.2,
        coordinates: { x: 5, y: 3 }
    }
];

// UPV (ID: 3) Dining Locations
const UPV_DINING: DiningLocation[] = [
    {
        id: 'upv-cafeteria',
        name: 'Diliman Hall Cafeteria',
        type: 'restaurant',
        building: 'Diliman Hall',
        floor: 1,
        operatingHours: '6:30 AM - 7:30 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'Asian Fusion'],
        rating: 4.2,
        coordinates: { x: 0, y: 0 }
    },
    {
        id: 'upv-coffee',
        name: 'UP Coffee Station',
        type: 'cafe',
        building: 'University Center',
        floor: 1,
        operatingHours: '7:00 AM - 8:00 PM',
        priceRange: '$$',
        cuisine: ['Premium Coffee', 'Pastries', 'Desserts'],
        rating: 4.4,
        coordinates: { x: 8, y: 2 }
    }
];

// WIT (ID: 4) Dining Locations
const WIT_DINING: DiningLocation[] = [
    {
        id: 'wit-tech-cafe',
        name: 'WIT Tech Cafeteria',
        type: 'restaurant',
        building: 'Technology Building',
        floor: 1,
        operatingHours: '7:00 AM - 7:00 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'Fast Food', 'Healthy Options'],
        rating: 4.0,
        coordinates: { x: 0, y: 0 }
    },
    {
        id: 'wit-snack-bar',
        name: 'Innovation Hub Snack Bar',
        type: 'snack',
        building: 'Research Center',
        floor: 1,
        operatingHours: '24 Hours',
        priceRange: '$',
        cuisine: ['Snacks', 'Coffee', 'Energy Drinks'],
        rating: 3.8,
        coordinates: { x: 6, y: -4 }
    }
];

// USA (ID: 5) Dining Locations
const USA_DINING: DiningLocation[] = [
    {
        id: 'usa-agustin-hall',
        name: 'San Agustin Hall Dining',
        type: 'restaurant',
        building: 'San Agustin Hall',
        floor: 1,
        operatingHours: '6:00 AM - 8:00 PM',
        priceRange: '$',
        cuisine: ['Filipino', 'Continental'],
        rating: 4.1,
        coordinates: { x: 0, y: 0 }
    },
    {
        id: 'usa-cafe',
        name: 'Agustin Cafe',
        type: 'cafe',
        building: 'Quadrangle',
        floor: 1,
        operatingHours: '7:00 AM - 9:00 PM',
        priceRange: '$$',
        cuisine: ['Specialty Coffee', 'Baked Goods', 'Light Meals'],
        rating: 4.3,
        coordinates: { x: 5, y: 5 }
    }
];

// Map of university ID to dining locations
export const getDiningByUniversity = (universityId: number): DiningLocation[] => {
    const diningMap: { [key: number]: DiningLocation[] } = {
        1: CPU_DINING,
        2: WVSU_DINING,
        3: UPV_DINING,
        4: WIT_DINING,
        5: USA_DINING,
        6: ISATU_DINING,
    };
    return diningMap[universityId] || CPU_DINING; // Default to CPU if not found
};

export const diningLocations: DiningLocation[] = CPU_DINING;

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
