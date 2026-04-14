import type { ModelPosition } from './geolocation';

export interface CoordinateConfig {
    originLat: number;
    originLon: number;
    metersPerUnit: number;
}

const DEFAULT_CONFIG: CoordinateConfig = {
    originLat: 10.7308651,
    originLon: 122.5485796,
    metersPerUnit: 16.25,
};

const DEGREES_TO_METERS = 111320;

export class CoordinateTransformer {
    private config: CoordinateConfig;

    constructor(config: CoordinateConfig = DEFAULT_CONFIG) {
        this.config = config;
    }

    updateConfig(config: Partial<CoordinateConfig>): void {
        this.config = { ...this.config, ...config };
    }

    updateFromMapConfig(mapConfig: any): void {
        const newConfig: CoordinateConfig = {
            originLat: mapConfig.originLat || DEFAULT_CONFIG.originLat,
            originLon: mapConfig.originLon || DEFAULT_CONFIG.originLon,
            metersPerUnit: mapConfig.metersPerUnit || DEFAULT_CONFIG.metersPerUnit,
        };
        this.updateConfig(newConfig);
    }

    gpsToModel(gps: { latitude: number; longitude: number }): ModelPosition {
        const dNorth = (gps.latitude - this.config.originLat) * DEGREES_TO_METERS;
        const dEast = (gps.longitude - this.config.originLon) * DEGREES_TO_METERS * Math.cos(this.config.originLat * Math.PI / 180);

        return {
            x: dEast / this.config.metersPerUnit,
            y: 0,
            z: -dNorth / this.config.metersPerUnit,
        };
    }

    modelToGPS(model: ModelPosition): { latitude: number; longitude: number } {
        const dNorth = -model.z * this.config.metersPerUnit;
        const dEast = model.x * this.config.metersPerUnit;

        return {
            latitude: this.config.originLat + dNorth / DEGREES_TO_METERS,
            longitude: this.config.originLon + dEast / (DEGREES_TO_METERS * Math.cos(this.config.originLat * Math.PI / 180)),
        };
    }

    calculateDistance(pos1: ModelPosition, pos2: ModelPosition): number {
        const dx = pos2.x - pos1.x;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dz * dz) * this.config.metersPerUnit;
    }

    getMetersPerUnit(): number {
        return this.config.metersPerUnit;
    }
}

export const coordinateTransformer = new CoordinateTransformer();