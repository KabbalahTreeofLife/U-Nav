export interface ValidationRule {
  test: (value: string, formData?: Record<string, string>) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
