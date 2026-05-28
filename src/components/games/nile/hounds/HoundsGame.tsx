import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, HelpCircle, Box, Grid, ChevronLeft, Info, Award, Zap } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';
import { HoundsEngine } from './engine/HoundsEngine';
import { HoundsAI } from './engine/HoundsAI';
import { GameState, HoundsSettings, PlayerSide, Peg } from './engine/types';
import { HoundsBoard2D } from './ui/HoundsBoard2D';
import { HoundsBoard3D } from './ui/HoundsBoard3D';

interface HoundsGameProps {
  onBack: () => void;
  levelIndex?: number;
  levelName?: string;
  aiDifficulty?: 'beginner' | 'normal' | 'pro';
  pegCount?: number;
  onComplete?: () => void;
}

export const HoundsGame: React.FC<HoundsGameProps> = ({ 
  onBack,
  levelIndex = 0,
  levelName = "Desert Race",
  aiDifficulty = "normal",
  pegCount = 5,
  onComplete
}) => {
  const { addScore } = useHighScores();

  const [settings, setSettings] = useState<HoundsSettings>({
    aiDifficulty: aiDifficulty,
    is3D: false,
  });

  const createInitialStateCustom = useCallback(() => {
    const pCount = pegCount !== undefined ? pegCount : 5;
    const pegs: Peg[] = [];
    
    for (let i = 0; i < pCount; i++) {
      pegs.push({ id: `hound-${i}`, side: 'hounds', position: -1, isFinished: false, isInPlay: false });
      pegs.push({ id: `jackal-${i}`, side: 'jackals', position: -1, isFinished: false, isInPlay: false });
    }

    return {
      pegs,
      currentPlayer: 'hounds',
      throwResult: 0,
      sticks: [true, true, true, true],
      isGameOver: false,
      winner: null,
      moveLog: ['Hounds vs Jackals begins.'],
      history: [],
      turnNumber: 1,
    };
  }, [pegCount]);

  const [gameState, setGameState] = useState<GameState>(createInitialStateCustom);
  const [selectedPegId, setSelectedPegId] = useState<string | null>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [noMovesAlert, setNoMovesAlert] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Sync settings
  useEffect(() => {
    setSettings(prev => ({ ...prev, aiDifficulty }));
  }, [aiDifficulty]);

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
          // AI pass turn back
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'hounds',
            throwResult: 0,
            moveLog: [`Jackals had no legal moves.`, ...prev.moveLog]
          }));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver, isThrowing, settings]);

  // Player Auto-Pass Logic
  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer === 'hounds' && gameState.throwResult > 0) {
      const moves = HoundsEngine.getLegalMoves(gameState, gameState.throwResult);
      if (moves.length === 0) {
        setNoMovesAlert(true);
        const timer = setTimeout(() => {
          setNoMovesAlert(false);
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'jackals',
            throwResult: 0,
            moveLog: ['You had no legal moves. Turn passed.', ...prev.moveLog]
          }));
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver]);

  // Save High Scores
  useEffect(() => {
    if (gameState.winner && !scoreSaved) {
      const isWin = gameState.winner === 'hounds';
      const finishedPegsCount = gameState.pegs.filter(p => p.side === 'hounds' && p.isFinished).length;
      const finalScore = isWin 
        ? Math.max(500, 1800 - gameState.turnNumber * 20) 
        : finishedPegsCount * 120;
      
      addScore({
        playerName: 'Desert Hunter',
        score: finalScore,
        game: 'hounds',
        difficulty: settings.aiDifficulty,
        details: isWin 
          ? `Won "${levelName}" in ${gameState.turnNumber} turns!` 
          : `Lost "${levelName}" at pegs: ${finishedPegsCount}/${pegCount}`
      });
      setScoreSaved(true);
    }
  }, [gameState.winner, scoreSaved, gameState.turnNumber, settings.aiDifficulty, levelName, addScore, pegCount]);

  const handleThrow = useCallback(() => {
    if (isThrowing || gameState.throwResult > 0 || gameState.isGameOver) return;
    setIsThrowing(true);
    setTimeout(() => {
      const { sticks, result } = HoundsEngine.throwSticks();
      setGameState(prev => ({
        ...prev,
        sticks,
        throwResult: result,
        moveLog: [`${prev.currentPlayer === 'hounds' ? 'You' : 'AI'} threw a ${result}!`, ...prev.moveLog]
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
    setGameState(createInitialStateCustom());
    setScoreSaved(false);
  };

  const legalMoves = gameState.throwResult > 0 ? HoundsEngine.getLegalMoves(gameState, gameState.throwResult) : [];

  return (
    <div className="min-h-screen bg-obsidian text-foreground overflow-hidden flex flex-col relative">
      
      {/* Alert toast for no legal moves */}
      <AnimatePresence>
        {noMovesAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-amber-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] text-center backdrop-blur-md"
          >
            <p className="text-gold font-display text-sm tracking-wider uppercase flex items-center gap-2 justify-center">
              <Zap className="text-gold animate-bounce" size={16} /> No moves possible! Turn passing...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 flex items-center justify-between border-b border-gold/20 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <EgyptianButton variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft size={20} /> Back
          </EgyptianButton>
          <div>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest">{levelName}</span>
            <h1 className="text-xl font-display text-gold-gradient leading-tight">Hounds & Jackals</h1>
          </div>
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
        {/* Game Board Area with height-based responsive containment */}
        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            {!settings.is3D ? (
              <motion.div
                key="2d-board"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-[50vh] min-h-[300px] max-h-[550px] aspect-[2/3] relative mx-auto lg:h-[60vh] lg:max-h-[620px]"
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

          {/* Premium Visual Sticks Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/75 backdrop-blur-xl p-4 rounded-2xl border border-gold/30 shadow-gold-glow flex flex-col items-center gap-4 min-w-[220px]">
              <div className="flex gap-4 h-16 items-center">
                {gameState.sticks.map((isWhite, i) => (
                  <motion.div
                    key={i}
                    animate={isThrowing ? { 
                      rotateX: [0, 180, 360, 540, 720],
                      y: [0, -20, 0]
                    } : { 
                      rotateX: isWhite ? 0 : 180,
                      y: 0
                    }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    style={{
                      width: '18px',
                      height: '64px',
                      borderRadius: '8px',
                      perspective: '1000px',
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                    }}
                    className="relative"
                  >
                    {/* Face Up (Light wood with palm palm/cactus design) */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '8px',
                        background: 'linear-gradient(to bottom, #faebd7, #dfba7c)',
                        border: '2px solid #b8860b',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                      }}
                    >
                      <div className="w-1 h-3 bg-amber-900/30 rounded-full" />
                      <div className="text-[12px] text-amber-900/60 font-bold select-none pointer-events-none font-display">🌵</div>
                      <div className="w-1 h-3 bg-amber-900/30 rounded-full" />
                    </div>

                    {/* Face Down (Dark charcoal wood) */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '8px',
                        background: 'linear-gradient(to bottom, #2b241f, #120e0a)',
                        border: '2px solid #4a3c31',
                        transform: 'rotateX(180deg)',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                      }}
                    >
                      <div className="w-1 h-3 bg-black/40 rounded-full" />
                      <div className="w-1.5 h-1.5 rounded-full bg-red-950/40" />
                      <div className="w-1 h-3 bg-black/40 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center gap-6 pt-1">
                <div className="text-center">
                  <p className="text-[9px] text-gold/60 uppercase font-bold tracking-widest">Throw</p>
                  <p className="text-3xl font-display text-gold-gradient">{gameState.throwResult || '?'}</p>
                </div>
                <EgyptianButton 
                  variant="gold" 
                  size="lg" 
                  disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer !== 'hounds'}
                  onClick={handleThrow}
                  className="font-bold tracking-widest"
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
             <h3 className={`text-2xl font-display uppercase ${gameState.currentPlayer === 'hounds' ? 'text-primary animate-pulse' : 'text-secondary/75'}`}>
                {gameState.currentPlayer === 'hounds' ? 'Hounds (You)' : 'Jackals (AI Thinking)'}
             </h3>
             <div className="mt-4 border-t border-white/5 pt-3 flex justify-between text-xs">
               <div className="text-left">
                 <p className="text-[10px] text-white/40 mb-1">Hounds Home</p>
                 <span className="font-bold text-primary">
                   {gameState.pegs.filter(p => p.side === 'hounds' && p.isFinished).length}/{pegCount}
                 </span>
               </div>
               <div className="text-right">
                 <p className="text-[10px] text-white/40 mb-1">Jackals Home</p>
                 <span className="font-bold text-turquoise">
                   {gameState.pegs.filter(p => p.side === 'jackals' && p.isFinished).length}/{pegCount}
                 </span>
               </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <p className="text-xs font-bold text-gold/60 uppercase mb-3 flex items-center gap-2">
               <Info size={14} /> How to Play
             </p>
             <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto font-body text-xs border border-white/5 space-y-3">
                <p className="text-white/80 leading-relaxed">
                  <span className="text-primary font-bold">Goal:</span> Race all pegs to the final finish hole.
                </p>
                <div className="space-y-2 text-white/60">
                  <p>• Throw sticks to advance your pegs along your track.</p>
                  <p>• Use <span className="text-primary">Shortcuts</span> (Holes 6 & 8) to bypass the valleys.</p>
                  <p>• Avoid <span className="text-destructive">Traps</span> (Hole 15) that slide you backward.</p>
                  <p>• Strategic blocking: Pegs cannot land on their own side's occupied holes.</p>
                </div>
             </div>
          </div>

          <EgyptianButton variant="interactive" className="w-full" onClick={handleRestart}>RESET TRIAL</EgyptianButton>
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {gameState.winner && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <EgyptianCard variant="tomb" className="max-w-md w-full text-center border-gold border-2">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full border border-primary/30">
                  <Award className="text-primary w-12 h-12" />
                </div>
              </div>
              <EgyptianCardTitle className="text-3xl mb-4 font-display uppercase tracking-widest text-gold-gradient">
                {gameState.winner === 'hounds' ? "Victory Achieved!" : "Trial Failed"}
              </EgyptianCardTitle>
              <p className="font-body text-white/70 mb-6 text-sm">
                {gameState.winner === 'hounds' 
                  ? `Your Hounds successfully crossed the desert sands ahead of the Jackals in ${gameState.turnNumber} turns!` 
                  : "The Jackals have claimed the Oasis. The desert sands swallow the passage."}
              </p>
              
              <div className="flex gap-4">
                {gameState.winner === 'hounds' && onComplete ? (
                  <EgyptianButton variant="gold" size="lg" className="flex-1 font-bold" onClick={onComplete}>
                    CONTINUE CAMPAIGN
                  </EgyptianButton>
                ) : (
                  <EgyptianButton variant="interactive" size="lg" className="flex-1 font-bold" onClick={handleRestart}>
                    TRY AGAIN
                  </EgyptianButton>
                )}
                <EgyptianButton variant="ghost" size="lg" className="flex-1 font-bold" onClick={onBack}>
                  BACK
                </EgyptianButton>
              </div>
            </EgyptianCard>
          </div>
        )}

        {showTutorial && (
           <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
             <EgyptianCard variant="gold" className="max-w-2xl w-full">
                <EgyptianCardHeader>
                   <EgyptianCardTitle>Hounds and Jackals (58 Holes)</EgyptianCardTitle>
                </EgyptianCardHeader>
                <EgyptianCardContent className="space-y-4 font-body text-sm text-white/80">
                   <p>Race your pegs along the track to the final hole. Each player has their own side.</p>
                   <p>Look out for shortcuts (holes 6 and 8) and traps (hole 15)! First to move all pegs to the finish wins.</p>
                   <EgyptianButton className="w-full" onClick={() => setShowTutorial(false)}>START RACE</EgyptianButton>
                </EgyptianCardContent>
             </EgyptianCard>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
