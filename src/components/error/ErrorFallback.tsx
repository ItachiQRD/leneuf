import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 bg-card rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-foreground">
          Oops! Something went wrong
        </h2>
        <p className="text-muted-foreground text-center mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex justify-center">
          <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
