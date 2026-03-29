import React, { useState, useMemo } from 'react';
import { CampusScene } from './CampusScene';
import { BuildingFloorView } from './BuildingFloorView';
import { getUniversityMap, getDefaultMap, GUEST_BUILDINGS, type UniversityMap } from './universities';
import { useAuth } from '../common/AuthContext';
import type { Building, Room } from './types';

export const MapView3D: React.FC = () => {
    const { isGuest, universityId, user } = useAuth();
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);
    const [showHeatMap, setShowHeatMap] = useState(false);
    const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

    const universityMap: UniversityMap = useMemo(() => {
        if (isGuest || !universityId) {
            return getDefaultMap();
        }
        const map = getUniversityMap(universityId);
        return map || getDefaultMap();
    }, [isGuest, universityId]);

    const buildings: Building[] = isGuest ? GUEST_BUILDINGS : universityMap.buildings;

    const glbUrl = isGuest ? undefined : universityMap.glbFile;

    const handleBuildingClick = (building: Building) => {
        if (isGuest) {
            return;
        }
        setSelectedBuilding(building);
    };

    const handleBuildingHover = (building: Building | null) => {
        if (isGuest) {
            document.body.style.cursor = building ? 'not-allowed' : 'auto';
        } else {
            document.body.style.cursor = building ? 'pointer' : 'auto';
        }
    };

    const handleRoomClick = (room: Room) => {
        console.log('Room clicked:', room);
    };

    const handleCloseFloorView = () => {
        setSelectedBuilding(null);
    };

    const canAccessDetails = !isGuest && user !== null;

    return (
        <div className="map3d-container">
            {viewMode === '3d' && !selectedBuilding ? (
                <>
                    <div className="map3d-controls">
                        {!isGuest && (
                            <button
                                className={`map3d-control-btn ${showHeatMap ? 'active' : ''}`}
                                onClick={() => setShowHeatMap(!showHeatMap)}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 2v20M2 12h20" />
                                    <circle cx="12" cy="12" r="10" />
                                </svg>
                                {showHeatMap ? 'Hide Heat Map' : 'Show Heat Map'}
                            </button>
                        )}
                        <button
                            className="map3d-control-btn"
                            onClick={() => setViewMode('2d')}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                <path d="M3 9h18M9 21V9" />
                            </svg>
                            2D View
                        </button>
                    </div>

                    <CampusScene
                        buildings={buildings}
                        glbUrl={glbUrl}
                        onBuildingClick={handleBuildingClick}
                        onBuildingHover={handleBuildingHover}
                        isInteractive={!isGuest}
                    />
                </>
            ) : selectedBuilding ? (
                <BuildingFloorView
                    building={selectedBuilding}
                    onClose={handleCloseFloorView}
                    onRoomClick={handleRoomClick}
                    showDetails={canAccessDetails}
                />
            ) : (
                <div className="map2d-placeholder">
                    <div className="map-placeholder">
                        <svg className="map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M3 9h18M9 21V9" />
                        </svg>
                        <h2>2D Campus Map</h2>
                        <p>Coming soon!</p>
                        <button
                            className="map3d-control-btn"
                            onClick={() => setViewMode('3d')}
                        >
                            Back to 3D View
                        </button>
                    </div>
                </div>
            )}

            {selectedBuilding && (
                <button className="floor-view-exit" onClick={handleCloseFloorView}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            )}

            {isGuest && (
                <div className="guest-notice">
                    Guest mode: Building details are limited. Login for full access.
                </div>
            )}
        </div>
    );
};

export default MapView3D;
