import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScryingOrbGlobe } from './ScryingOrbGlobe';

// Lazy load the heavy 3D viewer to optimize initial bundle size (~1MB dependency)
const ScryingOrbViewer = lazy(() => import('./ScryingOrbViewer').then(m => ({ default: m.ScryingOrbViewer })));

interface ScryingOrbProps {
    mode?: 'globe' | 'viewer';
    image?: string;
}

/**
 * ScryingOrb Component
 * Optimized for performance by splitting into a lightweight 2D globe and a heavy 3D viewer.
 * The 3D viewer (Three.js, OrbitControls) is lazy-loaded only when requested.
 *
 * @param mode - 'globe' (lightweight 2D) or 'viewer' (heavy 3D)
 * @param image - The panorama image to display in viewer mode
 */
export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: ScryingOrbProps) => {
    const isViewer = mode === 'viewer';

    return (
        <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
            <AnimatePresence mode="wait">
                {isViewer ? (
                    <Suspense fallback={<ScryingOrbGlobe />}>
                        <ScryingOrbViewer image={image} />
                    </Suspense>
                ) : (
                    <ScryingOrbGlobe />
                )}
            </AnimatePresence>
        </div>
    );
};
