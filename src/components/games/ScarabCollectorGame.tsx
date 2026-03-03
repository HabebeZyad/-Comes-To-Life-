import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, Bug, Zap, Shield, Sparkles, Clock } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface ScarabCollectorGameProps {
  onBack: () => void;
}

interface Scarab {
  id: number;
  x: number;
  y: number;
  type: 'gold' | 'silver' | 'cursed' | 'sacred' | 'time' | 'bonus';
  emoji: string;
  points: number;
  expiresAt: number;
}

const FIELD_WIDTH = 600;
const FIELD_HEIGHT = 450;

const WAVES = [
  { id: 1, name: 'Desert Dawn', target: 500, spawnRate: 1200, duration: 30, description: 'Collect sacred scarabs in the morning light.' },
  { id: 2, name: 'Sands of Time', target: 1200, spawnRate: 1000, duration: 30, description: 'The winds pick up. Watch for time-extending hourglasses!' },
  { id: 3, name: 'Cursed Tombs', target: 2000, spawnRate: 850, duration: 35, description: 'Ancient curses awaken. Avoid the scorpions at all costs!' },
  { id: 4, name: 'Pharaoh\'s Frenzy', target: 3000, spawnRate: 700, duration: 40, description: 'A swarm approaches! Keep your combo high for maximum points.' },
  { id: 5, name: 'Divine Trial', target: 4500, spawnRate: 600, duration: 45, description: 'The final test of the gods. Only the swiftest will survive.' }
];

export function ScarabCollectorGame({ onBack }: ScarabCollectorGameProps) {
  const [scarabs, setScarabs] = useState<Scarab[]>([]);
  const [level, setLevel] = useState(0); // 0 = not started
  const [score, setScore] = useState(0);
  const [collected, setCollected] = useState(0);
  const [cursedHits, setCursedHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelup' | 'victory' | 'defeat'>('intro');
  const lastClickRef = useRef(Date.now());
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentWave = WAVES[level - 1] || WAVES[0];

  const startNextLevel = useCallback(() => {
    const nextLevel = level + 1;
    if (nextLevel > WAVES.length) {
      setGameState('victory');
      stopAmbientMusic();
      playSound('victory');
      addScore({
        playerName: 'Explorer',
        score,
        game: 'scarab-collector',
        difficulty: 'hard',
        details: `Completed all 5 waves! ${collected} caught.`
      });
      return;
    }

    setLevel(nextLevel);
    const wave = WAVES[nextLevel - 1];
    setTimeLeft(wave.duration);
    setGameState('playing');
    setIsPlaying(true);
    if (nextLevel === 1) {
      setScore(0);
      setCollected(0);
      setCursedHits(0);
      setCombo(0);
      startAmbientMusic();
      playSound('gameStart');
    } else {
      playSound('levelUp');
    }
  }, [level, score, collected, startAmbientMusic, stopAmbientMusic, playSound, addScore]);

  // Timer logic - stable interval to avoid churn
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        if (prev <= 6 && prev > 1) playSound('tick');
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, playSound]);

  // Handle game state transitions when timer reaches zero
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      if (score >= currentWave.target) {
        setGameState('levelup');
        setIsPlaying(false);
        playSound('victory');
      } else {
        setGameState('defeat');
        setIsPlaying(false);
        stopAmbientMusic();
        playSound('defeat');
      }
    }
  }, [gameState, timeLeft, score, currentWave.target, playSound, stopAmbientMusic]);

  // Spawning logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnInterval = setInterval(() => {
      const now = Date.now();
      const rand = Math.random();
      let type: Scarab['type'], emoji: string, points: number;

      // Special items based on wave
      if (rand < 0.05 && level >= 2) {
        type = 'time'; emoji = '⌛'; points = 0; // Gives time
      } else if (rand < 0.1 && level >= 3) {
        type = 'bonus'; emoji = '💎'; points = 500;
      } else if (rand < 0.15) {
        type = 'sacred'; emoji = '🪲'; points = 250;
      } else if (rand < 0.35) {
        type = 'cursed'; emoji = '🦂'; points = -150;
      } else if (rand < 0.6) {
        type = 'gold'; emoji = '𓆣'; points = 100;
      } else {
        type = 'silver'; emoji = '🪲'; points = 50;
      }

      const lifespan = type === 'sacred' || type === 'bonus' ? 1200 : 2500 - (level * 150);

      setScarabs(prev => [...prev, {
        id: now + Math.random(),
        x: Math.random() * (FIELD_WIDTH - 60) + 30,
        y: Math.random() * (FIELD_HEIGHT - 60) + 30,
        type, emoji, points,
        expiresAt: now + lifespan
      }]);
    }, currentWave.spawnRate);

    return () => clearInterval(spawnInterval);
  }, [gameState, level, currentWave.spawnRate]);

  // Expiry logic - optimized to avoid redundant re-renders
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const now = Date.now();
      setScarabs(prev => {
        const stillActive = prev.filter(s => s.expiresAt > now);
        // Only update state if something actually expired to prevent unnecessary re-renders (every 100ms)
        if (stillActive.length === prev.length) return prev;
        return stillActive;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameState]);

  const handleScarabClick = (scarab: Scarab) => {
    if (gameState !== 'playing') return;

    const now = Date.now();
    const timeSinceLast = now - lastClickRef.current;
    lastClickRef.current = now;

    setScarabs(prev => prev.filter(s => s.id !== scarab.id));

    if (scarab.type === 'cursed') {
      playSound('wrong');
      setCursedHits(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 150));
      setCombo(0);
    } else if (scarab.type === 'time') {
      playSound('collect');
      setTimeLeft(prev => prev + 5);
      setCollected(prev => prev + 1);
    } else {
      playSound('collect');
      const newCombo = timeSinceLast < 1200 ? combo + 1 : 1;
      setCombo(newCombo);
      setCollected(prev => prev + 1);
      const comboBonus = Math.floor(newCombo / 3) * 50;
      setScore(prev => prev + scarab.points + comboBonus); if (newCombo >= 3 && newCombo % 3 === 0) {
        playSound('streak');
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full hieroglyph-pattern" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <EgyptianButton variant="nav" onClick={() => { stopAmbientMusic(); onBack(); }} className="-ml-4 mb-2">
              <ArrowLeft className="mr-2" size={18} /> Back to Games
            </EgyptianButton>
            <h1 className="text-4xl font-display text-gold-gradient">Scarab Collector</h1>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="bg-black/40 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-lg text-center">
              <div className="text-xs uppercase text-muted-foreground flex items-center justify-center gap-1">
                <Trophy size={12} className="text-primary" /> Wave
              </div>
              <div className="text-xl font-bold text-primary">{level || 1}/5</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
              <div className="text-xs uppercase text-muted-foreground flex items-center justify-center gap-1">
                <Zap size={12} className="text-turquoise" /> Score
              </div>
              <div className="text-xl font-bold text-turquoise">{score}</div>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden border-2 border-gold/30">
          {/* Game Stats Bar */}
          <div className="bg-black/60 border-b border-gold/20 p-4 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Timer className={timeLeft < 10 ? "text-terracotta animate-pulse" : "text-primary"} />
                <span className={`text-2xl font-mono ${timeLeft < 10 ? "text-terracotta" : "text-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Shield className="text-scarab" />
                <span className="text-muted-foreground">Target:</span>
                <span className="text-xl font-bold text-scarab">{currentWave.target}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {combo > 1 && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  key={combo}
                  className="bg-primary/20 text-primary px-3 py-1 rounded-full font-bold border border-primary/30 flex items-center gap-1"
                >
                  <Sparkles size={16} /> {combo}x COMBO
                </motion.div>
              )}
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase">Current Wave</div>
                <div className="text-lg font-display text-gold-light">{currentWave.name}</div>
              </div>
            </div>
          </div>

          {/* Game Field */}
          <div
            className="relative mx-auto bg-gradient-to-b from-sandstone/10 to-obsidian/30 cursor-crosshair overflow-hidden"
            style={{ width: '100%', height: FIELD_HEIGHT, maxWidth: FIELD_WIDTH }}
          >
            {/* Field background patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none grid grid-cols-6 grid-rows-4">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="border-[0.5px] border-gold/10 flex items-center justify-center text-xs">𓆣</div>
              ))}
            </div>

            {gameState === 'playing' && (
              <AnimatePresence>
                {scarabs.map(scarab => (
                  <motion.button
                    key={scarab.id}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => handleScarabClick(scarab)}
                    className={`absolute text-4xl select-none z-10 
                      ${scarab.type === 'sacred' ? 'drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]' : ''}
                      ${scarab.type === 'bonus' ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] animate-bounce' : ''}
                      ${scarab.type === 'cursed' ? 'drop-shadow-[0_0_8px_rgba(255,0,0,0.5)]' : ''}
                      ${scarab.type === 'time' ? 'drop-shadow-[0_0_8px_rgba(50,255,50,0.8)]' : ''}
                    `}
                    style={{
                      left: scarab.x,
                      top: scarab.y,
                      filter: scarab.type === 'sacred' ? 'hue-rotate(45deg)' : 'none'
                    }}
                  >
                    {scarab.emoji}
                    {scarab.type === 'time' && (
                      <div className="absolute -top-2 -right-2 bg-scarab text-[10px] p-0.5 rounded-full text-white">+5s</div>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            )}

            {/* Overlays */}
            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Scarab Collector"
                  description="Ancient scarabs are emerging from the sands! Catch the golden and sacred ones while avoiding the cursed scorpions. Maintain speed to build your score combo."
                  actionLabel="Enter Trial"
                  onAction={() => startNextLevel()}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelup' && (
                <GameOverlay
                  type="levelup"
                  title="Wave Complete!"
                  description={`Excellent work. You have mastered the ${currentWave.name}.`}
                  stats={[
                    { label: 'Wave Score', value: score },
                    { label: 'Collected', value: collected },
                    { label: 'Cursed Hits', value: cursedHits }
                  ]}
                  actionLabel={`Start Wave ${level + 1}`}
                  onAction={() => startNextLevel()}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Divine Master"
                  description="You have cleared all trials and collected the sacred swarm of the Pharaohs!"
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Total Caught', value: collected },
                    { label: 'Accuracy', value: `${Math.round((collected / (collected + cursedHits)) * 100)}%` }
                  ]}
                  actionLabel="Play Again"
                  onAction={() => {
                    setLevel(0);
                    setGameState('intro');
                  }}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Trial Failed"
                  description={`The sands were too swift. You needed ${currentWave.target} points to pass this wave.`}
                  score={score}
                  stats={[
                    { label: 'Required', value: currentWave.target },
                    { label: 'Current', value: score }
                  ]}
                  actionLabel="Retry Wave"
                  onAction={() => {
                    setLevel(level - 1);
                    startNextLevel();
                  }}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="bg-obsidian/40 p-4 grid grid-cols-3 gap-4 border-t border-gold/20">
            <div className="text-center">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Items Caught</div>
              <div className="flex items-center justify-center gap-1">
                <Bug size={14} className="text-gold" />
                <span className="font-bold">{collected}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Cursed Touches</div>
              <div className="flex items-center justify-center gap-1">
                <Skull size={14} className="text-terracotta" />
                <span className="font-bold">{cursedHits}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[10px] uppercase text-muted-foreground mb-1">Time Extended</div>
              <div className="flex items-center justify-center gap-1">
                <Clock size={14} className="text-turquoise" />
                <span className="font-bold">+{Math.floor(collected / 10)}s</span>
              </div>
            </div>
          </div>
        </EgyptianCard>

        {/* Legend */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { emoji: '𓆣', name: 'Gold Scarab', pts: '100' },
            { emoji: '🪲', name: 'Sacred Scarab', pts: '250', special: 'Rare' },
            { emoji: '🦂', name: 'Cursed Scorpion', pts: '-150', color: 'text-terracotta' },
            { emoji: '⌛', name: 'Time Glass', pts: '+5s', color: 'text-turquoise' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-black/30 p-3 rounded-lg border border-white/5">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <div className="text-xs font-bold text-foreground">{item.name}</div>
                <div className={`text-[10px] ${item.color || 'text-primary'}`}>{item.pts} Points {item.special && `• ${item.special}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Skull = ({ size, className }: { size?: number, className?: string }) => (
  <svg
    width={size || 24}
    height={size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 10L9.01 10" />
    <path d="M15 10L15.01 10" />
    <path d="M12 2a8 8 0 0 0-8 8v1a2 2 0 0 0 2 2 1.4 1.4 0 0 1 1.1.7l.7 2.2a2 2 0 0 0 1.9 1.4h6.6a2 2 0 0 0 1.9-1.4l.7-2.2a1.4 1.4 0 0 1 1.1-.7 2 2 0 0 0 2-2v-1a8 8 0 0 0-8-8z" />
    <path d="M12 14v2" />
    <path d="M9 21a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1H9v1z" />
  </svg>
);
