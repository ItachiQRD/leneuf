import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = 'Switch';

// Composant wrapper avec label et gestion des erreurs
interface SwitchFieldProps extends React.ComponentPropsWithoutRef<typeof Switch> {
  label?: string;
  description?: string;
  error?: string;
  containerClassName?: string;
}

const SwitchField = React.forwardRef<
  React.ElementRef<typeof Switch>,
  SwitchFieldProps
>(({ label, description, error, containerClassName, ...props }, ref) => (
  <div className={cn('flex flex-col space-y-2', containerClassName)}>
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        {label && (
          <label
            htmlFor={props.id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        {description && (
          <span className="text-sm text-gray-500">{description}</span>
        )}
      </div>
      <Switch ref={ref} {...props} />
    </div>
    {error && <p className="text-sm text-red-600">{error}</p>}
  </div>
));

SwitchField.displayName = 'SwitchField';

export { Switch, SwitchField };