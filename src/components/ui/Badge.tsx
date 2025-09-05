import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  "inline-flex items-center font-montserrat text-xs font-medium ring-1 ring-inset transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary ring-primary/20",
        outline: "bg-transparent text-primary ring-primary",
        secondary: "bg-surface-alt text-text-secondary ring-border-medium",
        success: "bg-success/10 text-success ring-success/20",
        error: "bg-error/10 text-error ring-error/20",
        warning: "bg-warning/10 text-warning ring-warning/20",
      },
      size: {
        default: "px-2.5 py-0.5 rounded-md",
        sm: "px-2 py-0.5 rounded",
        lg: "px-3 py-1 rounded-lg",
        pill: "px-3 py-0.5 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
}

function Badge({ className, variant, size, children, ...props }: BadgeProps) {
  return (
    <span className={badgeVariants({ variant, size, className })} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };