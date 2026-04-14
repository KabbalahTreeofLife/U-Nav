import type { ModelPosition } from './geolocation';
import { UNIVERSITY_MAPS } from './universities';

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

const S = 11.523;

const CPU_BUILDING_LOCATIONS: BuildingLocation[] = [
    {
        id: 'Building_Admin',
        name: 'Admin Building',
        modelPosition: { x: 0.851 * S, y: 0, z: -0.634 * S },
        floors: 1,
        description: 'Main administrative offices',
        categories: ['administration'],
    },
    {
        id: 'Building_Church',
        name: 'University Church',
        modelPosition: { x: -0.483 * S, y: 0, z: 0.689 * S },
        floors: 1,
        description: 'School chapel and religious services',
        categories: ['chapel', 'religious'],
    },
    {
        id: 'Building_Engineering',
        name: 'College of Engineering',
        modelPosition: { x: -0.461 * S, y: 0, z: -0.014 * S },
        floors: 1,
        description: 'Engineering and technology facilities',
        categories: ['academic', 'engineering'],
    },
    {
        id: 'Building_Library',
        name: 'Henry Luce Library',
        modelPosition: { x: 0.307 * S, y: 0, z: 0.586 * S },
        floors: 1,
        description: 'Main school library',
        categories: ['library', 'study'],
    },
    {
        id: 'Building_RoseMemorial',
        name: 'Rose Memorial Auditorium',
        modelPosition: { x: 0.039 * S, y: 0, z: 0.888 * S },
        floors: 1,
        description: 'Main auditorium',
        categories: ['events', 'auditorium'],
    },
    {
        id: 'Building_UniversityGym',
        name: 'University Gym',
        modelPosition: { x: -0.177 * S, y: 0, z: 1.257 * S },
        floors: 1,
        description: 'University gymnasium',
        categories: ['sports', 'gym'],
    },
];

export class BuildingDataService {
    private currentUniversityId: number = 1;
    private customRooms: RoomLocation[] = [];

    setUniversityId(id: number): void {
        this.currentUniversityId = id;
    }

    private getBuildings(): BuildingLocation[] {
        if (this.currentUniversityId === 1) {
            return CPU_BUILDING_LOCATIONS;
        }

        const uni = UNIVERSITY_MAPS.find(m => m.id === this.currentUniversityId);
        if (!uni) return [];

        return uni.buildings.map(b => ({
            id: b.id,
            name: b.name,
            modelPosition: { x: b.position[0], y: b.position[1], z: b.position[2] },
            floors: b.floors?.length || 1,
            description: b.description || b.name,
            categories: ['academic']
        }));
    }

    private getRooms(): RoomLocation[] {
        return this.customRooms;
    }

    getAllBuildings(): BuildingLocation[] {
        return this.getBuildings();
    }

    getBuildingById(id: string): BuildingLocation | undefined {
        return this.getBuildings().find(b => b.id === id);
    }

    getBuildingsByCategory(category: string): BuildingLocation[] {
        return this.getBuildings().filter(b => b.categories.includes(category));
    }

    searchBuildings(query: string): BuildingLocation[] {
        const lowerQuery = query.toLowerCase();
        return this.getBuildings().filter(
            b =>
                b.name.toLowerCase().includes(lowerQuery) ||
                b.description?.toLowerCase().includes(lowerQuery) ||
                b.categories.some(c => c.toLowerCase().includes(lowerQuery))
        );
    }

    getAllRooms(): RoomLocation[] {
        return this.getRooms();
    }

    getRoomsByBuilding(buildingId: string): RoomLocation[] {
        return this.getRooms().filter(r => r.buildingId === buildingId);
    }

    getRoomsByFloor(buildingId: string, floor: number): RoomLocation[] {
        return this.getRooms().filter(r => r.buildingId === buildingId && r.floor === floor);
    }

    searchRooms(query: string): RoomLocation[] {
        const lowerQuery = query.toLowerCase();
        return this.getRooms().filter(r => r.name.toLowerCase().includes(lowerQuery));
    }

    searchAll(query: string): { buildings: BuildingLocation[]; rooms: RoomLocation[] } {
        return {
            buildings: this.searchBuildings(query),
            rooms: this.searchRooms(query),
        };
    }

    addRoom(room: RoomLocation): void {
        this.customRooms.push(room);
    }
}

export const buildingDataService = new BuildingDataService();