import type { ValidationRule, ValidationResult } from './validation';

export class FormValidator {
  private rules: Map<string, ValidationRule[]>;
  private errors: Map<string, string>;

  constructor() {
    this.rules = new Map();
    this.errors = new Map();
  }

  addRule(fieldName: string, rule: ValidationRule): this {
    const existingRules = this.rules.get(fieldName) || [];
    this.rules.set(fieldName, [...existingRules, rule]);
    return this;
  }

  addRequired(fieldName: string, label: string): this {
    return this.addRule(fieldName, {
      test: (value) => value.trim().length > 0,
      message: `${label} is required`,
    });
  }

  addMinLength(fieldName: string, label: string, minLength: number): this {
    return this.addRule(fieldName, {
      test: (value) => value.length >= minLength,
      message: `${label} must be at least ${minLength} characters`,
    });
  }

  addMaxLength(fieldName: string, label: string, maxLength: number): this {
    return this.addRule(fieldName, {
      test: (value) => value.length <= maxLength,
      message: `${label} must be no more than ${maxLength} characters`,
    });
  }

  addPattern(
    fieldName: string,
    label: string,
    pattern: RegExp,
    message: string
  ): this {
    return this.addRule(fieldName, {
      test: (value) => pattern.test(value),
      message: message || `${label} format is invalid`,
    });
  }

  addEmail(fieldName: string, label: string): this {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this.addPattern(
      fieldName,
      label,
      emailPattern,
      `${label} must be a valid email address`
    );
  }

  addPasswordMatch(
    passwordField: string,
    confirmField: string
  ): this {
    return this.addRule(confirmField, {
      test: (_, formData = {}) => formData[passwordField] === formData[confirmField],
      message: 'Passwords do not match',
    });
  }

  validate(formData: Record<string, string>): ValidationResult {
    this.errors.clear();

    for (const [fieldName, rules] of this.rules.entries()) {
      const value = formData[fieldName] || '';

      for (const rule of rules) {
        if (!rule.test(value, formData || {})) {
          this.errors.set(fieldName, rule.message);
          break;
        }
      }
    }

    return {
      isValid: this.errors.size === 0,
      errors: Object.fromEntries(this.errors),
    };
  }

  getErrors(): Record<string, string> {
    return Object.fromEntries(this.errors);
  }

  getError(fieldName: string): string | undefined {
    return this.errors.get(fieldName);
  }

  clearErrors(): void {
    this.errors.clear();
  }
}

export const createLoginValidator = (): FormValidator => {
  return new FormValidator()
    .addRequired('university', 'University')
    .addRequired('username', 'Username')
    .addMinLength('password', 'Password', 6);
};

export const createSignupValidator = (): FormValidator => {
  return new FormValidator()
    .addRequired('university', 'University')
    .addRequired('username', 'Username')
    .addMinLength('username', 'Username', 3)
    .addRequired('password', 'Password')
    .addMinLength('password', 'Password', 8)
    .addPattern(
      'password',
      'Password',
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain uppercase, lowercase, and a number'
    )
    .addRequired('confirmPassword', 'Confirm Password')
    .addPasswordMatch('password', 'confirmPassword');
};
