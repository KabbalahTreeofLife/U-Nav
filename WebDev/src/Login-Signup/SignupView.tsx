import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputField, Button, FormDivider } from '../common';
import { UniversityDropdown } from './UniversityDropdown';
import { useForm } from './useForm';
import { createSignupValidator } from './FormValidator';
import type { University } from '../common/types';
import '../css/auth.css';

const UNIVERSITIES: University[] = [
  { id: 'uni-a', name: 'University of Science' },
  { id: 'uni-b', name: 'Tech Institute' },
  { id: 'uni-c', name: 'State College' },
];

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

  const handleSignup = async (values: SignupFormData) => {
    const { university, username, password } = values;
    console.log('Signing up user:', { university, username, password });
    navigate('/login');
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

          <FormDivider text="password requirements" />

          <div className="password-requirements">
            <p className="requirement">At least 8 characters</p>
            <p className="requirement">One uppercase letter</p>
            <p className="requirement">One lowercase letter</p>
            <p className="requirement">One number</p>
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting} fullWidth>
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
