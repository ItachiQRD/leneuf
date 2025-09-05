import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-surface shadow-md hover:shadow-lg",
        outline: "bg-surface border border-border-medium hover:border-primary",
        elevated: "bg-surface shadow-lg hover:shadow-xl",
        ghost: "bg-surface-alt hover:bg-surface",
        frosted: "bg-white/80 backdrop-blur-md shadow-md hover:shadow-lg",
      },
      radius: {
        none: "rounded-none",
        default: "rounded-lg",
        full: "rounded-2xl",
      },
      padding: {
        none: "p-0",
        default: "p-6",
        compact: "p-4",
        comfortable: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      radius: "default",
      padding: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, radius, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cardVariants({ variant, radius, padding, className })}
        {...props}
      />
    );
  }
);

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-1.5 pb-4", className)}
      {...props}
    />
  )
);

const CardTitle = forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className, children, level = 3, ...props }, ref) => {
    const Heading = `h${level}` as const;
    return (
      <Heading
        ref={ref}
        className={cn(
          "font-playfair text-text-primary",
          {
            'text-2xl': level === 1,
            'text-xl': level === 2,
            'text-lg': level === 3,
            'text-base': level >= 4
          },
          className
        )}
        {...props}
      >
        {children}
      </Heading>
    );
  }
);

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-text-secondary", className)}
      {...props}
    />
  )
);

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props} />
  )
);

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4", className)}
      {...props}
    />
  )
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};