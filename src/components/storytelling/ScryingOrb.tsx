import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScryingOrbGlobe } from './ScryingOrbGlobe';

// Lazy load the heavy Three.js viewer to isolate dependencies and reduce initial bundle size
const ScryingOrbViewer = lazy(() => import('./ScryingOrbViewer').then(m => ({ default: m.ScryingOrbViewer })));

interface ScryingOrbProps {
  mode?: 'globe' | 'viewer';
  image?: string;
}

/**
 * ScryingOrb Component
 * Optimized with code-splitting to isolate Three.js dependencies (~1MB).
 * The 'globe' mode is lightweight (CSS/Framer Motion), while the 'viewer' mode
 * is lazy-loaded only when requested.
 */
export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: ScryingOrbProps) => {
  const isViewer = mode === 'viewer';

  return (
    <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
      <AnimatePresence mode="wait">
        {isViewer ? (
          <Suspense fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
                <div className="text-[10px] text-gold/60 uppercase tracking-[0.2em] font-display">Initializing Vision...</div>
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
