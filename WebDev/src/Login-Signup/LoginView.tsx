import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InputField, Button, FormDivider } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { useForm } from './useForm';
import { createLoginValidator } from './FormValidator';
import { authApi } from '../api';
import type { University } from '../api/types';
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
  const [universities, setUniversities] = useState<University[]>([]);
  const [apiError, setApiError] = useState<string>('');
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      const result = await authApi.getUniversities();
      if (result.success) {
        setUniversities(result.data.universities);
      }
      setIsLoadingUniversities(false);
    };
    fetchUniversities();
  }, []);

  const handleLogin = async (values: LoginFormData) => {
    setApiError('');
    
    const result = await authApi.login({
      username: values.username,
      password: values.password,
    });

    if (result.success) {
      console.log('Login successful:', result.data);
      alert('Login successful! Welcome, ' + result.data.user?.username);
    } else {
      setApiError(result.error);
    }
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
            disabled={isSubmitting || isLoadingUniversities}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          {apiError && (
            <div className="auth-error">{apiError}</div>
          )}

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting || isLoadingUniversities} fullWidth>
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
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
