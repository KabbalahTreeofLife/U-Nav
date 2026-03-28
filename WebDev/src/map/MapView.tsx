import React from 'react';
import { TopNav, BottomNav } from '../common';
import '../css/Map/Map.css';

export const MapView: React.FC = () => {
    return (
        <div className="map-container">
            <TopNav title="U-Nav" />
            <div className="map-content">
                <div className="map-placeholder">
                    <svg className="map-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                        <path d="M8 2v16" />
                        <path d="M16 6v16" />
                    </svg>
                    <h2>Campus Map</h2>
                    <p>Interactive 3D map is coming soon!</p>
                    <p className="map-note">Navigate through Central Philippine University with ease</p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default MapView;
