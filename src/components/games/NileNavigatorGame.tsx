import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw } from 'lucide-react';
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

const RIVER_WIDTH = 360;
const RIVER_HEIGHT = 500;
const BOAT_SIZE = 40;

export function NileNavigatorGame({ onBack }: NileNavigatorGameProps) {
  const [boatX, setBoatX] = useState(RIVER_WIDTH / 2 - BOAT_SIZE / 2);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);
  const [score, setScore] = useState(0);
  const [distance, setDistance] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(2);
  const frameRef = useRef<number>(0);
  const lastSpawnRef = useRef(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const startGame = useCallback(() => {
    setBoatX(RIVER_WIDTH / 2 - BOAT_SIZE / 2);
    setObstacles([]);
    setCollectibles([]);
    setScore(0);
    setDistance(0);
    setSpeed(2);
    setIsPlaying(true);
    setGameOver(false);
    lastSpawnRef.current = 0;
    playSound('gameStart');
    startAmbientMusic();
  }, []);

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
    if (!isPlaying || gameOver) return;

    const gameLoop = () => {
      setDistance(d => {
        const newDist = d + 1;
        // Increase speed every 200 distance
        if (newDist % 200 === 0) setSpeed(s => Math.min(6, s + 0.5));
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
  }, [isPlaying, gameOver, speed]);

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
        const finalScore = score + Math.floor(distance / 10);
        setScore(finalScore);
        addScore({ playerName: 'Explorer', score: finalScore, game: 'nile-navigator', details: `Distance: ${distance}m` });
        return;
      }
    }

    // Check collectible collisions
    setCollectibles(cols => cols.map(c => {
      if (!c.collected && c.y + 30 > boatY && c.y < boatBottom && c.x + 30 > boatX && c.x < boatRight) {
        playSound('collect');
        setScore(s => s + c.points);
        return { ...c, collected: true };
      }
      return c;
    }).filter(c => !c.collected));
  }, [boatX, obstacles, collectibles, isPlaying, distance]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => { stopAmbientMusic(); onBack(); }} className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg">
            <ArrowLeft size={20} /> Back to Games
          </button>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Nile Navigator</h1>
          <p className="text-xl text-muted-foreground font-body">Sail the sacred river, dodge obstacles, collect treasures!</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
              <Trophy className="text-primary" size={24} />
              <span className="text-xl text-foreground font-body">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <span className="text-xl text-foreground font-body">📏 {distance}m</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <span className="text-xl text-foreground font-body">💨 Speed: {speed.toFixed(1)}x</span>
            </div>
          </div>

          {!isPlaying && !gameOver ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">⛵</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Set Sail!</h2>
              <p className="text-xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
                Use ← → arrow keys or A/D to steer your boat. Dodge rocks 🪨, crocodiles 🐊, and whirlpools 🌀. Collect treasures for points!
              </p>
              <p className="text-lg text-muted-foreground/80 font-body mb-8">The river gets faster as you go further!</p>
              <EgyptianButton variant="hero" size="xl" shimmer onClick={startGame}>
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
                </motion.div>
              </div>
            </div>
          )}

          {isPlaying && (
            <div className="text-center mt-4 text-muted-foreground font-body">
              <p>Use <span className="text-primary font-bold">← →</span> or <span className="text-primary font-bold">A/D</span> to steer</p>
            </div>
          )}

          {gameOver && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 absolute inset-0 bg-obsidian/95 rounded-lg flex flex-col items-center justify-center">
              <div className="text-9xl mb-6">🌊</div>
              <h2 className="text-5xl font-display text-terracotta mb-4">Shipwrecked!</h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Score: {score}</p>
                <p className="text-xl text-muted-foreground font-body">Distance: {distance}m</p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < Math.min(5, Math.floor(distance / 200)) ? 'text-primary fill-primary' : 'text-muted'} size={32} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={startGame}><RotateCcw size={20} /> Sail Again</EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
