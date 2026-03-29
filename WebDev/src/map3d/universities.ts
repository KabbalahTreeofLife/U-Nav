import type { Building, MapConfig } from './types';

export interface UniversityMap {
    id: number;
    name: string;
    glbFile: string;
    buildings: Building[];
    config: MapConfig;
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
    cameraPosition: [15, 15, 15],
    cameraTarget: [0, 0, 0],
    zoomLevel: 1,
};

export const UNIVERSITY_MAPS: UniversityMap[] = [
    {
        id: 1,
        name: 'Central Philippine University',
        glbFile: '/models/CPU-3d_map.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            {
                id: 'main-building',
                name: 'Main Building',
                position: [0, 0, 0],
                size: [4, 3, 6],
                floors: [
                    {
                        id: 'main-building-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'room-101', name: 'Room 101', position: { x: 0, y: 0, width: 1, height: 1 }, subject: 'Mathematics 1', stubCode: 'MATH 101', section: 'A', teacher: 'Prof. Juan Dela Cruz', capacity: 40, currentOccupancy: 35 },
                            { id: 'room-102', name: 'Room 102', position: { x: 1.5, y: 0, width: 1, height: 1 }, subject: 'English 1', stubCode: 'ENG 101', section: 'A', teacher: 'Prof. Maria Santos', capacity: 35, currentOccupancy: 30 },
                            { id: 'room-103', name: 'Room 103', position: { x: 3, y: 0, width: 1, height: 1 }, subject: 'Physics 1', stubCode: 'PHYS 101', section: 'A', teacher: 'Prof. Pedro Reyes', capacity: 40, currentOccupancy: 20 },
                        ],
                    },
                    {
                        id: 'main-building-floor-2',
                        floorNumber: 2,
                        rooms: [
                            { id: 'room-201', name: 'Room 201', position: { x: 0, y: 0, width: 1, height: 1 }, subject: 'Computer Science 1', stubCode: 'CS 101', section: 'A', teacher: 'Prof. Ana Garcia', capacity: 30, currentOccupancy: 28 },
                            { id: 'room-202', name: 'Room 202', position: { x: 1.5, y: 0, width: 1, height: 1 }, subject: 'History 1', stubCode: 'HIST 101', section: 'A', teacher: 'Prof. Jose Cruz', capacity: 45, currentOccupancy: 40 },
                        ],
                    },
                ],
            },
            {
                id: 'library',
                name: 'Library',
                position: [8, 0, -3],
                size: [3, 2, 4],
                floors: [
                    {
                        id: 'library-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'lib-room-1', name: 'Reading Area 1', position: { x: 0, y: 0, width: 2, height: 2 }, capacity: 50, currentOccupancy: 45 },
                            { id: 'lib-room-2', name: 'Study Room 1', position: { x: 2.5, y: 0, width: 1, height: 1 }, capacity: 10, currentOccupancy: 8 },
                        ],
                    },
                ],
            },
            {
                id: 'gymnasium',
                name: 'Gymnasium',
                position: [-6, 0, 5],
                size: [5, 1.5, 4],
                floors: [
                    {
                        id: 'gym-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'gym-court', name: 'Main Court', position: { x: 0, y: 0, width: 4, height: 3 }, capacity: 200, currentOccupancy: 150 },
                        ],
                    },
                ],
            },
            {
                id: 'science-building',
                name: 'Science Building',
                position: [-8, 0, -4],
                size: [3.5, 2.5, 5],
                floors: [
                    {
                        id: 'science-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'lab-101', name: 'Chemistry Lab', position: { x: 0, y: 0, width: 1.5, height: 1.5 }, subject: 'Chemistry 1', stubCode: 'CHEM 101', section: 'A', teacher: 'Prof. Lisa Wong', capacity: 25, currentOccupancy: 22 },
                            { id: 'lab-102', name: 'Biology Lab', position: { x: 2, y: 0, width: 1.5, height: 1.5 }, subject: 'Biology 1', stubCode: 'BIO 101', section: 'A', teacher: 'Prof. Mark Lee', capacity: 25, currentOccupancy: 18 },
                        ],
                    },
                ],
            },
            {
                id: 'canteen',
                name: 'Canteen',
                position: [3, 0, 5],
                size: [4, 1, 3],
                floors: [
                    {
                        id: 'canteen-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'canteen-1', name: 'Food Court A', position: { x: 0, y: 0, width: 2, height: 2 }, capacity: 100, currentOccupancy: 80 },
                            { id: 'canteen-2', name: 'Food Court B', position: { x: 2.5, y: 0, width: 2, height: 2 }, capacity: 100, currentOccupancy: 65 },
                        ],
                    },
                ],
            },
        ],
    },
    // ISATU - ID 6
    {
        id: 6,
        name: 'Institute of Science and Technology University',
        glbFile: '/models/ISATU-3d_map.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            {
                id: 'isatu-main-building',
                name: 'Admin Building',
                position: [0, 0, 0],
                size: [5, 3, 7],
                floors: [
                    {
                        id: 'isatu-main-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'isatu-room-101', name: 'Office 101', position: { x: 0, y: 0, width: 1, height: 1 }, subject: 'Administrative Services', stubCode: 'ADMIN 101', section: 'A', teacher: 'Dr. Rosa Martinez', capacity: 20, currentOccupancy: 15 },
                            { id: 'isatu-room-102', name: 'Conference Room', position: { x: 1.5, y: 0, width: 1.5, height: 1 }, subject: 'Meetings', stubCode: 'CONF 101', section: 'A', teacher: 'Staff', capacity: 30, currentOccupancy: 20 },
                        ],
                    },
                ],
            },
            {
                id: 'isatu-engineering',
                name: 'Engineering Building',
                position: [8, 0, -3],
                size: [4, 3, 5],
                floors: [
                    {
                        id: 'isatu-eng-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'isatu-lab-1', name: 'Engineering Lab 1', position: { x: 0, y: 0, width: 2, height: 2 }, subject: 'Electronics', stubCode: 'ENG 201', section: 'A', teacher: 'Prof. Ricardo Santos', capacity: 30, currentOccupancy: 28 },
                            { id: 'isatu-lab-2', name: 'Engineering Lab 2', position: { x: 2.5, y: 0, width: 2, height: 2 }, subject: 'Mechanics', stubCode: 'ENG 202', section: 'B', teacher: 'Prof. Antonio Reyes', capacity: 30, currentOccupancy: 25 },
                        ],
                    },
                ],
            },
            {
                id: 'isatu-library',
                name: 'Resource Center',
                position: [-6, 0, 5],
                size: [3, 2, 4],
                floors: [
                    {
                        id: 'isatu-lib-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'isatu-lib-1', name: 'Reading Area', position: { x: 0, y: 0, width: 2, height: 2 }, capacity: 60, currentOccupancy: 50 },
                        ],
                    },
                ],
            },
        ],
    },
    // WVSU - ID 2
    {
        id: 2,
        name: 'West Visayas State University',
        glbFile: '/models/WVSU-3d_map.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            {
                id: 'wvsu-main',
                name: 'Main Campus Building',
                position: [0, 0, 0],
                size: [5, 3, 6],
                floors: [
                    {
                        id: 'wvsu-main-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'wvsu-room-101', name: 'Lecture Hall 101', position: { x: 0, y: 0, width: 2, height: 1.5 }, subject: 'General Education', stubCode: 'GE 101', section: 'A', teacher: 'Prof. Ferdinand Cruz', capacity: 100, currentOccupancy: 85 },
                        ],
                    },
                ],
            },
        ],
    },
    // UPV - ID 3
    {
        id: 3,
        name: 'University of the Philippines - Visayas',
        glbFile: '/models/UPV-3d_map.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            {
                id: 'upv-main',
                name: 'Diliman Hall',
                position: [0, 0, 0],
                size: [5, 3, 6],
                floors: [
                    {
                        id: 'upv-main-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'upv-room-101', name: 'Classroom 101', position: { x: 0, y: 0, width: 1.5, height: 1.5 }, subject: 'Advanced Science', stubCode: 'ASCI 201', section: 'A', teacher: 'Prof. Emilio Lopez', capacity: 50, currentOccupancy: 45 },
                        ],
                    },
                ],
            },
        ],
    },
    // WIT - ID 4
    {
        id: 4,
        name: 'Western Institute of Technology',
        glbFile: '/models/WIT-3d_map.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            {
                id: 'wit-main',
                name: 'Technology Building',
                position: [0, 0, 0],
                size: [5, 3, 6],
                floors: [
                    {
                        id: 'wit-main-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'wit-lab-101', name: 'Computer Lab', position: { x: 0, y: 0, width: 2, height: 1.5 }, subject: 'Information Technology', stubCode: 'IT 101', section: 'A', teacher: 'Prof. Christine Torres', capacity: 40, currentOccupancy: 38 },
                        ],
                    },
                ],
            },
        ],
    },
    // USA - ID 5
    {
        id: 5,
        name: 'University of San Agustin',
        glbFile: '/models/USA-3d_map.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            {
                id: 'usa-main',
                name: 'San Agustin Hall',
                position: [0, 0, 0],
                size: [5, 3, 6],
                floors: [
                    {
                        id: 'usa-main-floor-1',
                        floorNumber: 1,
                        rooms: [
                            { id: 'usa-room-101', name: 'Liberal Arts Room', position: { x: 0, y: 0, width: 1.5, height: 1.5 }, subject: 'Philosophy', stubCode: 'PHIL 101', section: 'A', teacher: 'Prof. Gregorio Morales', capacity: 40, currentOccupancy: 35 },
                        ],
                    },
                ],
            },
        ],
    },
];

export const getUniversityMap = (universityId: number): UniversityMap | undefined => {
    return UNIVERSITY_MAPS.find(m => m.id === universityId);
};

export const getDefaultMap = (): UniversityMap => {
    return UNIVERSITY_MAPS[0];
};

export const GUEST_BUILDINGS: Building[] = [
    {
        id: 'guest-main-building',
        name: 'Main Building',
        position: [0, 0, 0],
        size: [4, 3, 6],
        floors: [],
    },
    {
        id: 'guest-library',
        name: 'Library',
        position: [8, 0, -3],
        size: [3, 2, 4],
        floors: [],
    },
    {
        id: 'guest-gymnasium',
        name: 'Gymnasium',
        position: [-6, 0, 5],
        size: [5, 1.5, 4],
        floors: [],
    },
    {
        id: 'guest-science-building',
        name: 'Science Building',
        position: [-8, 0, -4],
        size: [3.5, 2.5, 5],
        floors: [],
    },
    {
        id: 'guest-canteen',
        name: 'Canteen',
        position: [3, 0, 5],
        size: [4, 1, 3],
        floors: [],
    },
];
