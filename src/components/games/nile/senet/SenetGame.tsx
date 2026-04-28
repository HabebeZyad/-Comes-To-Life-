import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, HelpCircle, History, Settings, Box, Grid, ChevronLeft, Play, Info } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { SenetEngine } from './engine/SenetEngine';
import { SenetAI } from './engine/SenetAI';
import { GameState, Player, SenetSettings, AIDifficulty, RuleMode } from './engine/types';
import { SenetBoard2D } from './ui/SenetBoard2D';

interface SenetGameProps {
  onBack: () => void;
}

export const SenetGame: React.FC<SenetGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>(SenetEngine.createInitialState());
  const [settings, setSettings] = useState<SenetSettings>({
    ruleMode: 'modern',
    aiDifficulty: 'normal',
    is3D: false,
  });
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer === 'player2' && gameState.throwResult === 0 && !isThrowing) {
      const timer = setTimeout(() => handleThrow(), 1000);
      return () => clearTimeout(timer);
    }
    
    if (!gameState.isGameOver && gameState.currentPlayer === 'player2' && gameState.throwResult > 0) {
      const timer = setTimeout(() => {
        const bestMove = SenetAI.getBestMove(gameState, gameState.throwResult, settings.aiDifficulty);
        if (bestMove !== null) {
          handleMove(bestMove);
        } else {
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'player1',
            throwResult: 0,
            moveLog: [`AI has no legal moves. Turn passes.`, ...prev.moveLog]
          }));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver, isThrowing]);

  const handleThrow = useCallback(() => {
    if (isThrowing || gameState.throwResult > 0 || gameState.isGameOver) return;
    setIsThrowing(true);
    setTimeout(() => {
      const { sticks, result, extraTurn } = SenetEngine.throwSticks();
      setGameState(prev => ({
        ...prev,
        sticks,
        throwResult: result,
        extraTurn,
        moveLog: [`${prev.currentPlayer} threw a ${result}!`, ...prev.moveLog]
      }));
      setIsThrowing(false);
    }, 800);
  }, [isThrowing, gameState.throwResult, gameState.isGameOver]);

  const handleMove = useCallback((fromId: number) => {
    if (gameState.throwResult === 0 || gameState.isGameOver) return;
    const newState = SenetEngine.makeMove(gameState, fromId, gameState.throwResult);
    setGameState({
      ...newState,
      history: [gameState, ...gameState.history].slice(0, 10),
    });
    setSelectedPiece(null);
  }, [gameState]);

  const handleUndo = () => {
    if (gameState.history.length > 0) {
      setGameState(gameState.history[0]);
    }
  };

  const handleRestart = () => {
    setGameState(SenetEngine.createInitialState(settings.ruleMode));
  };

  const legalMoves = gameState.throwResult > 0 ? SenetEngine.getLegalMoves(gameState, gameState.throwResult) : [];

  return (
    <div className="min-h-screen bg-obsidian text-foreground overflow-hidden flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-gold/20 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <EgyptianButton variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft size={20} /> Back
          </EgyptianButton>
          <h1 className="text-2xl font-display text-gold-gradient hidden md:block">Senet: Game of Passage</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <EgyptianButton variant="ghost" size="sm" onClick={() => setSettings(s => ({ ...s, is3D: !s.is3D }))}>
            {settings.is3D ? <Grid size={20} className="mr-2" /> : <Box size={20} className="mr-2" />}
            {settings.is3D ? '2D Mode' : '3D Mode'}
          </EgyptianButton>
          <EgyptianButton variant="ghost" size="sm" onClick={() => setShowTutorial(true)}>
            <HelpCircle size={20} />
          </EgyptianButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            {!settings.is3D ? (
              <motion.div
                key="2d-board"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full max-w-5xl aspect-[10/4.5] relative"
              >
                <SenetBoard2D 
                  gameState={gameState} 
                  onPieceClick={(id) => {
                    if (gameState.currentPlayer === 'player1' && legalMoves.includes(id)) {
                      handleMove(id);
                    }
                  }}
                  selectedPiece={selectedPiece}
                  legalMoves={legalMoves}
                />
              </motion.div>
            ) : (
              <motion.div
                key="3d-board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <Box size={64} className="mb-4 text-gold/40 animate-pulse" />
                <p className="font-display text-xl text-gold/60">3D MODE COMING SOON</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-gold/30 shadow-gold-glow flex flex-col items-center gap-4">
              <div className="flex gap-3 h-12 items-center">
                {gameState.sticks.map((isWhite, i) => (
                  <motion.div
                    key={i}
                    animate={isThrowing ? { rotateX: [0, 180, 360, 540, 720], y: [0, -20, 0] } : { rotateX: isWhite ? 0 : 180 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`w-4 h-16 rounded-full border border-gold/40 shadow-inner ${isWhite ? 'bg-gradient-to-b from-papyrus to-papyrus-dark' : 'bg-gradient-to-b from-obsidian to-black'}`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-[10px] text-gold/60 uppercase font-bold tracking-tighter">Result</p>
                  <p className="text-2xl font-display text-primary">{gameState.throwResult || '?'}</p>
                </div>
                <EgyptianButton 
                  variant="gold" 
                  size="lg" 
                  disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer === 'player2'}
                  onClick={handleThrow}
                >
                  THROW
                </EgyptianButton>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-black/40 border-l border-gold/10 backdrop-blur-md p-6 flex flex-col gap-6 z-30">
          <div className="bg-lapis-deep/40 rounded-xl p-5 border border-lapis-light/20">
             <p className="text-xs text-turquoise font-bold uppercase tracking-widest mb-1">Turn</p>
             <h3 className={`text-2xl font-display uppercase ${gameState.currentPlayer === 'player1' ? 'text-primary' : 'text-white/60'}`}>
                {gameState.currentPlayer === 'player1' ? 'Player' : 'AI'}
             </h3>
             <div className="mt-4 flex justify-between">
                <div>
                   <p className="text-[10px] text-white/40">Player</p>
                   <div className="flex gap-1">
                      {Array.from({ length: 5 - gameState.piecesOffBoard.player1 }).map((_, i) => (
                        <div key={i} className="w-2 h-4 bg-primary rounded-full" />
                      ))}
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-[10px] text-white/40">AI</p>
                   <div className="flex gap-1 justify-end">
                      {Array.from({ length: 5 - gameState.piecesOffBoard.player2 }).map((_, i) => (
                        <div key={i} className="w-2 h-4 bg-white/20 rounded-full" />
                      ))}
                   </div>
                </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-gold/60 uppercase flex items-center gap-2">History</p>
                <button onClick={handleUndo} disabled={gameState.history.length === 0} className="text-[10px] text-primary">UNDO</button>
             </div>
             <div className="flex-1 bg-black/20 rounded-lg p-3 overflow-y-auto font-body text-sm border border-white/5 scrollbar-none">
                {gameState.moveLog.map((log, i) => (
                  <p key={i} className={`mb-1 ${i === 0 ? 'text-white' : 'text-white/40'}`}>{log}</p>
                ))}
             </div>
          </div>

          <EgyptianButton variant="interactive" className="w-full" onClick={handleRestart}>RESTART</EgyptianButton>
        </div>
      </div>

      <AnimatePresence>
        {gameState.winner && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <EgyptianCard variant="museum" className="max-w-md w-full text-center">
               <EgyptianCardTitle className="text-4xl mb-4">VICTORY</EgyptianCardTitle>
               <EgyptianCardContent className="mb-8">
                  {gameState.winner === 'player1' ? "You Won!" : "AI Won!"}
               </EgyptianCardContent>
               <EgyptianButton variant="gold" size="lg" className="w-full" onClick={handleRestart}>PLAY AGAIN</EgyptianButton>
            </EgyptianCard>
          </div>
        )}

        {showTutorial && (
           <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
             <EgyptianCard variant="gold" className="max-w-2xl w-full">
                <EgyptianCardHeader>
                   <EgyptianCardTitle>Rules</EgyptianCardTitle>
                </EgyptianCardHeader>
                <EgyptianCardContent className="space-y-4">
                   <p>Throw sticks. Move 1-5 steps. Swap with opponent unless they are protected (2 pieces) or blocked (3 pieces).</p>
                   <EgyptianButton className="w-full" onClick={() => setShowTutorial(false)}>CLOSE</EgyptianButton>
                </EgyptianCardContent>
             </EgyptianCard>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
