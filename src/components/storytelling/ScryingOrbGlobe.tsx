import React from 'react';
import { motion } from 'framer-motion';

/**
 * ScryingOrbGlobe Component
 * Pure CSS and Framer Motion implementation of the Scrying Orb's exterior.
 * Extremely lightweight and does not depend on Three.js.
 */
export const ScryingOrbGlobe = () => {
  return (
    <motion.div
      key="globe"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[72%] w-[72%] rounded-full border border-gold/20"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
        className="absolute h-[54%] w-[54%] rounded-full border border-turquoise/20"
      />
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative flex h-36 w-36 items-center justify-center rounded-full border border-gold/35 bg-[radial-gradient(circle_at_35%_25%,hsl(var(--gold-light)/0.85),hsl(var(--gold)/0.42)_34%,hsl(var(--lapis-deep)/0.85)_72%,hsl(var(--obsidian))_100%)] shadow-[0_0_70px_hsl(var(--gold)/0.28)]"
      >
        <div className="absolute inset-4 rounded-full border border-white/10" />
        <span className="text-6xl text-obsidian drop-shadow-gold-glow select-none">𓂀</span>
      </motion.div>
    </motion.div>
  );
};
