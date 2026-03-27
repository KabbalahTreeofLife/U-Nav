import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputField, Button } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { PasswordRequirements } from './PasswordRequirements';
import { useForm } from './useForm';
import { createSignupValidator } from './FormValidator';
import { authApi } from '../api';
import type { University } from '../api/types';
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

  const handleSignup = async (values: SignupFormData) => {
    setApiError('');

    const result = await authApi.signup({
      university_id: parseInt(values.university),
      username: values.username,
      password: values.password,
    });

    if (result.success) {
      console.log('Signup successful:', result.data);
      alert('Account created successfully! Please sign in.');
      navigate('/login');
    } else {
      setApiError(result.error);
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
            disabled={isSubmitting || isLoadingUniversities}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />

          <PasswordRequirements password={values.password} />

          {apiError && (
            <div className="auth-error">{apiError}</div>
          )}

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting || isLoadingUniversities} fullWidth>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupView;
