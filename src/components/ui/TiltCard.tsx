import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowColor?: string;
  tilt?: boolean;
  scale?: number;
}

export function TiltCard({ 
  children, 
  className, 
  containerClassName, 
  glowColor = "rgba(218,165,32,0.15)",
  tilt = true,
  scale = 1.02
}: TiltCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: tilt ? scale : 1 }}
      style={{
        rotateX: tilt ? rotateX : 0,
        rotateY: tilt ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative h-full", containerClassName)}
    >
      <div className={cn(
        "group relative h-full rounded-2xl border-2 border-gold/20 bg-black/40 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-gold/50 hover:shadow-gold-glow/20 overflow-hidden",
        className
      )}>
        {/* Shine Effect */}
        <motion.div
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 80%)`,
            left: useTransform(mouseXSpring, [-0.5, 0.5], ["-50%", "50%"]),
            top: useTransform(mouseYSpring, [-0.5, 0.5], ["-50%", "50%"]),
          }}
          className="absolute h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        />

        {children}

        {/* Decorative Corner Ornaments */}
        <div className="absolute top-4 left-4 h-4 w-4 border-l-2 border-t-2 border-gold/30 transition-all duration-500 group-hover:border-gold group-hover:h-6 group-hover:w-6" />
        <div className="absolute top-4 right-4 h-4 w-4 border-r-2 border-t-2 border-gold/30 transition-all duration-500 group-hover:border-gold group-hover:h-6 group-hover:w-6" />
        <div className="absolute bottom-4 left-4 h-4 w-4 border-l-2 border-b-2 border-gold/30 transition-all duration-500 group-hover:border-gold group-hover:h-6 group-hover:w-6" />
        <div className="absolute bottom-4 right-4 h-4 w-4 border-r-2 border-b-2 border-gold/30 transition-all duration-500 group-hover:border-gold group-hover:h-6 group-hover:w-6" />
      </div>
    </motion.div>
  );
}
