import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';

interface PyramidBuilderGameProps {
  onBack: () => void;
}

interface Block {
  id: number;
  width: number;
  placed: boolean;
  position: { x: number; y: number };
}

const BLOCK_WIDTHS = [200, 180, 160, 140, 120, 100, 80, 60];

export function PyramidBuilderGame({ onBack }: PyramidBuilderGameProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [movingX, setMovingX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [perfectDrops, setPerfectDrops] = useState(0);
  const [showSparkle, setShowSparkle] = useState(false);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const containerWidth = 400;
  const blockHeight = 30;
  const baseY = 300;

  const initializeGame = useCallback((level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    const initialBlocks: Block[] = BLOCK_WIDTHS.map((width, index) => ({
      id: index,
      width,
      placed: false,
      position: { x: (containerWidth - width) / 2, y: baseY - index * blockHeight }
    }));
    setBlocks(initialBlocks);
    setCurrentBlockIndex(0);
    setMovingX((containerWidth - BLOCK_WIDTHS[0]) / 2);
    setDirection(1);
    setScore(0);
    setPerfectDrops(0);
    setTimeLeft(level === 'easy' ? 90 : level === 'medium' ? 60 : 45);
    setIsPlaying(true);
    setGameWon(false);
    setGameLost(false);
    playSound('gameStart');
    startAmbientMusic();
  }, []);

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
  }, [timeLeft, isPlaying, gameWon, gameLost]);

  useEffect(() => {
    if (!isPlaying || gameWon || gameLost) return;
    const speed = difficulty === 'easy' ? 2 : difficulty === 'medium' ? 3 : 4;
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
  }, [isPlaying, currentBlockIndex, direction, blocks, difficulty, gameWon, gameLost]);

  const dropBlock = useCallback(() => {
    if (!isPlaying || currentBlockIndex >= blocks.length) return;
    const currentBlock = blocks[currentBlockIndex];
    const targetX = (containerWidth - currentBlock.width) / 2;
    const tolerance = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 10;
    const diff = Math.abs(movingX - targetX);

    if (diff <= tolerance) {
      const isPerfect = diff <= 5;
      const points = isPerfect ? 100 : Math.max(10, 50 - Math.floor(diff));
      if (isPerfect) {
        setPerfectDrops(prev => prev + 1);
        playSound('perfect');
      } else {
        playSound('drop');
      }
      setScore(prev => prev + points);
      setBlocks(prev => prev.map((block, index) => 
        index === currentBlockIndex 
          ? { ...block, placed: true, position: { x: movingX, y: block.position.y } }
          : block
      ));

      // Visual feedback for successful drop
      if (isPerfect) {
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 1000);
      }
      if (currentBlockIndex >= blocks.length - 1) {
        setGameWon(true);
        setIsPlaying(false);
        const finalScore = score + points + timeLeft * 10;
        setScore(finalScore);
        stopAmbientMusic();
        playSound('victory');
        addScore({ playerName: 'Explorer', score: finalScore, game: 'pyramid', difficulty, details: `${perfectDrops + (isPerfect ? 1 : 0)} perfect drops` });
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
  }, [isPlaying, currentBlockIndex, blocks, movingX, difficulty, timeLeft]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPlaying) {
        e.preventDefault();
        dropBlock();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, dropBlock]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Pyramid Builder</h1>
          <p className="text-xl text-muted-foreground font-body">Stack the sacred blocks to build the perfect pyramid</p>
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
              <span className="text-xl text-foreground font-body">{timeLeft}s</span>
            </div>
          </div>

          {!isPlaying && !gameWon && !gameLost ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">≡اؤي╕</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Build Your Pyramid</h2>
              <p className="text-xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
                Press SPACE or tap to drop blocks. Align them perfectly to build the pyramid!
              </p>
              <p className="text-lg text-muted-foreground/80 font-body mb-8">The closer to center, the more points you earn.</p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton variant="turquoise" size="xl" onClick={() => initializeGame('easy')} className="w-full h-auto flex-col py-8">
                    <div className="text-4xl mb-2">≡از</div>
                    <span className="text-xl">Easy</span>
                    <span className="text-sm opacity-80">Slow blocks ظت 90s</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton variant="default" size="xl" onClick={() => initializeGame('medium')} className="w-full h-auto flex-col py-8">
                    <div className="text-4xl mb-2">≡ا║</div>
                    <span className="text-xl">Medium</span>
                    <span className="text-sm opacity-80">Normal speed ظت 60s</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton variant="danger" size="xl" onClick={() => initializeGame('hard')} className="w-full h-auto flex-col py-8">
                    <div className="text-4xl mb-2">ظأة</div>
                    <span className="text-xl">Hard</span>
                    <span className="text-sm opacity-80">Fast blocks ظت 45s</span>
                  </EgyptianButton>
                </motion.div>
              </div>
            </div>
          ) : (
            <>
              <div 
                className="relative mx-auto bg-gradient-to-b from-lapis-deep/30 to-obsidian rounded-xl border-2 border-gold/30 overflow-hidden cursor-pointer"
                style={{ width: containerWidth, height: 380 }}
                onClick={dropBlock}
              >
                <div className="absolute top-0 bottom-0 w-0.5 bg-primary/30" style={{ left: containerWidth / 2 }} />
                {blocks.map((block, index) => (
                  block.placed && (
                    <motion.div key={block.id} initial={{ y: -50 }} animate={{ y: 0 }}
                      className="absolute bg-gradient-to-r from-gold-dark via-primary to-gold-dark border-2 border-gold-light/50 rounded"
                      style={{ width: block.width, height: blockHeight - 4, left: block.position.x, bottom: index * blockHeight }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-sm font-display text-obsidian/70">≡ôèز</div>
                    </motion.div>
                  )
                ))}
                {isPlaying && currentBlockIndex < blocks.length && (
                  <motion.div
                    className="absolute bg-gradient-to-r from-turquoise via-turquoise-glow to-turquoise border-2 border-turquoise-glow/50 rounded shadow-lg"
                    style={{ width: blocks[currentBlockIndex].width, height: blockHeight - 4, left: movingX, top: 20 }}
                  >
                    <div className="w-full h-full flex items-center justify-center text-sm font-display text-obsidian">≡ôèز</div>
                  </motion.div>
                )}
                {isPlaying && (
                  <div className="absolute border-2 border-dashed border-primary/40 rounded"
                    style={{ width: blocks[currentBlockIndex]?.width || 0, height: blockHeight - 4, left: (containerWidth - (blocks[currentBlockIndex]?.width || 0)) / 2, bottom: currentBlockIndex * blockHeight }}
                  />
                )}
                <AnimatePresence>
                  {showSparkle && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1.5 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    >
                      <div className="w-full h-full bg-primary/20 animate-pulse rounded-full" />
                      <div className="absolute text-4xl">ظ£ذ</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-center mt-6 text-muted-foreground font-body">
                <p>Press <span className="text-primary font-bold">SPACE</span> or <span className="text-primary font-bold">TAP</span> to drop the block</p>
                <p className="text-sm mt-1">Block {currentBlockIndex + 1} of {blocks.length}</p>
              </div>
            </>
          )}

          {gameWon && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 absolute inset-0 bg-scarab/95 rounded-lg flex flex-col items-center justify-center"
            >
              <div className="text-9xl mb-6">≡اؤي╕</div>
              <h2 className="text-5xl font-display text-gold-gradient mb-4">Pyramid Complete!</h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Final Score: {score}</p>
                <p className="text-xl text-muted-foreground font-body">Perfect Drops: {perfectDrops}/{blocks.length}</p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < Math.min(5, Math.floor(perfectDrops / 2) + 1) ? 'text-primary fill-primary' : 'text-muted'} size={32} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={() => initializeGame(difficulty)}>
                  <RotateCcw size={20} /> Play Again
                </EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}

          {gameLost && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 absolute inset-0 bg-obsidian/95 rounded-lg flex flex-col items-center justify-center"
            >
              <div className="text-9xl mb-6">≡اْح</div>
              <h2 className="text-5xl font-display text-terracotta mb-4">{timeLeft === 0 ? "Time's Up!" : "Block Misaligned!"}</h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Score: {score}</p>
                <p className="text-xl text-muted-foreground font-body">Blocks Placed: {currentBlockIndex}/{blocks.length}</p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={() => initializeGame(difficulty)}>
                  <RotateCcw size={20} /> Try Again
                </EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
