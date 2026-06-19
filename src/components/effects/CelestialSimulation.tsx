
import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleDuration: number;
    isSpecial?: boolean;
}

interface CelestialSimulationProps {
    timeOfDay?: 'day' | 'dusk' | 'night' | 'dawn';
    showOrion?: boolean;
}

const ORION_BELT = [
    { x: 45, y: 40 },
    { x: 50, y: 42 },
    { x: 55, y: 44 },
];

const SKY_COLORS = {
    day: 'bg-gradient-to-b from-blue-400 to-orange-100',
    dusk: 'bg-gradient-to-b from-[#1a1c2c] via-[#4a192c] to-[#f26419]',
    night: 'bg-gradient-to-b from-[#050510] to-[#1a1c2c]',
    dawn: 'bg-gradient-to-b from-[#1a1c2c] via-[#f26419] to-[#ffd166]',
};

/**
 * CelestialSimulation Component
 *
 * Optimized for performance:
 * 1. Uses React.memo to prevent unnecessary re-renders when parent state changes but props remain the same.
 * 2. Moves static constants (ORION_BELT, SKY_COLORS) outside the component to avoid recreation.
 * 3. Pre-calculates randomized animation values (twinkleDuration) in useMemo to stabilize
 *    Framer Motion's animation frame calculations and eliminate per-render Math.random() calls.
 *
 * @param timeOfDay - The time of day to simulate ('day' | 'dusk' | 'night' | 'dawn')
 * @param showOrion - Whether to display Orion's Belt constellation
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
                twinkleDuration: Math.random() * 3 + 2,
            });
        }
        return s;
    }, []);

    return (
        <div className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${SKY_COLORS[timeOfDay]}`}>
            {/* Star Field (only visible at night/dusk/dawn) */}
            {(timeOfDay !== 'day') && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: timeOfDay === 'night' ? 1 : 0.4 }}
                    className="absolute inset-0"
                >
                    {stars.map((star) => (
                        <motion.div
                            key={star.id}
                            className="absolute bg-white rounded-full"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: `${star.size}px`,
                                height: `${star.size}px`,
                                opacity: star.opacity,
                            }}
                            animate={{
                                opacity: [star.opacity, star.opacity * 0.3, star.opacity],
                            }}
                            transition={{
                                duration: star.twinkleDuration,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}

                    {/* Orion's Belt */}
                    {showOrion && ORION_BELT.map((star, i) => (
                        <motion.div
                            key={`orion-${i}`}
                            className="absolute bg-gold rounded-full shadow-[0_0_10px_rgba(189,144,36,0.8)] z-10"
                            style={{
                                left: `${star.x}%`,
                                top: `${star.y}%`,
                                width: '4px',
                                height: '4px',
                            }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.8, 1, 0.8],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
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
CelestialSimulation.displayName = 'CelestialSimulation';

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
