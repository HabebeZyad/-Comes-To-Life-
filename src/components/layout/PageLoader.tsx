import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center gap-4 bg-transparent">
      <div className="relative">
        <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-gold font-display text-xl tracking-[0.2em] animate-pulse">
          LOADING CHRONICLES...
        </p>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>
    </div>
  );
};

export default PageLoader;
