import React from 'react';

interface PasswordRequirementsProps {
  password: string;
}

interface Requirement {
  test: (password: string) => boolean;
  label: string;
}

const requirements: Requirement[] = [
  { test: (pwd) => pwd.length >= 8, label: 'At least 8 characters' },
  { test: (pwd) => /[A-Z]/.test(pwd), label: 'One uppercase letter' },
  { test: (pwd) => /[a-z]/.test(pwd), label: 'One lowercase letter' },
  { test: (pwd) => /\d/.test(pwd), label: 'One number' },
];

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const hasStartedTyping = password.length > 0;

  return (
    <div className="password-requirements">
      {requirements.map((req, index) => {
        const isMet = req.test(password);
        return (
          <p key={index} className={`requirement ${hasStartedTyping ? (isMet ? 'requirement-met' : 'requirement-not-met') : ''}`}>
            {hasStartedTyping ? (
              <span className="requirement-icon">{isMet ? '\u2713' : '\u2717'}</span>
            ) : (
              <span className="requirement-bullet">&#8226;</span>
            )}
            {req.label}
          </p>
        );
      })}
    </div>
  );
};
