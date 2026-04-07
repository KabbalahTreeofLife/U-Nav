import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { DEFAULT_MAP_CONFIG } from './universities';
import { UserDot, DestinationMarker, PathLine } from './userPosition';
import { KeyboardControls } from './KeyboardControls';
import type { ModelPosition } from './geolocation';

interface CampusSceneProps {
    glbUrl?: string;
    userPosition?: ModelPosition | null;
    accuracy?: number;
    scaleMetersPerUnit?: number;
    destinationPosition?: ModelPosition | null;
    destinationName?: string;
    showUserDot?: boolean;
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
        <group position={[0, 1.5, 0]} rotation={[0, (13 * Math.PI) / 45, 0]}>
            {gridLines.xLines.map((line: THREE.Line, idx: number) => (
                <primitive key={`x-${idx}`} object={line} />
            ))}
            {gridLines.zLines.map((line: THREE.Line, idx: number) => (
                <primitive key={`z-${idx}`} object={line} />
            ))}
        </group>
    );
};

const CampusModel: React.FC<{ url: string }> = ({ url }) => {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF(url);

    React.useEffect(() => {
        if (groupRef.current) {
            scene.scale.set(1, 1, 1);
            const box = new THREE.Box3().setFromObject(scene);
            const center = new THREE.Vector3();
            box.getCenter(center);
            groupRef.current.position.set(-center.x, -box.min.y, -center.z);
        }
    }, [scene]);

    return (
        <group ref={groupRef}>
            <primitive object={scene} />
        </group>
    );
};

const SceneContent: React.FC<CampusSceneProps> = ({ 
    glbUrl,
    userPosition,
    accuracy = 10,
    scaleMetersPerUnit = 16.25,
    destinationPosition,
    destinationName,
    showUserDot = true,
}) => {
    const orbitControlsRef = useRef(null);
    const pathPoints = userPosition && destinationPosition 
        ? [userPosition, destinationPosition]
        : [];

    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            <GridFloor />

            {glbUrl && <CampusModel url={glbUrl} />}

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
                <PathLine points={pathPoints} />
            )}

            <OrbitControls
                ref={orbitControlsRef}
                enablePan
                enableZoom
                enableRotate
                minDistance={5}
                maxDistance={200}
                maxPolarAngle={Math.PI / 2.1}
            />

            <KeyboardControls moveSpeed={0.1} enabled={true} orbitControlsRef={orbitControlsRef} />
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