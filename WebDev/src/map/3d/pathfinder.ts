import type { ModelPosition } from './geolocation';
import { buildingDataService } from './buildingData';

export interface PathNode {
    x: number;
    z: number;
    g: number;
    h: number;
    f: number;
    parent: PathNode | null;
    walkable: boolean;
}

export interface NavigationPath {
    waypoints: ModelPosition[];
    totalDistance: number;
    instructions: string[];
}

const SCALE = 16.25;
const CLEARANCE_UNITS = 0.15;

function getBuildingBounds() {
    return buildingDataService.getAllBuildings().map(b => ({
        id: b.id,
        name: b.name,
        centerX: b.modelPosition.x,
        centerZ: b.modelPosition.z,
        halfWidth: 0.3,
        halfDepth: 0.3,
    }));
}

const GRID_SIZE = 6;
const GRID_RESOLUTION = 150;

function gridToWorld(gridX: number, gridZ: number): ModelPosition {
    const range = GRID_SIZE;
    const step = range / GRID_RESOLUTION;
    return {
        x: -range / 2 + gridX * step,
        y: 0,
        z: -range / 2 + gridZ * step,
    };
}

function worldToGrid(x: number, z: number): { gx: number; gz: number } {
    const range = GRID_SIZE;
    const step = range / GRID_RESOLUTION;
    return {
        gx: Math.round((x + range / 2) / step),
        gz: Math.round((z + range / 2) / step),
    };
}

function isWalkable(x: number, z: number): boolean {
    const bounds = getBuildingBounds();
    for (const b of bounds) {
        const minX = b.centerX - b.halfWidth - CLEARANCE_UNITS;
        const maxX = b.centerX + b.halfWidth + CLEARANCE_UNITS;
        const minZ = b.centerZ - b.halfDepth - CLEARANCE_UNITS;
        const maxZ = b.centerZ + b.halfDepth + CLEARANCE_UNITS;
        
        if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
            return false;
        }
    }
    return x >= -GRID_SIZE / 2 && x <= GRID_SIZE / 2 &&
           z >= -GRID_SIZE / 2 && z <= GRID_SIZE / 2;
}

function heuristic(a: PathNode, b: PathNode): number {
    return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
}

function getNeighbors(node: PathNode): PathNode[] {
    const neighbors: PathNode[] = [];
    const directions = [
        { x: 1, z: 0 }, { x: -1, z: 0 }, { x: 0, z: 1 }, { x: 0, z: -1 },
        { x: 1, z: 1 }, { x: 1, z: -1 }, { x: -1, z: 1 }, { x: -1, z: -1 },
    ];

    for (const dir of directions) {
        const newX = node.x + dir.x;
        const newZ = node.z + dir.z;

        if (isWalkable(newX, newZ)) {
            const cost = dir.x !== 0 && dir.z !== 0 ? 1.414 : 1;
            neighbors.push({
                x: newX,
                z: newZ,
                g: 0,
                h: 0,
                f: 0,
                parent: null,
                walkable: true,
            });
            (neighbors[neighbors.length - 1] as PathNode & { cost?: number }).cost = cost;
        }
    }
    return neighbors;
}

function generateInstructions(waypoints: ModelPosition[]): string[] {
    const instructions: string[] = [];
    if (waypoints.length < 2) return instructions;

    for (let i = 0; i < waypoints.length - 1; i++) {
        const curr = waypoints[i];
        const next = waypoints[i + 1];
        const dx = next.x - curr.x;
        const dz = next.z - curr.z;

        let direction = '';
        if (Math.abs(dx) > Math.abs(dz)) {
            direction = dx > 0 ? 'East' : 'West';
        } else {
            direction = dz > 0 ? 'South' : 'North';
        }

        const dist = Math.sqrt(dx * dx + dz * dz) * SCALE;
        if (dist > 5) {
            instructions.push(`Walk ${direction} for ${Math.round(dist)}m`);
        }
    }

    return instructions;
}

export function findPath(start: ModelPosition, end: ModelPosition): NavigationPath | null {
    const startGrid = worldToGrid(start.x, start.z);
    const endGrid = worldToGrid(end.x, end.z);

    if (!isWalkable(start.x, start.z) || !isWalkable(end.x, end.z)) {
        return null;
    }

    const openSet: PathNode[] = [];
    const closedSet = new Set<string>();

    const startNode: PathNode = {
        x: startGrid.gx,
        z: startGrid.gz,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
        walkable: true,
    };
    startNode.h = heuristic(startNode, { x: endGrid.gx, z: endGrid.gz, g: 0, h: 0, f: 0, parent: null, walkable: true });
    startNode.f = startNode.g + startNode.h;
    openSet.push(startNode);

    const target: PathNode = {
        x: endGrid.gx,
        z: endGrid.gz,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
        walkable: true,
    };

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift()!;

        if (Math.abs(current.x - target.x) <= 1 && Math.abs(current.z - target.z) <= 1) {
            const path: ModelPosition[] = [];
            let node: PathNode | null = current;

            while (node) {
                const worldPos = gridToWorld(node.x, node.z);
                path.unshift(worldPos);
                node = node.parent;
            }

            path.unshift(start);
            path.push(end);

            let totalDist = 0;
            for (let i = 0; i < path.length - 1; i++) {
                const dx = path[i + 1].x - path[i].x;
                const dz = path[i + 1].z - path[i].z;
                totalDist += Math.sqrt(dx * dx + dz * dz) * SCALE;
            }

            const simplified = simplifyPath(path);

            return {
                waypoints: simplified,
                totalDistance: totalDist,
                instructions: generateInstructions(simplified),
            };
        }

        closedSet.add(`${current.x},${current.z}`);

        const neighbors = getNeighbors(current);
        for (const neighbor of neighbors) {
            const key = `${neighbor.x},${neighbor.z}`;
            if (closedSet.has(key)) continue;

            const gScore = current.g + ((neighbor as PathNode & { cost?: number }).cost || 1);
            const existing = openSet.find(n => n.x === neighbor.x && n.z === neighbor.z);

            if (!existing) {
                neighbor.g = gScore;
                neighbor.h = heuristic(neighbor, target);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = current;
                openSet.push(neighbor);
            } else if (gScore < existing.g) {
                existing.g = gScore;
                existing.f = existing.g + existing.h;
                existing.parent = current;
            }
        }
    }

    return null;
}

function simplifyPath(path: ModelPosition[]): ModelPosition[] {
    if (path.length < 3) return path;

    const simplified: ModelPosition[] = [path[0]];

    for (let i = 1; i < path.length - 1; i++) {
        const prev = simplified[simplified.length - 1];
        const curr = path[i];
        const next = path[i + 1];

        const dir1x = curr.x - prev.x;
        const dir1z = curr.z - prev.z;
        const dir2x = next.x - curr.x;
        const dir2z = next.z - curr.z;

        if (dir1x !== dir2x || dir1z !== dir2z) {
            simplified.push(curr);
        }
    }

    simplified.push(path[path.length - 1]);
    return simplified;
}

export function isPositionWalkable(position: ModelPosition): boolean {
    return isWalkable(position.x, position.z);
}