import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-hero-gradient relative overflow-hidden">
      <div className="z-10 flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-xl font-display text-gold-gradient animate-pulse">
          Loading Chronicles...
        </p>
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 hieroglyph-pattern pointer-events-none" />
    </div>
  );
};
