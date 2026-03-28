import React from 'react';
import { TopNav, BottomNav } from '../common';
import '../css/Dining/Dining.css';

export const DiningView: React.FC = () => {
    return (
        <div className="dining-container">
            <TopNav title="U-Nav" />
            <div className="dining-content">
                <div className="dining-placeholder">
                    <svg className="dining-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                        <line x1="6" y1="1" x2="6" y2="4" />
                        <line x1="10" y1="1" x2="10" y2="4" />
                        <line x1="14" y1="1" x2="14" y2="4" />
                    </svg>
                    <h2>Dining Guide</h2>
                    <p>Campus eateries and restaurants coming soon!</p>
                    <p className="dining-note">Find the best places to eat on campus</p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default DiningView;
