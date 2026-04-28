import React from 'react';
import { motion } from 'framer-motion';
import { GameState, Player, Square } from '../engine/types';
import { Sparkles, Tent, Eye, Waves as Water, Milestone } from 'lucide-react';

interface SenetBoard2DProps {
  gameState: GameState;
  onPieceClick: (id: number) => void;
  selectedPiece: number | null;
  legalMoves: number[];
}

export const SenetBoard2D: React.FC<SenetBoard2DProps> = ({ gameState, onPieceClick, selectedPiece, legalMoves }) => {
  // Map logic square indices to visual positions
  // 1-10: 0,0 to 0,9
  // 11-20: 1,9 to 1,0 (Reverse)
  // 21-30: 2,0 to 2,9
  const getVisualPosition = (id: number) => {
    if (id <= 10) return { row: 0, col: id - 1 };
    if (id <= 20) return { row: 1, col: 20 - id };
    return { row: 2, col: id - 21 };
  };

  const getSquareIcon = (type: string) => {
    switch (type) {
      case 'rebirth': return <Milestone className="text-turquoise" size={24} />;
      case 'happiness': return <Sparkles className="text-primary" size={24} />;
      case 'water': return <Water className="text-blue-400" size={24} />;
      case 'three-truths': return <div className="flex gap-0.5"><div className="w-1.5 h-1.5 bg-primary rounded-full" /><div className="w-1.5 h-1.5 bg-primary rounded-full" /><div className="w-1.5 h-1.5 bg-primary rounded-full" /></div>;
      case 're-atum': return <Eye className="text-gold" size={20} />;
      case 'last': return <Tent className="text-primary" size={24} />;
      default: return null;
    }
  };

  return (
    <div className="w-full h-full bg-sandstone-light/10 p-2 rounded-lg border-4 border-gold/40 shadow-2xl relative">
      {/* Board Texture Overlay */}
      <div className="absolute inset-0 hieroglyph-pattern opacity-5 pointer-events-none" />
      
      <div className="grid grid-rows-3 grid-cols-10 h-full w-full gap-1">
        {gameState.board.map((square) => {
          const { row, col } = getVisualPosition(square.id);
          const isLegal = legalMoves.includes(square.id);
          
          return (
            <div 
              key={square.id}
              style={{ gridRow: row + 1, gridColumn: col + 1 }}
              className={`
                relative flex items-center justify-center border border-gold/20
                ${(row + col) % 2 === 0 ? 'bg-black/40' : 'bg-black/20'}
                ${isLegal ? 'ring-2 ring-primary/50 shadow-[inset_0_0_15px_rgba(201,162,39,0.3)]' : ''}
                transition-all duration-300
              `}
            >
              {/* Square ID/Label (Subtle) */}
              <span className="absolute top-1 left-1 text-[8px] text-gold/20 font-display">{square.id}</span>
              
              {/* Special Square Markings */}
              <div className="opacity-30">
                {getSquareIcon(square.type)}
              </div>

              {/* Piece */}
              {square.piece && (
                <motion.div
                  layoutId={`piece-${square.id}`}
                  onClick={() => onPieceClick(square.id)}
                  className={`
                    w-4/5 h-4/5 rounded-sm cursor-pointer relative z-10
                    ${square.piece === 'player1' 
                      ? 'bg-gradient-to-br from-primary via-gold-dark to-gold-light shadow-[0_0_10px_rgba(201,162,39,0.5)]' 
                      : 'bg-gradient-to-br from-lapis via-lapis-deep to-lapis-light shadow-[0_0_10px_rgba(30,58,138,0.5)]'}
                    ${isLegal && gameState.currentPlayer === square.piece ? 'hover:scale-110' : ''}
                    flex items-center justify-center
                  `}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={isLegal && gameState.currentPlayer === square.piece ? { y: -5 } : {}}
                >
                  <div className={`w-1/2 h-1/2 rounded-full border border-white/10 ${square.piece === 'player1' ? 'hieroglyph-pattern opacity-20' : 'opacity-10'}`} />
                  
                  {isLegal && gameState.currentPlayer === square.piece && (
                    <motion.div 
                      className="absolute inset-0 border-2 border-white rounded-sm"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </motion.div>
              )}

              {/* Legal Move Target Marker */}
              {isLegal && !square.piece && (
                <div 
                  className="w-3 h-3 rounded-full bg-primary/20 animate-pulse cursor-pointer hover:bg-primary/40"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* S-curve path arrows (Decorative) */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gold/10 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/6 left-0 right-0 h-px bg-gold/10 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-5/6 left-0 right-0 h-px bg-gold/10 -translate-y-1/2 pointer-events-none" />
    </div>
  );
};
