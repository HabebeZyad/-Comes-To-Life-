import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, HelpCircle, Box, Grid, ChevronLeft, Info } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';
import { HoundsEngine } from './engine/HoundsEngine';
import { HoundsAI } from './engine/HoundsAI';
import { GameState, HoundsSettings, PlayerSide } from './engine/types';
import { HoundsBoard2D } from './ui/HoundsBoard2D';
import { HoundsBoard3D } from './ui/HoundsBoard3D';

interface HoundsGameProps {
  onBack: () => void;
}

const LEVELS = [
  { level: 1, name: "The Desert Outskirts", aiLevel: "beginner" as const },
  { level: 2, name: "The Jackal's Path", aiLevel: "normal" as const },
  { level: 3, name: "The Sphinx's Challenge", aiLevel: "pro" as const },
];

export const HoundsGame: React.FC<HoundsGameProps> = ({ onBack }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const levelData = LEVELS[currentLevelIndex];

  const [settings, setSettings] = useState<HoundsSettings>({
    aiDifficulty: levelData.aiLevel,
    is3D: false,
  });

  const [gameState, setGameState] = useState<GameState>(HoundsEngine.createInitialState());
  const [selectedPegId, setSelectedPegId] = useState<string | null>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const { addScore } = useHighScores();
  useEffect(() => {
    if (gameState.isGameOver && gameState.winner === 'hounds') {
      addScore({ playerName: 'Pharaoh', score: (currentLevelIndex + 1) * 1000, game: 'hounds', difficulty: levelData.aiLevel, details: 'Level ' + (currentLevelIndex + 1) });
    }
  }, [gameState.isGameOver, gameState.winner, currentLevelIndex, levelData, addScore]);
  const [showTutorial, setShowTutorial] = useState(false);

  // AI Turn Logic
  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer === 'jackals' && gameState.throwResult === 0 && !isThrowing) {
      const timer = setTimeout(() => handleThrow(), 1000);
      return () => clearTimeout(timer);
    }
    
    if (!gameState.isGameOver && gameState.currentPlayer === 'jackals' && gameState.throwResult > 0) {
      const timer = setTimeout(() => {
        const bestMove = HoundsAI.getBestMove(gameState, gameState.throwResult, settings);
        if (bestMove) {
          handleMove(bestMove);
        } else {
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'hounds',
            throwResult: 0,
            moveLog: [`Jackals have no legal moves.`, ...prev.moveLog]
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
      const { sticks, result } = HoundsEngine.throwSticks();
      setGameState(prev => ({
        ...prev,
        sticks,
        throwResult: result,
        moveLog: [`${prev.currentPlayer} threw a ${result}!`, ...prev.moveLog]
      }));
      setIsThrowing(false);
    }, 800);
  }, [isThrowing, gameState.throwResult, gameState.isGameOver]);

  const handleMove = useCallback((pegId: string) => {
    if (gameState.throwResult === 0 || gameState.isGameOver) return;
    const newState = HoundsEngine.makeMove(gameState, pegId);
    setGameState({
      ...newState,
      history: [gameState, ...gameState.history].slice(0, 10),
    });
    setSelectedPegId(null);
  }, [gameState]);

  const handleRestart = () => {
    setGameState(HoundsEngine.createInitialState());
  };

  const legalMoves = gameState.throwResult > 0 ? HoundsEngine.getLegalMoves(gameState, gameState.throwResult) : [];

  return (
    <div className="min-h-screen bg-obsidian text-foreground overflow-hidden flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-gold/20 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <EgyptianButton variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft size={20} /> Back
          </EgyptianButton>
          <h1 className="text-2xl font-display text-gold-gradient hidden md:block">Hounds & Jackals</h1>
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
                className="w-full max-w-2xl aspect-square sm:aspect-[2/3] max-h-[55vh] sm:max-h-[70vh] md:max-h-[80vh] relative"
              >
                <HoundsBoard2D 
                  gameState={gameState} 
                  onPegClick={(id) => {
                    if (gameState.currentPlayer === 'hounds' && legalMoves.includes(id)) {
                      handleMove(id);
                    }
                  }}
                  selectedPegId={selectedPegId}
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
                <HoundsBoard3D gameState={gameState} />
              </motion.div>
            )}
          </AnimatePresence>


              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {gameState.sticks.map((stick, i) => (
                    <motion.div
                      key={`${gameState.turnNumber}-${i}`}
                      initial={{ rotateX: 0, y: -20, opacity: 0 }}
                      animate={{
                        rotateX: isThrowing ? [0, 360, 720, stick ? 180 : 0] : (stick ? 180 : 0),
                        y: isThrowing ? [-20, -50, 0] : 0,
                        opacity: 1
                      }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className={`w-4 h-16 sm:w-6 sm:h-20 rounded-full border-2 ${stick ? 'bg-primary border-gold shadow-gold-glow' : 'bg-black/80 border-white/20'}`}
                    />
                  ))}
                </div>
                {gameState.throwResult > 0 && !isThrowing && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-display text-gold-light bg-black/60 px-6 py-2 rounded-full border border-gold/30 backdrop-blur-sm"
                  >
                    {gameState.throwResult}
                  </motion.div>
                )}
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">

            <div className="bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-gold/30 shadow-gold-glow flex flex-col items-center gap-4">
              <div className="flex gap-3 h-10 items-center">
                {gameState.sticks.map((isWhite, i) => (
                  <motion.div
                    key={i}
                    animate={isThrowing ? { rotateX: [0, 180, 360, 540, 720] } : { rotateX: isWhite ? 0 : 180 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className={`w-2 h-10 rounded-full border border-gold/40 ${isWhite ? 'bg-papyrus' : 'bg-black'}`}
                  />
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-2xl font-display text-primary">{gameState.throwResult || '?'}</p>
                </div>
                <EgyptianButton 
                  variant="gold" 
                  size="lg" 
                  disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer !== 'hounds'}
                  onClick={handleThrow}
                >
                  THROW
                </EgyptianButton>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-black/40 border-l border-gold/10 backdrop-blur-md p-6 flex flex-col gap-6 z-30">
          <div className="bg-lapis-deep/40 rounded-xl p-5 border border-lapis-light/20 text-center">
             <p className="text-xs text-turquoise font-bold uppercase mb-1">Turn</p>
             <h3 className={`text-2xl font-display uppercase ${gameState.currentPlayer === 'hounds' ? 'text-primary' : 'text-secondary'}`}>
                {gameState.currentPlayer === 'hounds' ? 'Hounds (You)' : 'Jackals (AI)'}
             </h3>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <p className="text-xs font-bold text-gold/60 uppercase mb-3 flex items-center gap-2">
               <Info size={14} /> How to Play
             </p>
             <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto font-body text-sm border border-white/5 space-y-3">
                <p className="text-white/80 leading-relaxed">
                  <span className="text-primary font-bold">Goal:</span> Race all 5 pegs to the final finish hole.
                </p>
                <div className="space-y-2 text-white/60 text-xs">
                  <p>• Each player has a <span className="text-turquoise">mirrored track</span>.</p>
                  <p>• Throw sticks to move your Hounds or Jackals.</p>
                  <p>• Use <span className="text-primary">Shortcuts</span> (Holes 6 & 8) to jump ahead.</p>
                  <p>• Watch out for <span className="text-destructive">Traps</span> (Hole 15) that set you back.</p>
                  <p>• First to get all 5 sacred pegs to the finish wins!</p>
                </div>
                <div className="pt-2 border-t border-white/5 italic text-[10px] text-white/40">
                  A classic race game of tactical placement and luck of the sticks.
                </div>
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
                  {gameState.winner === 'hounds' ? "The Hounds have reached the end!" : "The Jackals have claimed victory!"}
               </EgyptianCardContent>
               <EgyptianButton variant="gold" size="lg" className="w-full" onClick={handleRestart}>PLAY AGAIN</EgyptianButton>
            </EgyptianCard>
          </div>
        )}

        {showTutorial && (
           <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
             <EgyptianCard variant="gold" className="max-w-2xl w-full">
                <EgyptianCardHeader>
                   <EgyptianCardTitle>Hounds and Jackals (58 Holes)</EgyptianCardTitle>
                </EgyptianCardHeader>
                <EgyptianCardContent className="space-y-4 font-body">
                   <p>Race your 5 pegs along the track to the final hole. Each player has their own side.</p>
                   <p>Look out for shortcuts (holes 6 and 8) and traps (hole 15)! First to move all 5 pegs to the finish wins.</p>
                   <EgyptianButton className="w-full" onClick={() => setShowTutorial(false)}>START RACE</EgyptianButton>
                </EgyptianCardContent>
             </EgyptianCard>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
