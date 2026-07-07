import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScryingOrbGlobe } from './ScryingOrbGlobe';

// Lazy load the heavy Three.js viewer
const ScryingOrbViewer = lazy(() => import('./ScryingOrbViewer'));

interface ScryingOrbProps {
  mode?: 'globe' | 'viewer';
  image?: string;
}

/**
 * ScryingOrb Component
 * Optimized to lazy-load Three.js dependencies only when needed in 'viewer' mode.
 * The default 'globe' mode uses a lightweight CSS/Framer Motion implementation.
 *
 * Performance Impact: Reduces initial bundle size by ~1MB for pages using globe mode.
 */
export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: ScryingOrbProps) => {
  const isViewer = mode === 'viewer';

  return (
    <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
      <AnimatePresence mode="wait">
        {isViewer ? (
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-gold/20 animate-spin border-t-gold-light" />
                <span className="text-[10px] font-display text-gold-light tracking-widest uppercase animate-pulse">
                  Initializing Vision...
                </span>
              </div>
            </div>
          }>
            <ScryingOrbViewer image={image} />
          </Suspense>
        ) : (
          <ScryingOrbGlobe />
        )}
      </AnimatePresence>
    </div>
  );
};
