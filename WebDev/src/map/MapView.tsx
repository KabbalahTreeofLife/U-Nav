import React from 'react';
import { TopNav, BottomNav } from '../common';
import '../css/Map/Map.css';

export const MapView: React.FC = () => {
    return (
        <div className="map-container">
            <TopNav title="U-Nav" />
            <div className="map-content">
                <div className="map-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    <h2>Campus Map</h2>
                    <p>Coming soon!</p>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default MapView;
