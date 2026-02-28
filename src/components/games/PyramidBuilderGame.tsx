import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
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
  const [currentLevel, setCurrentLevel] = useState<PyramidLevel | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [movingX, setMovingX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [perfectDrops, setPerfectDrops] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const containerWidth = 400;
  const blockHeight = 30;
  const baseY = 300;

  const initializeGame = useCallback((level: PyramidLevel) => {
    setCurrentLevel(level);
    const initialBlocks: Block[] = level.blocks.map((width, index) => ({
      id: index,
      width,
      placed: false,
      position: { x: (containerWidth - width) / 2, y: baseY - index * blockHeight }
    }));
    setBlocks(initialBlocks);
    setCurrentBlockIndex(0);
    setMovingX((containerWidth - level.blocks[0]) / 2);
    setDirection(1);
    setScore(0);
    setPerfectDrops(0);
    setTimeLeft(level.timeLimit);
    setIsPlaying(true);
    setGameWon(false);
    setGameLost(false);
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameWon && !gameLost) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      if (timeLeft <= 10) playSound('tick');
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setGameLost(true);
      setIsPlaying(false);
      stopAmbientMusic();
      playSound('defeat');
    }
  }, [timeLeft, isPlaying, gameWon, gameLost, playSound, stopAmbientMusic]);

  useEffect(() => {
    if (!isPlaying || gameWon || gameLost || !currentLevel) return;

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
  }, [isPlaying, currentBlockIndex, direction, blocks, currentLevel, gameWon, gameLost]);

  const dropBlock = useCallback(() => {
    if (!isPlaying || !currentLevel || currentBlockIndex >= blocks.length) return;

    const currentBlock = blocks[currentBlockIndex];
    const targetX = (containerWidth - currentBlock.width) / 2;
    const tolerance = currentLevel.tolerance;
    const diff = Math.abs(movingX - targetX);

    if (diff <= tolerance) {
      const isPerfect = diff <= 5;
      const points = isPerfect ? 100 : Math.max(10, 50 - Math.floor(diff));
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
        setGameWon(true);
        setIsPlaying(false);
        const finalScore = score + points + timeLeft * 10;
        setScore(finalScore);
        stopAmbientMusic();
        playSound('victory');
        addScore({ playerName: 'Architect', score: finalScore, game: 'pyramid', details: `${perfectDrops + (isPerfect ? 1 : 0)} perfect drops` });
      } else {
        setCurrentBlockIndex(prev => prev + 1);
        setMovingX(0);
        setDirection(1);
      }
    } else {
      setGameLost(true);
      setIsPlaying(false);
      stopAmbientMusic();
      playSound('defeat');
    }
  }, [isPlaying, currentBlockIndex, blocks, movingX, currentLevel, timeLeft, score, perfectDrops, playSound, stopAmbientMusic, addScore]);

  useEffect(() => {
    const handleInteraction = () => {
      if (isPlaying) {
        dropBlock();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleInteraction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [isPlaying, dropBlock]);

  if (!currentLevel) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <EgyptianButton
              variant="nav"
              onClick={onBack}
              className="mb-4 -ml-4"
            >
              <ArrowLeft size={20} /> Back to Games
            </EgyptianButton>
            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Pyramid Builder</h1>
            <p className="text-xl text-muted-foreground font-body">Select a blueprint to begin construction</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pyramidLevels.map((level) => (
              <motion.div key={level.level} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <EgyptianButton onClick={() => initializeGame(level)} size="xl" variant="outline" className="w-full h-auto flex-col py-8">
                  <span className="text-4xl mb-4">{level.level === 1 ? '🌊' : level.level === 2 ? '🏛️' : '🔥'}</span>
                  <span className="text-2xl mb-1">Level {level.level}</span>
                  <span className="text-gold font-body mb-2">{level.title}</span>
                  <span className="text-sm opacity-60 font-body">{level.blocks.length} Blocks • {level.timeLimit}s</span>
                </EgyptianButton>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => { stopAmbientMusic(); setCurrentLevel(null); }} className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg">
            <ArrowLeft size={20} /> Back to Blueprints
          </button>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Pyramid Builder</h1>
          <p className="text-xl text-muted-foreground font-body">Building: {currentLevel.title}</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
              <Trophy className="text-primary" size={24} />
              <span className="text-xl text-foreground font-body">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <Star className="text-turquoise" size={24} />
              <span className="text-xl text-foreground font-body">Perfect: {perfectDrops}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <Timer className={`${timeLeft < 15 ? 'text-terracotta animate-pulse' : 'text-scarab'}`} size={24} />
              <span className="text-xl text-foreground font-body uppercase tracking-widest">{timeLeft}s</span>
            </div>
          </div>

          <div
            className="relative mx-auto bg-gradient-to-b from-lapis-deep/30 to-obsidian rounded-xl border-2 border-gold/30 overflow-hidden cursor-pointer shadow-inner"
            style={{ width: containerWidth, height: 380 }}
            onClick={dropBlock}
          >
            <div className="absolute top-0 bottom-0 w-0.5 bg-primary/20" style={{ left: containerWidth / 2 }} />

            {blocks.map((block, index) => (
              block.placed && (
                <motion.div key={block.id} initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  className="absolute bg-gradient-to-r from-gold-dark via-primary to-gold-dark border-2 border-gold-light/40 rounded flex items-center justify-center text-obsidian/40 font-display"
                  style={{ width: block.width, height: blockHeight - 4, left: block.position.x, bottom: index * blockHeight }}
                >
                  <span className="text-xs">🧱</span>
                </motion.div>
              )
            ))}

            {isPlaying && currentBlockIndex < blocks.length && (
              <motion.div
                className="absolute bg-gradient-to-r from-turquoise via-turquoise-glow to-turquoise border-2 border-turquoise-glow/50 rounded shadow-lg flex items-center justify-center text-obsidian"
                style={{ width: blocks[currentBlockIndex].width, height: blockHeight - 4, left: movingX, top: 20 }}
              >
                <span className="text-xs">🧱</span>
              </motion.div>
            )}

            <AnimatePresence>
              {showSparkle && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                  <div className="text-6xl">✨</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center mt-6 text-muted-foreground font-body">
            <p className="flex items-center justify-center gap-2">
              <span className="bg-primary/20 p-1 rounded text-primary border border-primary/30">SPACE</span>
              or
              <span className="bg-primary/20 p-1 rounded text-primary border border-primary/30">TAP</span>
              to drop
            </p>
            <p className="text-sm mt-2 opacity-60">Block {currentBlockIndex + 1} of {blocks.length}</p>
          </div>

          <AnimatePresence>
            {gameWon && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12 absolute inset-0 bg-obsidian/95 backdrop-blur-md rounded-lg flex flex-col items-center justify-center z-50 p-6"
              >
                <div className="text-9xl mb-6">🏛️</div>
                <h2 className="text-5xl font-display text-gold-gradient mb-4">Pyramid Complete!</h2>
                <div className="space-y-4 mb-8">
                  <div className="bg-gold/10 p-6 rounded-2xl border border-gold/30">
                    <p className="text-5xl font-display text-primary">{score}</p>
                    <p className="text-muted-foreground uppercase tracking-widest text-sm">Final Score</p>
                  </div>
                  <p className="text-xl text-foreground font-body">Perfect Hits: {perfectDrops}/{blocks.length}</p>
                </div>
                <div className="flex gap-4">
                  <EgyptianButton variant="hero" size="lg" onClick={() => initializeGame(currentLevel)}>
                    <RotateCcw size={20} className="mr-2" /> Rebuild
                  </EgyptianButton>
                  <EgyptianButton variant="lapis" size="lg" onClick={onBack}>
                    Back to Games
                  </EgyptianButton>
                </div>
              </motion.div>
            )}

            {gameLost && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12 absolute inset-0 bg-obsidian/95 backdrop-blur-md rounded-lg flex flex-col items-center justify-center z-50 p-6"
              >
                <div className="text-9xl mb-6">💀</div>
                <h2 className="text-5xl font-display text-terracotta mb-4">{timeLeft === 0 ? "Time Expired!" : "Construction Failed!"}</h2>
                <p className="text-xl text-muted-foreground font-body mb-8">Your structure was too unstable for the gods.</p>
                <div className="flex gap-4">
                  <EgyptianButton variant="default" size="lg" onClick={() => initializeGame(currentLevel)}>
                    <RotateCcw size={20} className="mr-2" /> Try Again
                  </EgyptianButton>
                  <EgyptianButton variant="lapis" size="lg" onClick={() => setCurrentLevel(null)}>
                    Blueprints
                  </EgyptianButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </EgyptianCard>
      </div>
    </div>
  );
}
