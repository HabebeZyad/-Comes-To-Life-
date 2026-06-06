import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, HelpCircle, Box, Grid, ChevronLeft, Award, Zap } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';
import { SenetEngine } from './engine/SenetEngine';
import { SenetAI } from './engine/SenetAI';
import { GameState, Player, SenetSettings } from './engine/types';
import { SenetBoard2D } from './ui/SenetBoard2D';
import { SenetBoard3D } from './ui/SenetBoard3D';

interface SenetGameProps {
  onBack: () => void;
  levelIndex?: number;
  levelName?: string;
  aiDifficulty?: 'beginner' | 'normal' | 'pro';
  playerPieces?: number;
  aiPieces?: number;
  onComplete?: () => void;
}

export const SenetGame: React.FC<SenetGameProps> = ({ 
  onBack,
  levelIndex = 0,
  levelName = "Senet Duel",
  aiDifficulty = "normal",
  playerPieces = 5,
  aiPieces = 5,
  onComplete
}) => {
  const { addScore } = useHighScores();

  // Create custom initial state based on starting pieces
  const createInitialStateCustom = useCallback(() => {
    const initial = SenetEngine.createInitialState('modern');
    
    // Custom piece counts
    if (playerPieces !== 5 || aiPieces !== 5) {
      // Clear standard placing
      for (let i = 0; i < 10; i++) {
        initial.board[i].piece = null;
      }
      
      // Place alternatingly based on specifications
      let pPlaced = 0;
      let aPlaced = 0;
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0 && aPlaced < aiPieces) {
          initial.board[i].piece = 'player2';
          aPlaced++;
        } else if (i % 2 === 1 && pPlaced < playerPieces) {
          initial.board[i].piece = 'player1';
          pPlaced++;
        }
      }
    }
    
    return initial;
  }, [playerPieces, aiPieces]);

  const [gameState, setGameState] = useState<GameState>(createInitialStateCustom);
  const [settings, setSettings] = useState<SenetSettings>({
    ruleMode: 'modern',
    aiDifficulty: aiDifficulty,
    is3D: false,
  });
  const [isThrowing, setIsThrowing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [noMovesAlert, setNoMovesAlert] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Sync settings difficulty prop
  useEffect(() => {
    setSettings(prev => ({ ...prev, aiDifficulty }));
  }, [aiDifficulty]);

  // AI Turn Logic
  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer === 'player2' && gameState.throwResult === 0 && !isThrowing) {
      const timer = setTimeout(() => handleThrow(), 1000);
      return () => clearTimeout(timer);
    }
    if (!gameState.isGameOver && gameState.currentPlayer === 'player2' && gameState.throwResult > 0) {
      const timer = setTimeout(() => {
        const bestMove = SenetAI.getBestMove(gameState, gameState.throwResult, settings.aiDifficulty);
        if (bestMove !== null) handleMove(bestMove);
        else setGameState(prev => ({ ...prev, currentPlayer: 'player1', throwResult: 0 }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver, isThrowing, settings.aiDifficulty]);

  // Player Auto-Pass Logic
  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer === 'player1' && gameState.throwResult > 0) {
      const moves = SenetEngine.getLegalMoves(gameState, gameState.throwResult);
      if (moves.length === 0) {
        setNoMovesAlert(true);
        const timer = setTimeout(() => {
          setNoMovesAlert(false);
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'player2',
            throwResult: 0,
            extraTurn: false,
            moveLog: ['Player had no legal moves. Turn passed.', ...prev.moveLog]
          }));
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver]);

  // Save High Scores
  useEffect(() => {
    if (gameState.winner && !scoreSaved) {
      const isWin = gameState.winner === 'player1';
      const finalScore = isWin 
        ? Math.max(500, 1500 - gameState.turnCount * 20) 
        : gameState.piecesOffBoard.player1 * 100;
      
      addScore({
        playerName: 'Noble Soul',
        score: finalScore,
        game: 'senet',
        difficulty: settings.aiDifficulty,
        details: isWin 
          ? `Won "${levelName}" in ${gameState.turnCount} turns!` 
          : `Lost "${levelName}" at pieces: ${gameState.piecesOffBoard.player1}/5`
      });
      setScoreSaved(true);
    }
  }, [gameState.winner, scoreSaved, gameState.turnCount, gameState.piecesOffBoard.player1, settings.aiDifficulty, levelName, addScore]);

  const handleThrow = useCallback(() => {
    if (isThrowing || gameState.throwResult > 0 || gameState.isGameOver) return;
    setIsThrowing(true);
    setTimeout(() => {
      const { sticks, result, extraTurn } = SenetEngine.throwSticks();
      setGameState(prev => ({ ...prev, sticks, throwResult: result, extraTurn }));
      setIsThrowing(false);
    }, 800);
  }, [isThrowing, gameState.throwResult, gameState.isGameOver]);

  const handleMove = useCallback((fromId: number) => {
    if (gameState.throwResult === 0 || gameState.isGameOver) return;
    const newState = SenetEngine.makeMove(gameState, fromId, gameState.throwResult);
    setGameState({ ...newState, history: [gameState, ...gameState.history].slice(0, 10) });
  }, [gameState]);

  const handleRestart = () => {
    setGameState(createInitialStateCustom());
    setScoreSaved(false);
  };

  const legalMoves = gameState.throwResult > 0 ? SenetEngine.getLegalMoves(gameState, gameState.throwResult) : [];

  return (
    <div className="min-h-screen bg-obsidian text-foreground flex flex-col relative overflow-y-auto lg:overflow-y-hidden lg:max-h-screen">
      
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
          <EgyptianButton variant="ghost" size="sm" onClick={onBack}><ChevronLeft size={20} /> Back</EgyptianButton>
          <div>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest">{levelName}</span>
            <h1 className="text-xl font-display text-gold-gradient leading-tight">Senet</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <EgyptianButton variant="ghost" size="sm" onClick={() => setSettings(s => ({ ...s, is3D: !s.is3D }))}>
            {settings.is3D ? <Grid size={20} /> : <Box size={20} />}
          </EgyptianButton>
          <EgyptianButton variant="ghost" size="sm" onClick={() => setShowTutorial(true)}><HelpCircle size={20} /></EgyptianButton>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row relative">
        <div className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            {!settings.is3D ? (
              <motion.div key="2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl aspect-[10/4.5]">
                <SenetBoard2D gameState={gameState} onPieceClick={handleMove} legalMoves={legalMoves} />
              </motion.div>
            ) : (
              <motion.div
                key="3d"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <SenetBoard3D gameState={gameState} onPieceClick={handleMove} legalMoves={legalMoves} />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Visual 3D Sticks & Throw Controls */}
          <div className="relative mt-4 mb-2 z-20">
            <div className="bg-black/75 backdrop-blur-xl p-2.5 px-4 rounded-xl border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.08)] flex items-center gap-5">
              <div className="flex gap-2 h-12 items-center">
                {gameState.sticks.map((isWhite, i) => (
                  <motion.div
                    key={i}
                    animate={isThrowing ? { 
                      rotateX: [0, 180, 360, 540, 720],
                      y: [0, -15, 0]
                    } : { 
                      rotateX: isWhite ? 0 : 180,
                      y: 0
                    }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    style={{
                      width: '12px',
                      height: '44px',
                      borderRadius: '4px',
                      perspective: '1000px',
                      transformStyle: 'preserve-3d',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    }}
                    className="relative"
                  >
                    {/* Face Up (White/Gold Papyrus with markings) */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '4px',
                        background: 'linear-gradient(to bottom, #faebd7, #dfba7c)',
                        border: '1px solid #b8860b',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2px 0',
                      }}
                    >
                      <div className="w-0.5 h-1.5 bg-amber-900/30 rounded-full" />
                      <div className="text-[8px] text-amber-900/60 font-bold select-none pointer-events-none font-display">𓂀</div>
                      <div className="w-0.5 h-1.5 bg-amber-900/30 rounded-full" />
                    </div>

                    {/* Face Down (Charcoal wood) */}
                    <div 
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '4px',
                        background: 'linear-gradient(to bottom, #2b241f, #120e0a)',
                        border: '1px solid #4a3c31',
                        transform: 'rotateX(180deg)',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '2px 0',
                      }}
                    >
                      <div className="w-0.5 h-1.5 bg-black/40 rounded-full" />
                      <div className="w-1 h-1 rounded-full bg-red-950/40" />
                      <div className="w-0.5 h-1.5 bg-black/40 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="w-[1px] h-8 bg-gold/20" />
              
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[36px]">
                  <p className="text-[8px] text-gold/60 uppercase font-bold tracking-widest leading-none mb-0.5">Throw</p>
                  <p className="text-xl font-display text-gold-gradient leading-none">{gameState.throwResult || '?'}</p>
                </div>
                <EgyptianButton 
                  variant="gold" 
                  size="sm" 
                  disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer !== 'player1'}
                  onClick={handleThrow}
                  className="font-bold tracking-wider text-xs py-1.5 px-3"
                >
                  THROW
                </EgyptianButton>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-black/40 border-t lg:border-t-0 lg:border-l border-gold/10 backdrop-blur-md p-6 flex flex-col gap-6 z-30 lg:overflow-y-auto">
          <div className="bg-lapis-deep/40 rounded-xl p-5 border border-lapis-light/20">
            <p className="text-xs text-turquoise font-bold uppercase tracking-widest mb-1">Turn</p>
            <h3 className={`text-2xl font-display uppercase ${gameState.currentPlayer === 'player1' ? 'text-primary animate-pulse' : 'text-white/60'}`}>
              {gameState.currentPlayer === 'player1' ? 'Your Turn' : 'AI Thinking'}
            </h3>
            <div className="mt-4 flex justify-between">
              <div>
                <p className="text-[10px] text-white/40 mb-1">Player Escapes</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2.5 h-4 rounded-full transition-colors ${
                        i < gameState.piecesOffBoard.player1 ? 'bg-primary shadow-gold-glow' : 'bg-white/10'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 mb-1">AI Escapes</p>
                <div className="flex gap-1 justify-end">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-2.5 h-4 rounded-full transition-colors ${
                        i < gameState.piecesOffBoard.player2 ? 'bg-turquoise shadow-turquoise-glow' : 'bg-white/10'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <p className="text-xs font-bold text-gold/60 uppercase mb-3 flex items-center gap-2">
              <HelpCircle size={14} /> How to Play
            </p>
            <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto font-body text-xs border border-white/5 space-y-3">
               <p className="text-white/80 leading-relaxed">
                 <span className="text-primary font-bold">Goal:</span> Move your pieces off the board (Square 30).
               </p>
               <div className="space-y-2 text-white/60">
                 <p>• Throw sticks. White sides count moves (all dark = 5).</p>
                 <p>• <span className="text-gold">Happiness (26):</span> Safe haven. Must land here first.</p>
                 <p>• <span className="text-destructive">Water (27):</span> Trap! Sends you back to Square 15.</p>
                 <p>• Pieces protect each other when standing in pairs.</p>
                 <p>• Leap over single enemy pieces to swap positions.</p>
               </div>
            </div>
          </div>

          <EgyptianButton variant="lapis" className="w-full" onClick={handleRestart}>RESET TRIAL</EgyptianButton>
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
                {gameState.winner === 'player1' ? "Trial Passed!" : "Trial Defeated"}
              </EgyptianCardTitle>
              <p className="font-body text-white/70 mb-6 text-sm">
                {gameState.winner === 'player1' 
                  ? `Your wisdom guided your soul through the chambers of Duat in ${gameState.turnCount} turns!` 
                  : "The spirits of the AI proved too swift. The passage is blocked."}
              </p>
              
              <div className="flex gap-4">
                {gameState.winner === 'player1' && onComplete ? (
                  <EgyptianButton variant="gold" size="lg" className="flex-1 font-bold" onClick={onComplete}>
                    CONTINUE CAMPAIGN
                  </EgyptianButton>
                ) : (
                  <EgyptianButton variant="lapis" size="lg" className="flex-1 font-bold" onClick={handleRestart}>
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
      </AnimatePresence>
    </div>
  );
};
