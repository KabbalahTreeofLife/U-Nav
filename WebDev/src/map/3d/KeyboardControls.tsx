import React, { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { MAX_BOUNDARY } from './CampusScene';

interface KeyboardControlsProps {
    moveSpeed?: number;
    enabled?: boolean;
    orbitControlsRef?: React.RefObject<OrbitControlsImpl | null>;
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

    const isInputActive = (): boolean => {
        const active = document.activeElement;
        return active?.tagName === 'INPUT' || 
               active?.tagName === 'TEXTAREA' || 
               active?.getAttribute('contenteditable') === 'true' ||
               active?.closest('.search-results-dropdown') !== null;
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (isInputActive()) return;
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
        if (!enabled || isInputActive() || keysPressed.current.size === 0) return;

        const keys = keysPressed.current;
        let moveX = 0;
        let moveZ = 0;

        // Only Arrow keys allowed for movement, WASD stays disabled
        if (keys.has('ArrowUp')) {
            moveZ -= 1;
        }
        if (keys.has('ArrowDown')) {
            moveZ += 1;
        }
        if (keys.has('ArrowLeft')) {
            moveX -= 1;
        }
        if (keys.has('ArrowRight')) {
            moveX += 1;
        }

        const controls = controlsRef?.current as any;
        if (!controls || !controls.target) return;

        if (moveX !== 0 || moveZ !== 0) {
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

            // Clamp Target and Camera to world boundaries
            controls.target.x = THREE.MathUtils.clamp(controls.target.x, -MAX_BOUNDARY, MAX_BOUNDARY);
            controls.target.z = THREE.MathUtils.clamp(controls.target.z, -MAX_BOUNDARY, MAX_BOUNDARY);
            camera.position.x = THREE.MathUtils.clamp(camera.position.x, -MAX_BOUNDARY, MAX_BOUNDARY);
            camera.position.z = THREE.MathUtils.clamp(camera.position.z, -MAX_BOUNDARY, MAX_BOUNDARY);
        }

        controls.update();
    });

    return null;
};

export default KeyboardControls;