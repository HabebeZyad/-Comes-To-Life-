import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl">𓂀</div>
        <div className="absolute bottom-10 right-10 text-6xl">𓋹</div>
        <div className="absolute top-1/4 right-20 text-4xl">𓇚</div>
        <div className="absolute bottom-1/4 left-20 text-4xl">𓀀</div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-display text-gold-gradient tracking-widest animate-pulse">
            Loading Chronicles...
          </h2>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-progress-indefinite w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
