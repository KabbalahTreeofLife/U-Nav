import React from 'react';
import { Link } from 'react-router-dom';
import { InputField, Button, FormDivider } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { useForm } from './useForm';
import { createLoginValidator } from './FormValidator';
import type { University } from '../common/types';
import '../css/Login-Signup/auth.css';

const UNIVERSITIES: University[] = [
  { id: 'cpu', name: 'Central Philippine University' },
  { id: 'wvsu', name: 'West Visayas State University' },
  { id: 'upv', name: 'University of the Philippines - Visayas' },
  { id: 'wit', name: 'Western Institute of Technology'},
  { id: 'usa', name: 'University of San Agustin'}
];

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
  const handleLogin = async (values: LoginFormData) => {
    console.log('Logging in user:', values);
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
            universities={UNIVERSITIES}
            required
            error={errors.university}
          />

          <InputField
            type="text"
            name="username"
            label="Username"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Student ID or Email"
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

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting} fullWidth>
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
