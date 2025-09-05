import React from 'react';
import Link from 'next/link';
import { FileQuestion } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 text-center">
        <FileQuestion className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
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

export default NotFound;
