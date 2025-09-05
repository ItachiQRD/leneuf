import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  "w-full rounded-md transition-all font-montserrat text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "border border-border-medium bg-white shadow-sm hover:border-primary/50",
        filled: "border-none bg-surface-200 focus:bg-white",
        flushed: "border-b border-border-medium rounded-none px-0 focus:ring-0 focus:border-primary",
      },
      hasError: {
        true: "border-error focus:ring-error",
        false: "",
      },
      size: {
        default: "h-11 px-4 py-2 text-sm",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hasError: false,
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    Omit<VariantProps<typeof inputVariants>, 'hasError'> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, error, label, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          className={inputVariants({ variant, size, hasError: !!error, className })}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants };