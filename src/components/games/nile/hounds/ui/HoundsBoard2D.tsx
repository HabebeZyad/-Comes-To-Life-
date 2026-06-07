import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Peg, HoleType } from '../engine/types';
import { HoundsEngine } from '../engine/HoundsEngine';
import { cn } from '@/lib/utils';

interface HoundsBoard2DProps {
  gameState: GameState;
  onPegClick: (pegId: string) => void;
  selectedPegId: string | null;
  legalMoves: string[];
}

export const HoundsBoard2D: React.FC<HoundsBoard2DProps> = ({
  gameState,
  onPegClick,
  selectedPegId,
  legalMoves,
}) => {
  // Generate hole positions for two mirrored tracks
  const trackPoints = useMemo(() => {
    const generateTrack = (isLeft: boolean) => {
      const points: { x: number; y: number; index: number }[] = [];
      const startX = isLeft ? 350 : 650;
      const startY = 850;
      
      // Track goes up the outer edge, then loops inward and back down
      for (let i = 0; i < 30; i++) {
        let x = startX;
        let y = startY - i * 25;
        
        if (i > 15) {
          x = isLeft ? startX + 100 : startX - 100;
          y = startY - (29 - i) * 25;
        }
        
        points.push({ x, y, index: i });
      }
      return points;
    };

    return {
      hounds: generateTrack(true),
      jackals: generateTrack(false),
    };
  }, []);

  return (
    <svg viewBox="170 10 660 990" className="w-full h-full">
      {/* Wooden Board Background */}
      <rect x="200" y="50" width="600" height="900" rx="40" fill="#3d2b1f" className="stroke-gold/20" strokeWidth="4" />
      <rect x="220" y="70" width="560" height="860" rx="30" fill="#2a1e15" className="opacity-50" />

      {/* Tracks */}
      {Object.entries(trackPoints).map(([side, points]) => (
        <g key={side}>
          {points.map((p, i) => {
            const type = HoundsEngine.getHoleType(i);
            return (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="10"
                  className={cn(
                    "fill-black/60 stroke-gold/10",
                    type === 'shortcut_start' && "stroke-primary/50 fill-primary/10",
                    type === 'penalty' && "stroke-destructive/50 fill-destructive/10"
                  )}
                  strokeWidth="2"
                />
                {i === 29 && (
                   <text x={p.x} y={p.y - 20} textAnchor="middle" className="text-[12px] fill-gold font-display">FINISH</text>
                )}
              </g>
            );
          })}
        </g>
      ))}

      {/* Pegs */}
      <AnimatePresence>
        {gameState.pegs.map((peg) => {
          if (peg.isFinished) return null;
          
          // Pieces not in play sit at the bottom
          const isLeft = peg.side === 'hounds';
          const defaultX = isLeft ? 300 : 700;
          const defaultY = 920 + (parseInt(peg.id.split('-')[1]) * 15);
          
          const point = peg.position >= 0 ? trackPoints[peg.side][peg.position] : { x: defaultX, y: defaultY };
          const isLegal = legalMoves.includes(peg.id);
          const isSelected = selectedPegId === peg.id;

          return (
            <motion.g
              key={peg.id}
              initial={false}
              animate={{ x: point.x, y: point.y }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              onClick={() => onPegClick(peg.id)}
              className="cursor-pointer"
            >
              <motion.circle
                r="15"
                fill={isLeft ? "hsl(var(--primary))" : "hsl(var(--secondary))"}
                stroke="white"
                strokeWidth={isSelected ? "4" : "2"}
                whileHover={{ scale: 1.2 }}
                className={cn(
                  "transition-all",
                  isLegal && "filter drop-shadow-[0_0_8px_hsl(var(--primary))]"
                )}
              />
              <text textAnchor="middle" dy="0.3em" className="text-[14px] pointer-events-none fill-black font-bold">
                {isLeft ? 'H' : 'J'}
              </text>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
};
