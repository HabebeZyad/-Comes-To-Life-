import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

const hieroglyphs = ['𓀀', '𓀁', '𓀂', '𓀃', '𓁀', '𓁁', '𓁂', '𓁃', '𓂀', '𓂁', '𓃀', '𓃁', '𓄀', '𓄁', '𓅀', '𓅁', '𓆀', '𓆁', '𓇀', '𓇁', '𓈀', '𓈁', '𓉀', '𓉁', '𓊀', '𓊁', '𓋀', '𓋁', '𓌀', '𓌁', '𓍀', '𓍁', '𓎀', '𓎁', '𓏀', '𓏁'];

interface HieroglyphBackgroundProps {
  density?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

/**
 * HieroglyphBackground Component
 * Optimized to use useMemo for symbol generation and React.memo to prevent unnecessary re-renders.
 * This avoids expensive randomization on every render cycle and improves performance on pages
 * where this background is used.
 */
function HieroglyphBackgroundComponent({ density = 'medium', animated = true }: HieroglyphBackgroundProps) {
  const counts = { low: 15, medium: 30, high: 50 };
  const count = counts[density];

  // Memoize the generated symbols to prevent recalculating them on every render
  const symbols = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      symbol: hieroglyphs[Math.floor(Math.random() * hieroglyphs.length)],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1.5,
      opacity: Math.random() * 0.1 + 0.03,
      delay: Math.random() * 5,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {symbols.map((item) => (
        <motion.span
          key={item.id}
          className="absolute font-display select-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            color: `hsl(var(--gold) / ${item.opacity})`,
          }}
          initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
          animate={animated ? { 
            opacity: item.opacity,
            scale: 1,
          } : undefined}
          transition={{
            delay: item.delay,
            duration: 2,
            ease: "easeOut",
          }}
        >
          {item.symbol}
        </motion.span>
      ))}
    </div>
  );
}

export const HieroglyphBackground = memo(HieroglyphBackgroundComponent);
