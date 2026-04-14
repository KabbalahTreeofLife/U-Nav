export interface Building {
    id: string;
    name: string;
    description: string;
    position: [number, number, number];
    size: [number, number, number];
    rotation?: number;
    floors: Floor[];
}

export interface Floor {
    id: string;
    floorNumber: number;
    rooms: Room[];
}

export interface Room {
    id: string;
    name: string;
    position: { x: number; y: number; width: number; height: number };
    subject?: string;
    stubCode?: string;
    section?: string;
    teacher?: string;
    capacity: number;
    currentOccupancy: number;
}

export interface MapConfig {
    cameraPosition: [number, number, number];
    cameraTarget: [number, number, number];
    zoomLevel: number;
    originLat?: number;
    originLon?: number;
    metersPerUnit?: number;
}
