import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-montserrat transition-all font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-dark shadow-sm",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "text-primary hover:bg-primary/10",
        link: "text-primary underline-offset-4 hover:underline",
        surface: "bg-surface hover:bg-surface-alt text-text-primary shadow-sm",
      },
      size: {
        default: "h-11 px-6 rounded-md text-sm",
        sm: "h-9 px-4 rounded text-xs",
        lg: "h-14 px-8 rounded-lg text-base",
        icon: "h-10 w-10 rounded-full",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, fullWidth, className })}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };