import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Standard Loader component for the application.
 * Used as a fallback for Suspense boundaries during code-splitting.
 */
export const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );
};

export default Loader;
