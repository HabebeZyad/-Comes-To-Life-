import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw, Zap } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';

interface NileNavigatorGameProps {
  onBack: () => void;
}

interface Obstacle {
  id: number;
  x: number;
  y: number;
  type: 'rock' | 'croc' | 'whirlpool';
  emoji: string;
  width: number;
}

interface Collectible {
  id: number;
  x: number;
  y: number;
  type: 'gold' | 'papyrus' | 'scarab';
  emoji: string;
  points: number;
  collected: boolean;
}

interface LevelGoal {
  distance: number;
  scarabs: number;
}

const RIVER_WIDTH = 360;
const RIVER_HEIGHT = 500;
const BOAT_SIZE = 40;

const levels: LevelGoal[] = [
  { distance: 300, scarabs: 1 },
  { distance: 600, scarabs: 2 },
  { distance: 1000, scarabs: 3 },
  { distance: 1500, scarabs: 5 },
  { distance: 2500, scarabs: 10 },
];

export function NileNavigatorGame({ onBack }: NileNavigatorGameProps) {
  const [boatX, setBoatX] = useState(RIVER_WIDTH / 2 - BOAT_SIZE / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [scarabsCollected, setScarabsCollected] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [speed, setSpeed] = useState(2);
  const [showCollectEffect, setShowCollectEffect] = useState(false);
  const frameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const startLevel = useCallback((levelIdx: number) => {
    setBoatX(RIVER_WIDTH / 2 - BOAT_SIZE / 2);
    setObstacles([]);
    setCollectibles([]);
    setDistance(0);
    setScarabsCollected(0);
    setSpeed(2 + levelIdx * 0.5);
    setIsPlaying(true);
    setGameOver(false);
    setLevelComplete(false);
    lastSpawnRef.current = 0;
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) return;
    const handleKey = (e: KeyboardEvent) => {
      const moveSpeed = 15;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBoatX(x => Math.max(0, x - moveSpeed));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBoatX(x => Math.min(RIVER_WIDTH - BOAT_SIZE, x + moveSpeed));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isPlaying]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || levelComplete) return;

    const gameLoop = () => {
      setDistance(d => {
        const newDist = d + 1;
        // Check level completion
        const goal = levels[currentLevel];
        if (newDist >= goal.distance && scarabsCollected >= goal.scarabs) {
          setLevelComplete(true);
          setIsPlaying(false);
          stopAmbientMusic();
          playSound('victory');
        }
        return newDist;
      });

      // Spawn obstacles and collectibles
      lastSpawnRef.current++;
      if (lastSpawnRef.current >= 40) {
        lastSpawnRef.current = 0;
        const rand = Math.random();
        if (rand < 0.6) {
          const types = [
            { type: 'rock' as const, emoji: '🪨', width: 40 },
            { type: 'croc' as const, emoji: '🐊', width: 50 },
            { type: 'whirlpool' as const, emoji: '🌀', width: 45 },
          ];
          const t = types[Math.floor(Math.random() * types.length)];
          setObstacles(obs => [...obs, {
            id: Date.now() + Math.random(),
            x: Math.floor(Math.random() * (RIVER_WIDTH - t.width)),
            y: -50,
            ...t,
          }]);
        } else {
          const types = [
            { type: 'gold' as const, emoji: '💰', points: 50 },
            { type: 'papyrus' as const, emoji: '📜', points: 30 },
            { type: 'scarab' as const, emoji: '𓆣', points: 100 },
          ];
          const t = types[Math.floor(Math.random() * types.length)];
          setCollectibles(cols => [...cols, {
            id: Date.now() + Math.random(),
            x: Math.floor(Math.random() * (RIVER_WIDTH - 30)),
            y: -40,
            collected: false,
            ...t,
          }]);
        }
      }

      // Move obstacles down
      setObstacles(obs => obs
        .map(o => ({ ...o, y: o.y + speed }))
        .filter(o => o.y < RIVER_HEIGHT + 60)
      );

      // Move collectibles down
      setCollectibles(cols => cols
        .map(c => ({ ...c, y: c.y + speed }))
        .filter(c => c.y < RIVER_HEIGHT + 60)
      );

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, gameOver, levelComplete, speed, currentLevel, scarabsCollected, playSound, stopAmbientMusic]);

  // Collision detection
  useEffect(() => {
    if (!isPlaying) return;
    const boatY = RIVER_HEIGHT - 60;
    const boatRight = boatX + BOAT_SIZE;
    const boatBottom = boatY + BOAT_SIZE;

    // Check obstacle collisions
    for (const obs of obstacles) {
      if (obs.y + 30 > boatY && obs.y < boatBottom && obs.x + obs.width > boatX && obs.x < boatRight) {
        setIsPlaying(false);
        setGameOver(true);
        stopAmbientMusic();
        playSound('defeat');
        return;
      }
    }

    // Check collectible collisions
    setCollectibles(cols => cols.map(c => {
      if (!c.collected && c.y + 30 > boatY && c.y < boatBottom && c.x + 30 > boatX && c.x < boatRight) {
        playSound('collect');
        setScore(s => s + c.points);
        if (c.type === 'scarab') setScarabsCollected(prev => prev + 1);
        setShowCollectEffect(true);
        setTimeout(() => setShowCollectEffect(false), 500);
        return { ...c, collected: true };
      }
      return c;
    }).filter(c => !c.collected));
  }, [boatX, obstacles, collectibles, isPlaying, playSound, stopAmbientMusic]);

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      startLevel(currentLevel + 1);
    } else {
      // Game Win
      setIsPlaying(false);
      addScore({ playerName: 'Captain', score, game: 'nile-navigator', details: 'Navigated all river reaches!' });
    }
  };

  const goal = levels[currentLevel];

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
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Nile Navigator</h1>
          <p className="text-xl text-muted-foreground font-body">Sail the sacred river, reach the goals, and become a master navigator!</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg" className="relative">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
              <Trophy className="text-primary" size={24} />
              <span className="text-xl text-foreground font-body">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <span className="text-xl text-foreground font-body">📏 {distance} / {goal.distance}m</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <span className="text-xl text-foreground font-body">𓆣 {scarabsCollected} / {goal.scarabs}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <span className="text-xl text-foreground font-body">Level {currentLevel + 1}</span>
            </div>
          </div>

          {!isPlaying && !gameOver && !levelComplete ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">⛵</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Set Sail!</h2>
              <p className="text-xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
                Reach the distance goal and collect enough sacred scarabs to pass each reach of the river.
              </p>
              <div className="bg-lapis/20 p-6 rounded-xl border border-lapis-light/30 mb-8 max-w-md mx-auto">
                <h3 className="text-2xl font-display text-primary mb-2">Level {currentLevel + 1} Goals:</h3>
                <p className="text-lg font-body">Distance: {goal.distance}m</p>
                <p className="text-lg font-body">Scarabs: {goal.scarabs}</p>
              </div>
              <EgyptianButton variant="hero" size="xl" shimmer onClick={() => startLevel(currentLevel)}>
                Set Sail!
              </EgyptianButton>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                className="relative bg-gradient-to-b from-lapis-deep via-lapis to-lapis-deep rounded-xl border-2 border-gold/30 overflow-hidden"
                style={{ width: RIVER_WIDTH, height: RIVER_HEIGHT }}
              >
                {/* River lines */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 bg-turquoise/20 rounded-full"
                    style={{ left: 40 + i * 45, height: 40 }}
                    animate={{ y: [-(i * 60), RIVER_HEIGHT] }}
                    transition={{ duration: 3 / speed, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                  />
                ))}

                {/* Obstacles */}
                {obstacles.map(obs => (
                  <div
                    key={obs.id}
                    className="absolute text-3xl flex items-center justify-center"
                    style={{ left: obs.x, top: obs.y, width: obs.width, height: 35 }}
                  >
                    {obs.emoji}
                  </div>
                ))}

                {/* Collectibles */}
                {collectibles.map(col => (
                  <motion.div
                    key={col.id}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute text-2xl"
                    style={{ left: col.x, top: col.y }}
                  >
                    {col.emoji}
                  </motion.div>
                ))}

                {/* Boat */}
                <motion.div
                  animate={{ x: boatX }}
                  transition={{ duration: 0.1 }}
                  className="absolute text-4xl"
                  style={{ top: RIVER_HEIGHT - 60 }}
                >
                  ⛵
                  <AnimatePresence>
                    {showCollectEffect && (
                      <motion.div
                        initial={{ opacity: 1, y: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: -40, scale: 2 }}
                        className="absolute -top-4 left-0 text-primary font-bold text-xl pointer-events-none"
                      >
                        +✨
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${Math.min(100, (distance / goal.distance) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {isPlaying && (
            <div className="text-center mt-4 text-muted-foreground font-body">
              <p>Use <span className="text-primary font-bold">← →</span> or <span className="text-primary font-bold">A/D</span> to steer</p>
            </div>
          )}

          {levelComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 rounded-lg text-center">
              <Zap className="w-16 h-16 text-primary mb-4 animate-bounce" />
              <h2 className="text-4xl font-display text-gold-gradient mb-2">Reach Cleared!</h2>
              <p className="text-xl text-foreground mb-6 font-body">You successfully navigated this stretch of the Nile.</p>
              <div className="flex gap-4">
                <EgyptianButton variant="hero" size="lg" onClick={nextLevel}>
                  {currentLevel < levels.length - 1 ? 'Next Reach' : 'Final Results'}
                </EgyptianButton>
              </div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 absolute inset-0 bg-obsidian/95 rounded-lg flex flex-col items-center justify-center z-40">
              <div className="text-9xl mb-6">🌊</div>
              <h2 className="text-5xl font-display text-terracotta mb-4">Shipwrecked!</h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Total Score: {score}</p>
                <p className="text-xl text-muted-foreground font-body">Distance this level: {distance}m</p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={() => startLevel(currentLevel)}><RotateCcw size={20} /> Try Reach Again</EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}

          {!isPlaying && score > 0 && !levelComplete && !gameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-obsidian/95 z-50 flex flex-col items-center justify-center p-8 rounded-lg text-center">
              <Trophy className="w-20 h-20 text-primary mb-4" />
              <h2 className="text-5xl font-display text-gold-gradient mb-2">Grand Captain!</h2>
              <p className="text-2xl text-foreground mb-8 font-body">Final Score: {score}</p>
              <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>
                Return to Port
              </EgyptianButton>
            </motion.div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
