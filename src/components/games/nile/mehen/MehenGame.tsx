import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, RotateCcw, HelpCircle, Box, Grid, ChevronLeft, Info, Award, Zap } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';
import { MehenEngine } from './engine/MehenEngine';
import { MehenAI } from './engine/MehenAI';
import { GameState, MehenSettings, Player, Piece } from './engine/types';
import { MehenBoard2D } from './ui/MehenBoard2D';
import { MehenBoard3D } from './ui/MehenBoard3D';

interface MehenGameProps {
  onBack: () => void;
  levelIndex?: number;
  levelName?: string;
  aiDifficulty?: 'beginner' | 'normal' | 'pro';
  boardSize?: number;
  marblesCount?: number;
  lionCount?: number;
  onComplete?: () => void;
}

export const MehenGame: React.FC<MehenGameProps> = ({ 
  onBack,
  levelIndex = 0,
  levelName = "Mehen Duel",
  aiDifficulty = "normal",
  boardSize = 72,
  marblesCount = 3,
  lionCount = 1,
  onComplete
}) => {
  const { addScore } = useHighScores();

  const [settings, setSettings] = useState<MehenSettings>({
    boardSize: boardSize,
    playersCount: 2, // Duel format
    ruleMode: 'strategic',
    aiDifficulty: aiDifficulty,
    is3D: false,
  });

  const createInitialStateCustom = useCallback(() => {
    const pCount = marblesCount !== undefined ? marblesCount : 3;
    const lCount = lionCount !== undefined ? lionCount : 1;
    
    const pieces: Piece[] = [];
    const players: Player[] = ['player1', 'player2']; // 1v1 campaign duel
    
    players.forEach(owner => {
      // Add marbles
      for (let j = 0; j < pCount; j++) {
        pieces.push({
          id: `${owner}-marble-${j}`,
          owner,
          position: 0,
          isLion: false,
          isHome: true,
          isFinished: false,
        });
      }
      // Add lions
      for (let j = 0; j < lCount; j++) {
        pieces.push({
          id: `${owner}-lion-${j}`,
          owner,
          position: 0,
          isLion: true,
          isHome: true,
          isFinished: false,
        });
      }
    });

    return {
      pieces,
      currentPlayer: 'player1',
      throwResult: 0,
      sticks: [true, true, true, true],
      isGameOver: false,
      winner: null,
      moveLog: ['The game of Mehen begins.'],
      history: [],
      turnNumber: 1,
    };
  }, [marblesCount, lionCount]);

  const [gameState, setGameState] = useState<GameState>(createInitialStateCustom);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [noMovesAlert, setNoMovesAlert] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  // Sync props difficulty
  useEffect(() => {
    setSettings(prev => ({ ...prev, aiDifficulty, boardSize }));
  }, [aiDifficulty, boardSize]);

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
          // No legal moves for AI, pass turn back to player
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'player1',
            throwResult: 0,
            moveLog: [`AI opponent had no legal moves.`, ...prev.moveLog]
          }));
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver, isThrowing, settings]);

  // Player Auto-Pass Logic
  useEffect(() => {
    if (!gameState.isGameOver && gameState.currentPlayer === 'player1' && gameState.throwResult > 0) {
      const moves = MehenEngine.getLegalMoves(gameState, gameState.throwResult, settings.boardSize);
      if (moves.length === 0) {
        setNoMovesAlert(true);
        const timer = setTimeout(() => {
          setNoMovesAlert(false);
          setGameState(prev => ({
            ...prev,
            currentPlayer: 'player2',
            throwResult: 0,
            moveLog: ['You had no legal moves. Turn passed.', ...prev.moveLog]
          }));
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState.currentPlayer, gameState.throwResult, gameState.isGameOver, settings.boardSize]);

  // Save High Scores
  useEffect(() => {
    if (gameState.winner && !scoreSaved) {
      const isWin = gameState.winner === 'player1';
      const finalScore = isWin 
        ? Math.max(500, 2000 - gameState.turnNumber * 20) 
        : 150;
      
      addScore({
        playerName: 'Serpent Rider',
        score: finalScore,
        game: 'mehen',
        difficulty: settings.aiDifficulty,
        details: isWin 
          ? `Won "${levelName}" in ${gameState.turnNumber} turns!` 
          : `Lost "${levelName}" to the Temple AI`
      });
      setScoreSaved(true);
    }
  }, [gameState.winner, scoreSaved, gameState.turnNumber, settings.aiDifficulty, levelName, addScore]);

  const handleThrow = useCallback(() => {
    if (isThrowing || gameState.throwResult > 0 || gameState.isGameOver) return;
    setIsThrowing(true);
    setTimeout(() => {
      const { sticks, result } = MehenEngine.throwSticks();
      setGameState(prev => ({
        ...prev,
        sticks,
        throwResult: result,
        moveLog: [`${prev.currentPlayer === 'player1' ? 'You' : 'AI'} threw a ${result}!`, ...prev.moveLog]
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
    setGameState(createInitialStateCustom());
    setScoreSaved(false);
  };

  const legalMoves = gameState.throwResult > 0 ? MehenEngine.getLegalMoves(gameState, gameState.throwResult, settings.boardSize) : [];

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
            <h1 className="text-xl font-display text-gold-gradient leading-tight">Mehen</h1>
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
        {/* Game Board Area with perfectly responsive height container */}
        <div className="flex-1 relative flex items-center justify-center p-4 md:p-8">
          <AnimatePresence mode="wait">
            {!settings.is3D ? (
              <motion.div
                key="2d-board"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="h-[50vh] min-h-[300px] max-h-[550px] aspect-square relative mx-auto lg:h-[60vh] lg:max-h-[620px]"
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

          {/* Premium Throw Controls */}
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
                    {/* Face Up (Light gold wood with snake coil engraving) */}
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
                      <div className="text-[12px] text-amber-900/60 font-bold select-none pointer-events-none font-display">🐍</div>
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
                  disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer !== 'player1'}
                  onClick={handleThrow}
                  className="font-bold tracking-widest"
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
             <p className="text-xs text-turquoise font-bold uppercase tracking-widest mb-1">Turn</p>
             <h3 className={`text-2xl font-display uppercase ${gameState.currentPlayer === 'player1' ? 'text-primary animate-pulse' : 'text-white/60'}`}>
                {gameState.currentPlayer === 'player1' ? 'Your Turn' : 'AI Thinking'}
             </h3>
             <div className="mt-4 border-t border-white/5 pt-3">
               <p className="text-[10px] text-white/40 mb-2">Pieces Remaining</p>
               <div className="space-y-1.5">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-primary font-bold">You:</span>
                   <span className="text-white/80">
                     {gameState.pieces.filter(p => p.owner === 'player1' && !p.isFinished).length} active
                   </span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-turquoise font-bold">AI:</span>
                   <span className="text-white/80">
                     {gameState.pieces.filter(p => p.owner === 'player2' && !p.isFinished).length} active
                   </span>
                 </div>
               </div>
             </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <p className="text-xs font-bold text-gold/60 uppercase mb-3 flex items-center gap-2">
               <Info size={14} /> How to Play
             </p>
             <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto font-body text-xs border border-white/5 space-y-3">
                <p className="text-white/80 leading-relaxed">
                  <span className="text-primary font-bold">Goal:</span> Race your marbles into the serpent's head.
                </p>
                <div className="space-y-2 text-white/60">
                  <p>• Throw sticks to move along the spiral path.</p>
                  <p>• Marbles move from tail (outside) to head (center).</p>
                  <p>• Once a marble reaches the head, your <span className="text-gold font-bold">Hunter Lion</span> awakens!</p>
                  <p>• The Lion races outwards from head to tail, hunting and devouring enemy marbles!</p>
                </div>
             </div>
          </div>

          <EgyptianButton variant="interactive" className="w-full" onClick={handleRestart}>RESET TRIAL</EgyptianButton>
        </div>
      </div>

      {/* Win Modal */}
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
                {gameState.winner === 'player1' ? "Ascended!" : "Defeated"}
              </EgyptianCardTitle>
              <p className="font-body text-white/70 mb-6 text-sm">
                {gameState.winner === 'player1' 
                  ? `Your wisdom guided your tokens to the center of the serpent god Mehen in ${gameState.turnNumber} turns!` 
                  : "The AI lion has swallowed your passage. The trial is lost."}
              </p>
              
              <div className="flex gap-4">
                {gameState.winner === 'player1' && onComplete ? (
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
                   <EgyptianCardTitle>The Mystery of Mehen</EgyptianCardTitle>
                </EgyptianCardHeader>
                <EgyptianCardContent className="space-y-4 font-body text-sm text-white/80">
                   <p className="italic text-primary/80">“Inspired by ancient Egyptian Mehen and modern reconstructions.”</p>
                   <p>Race your pieces (marbles and lions) from the tail of the serpent to its head. Lions can capture enemy marbles on the same space.</p>
                   <p>Special spaces like traps and leaps are scattered along the spiral body.</p>
                   <EgyptianButton className="w-full mt-4 animate-pulse" onClick={() => setShowTutorial(false)}>ENTER THE SPIRAL</EgyptianButton>
                </EgyptianCardContent>
             </EgyptianCard>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
};
