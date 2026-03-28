import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField, Button } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { PasswordRequirements } from './PasswordRequirements';
import { useForm } from './useForm';
import { createSignupValidator } from './FormValidator';
import { useAuth, useUniversities } from '../common';
import '../css/Login-Signup/auth.css';

interface SignupFormData {
    university: string;
    username: string;
    password: string;
    confirmPassword: string;
    [key: string]: string;
}

const initialValues: SignupFormData = {
    university: '',
    username: '',
    password: '',
    confirmPassword: '',
};

export const SignupView: React.FC = () => {
    const navigate = useNavigate();
    const { signup, isLoading: authLoading, error: authError, clearError } = useAuth();
    const { universities, isLoading: isLoadingUniversities } = useUniversities();
    const [successMessage, setSuccessMessage] = useState<string>('');

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleSignup = async (values: SignupFormData) => {
        setSuccessMessage('');
        
        const success = await signup(
            parseInt(values.university),
            values.username,
            values.password
        );

        if (success) {
            setSuccessMessage('Account created successfully! Please sign in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }
    };

    const {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useForm<SignupFormData>({
        initialValues,
        validator: createSignupValidator(),
        onSubmit: handleSignup,
    });

    const isLoading = isSubmitting || isLoadingUniversities || authLoading;

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join U-Nav today</p>
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
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
                        required
                        autoComplete="new-password"
                        error={errors.password}
                        disabled={isLoading}
                    />

                    <InputField
                        type="password"
                        name="confirmPassword"
                        label="Confirm Password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm your password"
                        required
                        autoComplete="new-password"
                        error={errors.confirmPassword}
                        disabled={isLoading}
                    />

                    <PasswordRequirements password={values.password} />

                    {successMessage && (
                        <div className="auth-success">{successMessage}</div>
                    )}

                    {authError && (
                        <div className="auth-error">{authError}</div>
                    )}

                    <div className="form-actions">
                        <Button type="submit" disabled={isLoading} fullWidth>
                            {isSubmitting ? 'Creating account...' : 'Create Account'}
                        </Button>
                    </div>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <button
                            type="button"
                            className="auth-link-button"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupView;
