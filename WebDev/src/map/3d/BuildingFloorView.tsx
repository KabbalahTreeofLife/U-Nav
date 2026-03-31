import React, { useState } from 'react';
import type { Building, Floor, Room } from './types';

interface BuildingFloorViewProps {
    building: Building;
    onClose: () => void;
    onRoomClick: (room: Room) => void;
    showDetails?: boolean;
}

export const BuildingFloorView: React.FC<BuildingFloorViewProps> = ({
    building,
    onClose,
    onRoomClick,
    showDetails = true,
}) => {
    const [currentFloor, setCurrentFloor] = useState<Floor>(building.floors[0]);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const handleRoomClick = (room: Room) => {
        if (!showDetails) return;
        setSelectedRoom(room);
        onRoomClick(room);
    };

    const getOccupancyColor = (current: number, capacity: number): string => {
        const ratio = current / capacity;
        if (ratio >= 0.9) return '#dc2626';
        if (ratio >= 0.7) return '#f59e0b';
        return '#22c55e';
    };

    if (!showDetails) {
        return (
            <div className="floor-view-container">
                <div className="floor-view-header">
                    <button className="floor-view-back" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Map
                    </button>
                    <h2 className="floor-view-title">{building.name}</h2>
                </div>
                <div className="guest-restricted">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <h3>Login Required</h3>
                    <p>Please login to view building details, floor plans, and room information.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="floor-view-container">
            <div className="floor-view-header">
                <button className="floor-view-back" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    Back to Map
                </button>
                <h2 className="floor-view-title">{building.name}</h2>
            </div>

            <div className="floor-tabs">
                {building.floors.map((floor) => (
                    <button
                        key={floor.id}
                        className={`floor-tab ${currentFloor.id === floor.id ? 'active' : ''}`}
                        onClick={() => setCurrentFloor(floor)}
                    >
                        Floor {floor.floorNumber}
                    </button>
                ))}
            </div>

            <div className="floor-plan">
                <div className="floor-grid">
                    {currentFloor.rooms.map((room) => (
                        <button
                            key={room.id}
                            className="room-card"
                            style={{
                                borderColor: getOccupancyColor(room.currentOccupancy, room.capacity),
                            }}
                            onClick={() => handleRoomClick(room)}
                        >
                            <span className="room-name">{room.name}</span>
                            {room.subject && (
                                <span className="room-subject">{room.subject}</span>
                            )}
                            <span className="room-occupancy">
                                {room.currentOccupancy}/{room.capacity}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {selectedRoom && (
                <div className="room-modal-overlay" onClick={() => setSelectedRoom(null)}>
                    <div className="room-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="room-modal-header">
                            <h3>{selectedRoom.name}</h3>
                            <button className="room-modal-close" onClick={() => setSelectedRoom(null)}>
                                ×
                            </button>
                        </div>
                        <div className="room-modal-content">
                            {selectedRoom.subject && (
                                <>
                                    <div className="room-detail">
                                        <span className="room-detail-label">Subject</span>
                                        <span className="room-detail-value">{selectedRoom.subject}</span>
                                    </div>
                                    <div className="room-detail">
                                        <span className="room-detail-label">Stub Code</span>
                                        <span className="room-detail-value">{selectedRoom.stubCode}</span>
                                    </div>
                                    <div className="room-detail">
                                        <span className="room-detail-label">Section</span>
                                        <span className="room-detail-value">{selectedRoom.section}</span>
                                    </div>
                                    <div className="room-detail">
                                        <span className="room-detail-label">Teacher</span>
                                        <span className="room-detail-value">{selectedRoom.teacher}</span>
                                    </div>
                                </>
                            )}
                            <div className="room-detail">
                                <span className="room-detail-label">Occupancy</span>
                                <span
                                    className="room-detail-value"
                                    style={{
                                        color: getOccupancyColor(
                                            selectedRoom.currentOccupancy,
                                            selectedRoom.capacity
                                        ),
                                    }}
                                >
                                    {selectedRoom.currentOccupancy}/{selectedRoom.capacity}
                                </span>
                            </div>
                            <div className="room-occupancy-bar">
                                <div
                                    className="room-occupancy-fill"
                                    style={{
                                        width: `${(selectedRoom.currentOccupancy / selectedRoom.capacity) * 100}%`,
                                        backgroundColor: getOccupancyColor(
                                            selectedRoom.currentOccupancy,
                                            selectedRoom.capacity
                                        ),
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuildingFloorView;
