import { Loader2 } from "lucide-react";

export const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
    <div className="absolute inset-0 opacity-5 pointer-events-none">
      <div className="absolute top-0 left-0 w-full h-full hieroglyph-pattern" />
    </div>
    <div className="relative z-10 flex flex-col items-center gap-4">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gold font-display text-xl animate-pulse tracking-widest uppercase">
        Loading Chronicles...
      </p>
    </div>
  </div>
);
