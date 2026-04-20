import { Loader2 } from "lucide-react";

export const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-12">
      <div className="relative">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
      </div>
      <p className="mt-8 font-display text-2xl text-gold-gradient animate-pulse tracking-[0.2em] uppercase">
        Loading Chronicles...
      </p>
      <div className="mt-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};
