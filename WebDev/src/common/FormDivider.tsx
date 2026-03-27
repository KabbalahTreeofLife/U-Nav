import React from 'react';

interface FormDividerProps {
  text?: string;
}

export const FormDivider: React.FC<FormDividerProps> = ({ text = 'or' }) => {
  return (
    <div className="form-divider">
      <span className="divider-line" />
      <span className="divider-text">{text}</span>
      <span className="divider-line" />
    </div>
  );
};
