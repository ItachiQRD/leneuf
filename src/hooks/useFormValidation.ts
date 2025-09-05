import { useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
import { productFormSchema, ProductFormData } from '@/types/schema';

interface ValidationError {
  [key: string]: string;  // Plus de undefined possible
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError;
  validationProgress: number;
  dirtyFields: Set<string>;
  touchedFields: Set<string>;
}

interface UseFormValidationReturn extends ValidationResult {
  validateField: (fieldName: keyof ProductFormData, value: any) => Promise<boolean>;
  validateForm: (data: Partial<ProductFormData>) => Promise<boolean>;
  resetValidation: () => void;
  setFieldTouched: (fieldName: keyof ProductFormData) => void;
  getFieldError: (fieldName: keyof ProductFormData) => string | undefined;
}

const initialValidationState: ValidationResult = {
  isValid: false,
  errors: {},
  validationProgress: 0,
  dirtyFields: new Set<string>(),
  touchedFields: new Set<string>()
};

export function useFormValidation(
  initialData: Partial<ProductFormData>,
  options: {
    validateOnMount?: boolean;
    validateOnChange?: boolean;
  } = {}
): UseFormValidationReturn {
  const [validationState, setValidationState] = useState<ValidationResult>(initialValidationState);

  const calculateProgress = useCallback((
    data: Partial<ProductFormData>,
    errors: ValidationError
  ) => {
    const fields = Object.keys(productFormSchema.shape);
    const totalFields = fields.length;
    const validFields = fields.filter(field => !errors[field]).length;
    
    return Math.min(100, Math.round((validFields / totalFields) * 100));
  }, []);

  const validateField = useCallback(async (
    fieldName: keyof ProductFormData,
    value: any
  ): Promise<boolean> => {
    try {
      const fieldSchema = productFormSchema.shape[fieldName as keyof typeof productFormSchema.shape];
      const partialSchema = z.object({ [fieldName]: fieldSchema });
      
      await partialSchema.parseAsync({ [fieldName]: value });
      
      setValidationState(prev => {
        const newErrors = { ...prev.errors };
        delete newErrors[fieldName];  // Au lieu de mettre undefined

        return {
          ...prev,
          errors: newErrors,
          dirtyFields: new Set([...Array.from(prev.dirtyFields), fieldName])
        };
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0]?.message || 'Champ invalide';
        
        setValidationState(prev => ({
          ...prev,
          errors: {
            ...prev.errors,
            [fieldName]: fieldError
          },
          dirtyFields: new Set([...Array.from(prev.dirtyFields), fieldName]),
          isValid: false
        }));
      }
      return false;
    }
  }, []);

  const validateForm = useCallback(async (
    data: Partial<ProductFormData>
  ): Promise<boolean> => {
    try {
      await productFormSchema.parseAsync(data);
      
      const progress = calculateProgress(data, {});
      setValidationState(prev => ({
        ...prev,
        isValid: true,
        errors: {},
        validationProgress: progress
      }));

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.reduce<ValidationError>((acc, err) => {
          const field = err.path.join('.');
          acc[field] = err.message;
          return acc;
        }, {});

        const progress = calculateProgress(data, errors);
        setValidationState(prev => ({
          ...prev,
          isValid: false,
          errors,
          validationProgress: progress
        }));
      }
      return false;
    }
  }, [calculateProgress]);

  const resetValidation = useCallback(() => {
    setValidationState(initialValidationState);
  }, []);

  const setFieldTouched = useCallback((fieldName: keyof ProductFormData) => {
    setValidationState(prev => ({
      ...prev,
      touchedFields: new Set([...Array.from(prev.touchedFields), fieldName])
    }));
  }, []);

  const getFieldError = useCallback((fieldName: keyof ProductFormData): string | undefined => {
    return validationState.touchedFields.has(fieldName as string) ? 
      validationState.errors[fieldName] : 
      undefined;
  }, [validationState.errors, validationState.touchedFields]);

  useEffect(() => {
    if (options.validateOnMount) {
      validateForm(initialData);
    }
  }, [options.validateOnMount, validateForm, initialData]);

  return {
    ...validationState,
    validateField,
    validateForm,
    resetValidation,
    setFieldTouched,
    getFieldError
  };
}