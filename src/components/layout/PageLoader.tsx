import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-hero-gradient relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 text-center px-4"
      >
        <div className="relative">
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-primary animate-spin" />
          <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-display text-gold-gradient mb-2">Loading Chronicles...</h2>
          <p className="text-muted-foreground font-body max-w-xs mx-auto">Preparing your journey through the sands of time.</p>
        </div>
      </motion.div>
      <div className="absolute inset-0 opacity-10 pointer-events-none hieroglyph-pattern" />
    </div>
  );
};
