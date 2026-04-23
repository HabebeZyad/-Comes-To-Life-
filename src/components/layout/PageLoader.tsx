import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />

        {/* Main loader icon */}
        <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />

        {/* Thematic corner accents */}
        <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-gold/40" />
        <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-gold/40" />
        <div className="absolute -bottom-4 -left-4 w-4 h-4 border-b-2 border-l-2 border-gold/40" />
        <div className="absolute -bottom-4 -right-4 w-4 h-4 border-b-2 border-r-2 border-gold/40" />
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display text-gold-gradient tracking-widest animate-pulse">
          Loading Chronicles...
        </h2>
        <p className="text-muted-foreground font-body italic">
          Consulting the sacred archives of the Pharaohs
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
