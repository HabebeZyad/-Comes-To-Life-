import React from 'react';
import { cn } from '@/lib/utils';

interface PageLoaderProps {
  className?: string;
}

/**
 * Thematic Loader Component shared across the application.
 * Used as a fallback for lazy-loaded pages and components.
 */
export const PageLoader = ({ className }: PageLoaderProps) => (
  <div className={cn("min-h-screen flex items-center justify-center bg-background p-4", className)}>
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-2 border-gold/20 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl animate-glow-pulse">𓂀</span>
        </div>
      </div>
      <div className="font-display text-gold tracking-[0.3em] text-sm animate-pulse uppercase">
        Restoring History...
      </div>
    </div>
  </div>
);

export default PageLoader;
