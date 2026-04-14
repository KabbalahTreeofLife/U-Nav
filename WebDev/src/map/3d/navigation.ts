import type { ModelPosition } from './geolocation';
import { findPath } from './pathfinder';

/**
 * A single stop or turn in a navigation sequence.
 */
export interface NavigationWaypoint {
    position: ModelPosition;
    instruction: string;
}

/**
 * The complete result of a navigation calculation.
 */
export interface NavigationResult {
    waypoints: NavigationWaypoint[];
    totalDistanceMeters: number;
    estimatedTimeMinutes: number;
}

// Average human walking speed (meters per second)
const WALKING_SPEED_MPS = 1.4;

/**
 * NavigationService translates raw pathfinding data into a user-friendly 
 * navigation experience, including distance and time estimates.
 */
export class NavigationService {
    /**
     * Calculates a complete path from start to end. 
     * Defaults to the simple pathfinding engine but falls back to a straight line if blocked.
     */
    calculatePath(
        start: ModelPosition,
        end: ModelPosition,
        usePathfinder: boolean = true,
        scaleMetersPerUnit: number = 16.25
    ): NavigationResult {
        if (usePathfinder) {
            // Use the advanced pathfinder to avoid buildings
            const pathResult = findPath(start, end);
            
            if (pathResult) {
                // Map the pathfinder waypoints to our navigation interface
                const waypoints: NavigationWaypoint[] = pathResult.waypoints.map((pos, idx) => ({
                    position: pos,
                    instruction: idx === 0 ? 'Start here' : pathResult.instructions[idx - 1] || `Continue to waypoint ${idx}`,
                }));
                
                // Add the final destination arrival instruction
                waypoints.push({
                    position: end,
                    instruction: `You have arrived at your destination`,
                });

                return {
                    waypoints,
                    totalDistanceMeters: pathResult.totalDistance,
                    estimatedTimeMinutes: Math.ceil(pathResult.totalDistance / (WALKING_SPEED_MPS * 60)),
                };
            }
        }

        // Fallback or explicit straight line path
        return this.calculateStraightLinePath(start, end, scaleMetersPerUnit);
    }

    /**
     * Simple calculation for a direct path between two points. 
     * Does NOT account for building obstacles.
     */
    calculateStraightLinePath(
        start: ModelPosition,
        end: ModelPosition,
        scaleMetersPerUnit: number = 16.25
    ): NavigationResult {
        const dx = end.x - start.x;
        const dz = end.z - start.z;
        const distanceUnits = Math.sqrt(dx * dx + dz * dz);
        const distanceMeters = distanceUnits * scaleMetersPerUnit;

        const directionX = dx / distanceUnits;
        const directionZ = dz / distanceUnits;

        const directions: string[] = [];
        
        // Determine the primary cardinal direction for the instruction
        if (Math.abs(directionX) > Math.abs(directionZ)) {
            directions.push(directionX > 0 ? 'East' : 'West');
        } else {
            directions.push(directionZ > 0 ? 'South' : 'North');
        }

        const waypoints: NavigationWaypoint[] = [
            {
                position: start,
                instruction: 'Start here',
            },
            {
                position: end,
                instruction: `Head ${directions.join(' and ')} for ${Math.round(distanceMeters)}m to reach your destination`,
            },
        ];

        return {
            waypoints,
            totalDistanceMeters: distanceMeters,
            estimatedTimeMinutes: Math.ceil(distanceMeters / (WALKING_SPEED_MPS * 60)),
        };
    }

    /**
     * Finds the closest building to the user's current 3D position.
     */
    findNearestBuilding(
        userPosition: ModelPosition,
        buildingPositions: { id: string; name: string; position: ModelPosition }[]
    ): { id: string; name: string; distance: number } | null {
        if (buildingPositions.length === 0) return null;

        let nearest = buildingPositions[0];
        let minDistance = this.calculateDistance(userPosition, nearest.position);

        for (const building of buildingPositions) {
            const distance = this.calculateDistance(userPosition, building.position);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = building;
            }
        }

        return {
            id: nearest.id,
            name: nearest.name,
            distance: minDistance,
        };
    }

    /**
     * Helper to calculate the Euclidean distance between two 3D positions (ignoring height Y).
     */
    calculateDistance(pos1: ModelPosition, pos2: ModelPosition): number {
        const dx = pos2.x - pos1.x;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

    /**
     * Returns a sorted list of buildings within a specified meter radius.
     */
    getNearbyBuildings(
        userPosition: ModelPosition,
        buildingPositions: { id: string; name: string; position: ModelPosition }[],
        maxDistanceMeters: number = 500,
        scaleMetersPerUnit: number = 16.25
    ): { id: string; name: string; distanceMeters: number }[] {
        return buildingPositions
            .map(building => ({
                id: building.id,
                name: building.name,
                distanceMeters: this.calculateDistance(userPosition, building.position) * scaleMetersPerUnit,
            }))
            .filter(b => b.distanceMeters <= maxDistanceMeters)
            .sort((a, b) => a.distanceMeters - b.distanceMeters);
    }

    /**
     * Converts a mathematical degree angle into a cardinal direction string.
     */
    getDirectionFromAngle(angle: number): string {
        const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
        const index = Math.round(((angle + 360) % 360) / 45) % 8;
        return directions[index];
    }

    /**
     * Calculates the bearing (angle) from one point to another in degrees.
     */
    calculateBearing(from: ModelPosition, to: ModelPosition): number {
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        // Uses Three.js coordinate system logic (X/Z plane)
        const bearing = Math.atan2(dx, -dz) * (180 / Math.PI);
        return (bearing + 360) % 360;
    }
}

/** Singleton instance to be used throughout the app */
export const navigationService = new NavigationService();