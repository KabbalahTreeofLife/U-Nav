import type { ModelPosition } from './geolocation';
import { findPath, isPositionWalkable, type NavigationPath } from './pathfinder';

export interface NavigationWaypoint {
    position: ModelPosition;
    instruction: string;
}

export interface NavigationResult {
    waypoints: NavigationWaypoint[];
    totalDistanceMeters: number;
    estimatedTimeMinutes: number;
}

const WALKING_SPEED_MPS = 1.4;

export class NavigationService {
    calculatePath(
        start: ModelPosition,
        end: ModelPosition,
        useAStar: boolean = true,
        scaleMetersPerUnit: number = 16.25
    ): NavigationResult {
        if (useAStar) {
            const aStarResult = findPath(start, end);
            console.log('A* result:', aStarResult);
            
            if (aStarResult) {
                const waypoints: NavigationWaypoint[] = aStarResult.waypoints.map((pos, idx) => ({
                    position: pos,
                    instruction: idx === 0 ? 'Start here' : aStarResult.instructions[idx - 1] || `Continue to waypoint ${idx}`,
                }));
                
                waypoints.push({
                    position: end,
                    instruction: `You have arrived at your destination`,
                });

                return {
                    waypoints,
                    totalDistanceMeters: aStarResult.totalDistance,
                    estimatedTimeMinutes: Math.ceil(aStarResult.totalDistance / (WALKING_SPEED_MPS * 60)),
                };
            } else {
                console.log('A* failed, falling back to straight line');
            }
        }

        return this.calculateStraightLinePath(start, end, scaleMetersPerUnit);
    }

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

    calculateDistance(pos1: ModelPosition, pos2: ModelPosition): number {
        const dx = pos2.x - pos1.x;
        const dz = pos2.z - pos1.z;
        return Math.sqrt(dx * dx + dz * dz);
    }

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

    getDirectionFromAngle(angle: number): string {
        const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
        const index = Math.round(((angle + 360) % 360) / 45) % 8;
        return directions[index];
    }

    calculateBearing(from: ModelPosition, to: ModelPosition): number {
        const dx = to.x - from.x;
        const dz = to.z - from.z;
        let bearing = Math.atan2(dx, -dz) * (180 / Math.PI);
        return (bearing + 360) % 360;
    }
}

export const navigationService = new NavigationService();