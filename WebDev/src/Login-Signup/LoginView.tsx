import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { InputField, Button, FormDivider } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { useForm } from './useForm';
import { createLoginValidator } from './FormValidator';
import { useAuth, useUniversities } from '../common';
import '../css/Login-Signup/auth.css';

interface LoginFormData {
    university: string;
    username: string;
    password: string;
    [key: string]: string;
}

const initialValues: LoginFormData = {
    university: '',
    username: '',
    password: '',
};

export const LoginView: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login, isLoading: authLoading, error: authError, clearError } = useAuth();
    const { universities, isLoading: isLoadingUniversities } = useUniversities();

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleLogin = async (values: LoginFormData) => {
        const universityId = parseInt(values.university, 10);
        if (isNaN(universityId)) {
            return;
        }
        await login(values.username, values.password, universityId);
    };

    const handleGuestLogin = () => {
        alert('Guest mode is not yet implemented.');
    };

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm<LoginFormData>({
        initialValues,
        validator: createLoginValidator(),
        onSubmit: handleLogin,
    });

    if (isAuthenticated) {
        return <Navigate to="/map" replace />;
    }

    const isLoading = isSubmitting || isLoadingUniversities || authLoading;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">U-Nav</h1>
                    <p className="auth-subtitle">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form" noValidate>
                    <UniversityDropdown
                        name="university"
                        label="University"
                        value={values.university}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        universities={universities}
                        placeholder={isLoadingUniversities ? 'Loading...' : 'Select your University'}
                        required
                        error={errors.university}
                        disabled={isLoading}
                    />

                    <InputField
                        type="text"
                        name="username"
                        label="Username"
                        value={values.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your username"
                        required
                        autoComplete="username"
                        error={errors.username}
                        disabled={isLoading}
                    />

                    <InputField
                        type="password"
                        name="password"
                        label="Password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Enter your password"
                        required
                        autoComplete="current-password"
                        error={errors.password}
                        disabled={isLoading}
                    />

                    {authError && (
                        <div className="auth-error">{authError}</div>
                    )}

                    <div className="form-actions">
                        <Button type="submit" disabled={isLoading} fullWidth>
                            {isSubmitting ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>

                    <FormDivider />

                    <Button
                        type="button"
                        onClick={handleGuestLogin}
                        variant="outline"
                        fullWidth
                        disabled={isSubmitting}
                    >
                        Continue as Guest
                    </Button>
                </form>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="auth-link-button"
                            onClick={() => navigate('/signup')}
                        >
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
