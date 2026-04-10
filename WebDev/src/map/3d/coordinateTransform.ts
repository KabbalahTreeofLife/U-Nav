import type { ModelPosition } from './geolocation';

export interface AnchorPoint {
    modelPosition: ModelPosition;
    gpsPosition: {
        latitude: number;
        longitude: number;
    };
}

export interface CoordinateConfig {
    originAnchor: AnchorPoint;
    scaleMetersPerUnit: number;
    rotationDegrees: number;
}

const DEFAULT_CONFIG: CoordinateConfig = {
    originAnchor: {
        modelPosition: { x: 0, y: 0, z: 0 },
        gpsPosition: {
            latitude: 10.7308651,
            longitude: 122.5485796,
        },
    },
    scaleMetersPerUnit: 16.25,
    rotationDegrees: 52,
};

export class CoordinateTransformer {
    private config: CoordinateConfig;
    private rotationRadians: number;

    constructor(config: CoordinateConfig = DEFAULT_CONFIG) {
        this.config = config;
        this.rotationRadians = (config.rotationDegrees * Math.PI) / 180;
    }

    updateConfig(config: Partial<CoordinateConfig>): void {
        this.config = { ...this.config, ...config };
        if (config.rotationDegrees !== undefined) {
            this.rotationRadians = (config.rotationDegrees * Math.PI) / 180;
        }
    }

    private degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    gpsToModel(gps: { latitude: number; longitude: number }): ModelPosition {
        const { originAnchor } = this.config;
        
        const dNorth = (gps.latitude - originAnchor.gpsPosition.latitude) * 111320;
        const dEast = (gps.longitude - originAnchor.gpsPosition.longitude) * 111320 * Math.cos(this.degreesToRadians(originAnchor.gpsPosition.latitude));
        
        const rawX = dEast / 16.25;
        const rawZ = dNorth / 16.25;
        
        const angle = this.degreesToRadians(-55);
        
        const rotatedX = rawX * Math.cos(angle) - rawZ * Math.sin(angle);
        const rotatedZ = rawX * Math.sin(angle) + rawZ * Math.cos(angle);
        
        return {
            x: -rotatedZ,
            y: 0,
            z: rotatedX,
        };
    }

    modelToGPS(model: ModelPosition): { latitude: number; longitude: number } {
        const { originAnchor } = this.config;
        
        const unrotatedX = -model.z;
        const unrotatedZ = model.x;
        
        const angle = this.degreesToRadians(-55);
        const unrotatedX2 = unrotatedX * Math.cos(angle) - unrotatedZ * Math.sin(angle);
        const unrotatedZ2 = unrotatedX * Math.sin(angle) + unrotatedZ * Math.cos(angle);
        
        const dEast = unrotatedX2 * 16.25;
        const dNorth = unrotatedZ2 * 16.25;
        
        const latDiff = dNorth / 111320;
        const lonDiff = dEast / (111320 * Math.cos(this.degreesToRadians(originAnchor.gpsPosition.latitude)));
        
        return {
            latitude: originAnchor.gpsPosition.latitude + latDiff,
            longitude: originAnchor.gpsPosition.longitude + lonDiff,
        };
    }

    calculateDistance(pos1: ModelPosition, pos2: ModelPosition): number {
        const dx = pos2.x - pos1.x;
        const dz = pos2.z - pos1.z;
        const distanceUnits = Math.sqrt(dx * dx + dz * dz);
        return distanceUnits * this.config.scaleMetersPerUnit;
    }

    calculateDistanceGPS(
        gps1: { latitude: number; longitude: number },
        gps2: { latitude: number; longitude: number }
    ): number {
        const R = 6371000;
        const lat1 = this.degreesToRadians(gps1.latitude);
        const lat2 = this.degreesToRadians(gps2.latitude);
        const deltaLat = this.degreesToRadians(gps2.latitude - gps1.latitude);
        const deltaLon = this.degreesToRadians(gps2.longitude - gps1.longitude);

        const a =
            Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    getScale(): number {
        return this.config.scaleMetersPerUnit;
    }

    getRotation(): number {
        return this.config.rotationDegrees;
    }
}

export const coordinateTransformer = new CoordinateTransformer();