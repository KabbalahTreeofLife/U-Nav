import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface TopNavProps {
    title?: string;
    showLogout?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ title = 'U-Nav', showLogout = true }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="top-nav">
            <div className="top-nav-title">{title}</div>
            {showLogout && (
                <button className="top-nav-logout" onClick={handleLogout} aria-label="Logout">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16,17 21,12 16,7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            )}
        </nav>
    );
};

export default TopNav;
