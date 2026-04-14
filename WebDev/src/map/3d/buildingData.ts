import type { ModelPosition } from './geolocation';

export interface BuildingLocation {
    id: string;
    name: string;
    modelPosition: ModelPosition;
    floors: number;
    description?: string;
    categories: string[];
}

const BUILDING_LOCATIONS: BuildingLocation[] = [
    {
        id: 'Building_Admin',
        name: 'Admin Building',
        modelPosition: { x: 9.8, y: 0, z: -7.3 },
        floors: 1,
        description: 'Main administrative offices',
        categories: ['administration'],
    },
    {
        id: 'Building_Church',
        name: 'University Church',
        modelPosition: { x: -5.6, y: 0, z: 7.9 },
        floors: 1,
        description: 'School chapel and religious services',
        categories: ['chapel', 'religious'],
    },
    {
        id: 'Building_Elementary',
        name: 'Elementary School',
        modelPosition: { x: 12.3, y: 0, z: -3.2 },
        floors: 1,
        description: 'Elementary school building',
        categories: ['academic', 'elementary'],
    },
    {
        id: 'Building_Engineering',
        name: 'College of Engineering',
        modelPosition: { x: -5.3, y: 0, z: -0.2 },
        floors: 1,
        description: 'Engineering and technology facilities',
        categories: ['academic', 'engineering'],
    },
    {
        id: 'Building_EXCEL',
        name: 'EXCEL Building',
        modelPosition: { x: 7.1, y: 0, z: -4.7 },
        floors: 1,
        description: 'EXCEL learning center',
        categories: ['academic', 'learning'],
    },
    {
        id: 'Building_FranklinHall',
        name: 'Franklin Hall',
        modelPosition: { x: -2.0, y: 0, z: -3.6 },
        floors: 1,
        description: 'Academic building',
        categories: ['academic'],
    },
    {
        id: 'Building_HSgym',
        name: 'High School Gym',
        modelPosition: { x: -10.1, y: 0, z: -7.9 },
        floors: 1,
        description: 'High school gymnasium',
        categories: ['sports', 'gym'],
    },
    {
        id: 'Building_JohnsonHall',
        name: 'Johnson Hall',
        modelPosition: { x: 10.5, y: 0, z: 3.0 },
        floors: 1,
        description: 'Residential hall',
        categories: ['dormitory', 'residential'],
    },
    {
        id: 'Building_JuniorHigh',
        name: 'Junior High School',
        modelPosition: { x: -7.1, y: 0, z: -6.4 },
        floors: 1,
        description: 'Junior high school building',
        categories: ['academic', 'juniorhigh'],
    },
    {
        id: 'Building_Kindergarten',
        name: 'Kindergarten',
        modelPosition: { x: -4.9, y: 0, z: 9.8 },
        floors: 1,
        description: 'Kindergarten building',
        categories: ['academic', 'kindergarten'],
    },
    {
        id: 'Building_LDT',
        name: 'LDT Building',
        modelPosition: { x: 5.4, y: 0, z: 3.3 },
        floors: 1,
        description: 'Learning development and training',
        categories: ['academic', 'training'],
    },
    {
        id: 'Building_LEB',
        name: 'LEB Building',
        modelPosition: { x: -5.0, y: 0, z: -10.4 },
        floors: 1,
        description: 'Laboratory and evaluation building',
        categories: ['academic', 'laboratory'],
    },
    {
        id: 'Building_Library',
        name: 'Henry Luce Library',
        modelPosition: { x: 3.5, y: 0, z: 6.7 },
        floors: 1,
        description: 'Main school library',
        categories: ['library', 'study'],
    },
    {
        id: 'Building_LopezMemorial',
        name: 'Lopez Memorial',
        modelPosition: { x: -3.1, y: 0, z: -10.0 },
        floors: 1,
        description: 'Memorial building',
        categories: ['memorial'],
    },
    {
        id: 'Building_MaryThomas',
        name: 'Mary Thomas Building',
        modelPosition: { x: -1.2, y: 0, z: -14.0 },
        floors: 1,
        description: 'Academic building',
        categories: ['academic'],
    },
    {
        id: 'Building_NewValentine',
        name: 'New Valentine',
        modelPosition: { x: 2.0, y: 0, z: -9.1 },
        floors: 1,
        description: 'Valentine building (new)',
        categories: ['academic'],
    },
    {
        id: 'Building_OldValentine',
        name: 'Old Valentine',
        modelPosition: { x: 1.0, y: 0, z: -12.0 },
        floors: 1,
        description: 'Valentine building (old)',
        categories: ['academic'],
    },
    {
        id: 'Building_Packaging',
        name: 'Packaging Center',
        modelPosition: { x: -5.4, y: 0, z: -4.0 },
        floors: 1,
        description: 'Packaging and logistics',
        categories: ['services'],
    },
    {
        id: 'Building_Promenade',
        name: 'Promenade',
        modelPosition: { x: 5.4, y: 0, z: -6.2 },
        floors: 1,
        description: 'Walkway and promenade area',
        categories: ['outdoor'],
    },
    {
        id: 'Building_Registrar',
        name: 'Registrar Office',
        modelPosition: { x: 7.3, y: 0, z: 3.7 },
        floors: 1,
        description: 'Registrar building',
        categories: ['administration'],
    },
    {
        id: 'Building_Roblee',
        name: 'Roblee Hall',
        modelPosition: { x: 0.0, y: 0, z: -6.7 },
        floors: 1,
        description: 'Academic hall',
        categories: ['academic'],
    },
    {
        id: 'Building_RoseMemorial',
        name: 'Rose Memorial Auditorium',
        modelPosition: { x: 0.4, y: 0, z: 10.2 },
        floors: 1,
        description: 'Main auditorium',
        categories: ['events', 'auditorium'],
    },
    {
        id: 'Building_SeniorHigh',
        name: 'Senior High School',
        modelPosition: { x: -7.4, y: 0, z: -11.3 },
        floors: 1,
        description: 'Senior high school building',
        categories: ['academic', 'seniorhigh'],
    },
    {
        id: 'Building_UniversityGym',
        name: 'University Gym',
        modelPosition: { x: -2.0, y: 0, z: 14.5 },
        floors: 1,
        description: 'University gymnasium',
        categories: ['sports', 'gym'],
    },
    {
        id: 'Building_Uy',
        name: 'Uy Building',
        modelPosition: { x: -3.4, y: 0, z: -6.3 },
        floors: 1,
        description: 'Academic building',
        categories: ['academic'],
    },
    {
        id: 'Building_WestonHall',
        name: 'Weston Hall',
        modelPosition: { x: 7.4, y: 0, z: -0.3 },
        floors: 1,
        description: 'Residential and academic hall',
        categories: ['academic', 'residential'],
    },
];

const ROOM_LOCATIONS: { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] = [];

export class BuildingDataService {
    private buildings: BuildingLocation[] = BUILDING_LOCATIONS;
    private rooms: { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] = ROOM_LOCATIONS;

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

    getAllRooms(): { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] {
        return this.rooms;
    }

    getRoomsByBuilding(buildingId: string): { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] {
        return this.rooms.filter(r => r.buildingId === buildingId);
    }

    getRoomsByFloor(buildingId: string, floor: number): { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] {
        return this.rooms.filter(r => r.buildingId === buildingId && r.floor === floor);
    }

    searchRooms(query: string): { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] {
        const lowerQuery = query.toLowerCase();
        return this.rooms.filter(r => r.name.toLowerCase().includes(lowerQuery));
    }

    searchAll(query: string): { buildings: BuildingLocation[]; rooms: { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }[] } {
        return {
            buildings: this.searchBuildings(query),
            rooms: this.searchRooms(query),
        };
    }

    addRoom(room: { id: string; name: string; buildingId: string; floor: number; modelPosition: ModelPosition; capacity?: number; }): void {
        this.rooms.push(room);
    }
}

export const buildingDataService = new BuildingDataService();