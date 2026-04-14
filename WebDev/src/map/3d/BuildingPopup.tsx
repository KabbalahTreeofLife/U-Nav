import React, { useState } from 'react';
import { useAuth } from '../../common';
import type { Building } from './types';

interface BuildingPopupProps {
    building: Building | null;
    onClose: () => void;
    style?: React.CSSProperties;
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({ building, onClose, style }) => {
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [areaStatus, setAreaStatus] = useState<{ [key: string]: string }>({});
    const { isGuest } = useAuth();

    if (!building) return null;

    const getAreaKey = (area: string) => `${building.id}:${area}`;

    const handleToggle = (area: string) => {
        if (isGuest) return;
        const areaKey = getAreaKey(area);
        setExpanded((prev) => ({ ...prev, [areaKey]: !prev[areaKey] }));
    };

    const handleStatusSelect = (area: string, status: string) => {
        if (isGuest) return;
        const areaKey = getAreaKey(area);
        setAreaStatus((prev) => ({ ...prev, [areaKey]: status }));
    };

    const buildingAreaMap: { [key: string]: string[] } = {
        'Admin Building': ['Waiting Area'],
        'Registrar Office': ['Waiting Area'],
        'Mary Thomas Building': ['MT Lobby', 'MT Canteen'],
        'University Gym': ['Ug 107', 'Bleachers'],
        'High School Gym': ['Bleachers'],
        'Uy Building': ['1st Floor Dining Hall', '2nd Floor Area'],
        'Henry Luce Library': ['Cyberlibrary', '2nd Floor Library', '3rd Floor Library', 'Activity Room'],
        'University Church': ['Nave'],
        'Rose Memorial Auditorium': ['Auditorium'],
        Gymnasium: ['Bleachers', 'UG 107'],
    };

    const mappedAreas = buildingAreaMap[building.name] ?? [];
    const hasCustomAreas = mappedAreas.length > 0;

    const shouldUseDefaultMainHub = ![
        'College of Engineering',
        'Henry Luce Library',
        'Rose Memorial Auditorium',
        'University Church',
    ].includes(building.name) && !hasCustomAreas;

    const areasForBuilding = hasCustomAreas
        ? mappedAreas
        : (shouldUseDefaultMainHub ? ['Main Hub'] : []);

    const renderAreaCard = (area: string) => {
        const areaKey = getAreaKey(area);

        return (
        <div
            key={areaKey}
            style={{
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '12px',
                minHeight: expanded[areaKey] ? '120px' : '60px',
                textAlign: 'left',
                fontWeight: 500,
                color: '#1f2937',
                border: '1px solid #e5e7eb',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                cursor: 'default',
                transition: 'min-height 0.2s',
            }}
        >
            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '15px' }}>{area}</div>
                {!isGuest && (
                    <button
                        type="button"
                        onClick={() => handleToggle(area)}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            fontSize: '18px',
                            lineHeight: '18px',
                            fontWeight: 700,
                            color: '#1f2937',
                            width: '24px',
                            height: '24px',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        aria-label={expanded[areaKey] ? `Close ${area} dropdown` : `Open ${area} dropdown`}
                    >
                        {expanded[areaKey] ? '⌃' : '⌄'}
                    </button>
                )}
            </div>
            <div style={{ fontWeight: 400, fontSize: '14px', marginLeft: 0 }}>
                Status: {areaStatus[areaKey] || ''}
            </div>
            {expanded[areaKey] && (
                <div style={{ marginTop: '10px', fontSize: '13px', color: '#374151' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Report</div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <button
                            type="button"
                            disabled={isGuest}
                            onClick={() => handleStatusSelect(area, 'Empty')}
                            style={{ flex: 1, background: '#bbf7d0', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#166534', border: '1px solid #22c55e', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                        >
                            Empty
                        </button>
                        <button
                            type="button"
                            disabled={isGuest}
                            onClick={() => handleStatusSelect(area, 'Partially Full')}
                            style={{ flex: 1, background: '#fef9c3', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#a16207', border: '1px solid #fde047', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                        >
                            Partially Full
                        </button>
                        <button
                            type="button"
                            disabled={isGuest}
                            onClick={() => handleStatusSelect(area, 'Full')}
                            style={{ flex: 1, background: '#fecaca', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#991b1b', border: '1px solid #f87171', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                        >
                            Full
                        </button>
                    </div>
                </div>
            )}
        </div>
        );
    };

    return (
        <div 
            className="events-modal-overlay"
            onClick={onClose} 
            style={{
                ...style,
                zIndex: 400
            }}
        >
            <div 
                className="events-modal" 
                onClick={(e) => e.stopPropagation()}
                style={{ zIndex: 400 }}
            >
                <div className="events-modal-header">
                    <h2>{building.name}</h2>
                    <button className="events-modal-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="events-modal-content">
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937', textAlign: 'left' }}>
                        Location
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textAlign: 'left' }}>
                        X: {building.position[0].toFixed(3)}, Y: {building.position[1].toFixed(3)}, Z: {building.position[2].toFixed(3)}
                    </p>
                </div>
                <div style={{ marginBottom: '16px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#1f2937', textAlign: 'left' }}>
                        Size
                    </h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#6b7280', textAlign: 'left' }}>
                        Width: {building.size[0].toFixed(3)}, Height: {building.size[1].toFixed(3)}, Depth: {building.size[2].toFixed(3)}
                    </p>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'left' }}>Description</div>
                <p style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '14px' }}>
                    {building.description}
                </p>
                <div style={{ fontWeight: 'bold', fontSize: '15px', textAlign: 'left' }}>Areas</div>
                {building.name === 'College of Engineering' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
                        {['Lobby', 'Study Area'].map((area) => renderAreaCard(area))}
                    </div>
                )}
                {building.name !== 'College of Engineering' && areasForBuilding.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
                        {areasForBuilding.map((area) => renderAreaCard(area))}
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default BuildingPopup;