import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, HelpCircle, Box, Grid, ChevronLeft } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';
import { SenetEngine } from './engine/SenetEngine';
import { SenetAI } from './engine/SenetAI';
import { GameState, Player, SenetSettings } from './engine/types';
import { SenetBoard2D } from './ui/SenetBoard2D';

interface SenetGameProps {
  onBack: () => void;
}

const LEVELS = [
  { level: 1, name: "Apprentice of Thoth", difficulty: "beginner" as const },
  { level: 2, name: "Priest of Ra", difficulty: "normal" as const },
  { level: 3, name: "Master of the Two Lands", difficulty: "pro" as const },
];

export const SenetGame: React.FC<SenetGameProps> = ({ onBack }) => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const levelData = LEVELS[currentLevelIndex];

  const [gameState, setGameState] = useState<GameState>(SenetEngine.createInitialState());
  const [settings, setSettings] = useState<SenetSettings>({
    ruleMode: 'modern',
    aiDifficulty: levelData.difficulty,
    is3D: false,
  });
  const [isThrowing, setIsThrowing] = useState(false);
  const { addScore } = useHighScores();
  useEffect(() => {
    if (gameState.isGameOver && gameState.winner === 'player1') {
      addScore({ playerName: 'Pharaoh', score: (currentLevelIndex + 1) * 1000, game: 'senet', difficulty: levelData.difficulty, details: 'Level ' + (currentLevelIndex + 1) });
    }
  }, [gameState.isGameOver, gameState.winner, currentLevelIndex, levelData, addScore]);
  const [showTutorial, setShowTutorial] = useState(false);

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


  const handleRestart = () => setGameState(SenetEngine.createInitialState(settings.ruleMode));
  const legalMoves = gameState.throwResult > 0 ? SenetEngine.getLegalMoves(gameState, gameState.throwResult) : [];

  return (
    <div className="min-h-screen bg-obsidian text-foreground overflow-hidden flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-gold/20 bg-black/40 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <EgyptianButton variant="ghost" size="sm" onClick={onBack}><ChevronLeft size={20} /> Back</EgyptianButton>
          <h1 className="text-2xl font-display text-gold-gradient hidden md:block">Senet</h1>
        </div>
        <div className="flex items-center gap-2">
          <EgyptianButton variant="ghost" size="sm" onClick={() => setSettings(s => ({ ...s, is3D: !s.is3D }))}>
            {settings.is3D ? <Grid size={20} /> : <Box size={20} />}
          </EgyptianButton>
          <EgyptianButton variant="ghost" size="sm" onClick={() => setShowTutorial(true)}><HelpCircle size={20} /></EgyptianButton>
        </div>
      </div>
      <div className="flex-1 flex flex-col lg:flex-row relative">
        <div className="flex-1 relative flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {!settings.is3D ? (
              <motion.div key="2d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-5xl aspect-[10/4.5]">
                <SenetBoard2D gameState={gameState} onPieceClick={handleMove} legalMoves={legalMoves} />
              </motion.div>
            ) : <div className="text-gold/60 font-display">3D MODE COMING SOON</div>}
          </AnimatePresence>

              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4">
                <div className="flex gap-2">
                  {gameState.sticks.map((stick, i) => (
                    <motion.div
                      key={`${gameState.turnCount}-${i}`}
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

            <EgyptianButton
              variant="default"
              size="lg"
              disabled={isThrowing || gameState.throwResult > 0 || gameState.isGameOver || gameState.currentPlayer === 'player2'}
              onClick={handleThrow}
            >
              THROW
            </EgyptianButton>
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
            <p className="text-xs font-bold text-gold/60 uppercase mb-3 flex items-center gap-2">
              <HelpCircle size={14} /> How to Play
            </p>
            <div className="flex-1 bg-black/20 rounded-lg p-4 overflow-y-auto font-body text-sm border border-white/5 space-y-3">
               <p className="text-white/80 leading-relaxed">
                 <span className="text-primary font-bold">Goal:</span> Move all 5 pieces off the board (Square 30).
               </p>
               <div className="space-y-2 text-white/60 text-xs">
                 <p>• Throw 4 sticks. White sides count moves (all dark = 6).</p>
                 <p>• <span className="text-gold">House of Happiness (26):</span> Safe haven. Must land here first.</p>
                 <p>• <span className="text-destructive">House of Water (27):</span> Trap! Sends you back to Square 15.</p>
                 <p>• Pieces protect each other when standing in pairs.</p>
                 <p>• Leap over single enemy pieces to swap positions.</p>
               </div>
               <div className="pt-2 border-t border-white/5 italic text-[10px] text-white/40">
                 "To play Senet is to walk the path of the soul through the underworld."
               </div>
            </div>
          </div>

          <EgyptianButton variant="lapis" className="w-full" onClick={handleRestart}>RESTART</EgyptianButton>
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
              <EgyptianButton variant="default" size="lg" className="w-full" onClick={handleRestart}>PLAY AGAIN</EgyptianButton>
            </EgyptianCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
