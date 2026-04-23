import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <div className="absolute inset-0 blur-lg bg-primary/20 -z-10" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-gold-gradient font-display text-xl tracking-widest uppercase"
      >
        Loading Chronicles...
      </motion.p>
    </div>
  );
};

export default PageLoader;
