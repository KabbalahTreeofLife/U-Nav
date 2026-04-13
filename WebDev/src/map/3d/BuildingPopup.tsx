import React, { useState } from 'react';
import { useAuth } from '../../common';
import type { Building } from './types';

interface BuildingPopupProps {
    building: Building | null;
    onClose: () => void;
}

export const BuildingPopup: React.FC<BuildingPopupProps> = ({ building, onClose }) => {
    const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
    const [areaStatus, setAreaStatus] = useState<{ [key: string]: string }>({});
    const { isGuest } = useAuth();

    if (!building) return null;

    const handleToggle = (area: string) => {
        if (isGuest) return;
        setExpanded((prev) => ({ ...prev, [area]: !prev[area] }));
    };

    const handleStatusSelect = (area: string, status: string) => {
        if (isGuest) return;
        setAreaStatus((prev) => ({ ...prev, [area]: status }));
    };

    const buildingAreaMap: { [key: string]: string[] } = {
        'Henry Luce Library': ['Cyberlibrary', '2nd Floor Library', '3rd Floor Library', 'Activity Room'],
        Chapel: ['Nave'],
        'Rose Memorial Auditorium': ['Auditorium'],
        Gymnasium: ['Bleachers', 'UG 107'],
    };

    const renderAreaCard = (area: string) => (
        <div
            key={area}
            style={{
                background: '#f3f4f6',
                borderRadius: '8px',
                padding: '12px',
                minHeight: expanded[area] ? '120px' : '60px',
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
                        aria-label={expanded[area] ? `Close ${area} dropdown` : `Open ${area} dropdown`}
                    >
                        {expanded[area] ? '⌃' : '⌄'}
                    </button>
                )}
            </div>
            <div style={{ fontWeight: 400, fontSize: '14px', marginLeft: 0 }}>
                Status: {areaStatus[area] || ''}
            </div>
            {expanded[area] && (
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
                                    cursor: 'default',
                                    transition: 'min-height 0.2s',
                                }}
                            >
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Lobby</div>
                                    {!isGuest && (
                                        <button
                                            type="button"
                                            onClick={() => handleToggle('Lobby')}
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
                                            aria-label={expanded['Lobby'] ? 'Close Lobby dropdown' : 'Open Lobby dropdown'}
                                        >
                                            {expanded['Lobby'] ? '⌃' : '⌄'}
                                        </button>
                                    )}
                                </div>
                                <div style={{ fontWeight: 400, fontSize: '14px', marginLeft: 0 }}>
                                    Status: {areaStatus['Lobby'] || ''}
                                </div>
                                {expanded['Lobby'] && (
                                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#374151' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Report</div>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <button
                                                type="button"
                                                disabled={isGuest}
                                                onClick={() => handleStatusSelect('Lobby', 'Empty')}
                                                style={{ flex: 1, background: '#bbf7d0', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#166534', border: '1px solid #22c55e', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                                            >
                                                Empty
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isGuest}
                                                onClick={() => handleStatusSelect('Lobby', 'Partially Full')}
                                                style={{ flex: 1, background: '#fef9c3', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#a16207', border: '1px solid #fde047', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                                            >
                                                Partially Full
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isGuest}
                                                onClick={() => handleStatusSelect('Lobby', 'Full')}
                                                style={{ flex: 1, background: '#fecaca', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#991b1b', border: '1px solid #f87171', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                                            >
                                                Full
                                            </button>
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
                                    cursor: 'default',
                                    transition: 'min-height 0.2s',
                                }}
                            >
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                                    <div style={{ fontWeight: 'bold', fontSize: '15px' }}>Study Area</div>
                                    {!isGuest && (
                                        <button
                                            type="button"
                                            onClick={() => handleToggle('Study Area')}
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
                                            aria-label={expanded['Study Area'] ? 'Close Study Area dropdown' : 'Open Study Area dropdown'}
                                        >
                                            {expanded['Study Area'] ? '⌃' : '⌄'}
                                        </button>
                                    )}
                                </div>
                                <div style={{ fontWeight: 400, fontSize: '14px', marginLeft: 0 }}>
                                    Status: {areaStatus['Study Area'] || ''}
                                </div>
                                {expanded['Study Area'] && (
                                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#374151' }}>
                                        <div style={{ fontWeight: 'bold', marginBottom: '6px' }}>Report</div>
                                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <button
                                                type="button"
                                                disabled={isGuest}
                                                onClick={() => handleStatusSelect('Study Area', 'Empty')}
                                                style={{ flex: 1, background: '#bbf7d0', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#166534', border: '1px solid #22c55e', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                                            >
                                                Empty
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isGuest}
                                                onClick={() => handleStatusSelect('Study Area', 'Partially Full')}
                                                style={{ flex: 1, background: '#fef9c3', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#a16207', border: '1px solid #fde047', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                                            >
                                                Partially Full
                                            </button>
                                            <button
                                                type="button"
                                                disabled={isGuest}
                                                onClick={() => handleStatusSelect('Study Area', 'Full')}
                                                style={{ flex: 1, background: '#fecaca', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, color: '#991b1b', border: '1px solid #f87171', textAlign: 'center', cursor: isGuest ? 'not-allowed' : 'pointer' }}
                                            >
                                                Full
                                            </button>
                                        </div>
                                        {/* Expanded content placeholder */}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Status label moved inside each area box */}
                    </>
                )}
                {buildingAreaMap[building.name] && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '8px' }}>
                        {buildingAreaMap[building.name].map((area) => renderAreaCard(area))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuildingPopup;