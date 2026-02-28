import React, { useMemo, memo } from 'react';
import styles from './DustParticles.module.css';

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

/**
 * DustParticles Component
 * Optimized to use useMemo for particle generation and React.memo to prevent unnecessary re-renders.
 * This avoids the double-render on mount caused by useEffect.
 */
const DustParticlesComponent = ({ count = 20 }: { count?: number }) => {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 20,
      duration: Math.random() * 10 + 15,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full bg-gold/30 animate-dust ${styles.particle}`}
          style={
            {
              '--x': particle.x,
              '--size': particle.size,
              '--delay': particle.delay,
              '--duration': particle.duration,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export const DustParticles = memo(DustParticlesComponent);
