import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 blur-lg bg-primary/20 animate-pulse" />
      </div>
      <div className="text-center">
        <p className="text-gold font-display text-xl uppercase tracking-widest animate-pulse">
          Loading Chronicles...
        </p>
        <p className="text-muted-foreground text-xs uppercase tracking-[0.2em] mt-1">
          Consulting the Scribes
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
