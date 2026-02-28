import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';

interface ScarabCollectorGameProps {
  onBack: () => void;
}

interface Scarab {
  id: number;
  x: number;
  y: number;
  type: 'gold' | 'silver' | 'cursed' | 'sacred';
  emoji: string;
  points: number;
  expiresAt: number;
}

const FIELD_WIDTH = 400;
const FIELD_HEIGHT = 400;

export function ScarabCollectorGame({ onBack }: ScarabCollectorGameProps) {
  const [scarabs, setScarabs] = useState<Scarab[]>([]);
  const [gameState, setGameState] = useState({
    score: 0,
    collected: 0,
    cursedHits: 0,
    combo: 0
  });
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const lastClickRef = useRef(Date.now());
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const startGame = useCallback((level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    setScarabs([]);
    setGameState({
      score: 0,
      collected: 0,
      cursedHits: 0,
      combo: 0
    });
    setTimeLeft(level === 'easy' ? 90 : level === 'medium' ? 60 : 45);
    setIsPlaying(true);
    setGameOver(false);
    playSound('gameStart');
    startAmbientMusic();
  }, []);

  // Timer
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGameOver(true);
      stopAmbientMusic();
      playSound(gameState.score >= 500 ? 'victory' : 'defeat');
      addScore({ playerName: 'Explorer', score: gameState.score, game: 'scarab-collector', difficulty, details: `${gameState.collected} caught, ${gameState.cursedHits} cursed` });
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    if (timeLeft <= 10) playSound('tick');
    return () => clearTimeout(timer);
  }, [timeLeft, isPlaying, gameOver, difficulty, gameState.score, gameState.collected, gameState.cursedHits, addScore, playSound, stopAmbientMusic]);

  // Spawn scarabs
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const spawnRate = difficulty === 'easy' ? 1200 : difficulty === 'medium' ? 900 : 600;
    const interval = setInterval(() => {
      const now = Date.now();
      const rand = Math.random();
      let type: Scarab['type'], emoji: string, points: number;
      if (rand < 0.1) {
        type = 'sacred'; emoji = '🪲'; points = 200;
      } else if (rand < 0.3) {
        type = 'cursed'; emoji = '🦂'; points = -100;
      } else if (rand < 0.55) {
        type = 'gold'; emoji = '𓆣'; points = 100;
      } else {
        type = 'silver'; emoji = '🪲'; points = 50;
      }

      const lifespan = type === 'sacred' ? 1500 : type === 'cursed' ? 3000 : 2500;

      setScarabs(s => [...s, {
        id: now + Math.random(),
        x: Math.floor(Math.random() * (FIELD_WIDTH - 50)) + 10,
        y: Math.floor(Math.random() * (FIELD_HEIGHT - 50)) + 10,
        type, emoji, points,
        expiresAt: now + lifespan,
      }]);
    }, spawnRate);
    return () => clearInterval(interval);
  }, [isPlaying, gameOver, difficulty]);

  // Remove expired scarabs
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setScarabs(s => s.filter(sc => sc.expiresAt > now));
    }, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const catchScarab = (scarab: Scarab) => {
    if (!isPlaying) return;
    const now = Date.now();
    const timeSinceLastClick = now - lastClickRef.current;
    lastClickRef.current = now;

    setScarabs(s => s.filter(sc => sc.id !== scarab.id));

    if (scarab.type === 'cursed') {
      playSound('wrong');
      setGameState(prev => ({
        ...prev,
        cursedHits: prev.cursedHits + 1,
        combo: 0,
        score: Math.max(0, prev.score + scarab.points)
      }));
    } else {
      playSound('collect');
      const newCombo = timeSinceLastClick < 1500 ? gameState.combo + 1 : 1;
      const comboBonus = Math.floor(newCombo / 3) * 25;
      const points = scarab.points + comboBonus;

      setGameState(prev => ({
        ...prev,
        collected: prev.collected + 1,
        combo: newCombo,
        score: prev.score + points
      }));
      if (newCombo >= 3) playSound('streak');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <EgyptianButton
            variant="nav"
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="mb-4 -ml-4"
          >
            <ArrowLeft size={20} /> Back to Games
          </EgyptianButton>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Scarab Collector</h1>
          <p className="text-xl text-muted-foreground font-body">Catch sacred scarabs, avoid the cursed scorpions!</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg" className="relative">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
              <Trophy className="text-primary" size={24} />
              <span className="text-xl text-foreground font-body">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <Star className="text-turquoise" size={24} />
              <span className="text-xl text-foreground font-body">Combo: {gameState.combo}x</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <Timer className={`${timeLeft <= 10 ? 'text-terracotta animate-pulse' : 'text-scarab'}`} size={24} />
              <span className="text-xl text-foreground font-body">{timeLeft}s</span>
            </div>
          </div>

          {!isPlaying && !gameOver ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">𓆣</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Catch the Scarabs!</h2>
              <p className="text-xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
                Click/tap scarabs before they vanish! Gold 𓆣 = 100pts, Silver 🪲 = 50pts, Sacred 🪲 = 200pts (rare!). Avoid scorpions 🦂 (-100pts)!
              </p>
              <p className="text-lg text-muted-foreground/80 font-body mb-8">Build combos by catching quickly in succession!</p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton variant="turquoise" size="xl" onClick={() => startGame('easy')} className="w-full h-auto flex-col py-8">
                    <div className="text-4xl mb-2">🐪</div>
                    <span className="text-xl">Easy</span>
                    <span className="text-sm opacity-80">Slow spawns • 90s</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton variant="default" size="xl" onClick={() => startGame('medium')} className="w-full h-auto flex-col py-8">
                    <div className="text-4xl mb-2">🏺</div>
                    <span className="text-xl">Medium</span>
                    <span className="text-sm opacity-80">Normal spawns • 60s</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton variant="danger" size="xl" onClick={() => startGame('hard')} className="w-full h-auto flex-col py-8">
                    <div className="text-4xl mb-2">⚡</div>
                    <span className="text-xl">Hard</span>
                    <span className="text-sm opacity-80">Fast spawns • 45s</span>
                  </EgyptianButton>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="relative bg-gradient-to-br from-sandstone/20 via-gold-dark/10 to-sandstone/20 rounded-xl border-2 border-gold/30 cursor-crosshair"
                style={{ width: FIELD_WIDTH, height: FIELD_HEIGHT }}
              >
                {/* Desert pattern */}
                <div className="absolute inset-0 hieroglyph-pattern opacity-30 rounded-xl" />

                <AnimatePresence>
                  {scarabs.map(scarab => (
                    <motion.button
                      key={scarab.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.3 }}
                      onClick={() => catchScarab(scarab)}
                      className={`absolute text-3xl cursor-pointer z-10 ${scarab.type === 'sacred' ? 'animate-glow-pulse' :
                        scarab.type === 'cursed' ? 'animate-pulse' : ''
                        }`}
                      style={{ left: scarab.x, top: scarab.y }}
                    >
                      {scarab.emoji}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {isPlaying && (
            <div className="text-center mt-4 text-muted-foreground font-body">
              <p>Caught: <span className="text-primary font-bold">{gameState.collected}</span> • Cursed: <span className="text-terracotta font-bold">{gameState.cursedHits}</span></p>
            </div>
          )}

          {gameOver && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 absolute inset-0 bg-obsidian/95 rounded-lg flex flex-col items-center justify-center">
              <div className="text-9xl mb-6">{gameState.score >= 500 ? '👑' : gameState.score >= 300 ? '🏺' : '📜'}</div>
              <h2 className="text-5xl font-display text-gold-gradient mb-4">
                {gameState.score >= 500 ? 'Master Collector!' : gameState.score >= 300 ? 'Skilled Hunter!' : 'Keep Practicing!'}
              </h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Score: {gameState.score}</p>
                <p className="text-xl text-muted-foreground font-body">Collected: {gameState.collected} • Cursed Hits: {gameState.cursedHits}</p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < Math.min(5, Math.floor(gameState.score / 150)) ? 'text-primary fill-primary' : 'text-muted'} size={32} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={() => startGame(difficulty)}><RotateCcw size={20} /> Play Again</EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
