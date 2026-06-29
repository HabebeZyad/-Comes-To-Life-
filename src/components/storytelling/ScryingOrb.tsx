import React, { lazy, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScryingOrbGlobe } from './ScryingOrbGlobe';

// Lazy-load the heavy Three.js viewer component
const ScryingOrbViewer = lazy(() => import('./ScryingOrbViewer'));

/**
 * ScryingOrb Component
 * Optimized to isolate heavy Three.js dependencies.
 * - 'globe' mode uses pure CSS/Framer Motion.
 * - 'viewer' mode lazy-loads the Three.js-based ScryingOrbViewer.
 */
export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: { mode?: 'globe' | 'viewer', image?: string }) => {
    const isViewer = mode === 'viewer';

    return (
        <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
            <AnimatePresence mode="wait">
                {isViewer ? (
                    <Suspense fallback={
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full border-2 border-gold/20 animate-spin border-t-gold" />
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
