import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState, Piece, SpaceType } from '../engine/types';
import { MehenEngine } from '../engine/MehenEngine';
import { cn } from '@/lib/utils';

interface MehenBoard2DProps {
  gameState: GameState;
  boardSize: number;
  onPieceClick: (pieceId: string) => void;
  selectedPieceId: string | null;
  legalMoves: string[];
}

export const MehenBoard2D: React.FC<MehenBoard2DProps> = ({
  gameState,
  boardSize,
  onPieceClick,
  selectedPieceId,
  legalMoves,
}) => {
  // Generate spiral points
  const spiralPoints = useMemo(() => {
    const points: { x: number; y: number; angle: number; index: number }[] = [];
    const centerX = 500;
    const centerY = 500;
    const initialRadius = 450;
    const finalRadius = 50;
    const totalRotations = 3;
    
    for (let i = 0; i <= boardSize; i++) {
      const t = i / boardSize;
      const angle = t * totalRotations * Math.PI * 2;
      const radius = initialRadius - t * (initialRadius - finalRadius);
      
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        angle,
        index: i
      });
    }
    return points;
  }, [boardSize]);

  const getPlayerColor = (player: string) => {
    switch (player) {
      case 'player1': return 'hsl(var(--primary))'; // Gold
      case 'player2': return 'hsl(var(--accent))'; // Turquoise
      case 'player3': return 'hsl(var(--destructive))'; // Terracotta
      case 'player4': return 'hsl(var(--secondary))'; // Lapis
      default: return '#fff';
    }
  };

  return (
    <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl">
      <defs>
        <radialGradient id="serpentGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--gold-dark))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--obsidian))" stopOpacity="0.8" />
        </radialGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Serpent Body */}
      <path
        d={`M ${spiralPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
        fill="none"
        stroke="url(#serpentGradient)"
        strokeWidth="60"
        strokeLinecap="round"
        className="opacity-40"
      />
      
      {/* Space Outlines */}
      {spiralPoints.map((p, i) => {
        const type = MehenEngine.getSpaceType(i, boardSize);
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="25"
              className={cn(
                "transition-all duration-300 stroke-gold/20 fill-black/40",
                type === 'head' && "fill-primary/20 stroke-primary/40",
                type === 'tail' && "fill-accent/20 stroke-accent/40",
                type === 'trap' && "fill-destructive/20 stroke-destructive/40"
              )}
              strokeWidth="2"
            />
            {type !== 'normal' && (
               <text x={p.x} y={p.y} textAnchor="middle" dy="0.3em" className="text-[10px] fill-gold/40 font-display">
                 {type === 'head' ? '𓆙' : type === 'tail' ? '𓅃' : ''}
               </text>
            )}
          </g>
        );
      })}

      {/* Connection Lines (Serpent Scale detail) */}
      <path
        d={`M ${spiralPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="1"
        strokeDasharray="5,10"
        className="opacity-20"
      />

      {/* Pieces */}
      <AnimatePresence>
        {gameState.pieces.map((piece) => {
          const point = spiralPoints[piece.position];
          const isLegal = legalMoves.includes(piece.id);
          const isSelected = selectedPieceId === piece.id;
          
          return (
            <motion.g
              key={piece.id}
              initial={false}
              animate={{ x: point.x, y: point.y }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              onClick={() => onPieceClick(piece.id)}
              className={cn(
                "cursor-pointer",
                isLegal && "filter drop-shadow-[0_0_8px_hsl(var(--primary))]"
              )}
            >
              <motion.circle
                r={piece.isLion ? "18" : "12"}
                fill={getPlayerColor(piece.owner)}
                stroke="white"
                strokeWidth="2"
                whileHover={{ scale: 1.2 }}
                className={cn(
                  "transition-all",
                  isSelected && "stroke-white stroke-[4px]",
                  piece.isLion && "stroke-gold"
                )}
              />
              <text
                textAnchor="middle"
                dy="0.3em"
                className="text-[10px] fill-black font-bold select-none pointer-events-none"
              >
                {piece.isLion ? '♌' : ''}
              </text>
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
};
