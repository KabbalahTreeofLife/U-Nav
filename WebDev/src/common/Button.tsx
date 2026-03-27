import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  type?: 'submit' | 'button';
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  variant = 'primary',
  disabled = false,
  children,
  fullWidth = false,
}) => {
  const variantClass = `btn-${variant}`;
  const fullWidthClass = fullWidth ? 'btn-full-width' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClass} ${fullWidthClass}`.trim()}
    >
      {children}
    </button>
  );
};
