import type { ModelPosition } from './geolocation';

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
const CLEARANCE_UNITS = 0.1;

const GLB_SCALE = 11.523;

const GRID_SIZE = 30;
const GRID_RESOLUTION = 300;

interface BuildingBounds {
    id: string;
    name: string;
    centerX: number;
    centerZ: number;
    halfWidth: number;
    halfDepth: number;
}

const GLB_BUILDINGS: { id: string; name: string; position: [number, number, number]; size: [number, number, number] }[] = [
    { id: 'Building_Admin', name: 'Admin Building', position: [0.851, 0, -0.634], size: [0.4, 0.3, 0.4] },
    { id: 'Building_Background', name: 'Background', position: [0.398, 0, 0.824], size: [2, 0.5, 1.5] },
    { id: 'Building_Church', name: 'Chapel', position: [-0.483, 0, 0.689], size: [0.5, 0.4, 0.4] },
    { id: 'Building_Elementary', name: 'Elementary School', position: [1.066, 0, -0.277], size: [0.6, 0.4, 0.5] },
    { id: 'Building_Engineering', name: 'College of Engineering', position: [-0.461, 0, -0.014], size: [0.7, 0.5, 0.6] },
    { id: 'Building_EXCEL', name: 'EXCEL Building', position: [0.62, 0, -0.407], size: [0.4, 0.3, 0.4] },
    { id: 'Building_FranklinHall', name: 'Franklin Hall', position: [-0.171, 0, -0.315], size: [0.5, 0.35, 0.4] },
    { id: 'Building_HSgym', name: 'High School Gym', position: [-0.873, 0, -0.682], size: [0.7, 0.5, 0.6] },
    { id: 'Building_JohnsonHall', name: 'Johnson Hall', position: [0.911, 0, 0.261], size: [0.4, 0.35, 0.5] },
    { id: 'Building_JuniorHigh', name: 'Junior High School', position: [-0.615, 0, -0.558], size: [0.7, 0.45, 0.6] },
    { id: 'Building_Kindergarten', name: 'Kindergarten', position: [-0.422, 0, 0.855], size: [0.5, 0.35, 0.4] },
    { id: 'Building_LDT', name: 'LDT Building', position: [0.469, 0, 0.285], size: [0.4, 0.3, 0.4] },
    { id: 'Building_LEB', name: 'LEB Building', position: [-0.437, 0, -0.902], size: [0.5, 0.35, 0.4] },
    { id: 'Building_Library', name: 'Henry Luce Library', position: [0.307, 0, 0.586], size: [0.5, 0.45, 0.5] },
    { id: 'Building_LopezMemorial', name: 'Lopez Memorial', position: [-0.272, 0, -0.866], size: [0.35, 0.3, 0.35] },
    { id: 'Building_MaryThomas', name: 'Mary Thomas Building', position: [-0.1, 0, -1.212], size: [0.5, 0.35, 0.4] },
    { id: 'Building_NewValentine', name: 'New Valentine', position: [0.176, 0, -0.789], size: [0.35, 0.3, 0.35] },
    { id: 'Building_OldValentine', name: 'Old Valentine', position: [0.083, 0, -1.046], size: [0.35, 0.3, 0.35] },
    { id: 'Building_Packaging', name: 'Packaging Center', position: [-0.471, 0, -0.347], size: [0.35, 0.3, 0.35] },
    { id: 'Building_Promenade', name: 'Promenade', position: [0.471, 0, -0.541], size: [0.35, 0.2, 0.35] },
    { id: 'Building_Registrar', name: 'Registrar Office', position: [0.631, 0, 0.321], size: [0.35, 0.3, 0.35] },
    { id: 'Building_Roblee', name: 'Roblee Hall', position: [0.001, 0, -0.581], size: [0.5, 0.35, 0.4] },
    { id: 'Building_RoseMemorial', name: 'Rose Memorial Auditorium', position: [0.039, 0, 0.888], size: [0.5, 0.45, 0.5] },
    { id: 'Building_SeniorHigh', name: 'Senior High School', position: [-0.643, 0, -0.98], size: [0.7, 0.5, 0.6] },
    { id: 'Building_UniversityGym', name: 'University Gym', position: [-0.177, 0, 1.257], size: [0.7, 0.5, 0.6] },
    { id: 'Building_Uy', name: 'Uy Building', position: [-0.294, 0, -0.544], size: [0.35, 0.3, 0.35] },
    { id: 'Building_WestonHall', name: 'Weston Hall', position: [0.643, 0, -0.029], size: [0.4, 0.35, 0.5] },
];

function getBuildingBounds(): BuildingBounds[] {
    return GLB_BUILDINGS.map(b => {
        const worldX = b.position[0] * GLB_SCALE;
        const worldZ = b.position[2] * GLB_SCALE;
        const halfWidth = (b.size[0] * GLB_SCALE) / 2;
        const halfDepth = (b.size[2] * GLB_SCALE) / 2;
        
        return {
            id: b.id,
            name: b.name,
            centerX: worldX,
            centerZ: worldZ,
            halfWidth,
            halfDepth,
        };
    });
}

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

    console.log('findPath called:', { start, end, startGrid, endGrid });

    const startInBounds = start.x >= -GRID_SIZE / 2 && start.x <= GRID_SIZE / 2 &&
                          start.z >= -GRID_SIZE / 2 && start.z <= GRID_SIZE / 2;
    const endInBounds = end.x >= -GRID_SIZE / 2 && end.x <= GRID_SIZE / 2 &&
                        end.z >= -GRID_SIZE / 2 && end.z <= GRID_SIZE / 2;

    if (!startInBounds || !endInBounds) {
        console.log('Start or end out of bounds');
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

            if (!isWalkable(end.x, end.z)) {
                const lastWalkable = path[path.length - 2] || path[path.length - 1];
                path.push({ ...lastWalkable, x: end.x, z: end.z });
            }

            const simplified = simplifyPath(path);

            console.log('Path found:', simplified.length, 'waypoints', simplified);
            return {
                waypoints: simplified,
                totalDistance: totalDist,
                instructions: generateInstructions(simplified),
            };
        }

        closedSet.add(`${current.x},${current.z}`);

        const neighbors = getNeighbors(current);
        
        if (neighbors.length === 0) {
            continue;
        }
        
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

    console.log('No path found - openSet exhausted');
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