import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw, Zap, Compass, Waves, Anchor } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

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
  name: string;
  distance: number;
  scarabs: number;
  speed: number;
}

const RIVER_WIDTH = 400;
const RIVER_HEIGHT = 550;
const BOAT_SIZE = 50;

const levels: LevelGoal[] = [
  { name: "The First Reach", distance: 400, scarabs: 1, speed: 2.5 },
  { name: "Crocodile Creek", distance: 800, scarabs: 3, speed: 3.2 },
  { name: "The Great Cataract", distance: 1200, scarabs: 5, speed: 4.0 },
  { name: "Valley of Spirits", distance: 1800, scarabs: 8, speed: 5.0 },
  { name: "The Pharaoh's Journey", distance: 3000, scarabs: 12, speed: 6.5 },
];

export function NileNavigatorGame({ onBack }: NileNavigatorGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [boatX, setBoatX] = useState(RIVER_WIDTH / 2 - BOAT_SIZE / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [scarabsCollected, setScarabsCollected] = useState(0);
  const [showCollectEffect, setShowCollectEffect] = useState(false);
  const lastSpawnRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const level = useMemo(() => levels[currentLevel], [currentLevel]);

  const startLevel = useCallback((levelIdx: number) => {
    setBoatX(RIVER_WIDTH / 2 - BOAT_SIZE / 2);
    setObstacles([]);
    setCollectibles([]);
    setDistance(0);
    setScarabsCollected(0);
    setGameState('playing');
    lastSpawnRef.current = 0;
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;
    const handleKey = (e: KeyboardEvent) => {
      const moveSpeed = 25;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBoatX(x => Math.max(0, x - moveSpeed));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBoatX(x => Math.min(RIVER_WIDTH - BOAT_SIZE, x + moveSpeed));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = () => {
      setDistance(d => {
        const newDist = d + level.speed;
        if (newDist >= level.distance && scarabsCollected >= level.scarabs) {
          if (currentLevel < levels.length - 1) {
            setGameState('levelUp');
          } else {
            setGameState('victory');
            addScore({
              playerName: 'Captain',
              score: score + 1000,
              game: 'nile-navigator',
              details: 'Grand Navigator of the Five Reaches'
            });
          }
          playSound('victory');
          return level.distance;
        }
        return newDist;
      });

      // Spawn obstacles and collectibles
      lastSpawnRef.current++;
      const spawnRate = Math.max(15, 40 - currentLevel * 5);
      if (lastSpawnRef.current >= spawnRate) {
        lastSpawnRef.current = 0;
        const rand = Math.random(); if (rand < 0.65) {
          const types = [
            { type: 'rock' as const, emoji: '🪨', width: 45 },
            { type: 'croc' as const, emoji: '🐊', width: 60 },
            { type: 'whirlpool' as const, emoji: '🌀', width: 50 },
          ];
          const t = types[Math.floor(Math.random() * types.length)];
          setObstacles(obs => [...obs, {
            id: Date.now() + Math.random(),
            x: Math.floor(Math.random() * (RIVER_WIDTH - t.width)),
            y: -60,
            ...t,
          }]);
        } else {
          const types = [
            { type: 'gold' as const, emoji: '💰', points: 50 },
            { type: 'papyrus' as const, emoji: '📜', points: 30 },
            { type: 'scarab' as const, emoji: '𓆣', points: 150 },
          ];
          const t = types[Math.floor(Math.random() * types.length)];
          setCollectibles(cols => [...cols, {
            id: Date.now() + Math.random(),
            x: Math.floor(Math.random() * (RIVER_WIDTH - 40)),
            y: -50,
            collected: false,
            ...t,
          }]);
        }
      }

      // Move objects
      setObstacles(obs => obs
        .map(o => ({ ...o, y: o.y + level.speed }))
        .filter(o => o.y < RIVER_HEIGHT + 100)
      );

      setCollectibles(cols => cols
        .map(c => ({ ...c, y: c.y + level.speed }))
        .filter(c => c.y < RIVER_HEIGHT + 100)
      );

      frameRef.current = requestAnimationFrame(gameLoop);
    };

    frameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gameState, level, currentLevel, scarabsCollected, playSound, score, addScore]);

  // Collision detection
  useEffect(() => {
    if (gameState !== 'playing') return;
    const boatY = RIVER_HEIGHT - 100;
    const boatHitbox = {
      left: boatX + 5,
      right: boatX + BOAT_SIZE - 5,
      top: boatY + 5,
      bottom: boatY + BOAT_SIZE - 5
    };

    // Check obstacle collisions
    for (const obs of obstacles) {
      if (obs.y + 10 < boatHitbox.bottom && obs.y + obs.width - 10 > boatHitbox.top &&
        obs.x + 10 < boatHitbox.right && obs.x + obs.width - 10 > boatHitbox.left) {
        setGameState('defeat');
        playSound('defeat');
        return;
      }
    }

    // Check collectible collisions
    setCollectibles(cols => cols.map(c => {
      if (!c.collected && c.y + 10 < boatHitbox.bottom && c.y + 40 > boatHitbox.top &&
        c.x + 10 < boatHitbox.right && c.x + 40 > boatHitbox.left) {
        playSound('collect');
        setScore(s => s + c.points);
        if (c.type === 'scarab') setScarabsCollected(prev => prev + 1);
        setShowCollectEffect(true);
        setTimeout(() => setShowCollectEffect(false), 500);
        return { ...c, collected: true };
      }
      return c;
    }).filter(c => !c.collected));
  }, [boatX, obstacles, collectibles, gameState, playSound]);

  const handleNextLevel = () => {
    const nextIdx = currentLevel + 1;
    setCurrentLevel(nextIdx);
    startLevel(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevel(0);
    startLevel(0);
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
              <Compass className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">REACH {currentLevel + 1}/5</span>
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
                <Waves className="text-primary" size={20} />
                <span className="font-display text-gold">Progress</span>
                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-gold-glow transition-all duration-300"
                    style={{ width: `${Math.min(100, (distance / level.distance) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">𓆣</span>
                <span className="font-display text-gold text-lg">{scarabsCollected} / {level.scarabs}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-xl font-display text-gold-gradient leading-none">{level.name}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">Steer with ARROWS or A/D</p>
            </div>
          </div>

          <div className="relative flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <div
              className="relative bg-gradient-to-b from-lapis-deep via-lapis to-lapis-deep rounded-xl border-4 border-gold/40 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.5)]"
              style={{ width: RIVER_WIDTH, height: RIVER_HEIGHT }}
            >
              {/* Animated Water Lines */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 bg-turquoise/15 rounded-full"
                  style={{ left: 20 + i * 42, height: 60 }}
                  animate={{ y: [-100, RIVER_HEIGHT + 100] }}
                  transition={{ duration: 4 / level.speed, repeat: Infinity, ease: 'linear', delay: i * 0.4 }}
                />
              ))}

              {/* Obstacles */}
              {obstacles.map(obs => (
                <div
                  key={obs.id}
                  className="absolute text-5xl flex items-center justify-center drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
                  style={{ left: obs.x, top: obs.y, width: obs.width, height: obs.width }}
                >
                  <span className={obs.type === 'whirlpool' ? 'animate-spin-slow opacity-60' : ''}>
                    {obs.emoji}
                  </span>
                </div>
              ))}

              {/* Collectibles */}
              {collectibles.map(col => (
                <motion.div
                  key={col.id}
                  animate={{
                    scale: [1, 1.2, 1],
                    y: [col.y - 2, col.y + 2, col.y - 2]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="absolute text-4xl drop-shadow-gold-glow flex items-center justify-center"
                  style={{ left: col.x, top: col.y, width: 40, height: 40 }}
                >
                  {col.emoji}
                </motion.div>
              ))}

              {/* Boat */}
              <motion.div
                animate={{ x: boatX }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute flex items-center justify-center"
                style={{ top: RIVER_HEIGHT - 120, width: BOAT_SIZE, height: BOAT_SIZE }}
              >
                <div className="text-6xl drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] transform -rotate-1">
                  ⛵
                </div>
                <AnimatePresence>
                  {showCollectEffect && (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -60, scale: 2.5 }}
                      className="absolute -top-10 text-primary font-display text-2xl drop-shadow-gold-glow pointer-events-none"
                    >
                      +✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Distance HUD Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px] font-display text-gold/60 uppercase tracking-widest">
                <span>Start Point</span>
                <span>{level.name} End</span>
              </div>
            </div>

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Nile Navigator"
                  description="Master the sacred river. Steer your vessel through hazardous reaches, collect ancient treasures, and prove your worth as a divine navigator."
                  onAction={() => startLevel(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Reach Mastered!"
                  description={`You have successfully navigated ${level.name}. The river flows faster ahead.`}
                  stats={[
                    { label: 'Scarabs Caught', value: scarabsCollected },
                    { label: 'Total Score', value: score }
                  ]}
                  actionLabel="Next Reach"
                  onAction={handleNextLevel}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Grand Navigator"
                  description="The entire length of the Nile has been conquered. You are truly a master of the currents and the wind."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Scarabs Found', value: scarabsCollected }
                  ]}
                  actionLabel="Sail Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Wrecked on the Nile"
                  description="The river's hazards have claimed your vessel. The sands of Egypt keep no record of the sunken."
                  score={score}
                  stats={[
                    { label: 'Current Reach', value: level.name },
                    { label: 'Score', value: score }
                  ]}
                  actionLabel="Retry Reach"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          {gameState === 'playing' && (
            <div className="p-4 bg-gold/5 border-t border-gold/10 flex justify-center gap-12 text-muted-foreground font-body text-sm uppercase tracking-tighter">
              <div className="flex items-center gap-2">
                <div className="p-1 border border-gold/30 rounded bg-obsidian/40 text-gold font-bold">A</div>
                <div className="p-1 border border-gold/30 rounded bg-obsidian/40 text-gold font-bold">←</div>
                <span>Steer Left</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1 border border-gold/30 rounded bg-obsidian/40 text-gold font-bold">D</div>
                <div className="p-1 border border-gold/30 rounded bg-obsidian/40 text-gold font-bold">→</div>
                <span>Steer Right</span>
              </div>
            </div>
          )}
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Anchor size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Navigation</h4>
              <p className="text-xs text-muted-foreground mt-1">Distance goal must be met while carrying enough sacred scarabs.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Waves size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Hazards</h4>
              <p className="text-xs text-muted-foreground mt-1">Rocks, crocodiles, and whirlpools will sink your vessel instantly.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><Zap size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Treasures</h4>
              <p className="text-xs text-muted-foreground mt-1">Sacred scarabs are required to pass. Gold and papyrus boost your score.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
