import { useState, useCallback } from 'react';
import { FormValidator } from './FormValidator';

interface UseFormOptions<T extends Record<string, string>> {
    initialValues: T;
    validator: FormValidator;
    onSubmit: (values: T) => Promise<void>;
}

interface UseFormReturn<T extends Record<string, string>> {
    values: T;
    errors: Record<string, string>;
    touched: Set<string>;
    isSubmitting: boolean;
    isValid: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setValue: (field: keyof T, value: string) => void;
    reset: () => void;
}

class FormStateManager<T extends Record<string, string>> {
    private values: T;
    private errors: Record<string, string>;
    private touched: Set<string>;
    private validator: FormValidator;

    constructor(initialValues: T, validator: FormValidator) {
        this.values = initialValues;
        this.errors = {};
        this.touched = new Set();
        this.validator = validator;
    }

    getValues(): T {
        return this.values;
    }

    setValues(newValues: T): void {
        this.values = newValues;
    }

    getErrors(): Record<string, string> {
        return this.errors;
    }

    setErrors(errors: Record<string, string>): void {
        this.errors = errors;
    }

    getTouched(): Set<string> {
        return this.touched;
    }

    addTouched(field: string): void {
        this.touched.add(field);
    }

    setAllTouched(): void {
        this.touched = new Set(Object.keys(this.values));
    }

    getValidator(): FormValidator {
        return this.validator;
    }

    validate(): { isValid: boolean; errors: Record<string, string> } {
        this.validator.clearErrors();
        return this.validator.validate(this.values as Record<string, string>);
    }

    reset(initialValues: T): void {
        this.values = initialValues;
        this.errors = {};
        this.touched = new Set();
    }
}

export function useForm<T extends Record<string, string>>({
    initialValues,
    validator,
    onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [manager] = useState(() => new FormStateManager(initialValues, validator));

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            const newValues = { ...manager.getValues(), [name]: value };
            manager.setValues(newValues);

            if (manager.getTouched().has(name)) {
                const result = manager.validate();
                manager.setErrors(result.errors);
            }
        },
        [manager]
    );

    const handleBlur = useCallback(
        (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name } = e.target;
            manager.addTouched(name);
            const result = manager.validate();
            manager.setErrors(result.errors);
        },
        [manager]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            manager.setAllTouched();
            const result = manager.validate();

            if (!result.isValid) {
                manager.setErrors(result.errors);
                return;
            }

            setIsSubmitting(true);
            try {
                await onSubmit(manager.getValues());
            } finally {
                setIsSubmitting(false);
            }
        },
        [manager, onSubmit]
    );

    const setValue = useCallback(
        (field: keyof T, value: string) => {
            const newValues = { ...manager.getValues(), [field]: value };
            manager.setValues(newValues);
        },
        [manager]
    );

    const reset = useCallback(() => {
        manager.reset(initialValues);
    }, [manager, initialValues]);

    const isValid = (() => {
        const result = manager.validate();
        return result.isValid;
    })();

    return {
        get values() { return manager.getValues(); },
        get errors() { return manager.getErrors(); },
        get touched() { return manager.getTouched(); },
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
        setValue,
        reset,
    };
}
