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

  const getPlayerColor = (player: string, isLion: boolean) => {
    if (isLion) {
      return 'url(#lionGoldenGradient)';
    }
    switch (player) {
      case 'player1': return 'url(#playerGoldGradient)'; 
      case 'player2': return 'url(#playerTurquoiseGradient)'; 
      default: return '#fff';
    }
  };

  return (
    <svg viewBox="0 0 1000 1000" className="w-full h-full drop-shadow-2xl">
      <defs>
        <radialGradient id="serpentGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--gold-dark))" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(var(--obsidian))" stopOpacity="0.85" />
        </radialGradient>
        
        {/* Premium Gradients for Tokens */}
        <linearGradient id="playerGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fff1d6" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#aa7c11" />
        </linearGradient>

        <linearGradient id="playerTurquoiseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e0ffff" />
          <stop offset="50%" stopColor="#00ced1" />
          <stop offset="100%" stopColor="#008b8b" />
        </linearGradient>

        <linearGradient id="lionGoldenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7f50" />
          <stop offset="50%" stopColor="#e25822" />
          <stop offset="100%" stopColor="#8b0000" />
        </linearGradient>
        
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
        className="opacity-45"
      />
      
      {/* Space Outlines */}
      {spiralPoints.map((p, i) => {
        const type = MehenEngine.getSpaceType(i, boardSize);
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="26"
              className={cn(
                "transition-all duration-300 stroke-gold/25 fill-black/45",
                type === 'head' && "fill-primary/20 stroke-primary/50",
                type === 'tail' && "fill-accent/20 stroke-accent/50",
                type === 'trap' && "fill-destructive/20 stroke-destructive/50"
              )}
              strokeWidth="2"
            />
            {type !== 'normal' && (
               <text x={p.x} y={p.y} textAnchor="middle" dy="0.32em" className="text-[12px] fill-gold/55 font-display select-none pointer-events-none">
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

      {/* Scattered Pieces */}
      <AnimatePresence>
        {gameState.pieces.map((piece) => {
          if (piece.isFinished) return null;

          // Radial layout offset logic for overlapping coordinates
          const piecesAtPos = gameState.pieces.filter(
            p => p.position === piece.position && !p.isFinished
          );
          const idx = piecesAtPos.findIndex(p => p.id === piece.id);
          const count = piecesAtPos.length;

          let dx = 0;
          let dy = 0;
          if (count > 1) {
            const angle = (idx / count) * Math.PI * 2;
            const radius = piece.position === 0 ? 32 : 15;
            dx = Math.cos(angle) * radius;
            dy = Math.sin(angle) * radius;
          }

          const point = spiralPoints[piece.position];
          const isLegal = legalMoves.includes(piece.id);
          const isSelected = selectedPieceId === piece.id;
          
          return (
            <motion.g
              key={piece.id}
              initial={false}
              animate={{ x: point.x + dx, y: point.y + dy }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              onClick={() => onPieceClick(piece.id)}
              className={cn(
                "cursor-pointer",
                isLegal && "filter drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]"
              )}
            >
              <motion.circle
                r={piece.isLion ? "18" : "12"}
                fill={getPlayerColor(piece.owner, piece.isLion)}
                stroke={piece.isLion ? "hsl(var(--gold))" : "white"}
                strokeWidth={piece.isLion ? "2.5" : "1.5"}
                whileHover={{ scale: 1.25 }}
                className={cn(
                  "transition-all",
                  isSelected && "stroke-white stroke-[4px]",
                  isLegal && "stroke-primary animate-pulse"
                )}
              />
              <text
                textAnchor="middle"
                dy="0.32em"
                className={cn(
                  "text-[10px] font-bold select-none pointer-events-none font-display",
                  piece.isLion ? "fill-white text-[12px]" : "fill-black/80"
                )}
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
