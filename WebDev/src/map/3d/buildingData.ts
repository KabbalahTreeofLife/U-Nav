import type { ModelPosition } from './geolocation';

export interface BuildingLocation {
    id: string;
    name: string;
    modelPosition: ModelPosition;
    floors: number;
    description?: string;
    categories: string[];
}

export interface RoomLocation {
    id: string;
    name: string;
    buildingId: string;
    floor: number;
    modelPosition: ModelPosition;
    capacity?: number;
}

const BUILDING_LOCATIONS: BuildingLocation[] = [
    {
        id: 'main-building',
        name: 'Main Building',
        modelPosition: { x: 0, y: 0, z: 0 },
        floors: 2,
        description: 'Central administrative and classroom building',
        categories: ['academic', 'administration'],
    },
    {
        id: 'library',
        name: 'Library',
        modelPosition: { x: 8, y: 0, z: -3 },
        floors: 1,
        description: 'Central library with study rooms',
        categories: ['library', 'study'],
    },
    {
        id: 'gymnasium',
        name: 'Gymnasium',
        modelPosition: { x: -6, y: 0, z: 5 },
        floors: 1,
        description: 'Sports and fitness center',
        categories: ['sports', 'fitness'],
    },
    {
        id: 'science-building',
        name: 'Science Building',
        modelPosition: { x: -8, y: 0, z: -4 },
        floors: 1,
        description: 'Science laboratories and classrooms',
        categories: ['academic', 'science'],
    },
    {
        id: 'canteen',
        name: 'Canteen',
        modelPosition: { x: 3, y: 0, z: 5 },
        floors: 1,
        description: 'Main campus canteen and food court',
        categories: ['dining', 'food'],
    },
    {
        id: 'auditorium',
        name: 'Auditorium',
        modelPosition: { x: -3, y: 0, z: -6 },
        floors: 1,
        description: 'Main auditorium for events and gatherings',
        categories: ['events', 'venue'],
    },
    {
        id: 'admin-building',
        name: 'Administration Building',
        modelPosition: { x: 5, y: 0, z: -7 },
        floors: 2,
        description: 'Administrative offices',
        categories: ['administration'],
    },
    {
        id: 'engineering-building',
        name: 'Engineering Building',
        modelPosition: { x: -10, y: 0, z: 2 },
        floors: 3,
        description: 'College of Engineering',
        categories: ['academic', 'engineering'],
    },
    {
        id: 'student-center',
        name: 'Student Center',
        modelPosition: { x: 2, y: 0, z: 8 },
        floors: 2,
        description: 'Student services and activities',
        categories: ['services', 'student'],
    },
    {
        id: 'parking-area',
        name: 'Parking Area',
        modelPosition: { x: 12, y: 0, z: 0 },
        floors: 1,
        description: 'Main parking lot',
        categories: ['parking'],
    },
];

const ROOM_LOCATIONS: RoomLocation[] = [
    {
        id: 'room-101',
        name: 'Room 101',
        buildingId: 'main-building',
        floor: 1,
        modelPosition: { x: 0, y: 0, z: 0 },
        capacity: 40,
    },
    {
        id: 'room-102',
        name: 'Room 102',
        buildingId: 'main-building',
        floor: 1,
        modelPosition: { x: 1.5, y: 0, z: 0 },
        capacity: 35,
    },
    {
        id: 'room-103',
        name: 'Room 103',
        buildingId: 'main-building',
        floor: 1,
        modelPosition: { x: 3, y: 0, z: 0 },
        capacity: 40,
    },
    {
        id: 'room-201',
        name: 'Room 201',
        buildingId: 'main-building',
        floor: 2,
        modelPosition: { x: 0, y: 0, z: 0 },
        capacity: 30,
    },
    {
        id: 'room-202',
        name: 'Room 202',
        buildingId: 'main-building',
        floor: 2,
        modelPosition: { x: 1.5, y: 0, z: 0 },
        capacity: 45,
    },
    {
        id: 'lib-reading-1',
        name: 'Reading Area 1',
        buildingId: 'library',
        floor: 1,
        modelPosition: { x: 8, y: 0, z: -3 },
        capacity: 50,
    },
    {
        id: 'lib-study-1',
        name: 'Study Room 1',
        buildingId: 'library',
        floor: 1,
        modelPosition: { x: 10.5, y: 0, z: -3 },
        capacity: 10,
    },
    {
        id: 'gym-court',
        name: 'Main Court',
        buildingId: 'gymnasium',
        floor: 1,
        modelPosition: { x: -6, y: 0, z: 5 },
        capacity: 200,
    },
    {
        id: 'chem-lab',
        name: 'Chemistry Lab',
        buildingId: 'science-building',
        floor: 1,
        modelPosition: { x: -8, y: 0, z: -4 },
        capacity: 25,
    },
    {
        id: 'bio-lab',
        name: 'Biology Lab',
        buildingId: 'science-building',
        floor: 1,
        modelPosition: { x: -6.5, y: 0, z: -4 },
        capacity: 25,
    },
];

export class BuildingDataService {
    private buildings: BuildingLocation[] = BUILDING_LOCATIONS;
    private rooms: RoomLocation[] = ROOM_LOCATIONS;

    getAllBuildings(): BuildingLocation[] {
        return this.buildings;
    }

    getBuildingById(id: string): BuildingLocation | undefined {
        return this.buildings.find(b => b.id === id);
    }

    getBuildingsByCategory(category: string): BuildingLocation[] {
        return this.buildings.filter(b => b.categories.includes(category));
    }

    searchBuildings(query: string): BuildingLocation[] {
        const lowerQuery = query.toLowerCase();
        return this.buildings.filter(
            b =>
                b.name.toLowerCase().includes(lowerQuery) ||
                b.description?.toLowerCase().includes(lowerQuery) ||
                b.categories.some(c => c.toLowerCase().includes(lowerQuery))
        );
    }

    getAllRooms(): RoomLocation[] {
        return this.rooms;
    }

    getRoomsByBuilding(buildingId: string): RoomLocation[] {
        return this.rooms.filter(r => r.buildingId === buildingId);
    }

    getRoomsByFloor(buildingId: string, floor: number): RoomLocation[] {
        return this.rooms.filter(r => r.buildingId === buildingId && r.floor === floor);
    }

    searchRooms(query: string): RoomLocation[] {
        const lowerQuery = query.toLowerCase();
        return this.rooms.filter(
            r =>
                r.name.toLowerCase().includes(lowerQuery) ||
                this.getBuildingById(r.buildingId)?.name.toLowerCase().includes(lowerQuery)
        );
    }

    searchAll(query: string): { buildings: BuildingLocation[]; rooms: RoomLocation[] } {
        const buildings = this.searchBuildings(query);
        const rooms = this.searchRooms(query);
        return { buildings, rooms };
    }

    addBuilding(building: BuildingLocation): void {
        this.buildings.push(building);
    }

    addRoom(room: RoomLocation): void {
        this.rooms.push(room);
    }
}

export const buildingDataService = new BuildingDataService();