import React, { useState } from 'react';
import { useAuth } from '../../common';
import type { Building } from './types';

interface BuildingPopupProps {
    building: Building | null;
    onClose: () => void;
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({ building, onClose }) => {
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const { isGuest } = useAuth();

    if (!building) return null;

    const handleToggle = (area: string) => {
        if (isGuest) return;
        setExpanded((prev) => ({ ...prev, [area]: !prev[area] }));
    };

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
            <div style={{ height: '1px', background: '#e5e7eb', width: '100%' }} />

            <div style={{ padding: '16px 20px', overflowY: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937', textAlign: 'left' }}>
                        Location
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textAlign: 'left' }}>
                        X: {building.position[0]}, Y: {building.position[1]}, Z: {building.position[2]}
                    </p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937', textAlign: 'left' }}>
                        Size
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textAlign: 'left' }}>
                        Width: {building.size[0]}, Height: {building.size[1]}, Depth: {building.size[2]}
                    </p>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'left' }}>Description</div>
                <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '14px' }}>
                    {building.description}
                </p>
                <div style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'left' }}>Areas</div>
                {building.name === 'College of Engineering' && (
                    <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
                            {/* Lobby Box */}
                            <div
                                style={{
                                    background: '#f3f4f6',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minHeight: expanded['Lobby'] ? '120px' : '60px',
                                    textAlign: 'left',
                                    fontWeight: 500,
                                    color: '#1f2937',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    cursor: isGuest ? 'not-allowed' : 'pointer',
                                    transition: 'min-height 0.2s',
                                }}
                                onClick={() => handleToggle('Lobby')}
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '2px' }}>Lobby</div>
                                <div style={{ fontWeight: 400, fontSize: '14px', marginLeft: 0 }}>Status:</div>
                                {expanded['Lobby'] && (
                                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#374151' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Report</div>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ flex: 1, background: '#bbf7d0', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#166534', border: '1px solid #22c55e', textAlign: 'center' }}>Empty</div>
                                            <div style={{ flex: 1, background: '#fef9c3', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#a16207', border: '1px solid #fde047', textAlign: 'center' }}>Partially Full</div>
                                            <div style={{ flex: 1, background: '#fecaca', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#991b1b', border: '1px solid #f87171', textAlign: 'center' }}>Full</div>
                                        </div>
                                        {/* Expanded content placeholder */}
                                    </div>
                                )}
                            </div>
                            {/* Study Area Box */}
                            <div
                                style={{
                                    background: '#f3f4f6',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    minHeight: expanded['Study Area'] ? '120px' : '60px',
                                    textAlign: 'left',
                                    fontWeight: 500,
                                    color: '#1f2937',
                                    border: '1px solid #e5e7eb',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    cursor: isGuest ? 'not-allowed' : 'pointer',
                                    opacity: isGuest ? 0.6 : 1,
                                    transition: 'min-height 0.2s',
                                }}
                                onClick={() => handleToggle('Study Area')}
                            >
                                <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '2px' }}>Study Area</div>
                                <div style={{ fontWeight: 400, fontSize: '14px', marginLeft: 0 }}>Status:</div>
                                {expanded['Study Area'] && (
                                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#374151' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Report</div>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <div style={{ flex: 1, background: '#bbf7d0', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#166534', border: '1px solid #22c55e', textAlign: 'center' }}>Empty</div>
                                            <div style={{ flex: 1, background: '#fef9c3', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#a16207', border: '1px solid #fde047', textAlign: 'center' }}>Partially Full</div>
                                            <div style={{ flex: 1, background: '#fecaca', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#991b1b', border: '1px solid #f87171', textAlign: 'center' }}>Full</div>
                                        </div>
                                        {/* Expanded content placeholder */}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Status label moved inside each area box */}
                    </>
                )}
            </div>
        </div>
    );
};

export default BuildingPopup;