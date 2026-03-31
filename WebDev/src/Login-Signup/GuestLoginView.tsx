import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { useAuth, useUniversities } from '../common';
import '../css/Login-Signup/auth.css';

export const GuestLoginView: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isGuest, loginAsGuest, clearError } = useAuth();
    const { universities, isLoading: isLoadingUniversities } = useUniversities();
    const [selectedUniversity, setSelectedUniversity] = React.useState('');
    const [error, setError] = React.useState<string | null>(null);

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleContinueAsGuest = () => {
        const universityId = parseInt(selectedUniversity, 10);
        if (isNaN(universityId)) {
            setError('Please select a university');
            return;
        }

        const university = universities.find(uni => uni.id === universityId);
        const universityName = university?.name || 'Guest University';
        
        loginAsGuest(universityId, universityName);
        navigate('/map');
    };

    const handleBack = () => {
        navigate('/login');
    };

    if (isAuthenticated && !isGuest) {
        return <Navigate to="/map" replace />;
    }

    const isUniversitiesLoading = isLoadingUniversities;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">U-Nav</h1>
                    <p className="auth-subtitle">Continue as Guest</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleContinueAsGuest(); }} className="auth-form" noValidate>
                    <UniversityDropdown
                        name="university"
                        label="University"
                        value={selectedUniversity}
                        onChange={(e) => {
                            setSelectedUniversity(e.target.value);
                            setError(null);
                        }}
                        universities={universities}
                        placeholder={isUniversitiesLoading ? 'Loading...' : 'Select your University'}
                        required
                        error={error || undefined}
                        disabled={isUniversitiesLoading}
                    />

                    <div className="form-actions">
                        <Button type="submit" disabled={isUniversitiesLoading} fullWidth>
                            {isUniversitiesLoading ? 'Loading...' : 'Continue'}
                        </Button>
                    </div>

                    <div className="guest-features-note">
                        <h4>Guest Features:</h4>
                        <ul>
                            <li>View campus map (2D/3D)</li>
                            <li>Search for buildings</li>
                        </ul>
                        <p className="guest-restricted">Note: Dining and Events require an account.</p>
                    </div>

                    <button
                        type="button"
                        className="back-link"
                        onClick={handleBack}
                    >
                        Back to Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GuestLoginView;
