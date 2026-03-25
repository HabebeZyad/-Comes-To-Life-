import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 blur-lg bg-primary/20 animate-pulse rounded-full" />
      </div>
      <p className="font-display text-gold-gradient tracking-widest text-sm animate-pulse">
        UNVEILING THE ARCHIVES...
      </p>
    </div>
  );
};

export default Loader;
