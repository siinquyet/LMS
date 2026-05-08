import { useState, useCallback } from 'react';

export function useForm<T extends Record<string, any>>(initialState: T) {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }, [errors]);

  const setFields = useCallback((updates: Partial<T>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const reset = useCallback((newState?: T) => {
    setFormData(newState || initialState);
    setErrors({});
  }, [initialState]);

  const validate = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return { formData, setField, setFields, reset, validate, errors, setFormData };
}