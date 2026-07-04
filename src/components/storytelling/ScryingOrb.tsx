import { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScryingOrbGlobe } from './ScryingOrbGlobe';
import { PageLoader } from '@/components/layout/PageLoader';

// Lazy-load the heavy Three.js viewer component
const ScryingOrbViewer = lazy(() => import('./ScryingOrbViewer'));

interface ScryingOrbProps {
  mode?: 'globe' | 'viewer';
  image?: string;
}

/**
 * ScryingOrb Component (Optimized)
 * Performance-focused wrapper that splits the lightweight CSS globe and
 * the heavy Three.js viewer. By lazy-loading the viewer, we avoid
 * downloading ~1MB of Three.js dependencies (including OrbitControls)
 * until the user actually enters a 3D panorama view.
 */
export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: ScryingOrbProps) => {
  const isViewer = mode === 'viewer';

  return (
    <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
      <AnimatePresence mode="wait">
        {isViewer ? (
          <Suspense fallback={<PageLoader className="h-full bg-black/20" />}>
            <ScryingOrbViewer image={image} key="viewer" />
          </Suspense>
        ) : (
          <ScryingOrbGlobe key="globe" />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScryingOrb;
