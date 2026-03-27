import { useState, useCallback, useMemo } from 'react';
import { FormValidator } from './FormValidator';

interface UseFormOptions<T> {
  initialValues: T;
  validator: FormValidator;
  onSubmit: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T> {
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

export function useForm<T extends Record<string, string>>({
  initialValues,
  validator,
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched.has(name)) {
        validator.clearErrors();
        const result = validator.validate({ ...values, [name]: value } as Record<string, string>);
        setErrors(result.errors);
      }
    },
    [touched, validator, values]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => new Set(prev).add(name));

      validator.clearErrors();
      const result = validator.validate(values as Record<string, string>);
      setErrors(result.errors);
    },
    [validator, values]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const allTouched = new Set(Object.keys(values));
      setTouched(allTouched);

      validator.clearErrors();
      const result = validator.validate(values as Record<string, string>);

      if (!result.isValid) {
        setErrors(result.errors);
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validator, onSubmit, values]
  );

  const setValue = useCallback((field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(new Set());
    setIsSubmitting(false);
  }, [initialValues]);

  const isValid = useMemo(() => {
    validator.clearErrors();
    const result = validator.validate(values as Record<string, string>);
    return result.isValid;
  }, [validator, values]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    reset,
  };
}
