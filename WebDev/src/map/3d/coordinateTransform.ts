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
            latitude: 10.730364,
            longitude: 122.549244,
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
        const { originAnchor, scaleMetersPerUnit } = this.config;
        
        const latDiff = gps.latitude - originAnchor.gpsPosition.latitude;
        const lonDiff = gps.longitude - originAnchor.gpsPosition.longitude;
        
        const latMeters = latDiff * 111320;
        const lonMeters = lonDiff * 111320 * Math.cos(this.degreesToRadians(originAnchor.gpsPosition.latitude));
        
        const rawX = lonMeters / scaleMetersPerUnit;
        const rawZ = latMeters / scaleMetersPerUnit;
        
        const rotatedX = rawX * Math.cos(-this.rotationRadians) - rawZ * Math.sin(-this.rotationRadians);
        const rotatedZ = rawX * Math.sin(-this.rotationRadians) + rawZ * Math.cos(-this.rotationRadians);
        
        return {
            x: rotatedX,
            y: 0,
            z: rotatedZ,
        };
    }

    modelToGPS(model: ModelPosition): { latitude: number; longitude: number } {
        const { originAnchor, scaleMetersPerUnit } = this.config;
        
        const rotatedX = model.x * Math.cos(this.rotationRadians) - model.z * Math.sin(this.rotationRadians);
        const rotatedZ = model.x * Math.sin(this.rotationRadians) + model.z * Math.cos(this.rotationRadians);
        
        const lonMeters = rotatedX * scaleMetersPerUnit;
        const latMeters = rotatedZ * scaleMetersPerUnit;
        
        const latDiff = latMeters / 111320;
        const lonDiff = lonMeters / (111320 * Math.cos(this.degreesToRadians(originAnchor.gpsPosition.latitude)));
        
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