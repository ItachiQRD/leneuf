import React from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

const ServerError: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 text-center">
        <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-destructive" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">500</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Server Error</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, something went wrong on our servers. We are working to fix the problem.
          Please try again later.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ServerError;
