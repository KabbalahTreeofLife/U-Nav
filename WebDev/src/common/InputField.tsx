import React from 'react';

interface InputFieldProps {
  type: 'text' | 'password' | 'email';
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  error?: string;
  disabled?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  required = false,
  autoComplete,
  error,
  disabled = false,
}) => {
  const hasError = Boolean(error);

  return (
    <div className="input-group">
      <label htmlFor={name} className="input-label">
        {label}
        {required && <span className="required-indicator">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        disabled={disabled}
        className={`input-field ${hasError ? 'input-error' : ''}`}
      />
      {hasError && <span className="error-message">{error}</span>}
    </div>
  );
};
