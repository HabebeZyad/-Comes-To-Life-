
import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import styles from './CelestialSimulation.module.css';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
}

interface CelestialSimulationProps {
    timeOfDay?: 'day' | 'dusk' | 'night' | 'dawn';
    showOrion?: boolean;
}

/**
 * CelestialSimulation Component
 * Optimized to use CSS animations for the star field (200+ elements) to reduce main thread load.
 * Wrapped in React.memo to prevent unnecessary re-renders when parent state updates.
 */
const CelestialSimulationComponent: React.FC<CelestialSimulationProps> = ({
    timeOfDay = 'night',
    showOrion = true
}) => {
    const stars = useMemo(() => {
        const s: Star[] = [];
        for (let i = 0; i < 200; i++) {
            s.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.7 + 0.3,
                duration: Math.random() * 3 + 2,
                delay: Math.random() * 5,
            });
        }
        return s;
    }, []);

    // Simplified Orion's Belt simulation
    const orionBelt = useMemo(() => [
        { x: 45, y: 40, delay: 0 },
        { x: 50, y: 42, delay: 0.2 },
        { x: 55, y: 44, delay: 0.4 },
    ], []);

    const skyColors = {
        day: 'bg-gradient-to-b from-blue-400 to-orange-100',
        dusk: 'bg-gradient-to-b from-[#1a1c2c] via-[#4a192c] to-[#f26419]',
        night: 'bg-gradient-to-b from-[#050510] to-[#1a1c2c]',
        dawn: 'bg-gradient-to-b from-[#1a1c2c] via-[#f26419] to-[#ffd166]',
    };

    return (
        <div className={cn("absolute inset-0 overflow-hidden transition-colors duration-[3000ms]", skyColors[timeOfDay])}>
            {/* Star Field (only visible at night/dusk/dawn) */}
            {(timeOfDay !== 'day') && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: timeOfDay === 'night' ? 1 : 0.4 }}
                    className="absolute inset-0"
                >
                    {stars.map((star) => (
                        <div
                            key={star.id}
                            className={styles.star}
                            style={{
                                '--star-x': star.x,
                                '--star-y': star.y,
                                '--star-size': star.size,
                                '--star-opacity': star.opacity,
                                '--star-duration': `${star.duration}s`,
                                '--star-delay': `${star.delay}s`,
                            } as React.CSSProperties}
                        />
                    ))}

                    {/* Orion's Belt */}
                    {showOrion && orionBelt.map((star, i) => (
                        <div
                            key={`orion-${i}`}
                            className={styles.orionStar}
                            style={{
                                '--star-x': star.x,
                                '--star-y': star.y,
                                '--star-size': 4,
                                '--star-duration': '2s',
                                '--star-delay': `${star.delay}s`,
                            } as React.CSSProperties}
                        />
                    ))}
                </motion.div>
            )}

            {/* Sun/Moon */}
            <motion.div
                className={cn(
                    "absolute w-32 h-32 rounded-full",
                    timeOfDay === 'day' ? "bg-gold shadow-[0_0_80px_rgba(189,144,36,0.6)]" : "bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                )}
                animate={{
                    top: timeOfDay === 'day' ? '20%' : '110%',
                    left: timeOfDay === 'day' ? '70%' : '30%',
                }}
                transition={{ duration: 3, ease: "easeInOut" }}
            />

            {/* Atmosphere Glow */}
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
    );
};

export const CelestialSimulation = memo(CelestialSimulationComponent);
