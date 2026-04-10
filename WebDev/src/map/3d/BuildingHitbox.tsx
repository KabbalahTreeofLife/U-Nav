import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { Building } from './types';

interface BuildingHitboxProps {
    building: Building;
    onSelect: (building: Building) => void;
    isSelected: boolean;
}

export const BuildingHitbox: React.FC<BuildingHitboxProps> = ({ building, onSelect, isSelected }) => {
    const [hovered, setHovered] = useState(false);

    const handleClick = (e: THREE.Event) => {
        e.stopPropagation();
        onSelect(building);
    };

    const [width, height, depth] = building.size;
    const [posX, posY, posZ] = building.position;
    const x = posX;
    const z = posZ;
    const rotation = building.rotation || 0;
    
    const isOrigin = building.id === 'origin-marker';
    const isXAxis = building.id.startsWith('x-axis');
    const isZAxis = building.id.startsWith('z-axis');
    
    let boxColor = '#3b82f6';
    if (isSelected) boxColor = '#22c55e';
    else if (hovered && !isOrigin) boxColor = '#f59e0b';
    else if (isOrigin) boxColor = '#ef4444';
    else if (isXAxis) {
        boxColor = x >= 0 ? '#4ade80' : '#166534';
    } else if (isZAxis) {
        boxColor = z >= 0 ? '#fde047' : '#a16207';
    }
    
    const boxOpacity = isOrigin ? 0.8 : (hovered || isSelected ? 0.5 : (isXAxis || isZAxis ? 0.6 : 0.3));

    const isAxis = building.id.startsWith('x-axis') || building.id.startsWith('z-axis');
    const yOffset = isAxis ? 2 : 0;
    const position: [number, number, number] = [posX, posY + yOffset + height / 2, posZ];

    return (
        <group position={position} rotation={[0, rotation, 0]}>
            <mesh
                onClick={handleClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <boxGeometry args={[width, height, depth]} />
                <meshBasicMaterial
                    color={boxColor}
                    transparent
                    opacity={boxOpacity}
                    depthWrite={false}
                />
            </mesh>

            {(hovered || isSelected) && (
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
                            background: 'rgba(0, 0, 0, 0.8)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            fontFamily: 'system-ui, sans-serif',
                        }}
                    >
                        {building.name}
                    </div>
                </Html>
            )}
        </group>
    );
};

interface BuildingHitboxesProps {
    buildings: Building[];
    onSelectBuilding: (building: Building | null) => void;
    selectedBuildingId: string | null;
}

export const BuildingHitboxes: React.FC<BuildingHitboxesProps> = ({
    buildings,
    onSelectBuilding,
    selectedBuildingId,
}) => {
    return (
        <>
            {buildings.map((building) => (
                <BuildingHitbox
                    key={building.id}
                    building={building}
                    onSelect={onSelectBuilding}
                    isSelected={selectedBuildingId === building.id}
                />
            ))}
        </>
    );
};

export default BuildingHitbox;