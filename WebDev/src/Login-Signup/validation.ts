export interface ValidationRule {
    test: (value: string, formData?: Record<string, string>) => boolean;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: Record<string, string>;
}

export abstract class BaseValidator {
    protected rules: Map<string, ValidationRule[]>;
    protected errors: Map<string, string>;

    constructor() {
        this.rules = new Map();
        this.errors = new Map();
    }

    public addRule(fieldName: string, rule: ValidationRule): this {
        const existingRules = this.rules.get(fieldName) || [];
        this.rules.set(fieldName, [...existingRules, rule]);
        return this;
    }

    public addRequired(fieldName: string, label: string): this {
        return this.addRule(fieldName, {
            test: (value) => value.trim().length > 0,
            message: `${label} is required`,
        });
    }

    public addMinLength(fieldName: string, label: string, minLength: number): this {
        return this.addRule(fieldName, {
            test: (value) => value.length >= minLength,
            message: `${label} must be at least ${minLength} characters`,
        });
    }

    public addMaxLength(fieldName: string, label: string, maxLength: number): this {
        return this.addRule(fieldName, {
            test: (value) => value.length <= maxLength,
            message: `${label} must be no more than ${maxLength} characters`,
        });
    }

    public addPattern(fieldName: string, label: string, pattern: RegExp, message: string): this {
        return this.addRule(fieldName, {
            test: (value) => pattern.test(value),
            message: message || `${label} format is invalid`,
        });
    }

    public addEmail(fieldName: string, label: string): this {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return this.addPattern(fieldName, label, emailPattern, `${label} must be a valid email address`);
    }

    public addPasswordMatch(passwordField: string, confirmField: string): this {
        return this.addRule(confirmField, {
            test: (_, formData = {}) => formData[passwordField] === formData[confirmField],
            message: 'Passwords do not match',
        });
    }

    public validate(formData: Record<string, string>): ValidationResult {
        this.errors.clear();

        for (const [fieldName, fieldRules] of this.rules.entries()) {
            const value = formData[fieldName] || '';

            for (const rule of fieldRules) {
                if (!rule.test(value, formData)) {
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

    public getErrors(): Record<string, string> {
        return Object.fromEntries(this.errors);
    }

    public getError(fieldName: string): string | undefined {
        return this.errors.get(fieldName);
    }

    public clearErrors(): void {
        this.errors.clear();
    }
}
