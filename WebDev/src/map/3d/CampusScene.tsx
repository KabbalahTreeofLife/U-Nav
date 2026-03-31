import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { DEFAULT_MAP_CONFIG } from './universities';

interface CampusSceneProps {
    glbUrl?: string;
}

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

const SceneContent: React.FC<CampusSceneProps> = ({ glbUrl }) => {
    return (
        <>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
            <pointLight position={[-10, 10, -10]} intensity={0.5} />

            {glbUrl && <CampusModel url={glbUrl} />}

            <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={5}
                maxDistance={200}
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
