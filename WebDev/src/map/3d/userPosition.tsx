import React, { useRef, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { ModelPosition } from './geolocation';

/**
 * Visual elements that indicate positions and paths in the 3D scene.
 */

interface UserDotProps {
    position: ModelPosition | null;
    /** GPS accuracy in meters */
    accuracy: number;
    /** Scale factor to convert meters to 3D units */
    scaleMetersPerUnit: number;
    visible?: boolean;
}

/**
 * Renders the user's current position in the 3D map.
 * Includes a central dot, an accuracy radius circle, and a floating label.
 */
export const UserDot: React.FC<UserDotProps> = ({
    position,
    accuracy,
    scaleMetersPerUnit,
    visible = true,
}) => {
    const groupRef = useRef<THREE.Group>(null);
    // Limit visually represented accuracy to avoid covering the whole map
    const clampedAccuracy = Math.min(accuracy, 50);
    const accuracyRadius = clampedAccuracy / scaleMetersPerUnit;

    useEffect(() => {
        if (groupRef.current && position) {
            // Slightly elevated (0.1) to avoid z-fighting with the ground
            groupRef.current.position.set(position.x, position.y + 0.1, position.z);
        }
    }, [position]);

    if (!position || !visible) return null;

    return (
        <group ref={groupRef}>
            {/* The primary green dot for the user */}
            <mesh>
                <circleGeometry args={[0.3, 32]} />
                <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} />
            </mesh>
            
            {/* The semi-transparent accuracy radius circle */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[accuracyRadius, 32]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.15} />
            </mesh>

            {/* A small cone indicator to give the position some depth */}
            <mesh position={[0, 0.5, 0]}>
                <coneGeometry args={[0.15, 0.4, 8]} />
                <meshBasicMaterial color="#10b981" />
            </mesh>

            {/* A floating HTML label that always faces the camera */}
            <Html position={[0.5, 1, 0]} zIndexRange={[100, 0]}>
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

/**
 * Renders a bright red marker representing the user's selected destination.
 */
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
            {/* Distinctive red octahedron marker */}
            <mesh position={[0, 0.6, 0]} scale={[0.6, 1.4, 0.6]} rotation={[0, Math.PI, 0]}>
                <octahedronGeometry args={[0.4, 0]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>

            {/* Floating destination name label */}
            <Html position={[0, 1.2, 0]} center occlude zIndexRange={[100, 0]}>
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
    lineWidth?: number;
}

/**
 * Renders a smooth navigational path on the ground.
 * Uses a CatmullRomCurve3 to smoothly interpolate between path waypoints.
 */
export const PathLine: React.FC<PathLineProps> = ({ points, color = '#ef4444', lineWidth = 2 }) => {
    if (points.length < 2) return null;

    // Elevate points slightly to stay above floor geometry
    const elevatedPoints = points.map((p) => {
        return new THREE.Vector3(p.x, 0.15, p.z);
    });

    const curve = new THREE.CatmullRomCurve3(elevatedPoints);
    const curvePoints = curve.getPoints(points.length * 5); // Subdivision logic

    return (
        <line>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={curvePoints.length}
                    args={[new Float32Array(curvePoints.flatMap(p => [p.x, p.y, p.z])), 3]}
                />
            </bufferGeometry>
            <lineBasicMaterial color={color} linewidth={lineWidth} />
        </line>
    );
};

/**
 * Renders small dots along the navigation path to improve visibility.
 */
export const PathDots: React.FC<{ points: ModelPosition[]; color?: string }> = ({ points, color = '#fbbf24' }) => {
    if (points.length < 2) return null;

    return (
        <>
            {/* Slice to exclude the start and end positions, which already have markers */}
            {points.slice(1, -1).map((point, idx) => (
                <group key={idx} position={[point.x, 0.2, point.z]}>
                    <mesh>
                        <circleGeometry args={[0.15, 16]} />
                        <meshBasicMaterial color={color} side={THREE.DoubleSide} />
                    </mesh>
                </group>
            ))}
        </>
    );
};

export default UserDot;