import React, { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ModelPosition } from './geolocation';

interface UserDotProps {
    position: ModelPosition | null;
    accuracy: number;
    scaleMetersPerUnit: number;
    visible?: boolean;
}

export const UserDot: React.FC<UserDotProps> = ({
    position,
    accuracy,
    scaleMetersPerUnit,
    visible = true,
}) => {
    const groupRef = useRef<THREE.Group>(null);
    const accuracyRadius = accuracy / scaleMetersPerUnit;

    useEffect(() => {
        if (groupRef.current && position) {
            groupRef.current.position.set(position.x, position.y + 0.1, position.z);
        }
    }, [position]);

    if (!position || !visible) return null;

    return (
        <group ref={groupRef}>
            <mesh>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
            </mesh>
            
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[accuracyRadius, 32]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
            </mesh>

            <mesh position={[0, 0.5, 0]}>
                <coneGeometry args={[0.15, 0.4, 8]} />
                <meshBasicMaterial color="#10b981" />
            </mesh>

            <Html position={[0.5, 1, 0]}>
                <div style={{
                    background: 'rgba(16, 185, 129, 0.9)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'system-ui, sans-serif',
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                }}>
                    You are here
                </div>
            </Html>
        </group>
    );
};

interface DestinationMarkerProps {
    position: ModelPosition;
    name: string;
    onClick?: () => void;
}

export const DestinationMarker: React.FC<DestinationMarkerProps> = ({
    position,
    name,
    onClick,
}) => {
    const groupRef = useRef<THREE.Group>(null);

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.position.set(position.x, position.y + 0.1, position.z);
        }
    }, [position]);

    return (
        <group ref={groupRef} onClick={onClick}>
            <mesh>
                <sphereGeometry args={[0.4, 16, 16]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>

            <Html position={[0, 1, 0]} center>
                <div style={{
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'system-ui, sans-serif',
                    whiteSpace: 'nowrap',
                }}>
                    {name}
                </div>
            </Html>
        </group>
    );
};

interface PathLineProps {
    points: ModelPosition[];
    color?: string;
}

export const PathLine: React.FC<PathLineProps> = ({ points, color = '#ef4444' }) => {
    if (points.length < 2) return null;

    const linePoints = points.map(p => new THREE.Vector3(p.x, 1, p.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);

    return (
        <primitive object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, linewidth: 3 }))} />
    );
};

export default UserDot;