import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  "w-full rounded-md border bg-white px-3 py-2 text-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus:ring-2",
  {
    variants: {
      variant: {
        default: "border-gray-300 shadow-sm focus:ring-orange-500 focus:border-orange-500",
        error: "border-red-300 shadow-sm focus:ring-red-500 focus:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, variant, containerClassName, ...props }, ref) => {
    return (
      <div className={cn("space-y-1.5", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          className={textareaVariants({ variant: error ? "error" : variant, className })}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };