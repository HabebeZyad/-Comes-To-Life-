
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './CelestialSimulation.module.css';

interface Star {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    duration: number;
    delay: number;
    isSpecial?: boolean;
}

interface CelestialSimulationProps {
    timeOfDay?: 'day' | 'dusk' | 'night' | 'dawn';
    showOrion?: boolean;
}

/**
 * CelestialSimulation Component
 * Optimized with React.memo to prevent unnecessary re-renders when parent state updates.
 * For example, in StoryReader, this prevents 200+ stars from being re-evaluated
 * every time the user moves to a new story panel if the props remain identical.
 */
export const CelestialSimulation = React.memo<CelestialSimulationProps>(({
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
    const orionBelt = [
        { x: 45, y: 40 },
        { x: 50, y: 42 },
        { x: 55, y: 44 },
    ];

    const skyColors = {
        day: 'bg-gradient-to-b from-blue-400 to-orange-100',
        dusk: 'bg-gradient-to-b from-[#1a1c2c] via-[#4a192c] to-[#f26419]',
        night: 'bg-gradient-to-b from-[#050510] to-[#1a1c2c]',
        dawn: 'bg-gradient-to-b from-[#1a1c2c] via-[#f26419] to-[#ffd166]',
    };

    return (
        <div className={`absolute inset-0 overflow-hidden transition-colors duration-[3000ms] ${skyColors[timeOfDay]}`}>
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
                            className={`absolute bg-white rounded-full ${styles.star}`}
                            style={{
                                '--x': star.x,
                                '--y': star.y,
                                '--size': star.size,
                                '--opacity': star.opacity,
                                '--duration': `${star.duration}s`,
                                '--delay': `${star.delay}s`,
                            } as React.CSSProperties}
                        />
                    ))}

                    {/* Orion's Belt */}
                    {showOrion && orionBelt.map((star, i) => (
                        <div
                            key={`orion-${i}`}
                            className={`absolute bg-gold rounded-full shadow-[0_0_10px_rgba(189,144,36,0.8)] z-10 ${styles.orionStar}`}
                            style={{
                                '--x': star.x,
                                '--y': star.y,
                                '--duration': '2s',
                                '--delay': `${i * 0.2}s`,
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
});

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
