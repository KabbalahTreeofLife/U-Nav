import React, { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { DEFAULT_MAP_CONFIG } from './universities';
import { UserDot, DestinationMarker, PathLine, PathDots } from './userPosition';
import { KeyboardControls } from './KeyboardControls';
import { BuildingPopup } from './BuildingPopup';
import type { ModelPosition } from './geolocation';
import type { Building } from './types';

const CAMERA_STORAGE_KEY = 'unav_camera_state';

interface BuildingInfo {
    id: string;
    name: string;
    description: string;
    position: [number, number, number];
    size: [number, number, number];
}

const BUILDING_DATA: BuildingInfo[] = [
    { id: 'Building_Admin', name: 'Admin Building', description: 'Main administrative offices', position: [0.851, 0, -0.634], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Church', name: 'Chapel', description: 'School chapel and religious services', position: [-0.483, 0, 0.689], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Elementary', name: 'Elementary School', description: 'Elementary school building', position: [1.066, 0, -0.277], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Engineering', name: 'College of Engineering', description: 'Engineering and technology facilities', position: [-0.461, 0, -0.014], size: [0.7, 0.4, 0.7] },
    { id: 'Building_EXCEL', name: 'EXCEL Building', description: 'EXCEL learning center', position: [0.62, 0, -0.407], size: [0.5, 0.3, 0.5] },
    { id: 'Building_FranklinHall', name: 'Franklin Hall', description: 'Academic building', position: [-0.171, 0, -0.315], size: [0.5, 0.3, 0.5] },
    { id: 'Building_HSgym', name: 'High School Gym', description: 'High school gymnasium', position: [-0.873, 0, -0.682], size: [0.7, 0.4, 0.7] },
    { id: 'Building_JohnsonHall', name: 'Johnson Hall', description: 'Residential hall', position: [0.911, 0, 0.261], size: [0.5, 0.3, 0.5] },
    { id: 'Building_JuniorHigh', name: 'Junior High School', description: 'Junior high school building', position: [-0.615, 0, -0.558], size: [0.7, 0.35, 0.6] },
    { id: 'Building_Kindergarten', name: 'Kindergarten', description: 'Kindergarten building', position: [-0.422, 0, 0.855], size: [0.5, 0.3, 0.5] },
    { id: 'Building_LDT', name: 'LDT Building', description: 'Learning development and training', position: [0.469, 0, 0.285], size: [0.5, 0.3, 0.5] },
    { id: 'Building_LEB', name: 'LEB Building', description: 'Laboratory and evaluation building', position: [-0.437, 0, -0.902], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Library', name: 'Henry Luce Library', description: 'Main school library', position: [0.307, 0, 0.586], size: [0.6, 0.35, 0.6] },
    { id: 'Building_LopezMemorial', name: 'Lopez Memorial', description: 'Memorial building', position: [-0.272, 0, -0.866], size: [0.5, 0.3, 0.5] },
    { id: 'Building_MaryThomas', name: 'Mary Thomas Building', description: 'Academic building', position: [-0.1, 0, -1.212], size: [0.5, 0.3, 0.5] },
    { id: 'Building_NewValentine', name: 'New Valentine', description: 'Valentine building (new)', position: [0.176, 0, -0.789], size: [0.5, 0.3, 0.5] },
    { id: 'Building_OldValentine', name: 'Old Valentine', description: 'Valentine building (old)', position: [0.083, 0, -1.046], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Packaging', name: 'Packaging Center', description: 'Packaging and logistics', position: [-0.471, 0, -0.347], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Promenade', name: 'Promenade', description: 'Walkway and promenade area', position: [0.471, 0, -0.541], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Registrar', name: 'Registrar Office', description: 'Registrar building', position: [0.631, 0, 0.321], size: [0.5, 0.3, 0.5] },
    { id: 'Building_Roblee', name: 'Roblee Hall', description: 'Academic hall', position: [0.001, 0, -0.581], size: [0.5, 0.3, 0.5] },
    { id: 'Building_RoseMemorial', name: 'Rose Memorial Auditorium', description: 'Main auditorium', position: [0.039, 0, 0.888], size: [0.6, 0.35, 0.6] },
    { id: 'Building_SeniorHigh', name: 'Senior High School', description: 'Senior high school building', position: [-0.643, 0, -0.98], size: [0.7, 0.4, 0.7] },
    { id: 'Building_UniversityGym', name: 'University Gym', description: 'University gymnasium', position: [-0.177, 0, 1.257], size: [0.7, 0.4, 0.7] },
    { id: 'Building_Uy', name: 'Uy Building', description: 'Academic building', position: [-0.294, 0, -0.544], size: [0.5, 0.3, 0.5] },
    { id: 'Building_WestonHall', name: 'Weston Hall', description: 'Residential and academic hall', position: [0.643, 0, -0.029], size: [0.5, 0.3, 0.5] },
];

const getBuildingInfo = (id: string): BuildingInfo | undefined => {
    return BUILDING_DATA.find(b => b.id === id);
};

interface CameraState {
    position: [number, number, number];
    target: [number, number, number];
}

const getStoredCameraState = (): CameraState | null => {
    try {
        const stored = localStorage.getItem(CAMERA_STORAGE_KEY);
        return stored ? JSON.parse(stored) : null;
    } catch {
        return null;
    }
};

const CameraStateManager: React.FC<{ controlsRef: React.RefObject<ReturnType<typeof OrbitControls> | null> }> = ({ controlsRef }) => {
    const { camera } = useThree();
    const initialized = useRef(false);
    const frameCount = useRef(0);

    useEffect(() => {
        const stored = getStoredCameraState();
        if (stored) {
            camera.position.set(...stored.position);
            if (controlsRef.current) {
                controlsRef.current.target.set(...stored.target);
                controlsRef.current.update();
            }
        }
        initialized.current = true;
    }, [camera, controlsRef]);

    useFrame(() => {
        if (!initialized.current || !controlsRef.current) return;

        frameCount.current++;
        if (frameCount.current % 30 !== 0) return;

        const state: CameraState = {
            position: camera.position.toArray() as [number, number, number],
            target: controlsRef.current.target.toArray() as [number, number, number],
        };
        localStorage.setItem(CAMERA_STORAGE_KEY, JSON.stringify(state));
    });

    return null;
};

interface CampusSceneProps {
    glbUrl?: string;
    userPosition?: ModelPosition | null;
    accuracy?: number;
    scaleMetersPerUnit?: number;
    destinationPosition?: ModelPosition | null;
    destinationName?: string;
    showUserDot?: boolean;
    onSelectBuildingFromMesh?: (id: string) => void;
    selectedBuildingId?: string | null;
    navigationWaypoints?: ModelPosition[] | null;
    disableControls?: boolean;
}

const GridFloor: React.FC = () => {
    const gridSize = 50;
    const sectionSize = 5;

    const gridLines = useMemo(() => {
        const xLines: THREE.Line[] = [];
        const zLines: THREE.Line[] = [];

        for (let i = -gridSize / 2; i <= gridSize / 2; i++) {
            const isSection = i % sectionSize === 0;
            const isOrigin = i === 0;

            let zColor: THREE.Color;
            let xColor: THREE.Color;
            const opacity = isSection || isOrigin ? 1 : 0.5;

            if (isOrigin) {
                zColor = new THREE.Color('#000000');
                xColor = new THREE.Color('#000000');
            } else if (isSection) {
                zColor = i > 0 ? new THREE.Color('#3b82f6') : new THREE.Color('#1e3a8a');
                xColor = i > 0 ? new THREE.Color('#ef4444') : new THREE.Color('#7f1d1d');
            } else {
                zColor = i > 0 ? new THREE.Color('#60a5fa') : new THREE.Color('#1e40af');
                xColor = i > 0 ? new THREE.Color('#f87171') : new THREE.Color('#b91c1c');
            }

            const zGeom = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(-gridSize / 2, 0, i),
                new THREE.Vector3(gridSize / 2, 0, i),
            ]);
            const zMat = new THREE.LineBasicMaterial({ color: zColor, transparent: true, opacity });
            const zLine = new THREE.Line(zGeom, zMat);
            zLines.push(zLine);

            const xGeom = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(i, 0, -gridSize / 2),
                new THREE.Vector3(i, 0, gridSize / 2),
            ]);
            const xMat = new THREE.LineBasicMaterial({ color: xColor, transparent: true, opacity });
            const xLine = new THREE.Line(xGeom, xMat);
            xLines.push(xLine);
        }

        return { xLines, zLines };
    }, [gridSize, sectionSize]);

    return (
        <group position={[0, 1.5, 0]} rotation={[0, 0, 0]}>
            {gridLines.xLines.map((line: THREE.Line, idx: number) => (
                <primitive key={`x-${idx}`} object={line} />
            ))}
            {gridLines.zLines.map((line: THREE.Line, idx: number) => (
                <primitive key={`z-${idx}`} object={line} />
            ))}
        </group>
    );
};

const CampusModel: React.FC<{ url: string; onSelectBuilding: (id: string) => void }> = ({ url, onSelectBuilding }) => {
    const { scene } = useGLTF(url);

    React.useEffect(() => {
        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                const meshName = child.userData?.name || child.name;
                if (meshName && meshName.startsWith('Building_')) {
                    child.userData.isSelectable = true;
                    child.userData.buildingId = meshName;
                }
            }
        });
    }, [scene]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
        e.stopPropagation();
        const meshName = e.object?.userData?.buildingId || e.object?.name;
        if (meshName && meshName.startsWith('Building_')) {
            onSelectBuilding(meshName);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handlePointerOver = (e: any) => {
        e.stopPropagation();
        const meshName = e.object?.userData?.buildingId || e.object?.name;
        if (meshName && meshName.startsWith('Building_')) {
            document.body.style.cursor = 'pointer';
        }
    };

    const handlePointerOut = () => {
        document.body.style.cursor = 'auto';
    };

    return (
        <primitive 
            object={scene} 
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
        />
    );
};

const SceneContent: React.FC<CampusSceneProps & { selectedBuildingId: string | null; onSelectBuilding: (building: Building | null) => void }> = ({ 
    glbUrl,
    userPosition,
    accuracy = 10,
    scaleMetersPerUnit = 16.25,
    destinationPosition,
    destinationName,
    showUserDot = true,
    selectedBuildingId,
    onSelectBuilding,
    navigationWaypoints,
    disableControls = false,
}) => {
    const orbitControlsRef = useRef<ReturnType<typeof OrbitControls> | null>(null);
    const pathPoints = navigationWaypoints && navigationWaypoints.length >= 2 
        ? navigationWaypoints
        : (userPosition && destinationPosition 
            ? [userPosition, destinationPosition]
            : []);

    const handleMeshSelect = (buildingId: string) => {
        const info = getBuildingInfo(buildingId);
        if (info) {
            const scale = 11.523;
            const building: Building = {
                id: info.id,
                name: info.name,
                description: info.description,
                position: [info.position[0] * scale, info.position[1] * scale, info.position[2] * scale],
                size: [info.size[0] * scale, info.size[1] * scale, info.size[2] * scale],
                floors: [],
            };
            onSelectBuilding(building);
        }
    };

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            <GridFloor />

            {glbUrl && <CampusModel url={glbUrl} onSelectBuilding={handleMeshSelect} />}

            {showUserDot && userPosition && (
                <UserDot 
                    position={userPosition} 
                    accuracy={accuracy}
                    scaleMetersPerUnit={scaleMetersPerUnit}
                />
            )}

            {destinationPosition && destinationName && (
                <DestinationMarker 
                    position={destinationPosition}
                    name={destinationName}
                />
            )}

            {pathPoints.length >= 2 && (
                <>
                    <PathLine points={pathPoints} />
                    <PathDots points={pathPoints} />
                </>
            )}

            <OrbitControls
                ref={orbitControlsRef}
                enablePan={!disableControls}
                enableZoom={!disableControls}
                enableRotate={!disableControls}
                minDistance={5}
                maxDistance={200}
                maxPolarAngle={Math.PI / 2.1}
            />

            <CameraStateManager controlsRef={orbitControlsRef} />

            <KeyboardControls moveSpeed={0.1} enabled={!disableControls} orbitControlsRef={orbitControlsRef} />
        </>
    );
};

export const CampusScene: React.FC<CampusSceneProps> = (props) => {
    const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

    const handleSelectBuilding = (building: Building | null) => {
        setSelectedBuildingId(building?.id ?? null);
        setSelectedBuilding(building);
    };

    return (
        <>
            <Canvas
                camera={{
                    position: DEFAULT_MAP_CONFIG.cameraPosition,
                    fov: 50,
                    near: 0.1,
                    far: 1000,
                }}
                shadows
                style={{ width: '100%', height: '100%' }}
            >
                <Suspense fallback={null}>
                    <SceneContent 
                        {...props} 
                        selectedBuildingId={selectedBuildingId}
                        onSelectBuilding={handleSelectBuilding}
                    />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
            <BuildingPopup building={selectedBuilding} onClose={() => handleSelectBuilding(null)} />
        </>
    );
};

export default CampusScene;