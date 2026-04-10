import React, { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface KeyboardControlsProps {
    moveSpeed?: number;
    enabled?: boolean;
    orbitControlsRef?: React.RefObject<ReturnType<typeof OrbitControls> | null>;
}

export const KeyboardControls: React.FC<KeyboardControlsProps> = ({
    moveSpeed = 0.1,
    enabled = true,
    orbitControlsRef,
}) => {
    const { camera } = useThree();
    const keysPressed = useRef<Set<string>>(new Set());
    const internalRef = useRef<any>(null);
    const controlsRef = orbitControlsRef || internalRef;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        keysPressed.current.add(e.code);
    }, []);

    const handleKeyUp = useCallback((e: KeyboardEvent) => {
        keysPressed.current.delete(e.code);
    }, []);

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [enabled, handleKeyDown, handleKeyUp]);

    useFrame(() => {
        if (!enabled || keysPressed.current.size === 0) return;

        const keys = keysPressed.current;
        let moveX = 0;
        let moveZ = 0;

        if (keys.has('KeyW') || keys.has('ArrowUp')) {
            moveZ -= 1;
        }
        if (keys.has('KeyS') || keys.has('ArrowDown')) {
            moveZ += 1;
        }
        if (keys.has('KeyA') || keys.has('ArrowLeft')) {
            moveX -= 1;
        }
        if (keys.has('KeyD') || keys.has('ArrowRight')) {
            moveX += 1;
        }

        if (moveX === 0 && moveZ === 0) return;

        const controls = controlsRef?.current as any;
        if (!controls || !controls.target) return;

        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, camera.up).normalize();

        const movement = new THREE.Vector3();
        movement.addScaledVector(right, moveX * moveSpeed);
        movement.addScaledVector(forward, -moveZ * moveSpeed);

        controls.target.add(movement);
        camera.position.add(movement);
        controls.update();
        controls.update();
    });

    return null;
};

export default KeyboardControls;