import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BottomNavProps {
    className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ className = '' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        {
            path: '/map',
            label: 'Map',
            icon: (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
                    <path d="M8 2v16" />
                    <path d="M16 6v16" />
                </svg>
            ),
        },
        {
            path: '/dining',
            label: 'Dining',
            icon: (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                    <line x1="6" y1="1" x2="6" y2="4" />
                    <line x1="10" y1="1" x2="10" y2="4" />
                    <line x1="14" y1="1" x2="14" y2="4" />
                </svg>
            ),
        },
        {
            path: '/about',
            label: 'About',
            icon: (
                <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <circle cx="12" cy="8" r="1" fill="currentColor" stroke="none" />
                </svg>
            ),
        },
    ];

    return (
        <nav className={`bottom-nav ${className}`}>
            {navItems.map((item) => (
                <button
                    key={item.path}
                    className={`nav-item ${isActive(item.path) ? 'nav-item-active' : ''}`}
                    onClick={() => navigate(item.path)}
                >
                    {item.icon}
                    <span className="nav-label">{item.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default BottomNav;
