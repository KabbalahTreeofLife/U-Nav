import type { Building, MapConfig } from './types';

export const DEFAULT_MAP_CONFIG: MapConfig = {
    cameraPosition: [15, 15, 15],
    cameraTarget: [0, 0, 0],
    zoomLevel: 1,
};

export const DEFAULT_BUILDINGS: Building[] = [
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
];
