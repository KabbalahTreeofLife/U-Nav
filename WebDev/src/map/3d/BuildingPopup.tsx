import React from 'react';
import type { Building } from './types';

interface BuildingPopupProps {
    building: Building | null;
    onClose: () => void;
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({ building, onClose }) => {
    if (!building) return null;

    return (
        <div
            style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '320px',
                maxHeight: '80vh',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: '#2563eb',
                    color: 'white',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                    {building.name}
                </h2>
                <button
                    onClick={onClose}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'white',
                        fontSize: '24px',
                        cursor: 'pointer',
                        padding: '0 4px',
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ padding: '16px 20px', overflowY: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
                <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '14px' }}>
                    {building.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        Location
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                        X: {building.position[0]}, Y: {building.position[1]}, Z: {building.position[2]}
                    </p>
                </div>

                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        Size
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                        Width: {building.size[0]}, Height: {building.size[1]}, Depth: {building.size[2]}
                    </p>
                </div>

                {building.floors.length > 0 && (
                    <div>
                        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            Floors ({building.floors.length})
                        </h3>

                        {building.floors.map((floor) => (
                            <div
                                key={floor.id}
                                style={{
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div
                                    style={{
                                        background: '#f3f4f6',
                                        padding: '8px 12px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        color: '#374151',
                                        borderBottom: '1px solid #e5e7eb',
                                    }}
                                >
                                    Floor {floor.floorNumber}
                                </div>

                                {floor.rooms.length > 0 ? (
                                    <div style={{ padding: '8px 12px' }}>
                                        {floor.rooms.map((room) => (
                                            <div
                                                key={room.id}
                                                style={{
                                                    padding: '6px 0',
                                                    borderBottom: '1px solid #f3f4f6',
                                                }}
                                            >
                                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                                                    {room.name}
                                                </div>
                                                {room.subject && (
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        {room.stubCode} - {room.subject}
                                                    </div>
                                                )}
                                                {room.teacher && (
                                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                                        Teacher: {room.teacher}
                                                    </div>
                                                )}
                                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                                    Capacity: {room.currentOccupancy}/{room.capacity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '8px 12px', fontSize: '12px', color: '#9ca3af' }}>
                                        No rooms
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {building.floors.length === 0 && (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '16px',
                            color: '#9ca3af',
                            fontSize: '13px',
                        }}
                    >
                        No floor information available
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuildingPopup;