import { BaseValidator } from './validation';

export class FormValidator extends BaseValidator {}

export const createLoginValidator = (): FormValidator => {
    const validator = new FormValidator();
    validator.addRequired('university', 'University');
    validator.addRequired('email', 'Email');
    validator.addEmail('email', 'Email');
    validator.addMinLength('password', 'Password', 6);
    return validator;
};

export const createSignupValidator = (getEmailDomain: (universityId: number) => string | undefined): FormValidator => {
    const validator = new FormValidator();
    validator.addRequired('university', 'University');
    validator.addRequired('email', 'University Email');
    validator.addEmail('email', 'University Email');
    validator.addUniversityEmail('email', 'university', getEmailDomain);
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
