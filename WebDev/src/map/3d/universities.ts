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
    originLat: 10.730865,
    originLon: 122.548580,
    metersPerUnit: 16.25,
};

// GLB Scale helper for calculations
const S = 11.523;

export const UNIVERSITY_MAPS: UniversityMap[] = [
    {
        id: 1,
        name: 'Central Philippine University',
        glbFile: '/models/CentralMap.glb',
        config: DEFAULT_MAP_CONFIG,
        buildings: [
            { id: 'Building_Admin', name: 'Admin Building', description: 'Main administrative offices', position: [0.851 * S, 0, -0.634 * S], size: [0.4 * S, 0.3 * S, 0.4 * S], floors: [] },
            { id: 'Building_Background', name: 'Background', description: 'Background area', position: [0.398 * S, 0, 0.824 * S], size: [2 * S, 0.5 * S, 1.5 * S], floors: [] },
            { id: 'Building_Church', name: 'Chapel', description: 'School chapel and religious services', position: [-0.483 * S, 0, 0.689 * S], size: [0.5 * S, 0.4 * S, 0.4 * S], floors: [] },
            { id: 'Building_Elementary', name: 'Elementary School', description: 'Elementary school building', position: [1.066 * S, 0, -0.277 * S], size: [0.6 * S, 0.4 * S, 0.5 * S], floors: [] },
            { id: 'Building_Engineering', name: 'College of Engineering', description: 'Engineering and technology facilities', position: [-0.461 * S, 0, -0.014 * S], size: [0.7 * S, 0.5 * S, 0.6 * S], floors: [] },
            { id: 'Building_EXCEL', name: 'EXCEL Building', description: 'EXCEL learning center', position: [0.62 * S, 0, -0.407 * S], size: [0.4 * S, 0.3 * S, 0.4 * S], floors: [] },
            { id: 'Building_FranklinHall', name: 'Franklin Hall', description: 'Academic building', position: [-0.171 * S, 0, -0.315 * S], size: [0.5 * S, 0.35 * S, 0.4 * S], floors: [] },
            { id: 'Building_HSgym', name: 'High School Gym', description: 'High school gymnasium', position: [-0.873 * S, 0, -0.682 * S], size: [0.7 * S, 0.5 * S, 0.6 * S], floors: [] },
            { id: 'Building_JohnsonHall', name: 'Johnson Hall', description: 'Residential hall', position: [0.911 * S, 0, 0.261 * S], size: [0.4 * S, 0.35 * S, 0.5 * S], floors: [] },
            { id: 'Building_JuniorHigh', name: 'Junior High School', description: 'Junior high school building', position: [-0.615 * S, 0, -0.558 * S], size: [0.7 * S, 0.45 * S, 0.6 * S], floors: [] },
            { id: 'Building_Kindergarten', name: 'Kindergarten', description: 'Kindergarten building', position: [-0.422 * S, 0, 0.855 * S], size: [0.5 * S, 0.35 * S, 0.4 * S], floors: [] },
            { id: 'Building_LDT', name: 'LDT Building', description: 'Learning development and training', position: [0.469 * S, 0, 0.285 * S], size: [0.4 * S, 0.3 * S, 0.4 * S], floors: [] },
            { id: 'Building_LEB', name: 'LEB Building', description: 'Laboratory and evaluation building', position: [-0.437 * S, 0, -0.902 * S], size: [0.5 * S, 0.35 * S, 0.4 * S], floors: [] },
            { id: 'Building_Library', name: 'Henry Luce Library', description: 'Main school library', position: [0.307 * S, 0, 0.586 * S], size: [0.5 * S, 0.45 * S, 0.5 * S], floors: [] },
            { id: 'Building_LopezMemorial', name: 'Lopez Memorial', description: 'Memorial building', position: [-0.272 * S, 0, -0.866 * S], size: [0.35 * S, 0.3 * S, 0.35 * S], floors: [] },
            { id: 'Building_MaryThomas', name: 'Mary Thomas Building', description: 'Academic building', position: [-0.1 * S, 0, -1.212 * S], size: [0.5 * S, 0.35 * S, 0.4 * S], floors: [] },
            { id: 'Building_NewValentine', name: 'New Valentine', description: 'Valentine building (new)', position: [0.176 * S, 0, -0.789 * S], size: [0.35 * S, 0.3 * S, 0.35 * S], floors: [] },
            { id: 'Building_OldValentine', name: 'Old Valentine', description: 'Valentine building (old)', position: [0.083 * S, 0, -1.046 * S], size: [0.35 * S, 0.3 * S, 0.35 * S], floors: [] },
            { id: 'Building_Packaging', name: 'Packaging Center', description: 'Packaging and logistics', position: [-0.471 * S, 0, -0.347 * S], size: [0.35 * S, 0.3 * S, 0.35 * S], floors: [] },
            { id: 'Building_Promenade', name: 'Promenade', description: 'Walkway and promenade area', position: [0.471 * S, 0, -0.541 * S], size: [0.35 * S, 0.2 * S, 0.35 * S], floors: [] },
            { id: 'Building_Registrar', name: 'Registrar Office', description: 'Registrar building', position: [0.631 * S, 0, 0.321 * S], size: [0.35 * S, 0.3 * S, 0.35 * S], floors: [] },
            { id: 'Building_Roblee', name: 'Roblee Hall', description: 'Academic hall', position: [0.001 * S, 0, -0.581 * S], size: [0.5 * S, 0.35 * S, 0.4 * S], floors: [] },
            { id: 'Building_RoseMemorial', name: 'Rose Memorial Auditorium', description: 'Main auditorium', position: [0.039 * S, 0, 0.888 * S], size: [0.5 * S, 0.45 * S, 0.5 * S], floors: [] },
            { id: 'Building_SeniorHigh', name: 'Senior High School', description: 'Senior high school building', position: [-0.643 * S, 0, -0.98 * S], size: [0.7 * S, 0.5 * S, 0.6 * S], floors: [] },
            { id: 'Building_UniversityGym', name: 'University Gym', description: 'University gymnasium', position: [-0.177 * S, 0, 1.257 * S], size: [0.7 * S, 0.5 * S, 0.6 * S], floors: [] },
            { id: 'Building_Uy', name: 'Uy Building', description: 'Academic building', position: [-0.294 * S, 0, -0.544 * S], size: [0.35 * S, 0.3 * S, 0.35 * S], floors: [] },
            { id: 'Building_WestonHall', name: 'Weston Hall', description: 'Residential and academic hall', position: [0.643 * S, 0, -0.029 * S], size: [0.4 * S, 0.35 * S, 0.5 * S], floors: [] },
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
        description: 'Default main building for guests',
        position: [0, 0, 0],
        size: [4, 3, 6],
        floors: [],
    },
];
