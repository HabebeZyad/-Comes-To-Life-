import React from 'react';
import { motion } from 'framer-motion';
import { GameState, Square } from '../engine/types';
import { Sparkles, Milestone, Eye, Tent, Waves as Water } from 'lucide-react';

interface SenetBoard2DProps {
  gameState: GameState;
  onPieceClick: (id: number) => void;
  legalMoves: number[];
}

export const SenetBoard2D: React.FC<SenetBoard2DProps> = ({ gameState, onPieceClick, legalMoves }) => {
  const getVisualPosition = (id: number) => {
    if (id <= 10) return { row: 0, col: id - 1 };
    if (id <= 20) return { row: 1, col: 20 - id };
    return { row: 2, col: id - 21 };
  };

  const getSquareIcon = (type: string) => {
    switch (type) {
      case 'rebirth': return <Milestone className="text-turquoise" size={20} />;
      case 'happiness': return <Sparkles className="text-primary" size={20} />;
      case 'water': return <Water className="text-blue-400" size={20} />;
      case 're-atum': return <Eye className="text-gold" size={18} />;
      case 'last': return <Tent className="text-primary" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="grid grid-rows-3 grid-cols-10 h-full w-full gap-1 p-2 bg-black/20 rounded-lg border-2 border-gold/20">
      {gameState.board.map((square) => {
        const { row, col } = getVisualPosition(square.id);
        const isLegal = legalMoves.includes(square.id);
        return (
          <div 
            key={square.id}
            style={{ gridRow: row + 1, gridColumn: col + 1 }}
            className={`relative flex items-center justify-center border border-gold/10 ${(row + col) % 2 === 0 ? 'bg-black/30' : 'bg-black/10'} ${isLegal ? 'ring-1 ring-primary/40' : ''}`}
          >
            <span className="absolute top-0.5 left-0.5 text-[6px] text-gold/20">{square.id}</span>
            <div className="opacity-20">{getSquareIcon(square.type)}</div>
            {square.piece && (
              <motion.div
                layoutId={`piece-${square.id}`}
                onClick={() => isLegal && onPieceClick(square.id)}
                className={`w-3/4 h-3/4 rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 relative ${
                  square.piece === 'player1' 
                    ? 'bg-gradient-to-br from-gold-light via-gold to-gold-dark border border-gold-light/40 shadow-[0_0_10px_rgba(201,162,39,0.35)]' 
                    : 'bg-gradient-to-br from-turquoise via-lapis to-lapis-dark border border-turquoise/30 shadow-[0_0_10px_rgba(43,122,120,0.35)]'
                } ${isLegal ? 'animate-pulse ring-2 ring-primary scale-105' : 'hover:scale-105'}`}
              >
                {/* Visual texture inside pieces: spool groove for gold, miniature pyramid for lapis */}
                {square.piece === 'player1' ? (
                  <div className="w-1/2 h-1/2 rounded-full border border-black/20 flex items-center justify-center bg-gold-dark/20">
                    <div className="w-2 h-2 rounded-full bg-gold-light/80" />
                  </div>
                ) : (
                  <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-turquoise-light/80" />
                )}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
};
