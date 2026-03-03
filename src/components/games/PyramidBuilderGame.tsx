import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw, Construction, Ruler, Hammer } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';
import { pyramidLevels, PyramidLevel } from '@/data/pyramidBuilderLevels';

interface PyramidBuilderGameProps {
  onBack: () => void;
}

interface Block {
  id: number;
  width: number;
  placed: boolean;
  position: { x: number; y: number };
}

export function PyramidBuilderGame({ onBack }: PyramidBuilderGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [movingX, setMovingX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [perfectDrops, setPerfectDrops] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const containerWidth = 400;
  const blockHeight = 35;
  const baseY = 320;

  const currentLevel = useMemo(() => pyramidLevels[currentLevelIdx], [currentLevelIdx]);

  const initLevel = useCallback((levelIdx: number) => {
    const level = pyramidLevels[levelIdx];
    const initialBlocks: Block[] = level.blocks.map((width, index) => ({
      id: index,
      width,
      placed: false,
      position: { x: (containerWidth - width) / 2, y: index * blockHeight }
    }));
    setBlocks(initialBlocks);
    setCurrentBlockIndex(0);
    setMovingX(0);
    setDirection(1);
    setTimeLeft(level.timeLimit);
    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Timer - stable interval to avoid churn
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 11 && prev > 1) playSound('tick');
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, playSound]);

  // Handle defeat state when timer reaches zero
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      setGameState('defeat');
      stopAmbientMusic();
      playSound('defeat');
    }
  }, [gameState, timeLeft, stopAmbientMusic, playSound]);

  useEffect(() => {
    if (gameState !== 'playing' || !currentLevel) return;

    const speed = currentLevel.speed;
    const currentBlock = blocks[currentBlockIndex];
    if (!currentBlock) return;

    const interval = setInterval(() => {
      setMovingX(prev => {
        const newX = prev + direction * speed;
        const maxX = containerWidth - currentBlock.width;
        if (newX >= maxX) { setDirection(-1); return maxX; }
        else if (newX <= 0) { setDirection(1); return 0; }
        return newX;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameState, currentBlockIndex, direction, blocks, currentLevel]);

  const dropBlock = useCallback(() => {
    if (gameState !== 'playing' || !currentLevel || currentBlockIndex >= blocks.length) return;

    const currentBlock = blocks[currentBlockIndex];
    const targetX = (containerWidth - currentBlock.width) / 2;
    const tolerance = currentLevel.tolerance;
    const diff = Math.abs(movingX - targetX);

    if (diff <= tolerance) {
      const isPerfect = diff <= 5;
      const points = isPerfect ? 200 : Math.max(20, 100 - Math.floor(diff * 2));
      if (isPerfect) {
        setPerfectDrops(prev => prev + 1);
        playSound('perfect');
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 800);
      } else {
        playSound('drop');
      }

      setScore(prev => prev + points);
      setBlocks(prev => prev.map((block, index) =>
        index === currentBlockIndex
          ? { ...block, placed: true, position: { x: movingX, y: block.position.y } }
          : block
      ));

      if (currentBlockIndex >= blocks.length - 1) {
        if (currentLevelIdx < pyramidLevels.length - 1) {
          setGameState('levelUp');
          playSound('victory');
        } else {
          setGameState('victory');
          playSound('victory');
          const finalScore = score + points + timeLeft * 20;
          addScore({
            playerName: 'Architect',
            score: finalScore,
            game: 'pyramid',
            details: `Master Builder of ${pyramidLevels.length} Pyramids`
          });
        }
      } else {
        setCurrentBlockIndex(prev => prev + 1);
        setMovingX(0);
        setDirection(1);
      }
    } else {
      setGameState('defeat');
      stopAmbientMusic();
      playSound('defeat');
    }
  }, [gameState, currentBlockIndex, blocks, movingX, currentLevel, timeLeft, score, currentLevelIdx, addScore, playSound, stopAmbientMusic]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        dropBlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dropBlock]);

  const handleNextLevel = () => {
    const nextIdx = currentLevelIdx + 1;
    setCurrentLevelIdx(nextIdx);
    initLevel(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevelIdx(0);
    setPerfectDrops(0);
    initLevel(0);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <EgyptianButton
            variant="nav"
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="-ml-4"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Games
          </EgyptianButton>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Construction className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">PHASE {currentLevelIdx + 1}/4</span>
            </div>
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Trophy className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">SCORE: {score}</span>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20">
          {/* Header HUD */}
          <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Ruler className="text-primary" size={20} />
                <span className="font-display text-gold">Alignment</span>
                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                  <div className="absolute inset-y-0 w-1 bg-white left-1/2 -translate-x-1/2 z-10" />
                  <div
                    className="h-full bg-primary shadow-gold-glow transition-all duration-75"
                    style={{ width: `${(movingX / (containerWidth - (blocks[currentBlockIndex]?.width || 100))) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-turquoise" size={20} />
                <span className="font-display text-gold text-lg">Perfect: {perfectDrops}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-xl font-display text-gold-gradient leading-none">{currentLevel.title}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">Tolerance: ±{currentLevel.tolerance}px</p>
            </div>
          </div>

          <div className="relative p-8 bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')] bg-obsidian min-h-[550px] flex flex-col items-center justify-center">
            <div
              className="relative bg-gradient-to-b from-obsidian/40 to-obsidian/90 rounded-xl border-4 border-gold/20 overflow-hidden shadow-inner cursor-pointer"
              style={{ width: containerWidth, height: 420 }}
              onClick={dropBlock}
            >
              {/* Central Alignment Guide */}
              <div className="absolute inset-y-0 w-0.5 bg-primary/10 left-1/2 -translate-x-1/2" />
              {/* Base Line */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gold/20" />

              {/* Placed Blocks */}
              <AnimatePresence>
                {blocks.map((block, index) => (
                  block.placed && (
                    <motion.div
                      key={block.id}
                      initial={{ y: -200, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      className="absolute bg-gradient-to-br from-gold-dark via-primary to-gold-dark border-2 border-gold-light/40 rounded flex items-center justify-center shadow-lg"
                      style={{
                        width: block.width,
                        height: blockHeight - 2,
                        left: block.position.x,
                        bottom: index * blockHeight + 2
                      }}
                    >
                      <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] mix-blend-overlay" />
                    </motion.div>
                  )
                ))}
              </AnimatePresence>              {/* Current Moving Block */}
              {gameState === 'playing' && currentBlockIndex < blocks.length && (
                <motion.div
                  className="absolute bg-gradient-to-r from-turquoise via-turquoise-glow to-turquoise border-2 border-white shadow-turquoise-glow rounded z-20"
                  style={{
                    width: blocks[currentBlockIndex].width,
                    height: blockHeight - 2,
                    left: movingX,
                    top: 40
                  }}
                >
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                  </div>
                </motion.div>
              )}

              {/* HUD Elements */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                <div className={`px-4 py-1 rounded-full border-2 ${timeLeft < 10 ? 'bg-terracotta/20 border-terracotta animate-pulse text-terracotta' : 'bg-obsidian/60 border-gold/30 text-gold'} font-display flex items-center gap-2`}>
                  <Timer size={16} />
                  <span>{timeLeft}s</span>
                </div>
                <div className="px-4 py-1 rounded-full bg-obsidian/60 border border-gold/30 text-gold font-display text-xs uppercase tracking-widest">
                  Block {currentBlockIndex + 1} / {blocks.length}
                </div>
              </div>

              {/* Visual Feedback Effects */}
              <AnimatePresence>
                {showSparkle && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 0 }}
                    animate={{ opacity: 1, scale: 2, y: -50 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 pointer-events-none flex items-center justify-center z-50"
                  >
                    <div className="text-gold font-display text-4xl drop-shadow-gold-glow">PERFECT ALIGNMENT! ✨</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Pyramid Builder"
                  description="Carry out the Pharaoh's grand design. Align each stone block with divine precision to construct a monument that will stand for eternity."
                  onAction={() => initLevel(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Phase Completed!"
                  description={`The foundation of ${currentLevel.title} is solid. The structure rises high into the desert sky.`}
                  stats={[
                    { label: 'Score', value: score },
                    { label: 'Perfect Drops', value: perfectDrops }
                  ]}
                  actionLabel="Next Phase"
                  onAction={handleNextLevel}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Master Architect"
                  description="The pyramid is finished. It stands as a testament to your precision and the Pharaoh's eternal glory."
                  score={score}
                  stars={Math.min(5, Math.ceil(perfectDrops / 2) + 1)}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Perfect Alignment', value: perfectDrops }
                  ]}
                  actionLabel="Build Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="The Structure Crumbles"
                  description="A stone was misaligned, and the design has collapsed. The gods require absolute precision."
                  score={score}
                  stats={[
                    { label: 'Phase Reached', value: currentLevel.title },
                    { label: 'Final Score', value: score }
                  ]}
                  actionLabel="Retry Phase"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>

            {gameState === 'playing' && (
              <div className="mt-8 flex flex-col items-center gap-4">
                <p className="text-gold/60 font-body text-sm uppercase tracking-widest flex items-center gap-3">
                  <Hammer size={16} />
                  Press <span className="text-gold font-bold">SPACE</span> or <span className="text-gold font-bold">CLICK</span> to drop the stone
                </p>
              </div>
            )}
          </div>
        </EgyptianCard>
      </div>
    </div>
  );
}
