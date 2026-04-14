import type { ModelPosition } from './geolocation';
import { UNIVERSITY_MAPS } from './universities';

/**
 * Represents a calculated navigation route.
 */
export interface NavigationPath {
    /** Array of 3D coordinates defining the path */
    waypoints: ModelPosition[];
    /** Total distance of the path in meters */
    totalDistance: number;
    /** Human-readable walking instructions */
    instructions: string[];
}

// Global scale factor to convert Three.js units to meters for realistic distance calculation
const SCALE = 16.25;
// Safety buffer to ensure path nodes don't clip through building walls
const CORNER_OFFSET = 0.6; 

/**
 * PathfinderService implements a custom navigation engine using a simple pathfinding implementation.
 * It treats building corners as nodes in a graph and calculates the shortest obstacle-free path.
 */
class PathfinderService {
    private currentUniversityId: number = 1;

    /**
     * Updates the active university context for pathfinding.
     */
    setUniversityId(id: number): void {
        this.currentUniversityId = id;
    }

    /**
     * Retrieves building data from the current university map, filtering out 
     * non-navigational meshes like roads, fields, and background elements.
     */
    private getObstacles() {
        const map = UNIVERSITY_MAPS.find(m => m.id === this.currentUniversityId);
        if (!map) return [];

        return map.buildings.filter(b => 
            !b.id.includes('Background') && 
            !b.id.includes('Road') && 
            !b.id.includes('Outline') && 
            !b.id.includes('Field') && 
            !b.id.includes('Floor') &&
            !b.id.includes('Promenade')
        );
    }

    /**
     * Checks if a specific 2D point (x, z) is inside a building's footprint.
     * @param buffer Extra padding around the obstacle.
     */
    private isPointBlocked(x: number, z: number, buffer: number = 0.1): boolean {
        const obstacles = this.getObstacles();
        for (const b of obstacles) {
            const hW = b.size[0] / 2 + buffer;
            const hD = b.size[2] / 2 + buffer;
            if (x >= b.position[0] - hW && x <= b.position[0] + hW && 
                z >= b.position[2] - hD && z <= b.position[2] + hD) {
                return true;
            }
        }
        return false;
    }

    /**
     * Performs a ray-cast style check to see if two points can "see" each other
     * without crossing any building obstacles.
     */
    private hasLineOfSight(p1: {x: number, z: number}, p2: {x: number, z: number}): boolean {
        const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.z - p1.z, 2));
        const steps = Math.ceil(dist / 0.2); // Sample check every 0.2 units
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const tx = p1.x + (p2.x - p1.x) * t;
            const tz = p1.z + (p2.z - p1.z) * t;
            if (this.isPointBlocked(tx, tz, 0.2)) return false;
        }
        return true;
    }

    /**
     * Finds the shortest path between start and end using building corners as navigation nodes.
     * 1. Checks for a direct line of sight.
     * 2. If blocked, generates a graph of all visible building corners.
     * 3. Runs the pathfinding logic to find the optimal waypoint sequence.
     */
    findPath(start: ModelPosition, end: ModelPosition): NavigationPath | null {
        // 1. Optimization: Direct path check first
        if (this.hasLineOfSight(start, end)) {
            return {
                waypoints: [start, end],
                totalDistance: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.z - start.z, 2)) * SCALE,
                instructions: this.generateInstructions([start, end])
            };
        }

        // 2. Node Generation: Use building corners as potential navigation points
        const obstacles = this.getObstacles();
        const nodes: ModelPosition[] = [start, end];
        
        for (const b of obstacles) {
            const hW = b.size[0] / 2 + CORNER_OFFSET;
            const hD = b.size[2] / 2 + CORNER_OFFSET;
            // Add 4 slightly offset corners per building to allow "turning" around them
            nodes.push({ x: b.position[0] - hW, y: 0, z: b.position[2] - hD });
            nodes.push({ x: b.position[0] + hW, y: 0, z: b.position[2] - hD });
            nodes.push({ x: b.position[0] - hW, y: 0, z: b.position[2] + hD });
            nodes.push({ x: b.position[0] + hW, y: 0, z: b.position[2] + hD });
        }

        // 3. Simple Pathfinding implementation
        const n = nodes.length;
        const dist = new Array(n).fill(Infinity);
        const parent = new Array(n).fill(-1);
        const visited = new Array(n).fill(false);

        dist[0] = 0; // Start node is always index 0

        for (let i = 0; i < n; i++) {
            let u = -1;
            // Select the unvisited node with the smallest distance
            for (let j = 0; j < n; j++) {
                if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
            }

            if (u === -1 || dist[u] === Infinity) break;
            visited[u] = true;

            if (u === 1) break; // Finished: Found the shortest path to end node (index 1)

            for (let v = 0; v < n; v++) {
                if (visited[v]) continue;
                
                // Only connect nodes with clear line of sight
                if (this.hasLineOfSight(nodes[u], nodes[v])) {
                    const d = Math.sqrt(Math.pow(nodes[v].x - nodes[u].x, 2) + Math.pow(nodes[v].z - nodes[u].z, 2));
                    if (dist[u] + d < dist[v]) {
                        dist[v] = dist[u] + d;
                        parent[v] = u;
                    }
                }
            }
        }

        // 4. Path Reconstruction
        if (dist[1] === Infinity) return null; // No path found

        const waypoints: ModelPosition[] = [];
        let curr = 1;
        while (curr !== -1) {
            waypoints.unshift(nodes[curr]);
            curr = parent[curr];
        }

        return {
            waypoints,
            totalDistance: dist[1] * SCALE,
            instructions: this.generateInstructions(waypoints)
        };
    }

    /**
     * Converts a list of waypoints into cardinal-direction instructions.
     */
    private generateInstructions(path: ModelPosition[]): string[] {
        const instructions: string[] = [];
        for (let i = 0; i < path.length - 1; i++) {
            const dx = path[i+1].x - path[i].x;
            const dz = path[i+1].z - path[i].z;
            const dist = Math.sqrt(dx * dx + dz * dz) * SCALE;
            if (dist < 0.5) continue; // Skip very small adjustments

            const angle = Math.atan2(dz, dx) * 180 / Math.PI;
            let dir = '';
            if (angle > -45 && angle <= 45) dir = 'East';
            else if (angle > 45 && angle <= 135) dir = 'South';
            else if (angle > -135 && angle <= -45) dir = 'North';
            else dir = 'West';
            
            instructions.push(`Walk ${dir} for ${Math.round(dist)}m`);
        }
        return instructions;
    }
}

/** Singleton instance to be used across the application */
export const pathfinder = new PathfinderService();
/** Convenience wrapper for pathfinding */
export const findPath = (start: ModelPosition, end: ModelPosition) => pathfinder.findPath(start, end);
/** Default walkable check */
export const isPositionWalkable = () => true;