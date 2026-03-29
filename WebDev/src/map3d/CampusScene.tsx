import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Building } from './types';
import { DEFAULT_MAP_CONFIG } from './universities';

interface CampusSceneProps {
    buildings: Building[];
    glbUrl?: string;
    onBuildingClick: (building: Building) => void;
    onBuildingHover?: (building: Building | null) => void;
    isInteractive?: boolean;
}

interface ModelProps {
    url: string;
    onLoad?: (scene: THREE.Group) => void;
}

const CampusModel: React.FC<ModelProps> = ({ url, onLoad }) => {
    const { scene } = useGLTF(url);
    const modelRef = useRef<THREE.Group>(null);

    React.useEffect(() => {
        if (scene && onLoad) {
            onLoad(scene);
        }
    }, [scene, onLoad]);

    return <primitive ref={modelRef} object={scene} scale={1} position={[0, 0, 0]} />;
};

interface BuildingZoneProps {
    building: Building;
    isSelected: boolean;
    isHovered: boolean;
    onClick: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
    isInteractive?: boolean;
}

const BuildingZone: React.FC<BuildingZoneProps> = ({
    building,
    isSelected,
    isHovered,
    onClick,
    onPointerEnter,
    onPointerLeave,
    isInteractive = true,
}) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const [x, , z] = building.position;
    const [width, height, depth] = building.size;

    const color = isSelected ? '#4f46e5' : isHovered && isInteractive ? '#818cf8' : 'transparent';
    const opacity = isSelected || (isHovered && isInteractive) ? 0.4 : 0;

    return (
        <mesh
            ref={meshRef}
            position={[x, height / 2 + 0.1, z]}
            onClick={onClick}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
        >
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial
                color={color}
                transparent
                opacity={opacity}
                depthWrite={false}
            />
            <Html
                position={[0, height / 2 + 0.5, 0]}
                center
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div
                    style={{
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {building.name}
                </div>
            </Html>
        </mesh>
    );
};

const GroundPlane: React.FC = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="#f0f0f0" />
        </mesh>
    );
};

const SceneContent: React.FC<CampusSceneProps> = ({
    buildings,
    glbUrl,
    onBuildingClick,
    onBuildingHover,
    isInteractive = true,
}) => {
    const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
    const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

    const handleBuildingClick = (building: Building) => {
        if (!isInteractive) return;
        setSelectedBuilding(building.id);
        onBuildingClick(building);
    };

    const handlePointerEnter = (building: Building) => {
        setHoveredBuilding(building.id);
        onBuildingHover?.(building);
    };

    const handlePointerLeave = () => {
        setHoveredBuilding(null);
        onBuildingHover?.(null);
    };

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            <GroundPlane />

            {glbUrl && <CampusModel url={glbUrl} />}

            {buildings.map((building) => (
                <BuildingZone
                    key={building.id}
                    building={building}
                    isSelected={selectedBuilding === building.id}
                    isHovered={hoveredBuilding === building.id}
                    onClick={() => handleBuildingClick(building)}
                    onPointerEnter={() => handlePointerEnter(building)}
                    onPointerLeave={handlePointerLeave}
                    isInteractive={isInteractive}
                />
            ))}

            <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={5}
                maxDistance={50}
                maxPolarAngle={Math.PI / 2.1}
            />
        </>
    );
};

export const CampusScene: React.FC<CampusSceneProps> = (props) => {
    return (
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
                <SceneContent {...props} />
                <Environment preset="city" />
            </Suspense>
        </Canvas>
    );
};

export default CampusScene;
