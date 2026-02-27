import React, { useEffect, useState } from 'react';
import styles from './DustParticles.module.css';

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

export function DustParticles({ count = 20 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 20,
      duration: Math.random() * 10 + 15,
    }));
    setParticles(newParticles);
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
}
