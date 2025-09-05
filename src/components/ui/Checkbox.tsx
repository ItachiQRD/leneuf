import * as React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, register, error, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        className={`h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${className}`}
        ref={ref}
        {...register}
        {...props}
      />
    );
  }
);
