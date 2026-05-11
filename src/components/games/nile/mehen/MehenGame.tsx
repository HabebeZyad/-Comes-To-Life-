import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, HelpCircle, Box, Grid, ChevronLeft, Info } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { MehenEngine } from './engine/MehenEngine';
import { MehenAI } from './engine/MehenAI';
import { GameState, MehenSettings, Player } from './engine/types';
import { MehenBoard2D } from './ui/MehenBoard2D';
import { MehenBoard3D } from './ui/MehenBoard3D';

interface MehenGameProps {
  onBack: () => void;
}

export const MehenGame: React.FC<MehenGameProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<MehenSettings>({
    boardSize: 72,
    playersCount: 4,
    ruleMode: 'strategic',
    aiDifficulty: 'normal',
    is3D: false,
  });

  const [gameState, setGameState] = useState<GameState>(MehenEngine.createInitialState(settings));
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // AI Turn Logic
  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer !== 'player1' && gameState.throwResult === 0 && !isThrowing) {
      const timer = setTimeout(() => handleThrow(), 1000);
      return () => clearTimeout(timer);
    }
    
    if (!gameState.isGameOver && gameState.currentPlayer !== 'player1' && gameState.throwResult > 0) {
      const timer = setTimeout(() => {
        const bestMove = MehenAI.getBestMove(gameState, gameState.throwResult, settings);
        if (bestMove) {
          handleMove(bestMove);
        } else {
          // No legal moves
          setGameState(prev => ({
            ...prev,
            currentPlayer: getNextPlayer(prev.currentPlayer, settings.playersCount),
            throwResult: 0,
            moveLog: [`${prev.currentPlayer} has no legal moves.`, ...prev.moveLog]
          }));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver, isThrowing]);

  const getNextPlayer = (current: Player, count: number): Player => {
    const players: Player[] = (['player1', 'player2', 'player3', 'player4', 'player5', 'player6'] as Player[]).slice(0, count);
    const idx = players.indexOf(current);
    return players[(idx + 1) % players.length];
  };

  const handleThrow = useCallback(() => {
    if (isThrowing || gameState.throwResult > 0 || gameState.isGameOver) return;
    setIsThrowing(true);
    setTimeout(() => {
      const { sticks, result } = MehenEngine.throwSticks();
      setGameState(prev => ({
        ...prev,
        sticks,
        throwResult: result,
        moveLog: [`${prev.currentPlayer} threw a ${result}!`, ...prev.moveLog]
      }));
      setIsThrowing(false);
    }, 800);
  }, [isThrowing, gameState.throwResult, gameState.isGameOver]);

  const handleMove = useCallback((pieceId: string) => {
    if (gameState.throwResult === 0 || gameState.isGameOver) return;
    const newState = MehenEngine.makeMove(gameState, pieceId, settings.boardSize, settings.ruleMode);
    setGameState({
      ...newState,
      history: [gameState, ...gameState.history].slice(0, 10),
    });
    setSelectedPieceId(null);
  }, [gameState, settings]);

  const handleRestart = () => {
    setGameState(MehenEngine.createInitialState(settings));
  };

  const legalMoves = gameState.throwResult > 0 ? MehenEngine.getLegalMoves(gameState, gameState.throwResult, settings.boardSize) : [];

  return (
    <div className="min-h-screen bg-obsidian text-foreground overflow-hidden flex flex-col">
      {/* HUD Header */}
      <div className="p-4 flex items-center justify-between border-b border-gold/20 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <EgyptianButton variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft size={20} /> Back
          </EgyptianButton>
          <h1 className="text-2xl font-display text-gold-gradient hidden md:block">Mehen: The Coiled Serpent</h1>
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
        {/* Game Board Area */}
        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            {!settings.is3D ? (
              <motion.div
                key="2d-board"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="w-full max-w-4xl aspect-square relative"
              >
                <MehenBoard2D 
                  gameState={gameState} 
                  boardSize={settings.boardSize}
                  onPieceClick={(id) => {
                    if (gameState.currentPlayer === 'player1' && legalMoves.includes(id)) {
                      handleMove(id);
                    }
                  }}
                  selectedPieceId={selectedPieceId}
                  legalMoves={legalMoves}
                />
              </motion.div>
            ) : (
              <motion.div
                key="3d-board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <MehenBoard3D gameState={gameState} boardSize={settings.boardSize} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls Overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-gold/30 shadow-gold-glow flex flex-col items-center gap-4">
              <div className="flex gap-3 h-12 items-center">
                {gameState.sticks.map((isWhite, i) => (
                  <motion.div
                    key={i}
                    animate={isThrowing ? { rotateX: [0, 180, 360, 540, 720], y: [0, -20, 0] } : { rotateX: isWhite ? 0 : 180 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`w-3 h-12 rounded-full border border-gold/40 ${isWhite ? 'bg-papyrus' : 'bg-black'}`}
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
                  disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer !== 'player1'}
                  onClick={handleThrow}
                >
                  THROW
                </EgyptianButton>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 bg-black/40 border-l border-gold/10 backdrop-blur-md p-6 flex flex-col gap-6 z-30 overflow-y-auto">
          <div className="bg-lapis-deep/40 rounded-xl p-5 border border-lapis-light/20">
             <p className="text-xs text-turquoise font-bold uppercase tracking-widest mb-1">Current Turn</p>
             <h3 className={`text-2xl font-display uppercase text-primary`}>
                {gameState.currentPlayer === 'player1' ? 'You' : `AI ${gameState.currentPlayer.slice(-1)}`}
             </h3>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <p className="text-xs font-bold text-gold/60 uppercase mb-3 flex items-center gap-2">
               <Info size={14} /> How to Play
             </p>
             <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto font-body text-sm border border-white/5 space-y-3">
                <p className="text-white/80 leading-relaxed">
                  <span className="text-primary font-bold">Goal:</span> Guide your pieces to the serpent's head.
                </p>
                <div className="space-y-2 text-white/60 text-xs">
                  <p>• Use throw sticks to advance along the <span className="text-gold">spiral path</span>.</p>
                  <p>• You control 3 marbles and 1 <span className="text-primary">Hunter Lion</span>.</p>
                  <p>• Your Lion can <span className="text-terracotta">capture</span> enemy marbles by landing on them.</p>
                  <p>• Avoid <span className="text-destructive">Traps</span> that reset your position.</p>
                  <p>• Land on <span className="text-turquoise">Safe</span> spaces to protect your pieces.</p>
                </div>
                <div className="pt-2 border-t border-white/5 italic text-[10px] text-white/40">
                  Inspired by ancient reconstructions of the mysterious coiled serpent game.
                </div>
             </div>
          </div>

          <EgyptianButton variant="interactive" className="w-full" onClick={handleRestart}>RESTART MATCH</EgyptianButton>
        </div>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {gameState.winner && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <EgyptianCard variant="museum" className="max-w-md w-full text-center">
               <EgyptianCardTitle className="text-4xl mb-4">ASCENSION</EgyptianCardTitle>
               <EgyptianCardContent className="mb-8 text-xl font-body">
                  {gameState.winner === 'player1' ? "You have reached the serpent's head!" : `AI ${gameState.winner.slice(-1)} has ascended!`}
               </EgyptianCardContent>
               <EgyptianButton variant="gold" size="lg" className="w-full" onClick={handleRestart}>PLAY AGAIN</EgyptianButton>
            </EgyptianCard>
          </div>
        )}

        {showTutorial && (
           <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
             <EgyptianCard variant="gold" className="max-w-2xl w-full">
                <EgyptianCardHeader>
                   <EgyptianCardTitle>The Mystery of Mehen</EgyptianCardTitle>
                </EgyptianCardHeader>
                <EgyptianCardContent className="space-y-4 font-body">
                   <p className="italic text-primary/80 text-sm">“Inspired by ancient Egyptian Mehen and modern reconstructions.”</p>
                   <p>Race your pieces (marbles and lions) from the tail of the serpent to its head. Lions can capture enemy marbles on the same space.</p>
                   <p>Special spaces like traps and leaps are scattered along the spiral body.</p>
                   <EgyptianButton className="w-full mt-4" onClick={() => setShowTutorial(false)}>ENTER THE SPIRAL</EgyptianButton>
                </EgyptianCardContent>
             </EgyptianCard>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
