import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScryingOrbGlobe } from './ScryingOrbGlobe';

// Lazy load the heavy 3D viewer component
const ScryingOrbViewer = lazy(() => import('./ScryingOrbViewer'));

/**
 * ScryingOrb Component
 * Optimized to lazy-load Three.js dependencies only when 'viewer' mode is requested.
 * This significantly reduces the initial bundle size for pages that primarily use the 'globe' mode.
 */
export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: { mode?: 'globe' | 'viewer', image?: string }) => {
  const isViewer = mode === 'viewer';

  return (
    <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
      <AnimatePresence mode="wait">
        {isViewer ? (
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse text-gold font-display text-xs tracking-widest">
                LOADING 3D VIEW...
              </div>
            </div>
          }>
            <ScryingOrbViewer image={image} />
          </Suspense>
        ) : (
          <ScryingOrbGlobe key="globe" />
        )}
      </AnimatePresence>
    </div>
  );
};
