import { useState } from 'react';
import type { BuildingLocation } from '../map/3d/buildingData';

interface FloorSelectorProps {
    building: BuildingLocation | null;
    currentFloor: number;
    onFloorChange: (floor: number) => void;
    visible: boolean;
}

export const FloorSelector: React.FC<FloorSelectorProps> = ({
    building,
    currentFloor,
    onFloorChange,
    visible,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!visible || !building) return null;

    const floors = Array.from({ length: building.floors }, (_, i) => i + 1);

    return (
        <div className="floor-selector">
            <div 
                className="floor-selector-trigger"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="floor-label">Floor {currentFloor}</span>
                <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    className={`chevron ${isExpanded ? 'expanded' : ''}`}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {isExpanded && (
                <div className="floor-selector-dropdown">
                    {floors.map((floor) => (
                        <div
                            key={floor}
                            className={`floor-option ${floor === currentFloor ? 'active' : ''}`}
                            onClick={() => {
                                onFloorChange(floor);
                                setIsExpanded(false);
                            }}
                        >
                            Floor {floor}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const useIndoorPosition = () => {
    const [currentBuilding, setCurrentBuilding] = useState<BuildingLocation | null>(null);
    const [currentFloor, setCurrentFloor] = useState<number>(1);
    const [isIndoor, setIsIndoor] = useState<boolean>(false);

    const checkIndoorStatus = (distanceToBuildingMeters: number, indoorThreshold: number = 20) => {
        if (distanceToBuildingMeters < indoorThreshold) {
            setIsIndoor(true);
            return true;
        }
        setIsIndoor(false);
        return false;
    };

    const setBuilding = (building: BuildingLocation | null) => {
        setCurrentBuilding(building);
        if (building) {
            setCurrentFloor(1);
        }
    };

    return {
        currentBuilding,
        currentFloor,
        isIndoor,
        checkIndoorStatus,
        setBuilding,
        setCurrentFloor,
    };
};

export default FloorSelector;