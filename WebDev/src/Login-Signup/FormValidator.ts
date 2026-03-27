import { BaseValidator, ValidationRule } from './validation';

export class FormValidator extends BaseValidator {
    public build(): ValidationRule[] {
        const allRules: ValidationRule[] = [];
        for (const rules of this.rules.values()) {
            allRules.push(...rules);
        }
        return allRules;
    }
}

export class LoginValidator extends BaseValidator {
    public build(): ValidationRule[] {
        return this
            .addRequired('university', 'University')
            .addRequired('username', 'Username')
            .addMinLength('password', 'Password', 6)
            .build();
    }
}

export class SignupValidator extends BaseValidator {
    public build(): ValidationRule[] {
        return this
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
            .addPasswordMatch('password', 'confirmPassword')
            .build();
    }
}

export const createLoginValidator = (): FormValidator => {
    const validator = new FormValidator();
    validator.addRequired('university', 'University');
    validator.addRequired('username', 'Username');
    validator.addMinLength('password', 'Password', 6);
    return validator;
};

export const createSignupValidator = (): FormValidator => {
    const validator = new FormValidator();
    validator.addRequired('university', 'University');
    validator.addRequired('username', 'Username');
    validator.addMinLength('username', 'Username', 3);
    validator.addRequired('password', 'Password');
    validator.addMinLength('password', 'Password', 8);
    validator.addPattern(
        'password',
        'Password',
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain uppercase, lowercase, and a number'
    );
    validator.addRequired('confirmPassword', 'Confirm Password');
    validator.addPasswordMatch('password', 'confirmPassword');
    return validator;
};
