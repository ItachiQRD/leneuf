// components/ui/tooltip.tsx
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// Définition des variants du tooltip pour plus de flexibilité
const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md px-3 py-1.5 text-sm shadow-soft animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "bg-surface-300 text-foreground",
        dark: "bg-surface-raised text-foreground",
        light: "bg-background border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
    VariantProps<typeof tooltipVariants> {
  sideOffset?: number;
}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(({ className, children, variant, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant }), className)}
    {...props}
  >
    {children}
  </TooltipPrimitive.Content>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Composant pratique qui combine tous les éléments
interface TooltipComponentProps extends React.PropsWithChildren {
  content: React.ReactNode;
  variant?: VariantProps<typeof tooltipVariants>["variant"];
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  className?: string;
}

function TooltipComponent({
  children,
  content,
  variant,
  side = "top",
  align = "center",
  delayDuration = 200,
  className,
}: TooltipComponentProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent 
        variant={variant} 
        side={side} 
        align={align}
        className={className}
      >
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  TooltipComponent as Default,
  type TooltipComponentProps,
};