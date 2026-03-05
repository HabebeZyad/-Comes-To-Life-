import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Sun, Moon, Zap, ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, Users, Compass, Timer } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { useMobile } from '@/hooks/use-mobile';
import { GameOverlay } from './GameOverlay';

interface MummyMazeGameProps {
  onBack: () => void;
}

type TileType = 'empty' | 'wall' | 'lava' | 'water' | 'ra-exit' | 'thoth-exit' | 'pressure-plate' | 'timed-gate';

interface Level {
  name: string;
  description: string;
  grid: number[][];
  raStart: { x: number; y: number };
  thothStart: { x: number; y: number };
  timeLimit: number;
}

const TILE_SIZE = 40;
const GRID_WIDTH = 12;
const GRID_HEIGHT = 10;

const TILE_MAP: Record<number, TileType> = {
  0: 'empty',
  1: 'wall',
  2: 'lava',
  3: 'water',
  4: 'ra-exit',
  5: 'thoth-exit',
  6: 'pressure-plate',
  7: 'timed-gate',
};

const levels: Level[] = [
  {
    name: "The Divided Path",
    description: "Ra survives lava, Thoth survives water. Reach your respective exits.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 1, 1, 1, 1, 0, 0, 5, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 1, 0, 0, 1, 3, 3, 0, 1],
      [1, 0, 2, 2, 1, 0, 0, 1, 3, 3, 0, 1],
      [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 2, y: 3 },
    thothStart: { x: 9, y: 3 },
    timeLimit: 45,
  },
  {
    name: "Synchronized Spirits",
    description: "One spirit must stand on the pressure plate to open the gate for the other.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 0, 1, 1, 0, 0, 0, 5, 1],
      [1, 1, 1, 7, 1, 1, 1, 1, 7, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 0, 0, 0, 0, 3, 3, 0, 1],
      [1, 0, 2, 2, 0, 0, 0, 0, 3, 3, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 1, y: 6 },
    thothStart: { x: 10, y: 6 },
    timeLimit: 60,
  },
  {
    name: "Elemental Labyrinth",
    description: "Navigate through shifting elements and hazardous terrain.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 2, 0, 0, 0, 0, 3, 0, 5, 1],
      [1, 1, 0, 2, 0, 1, 1, 0, 3, 0, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 6, 0, 0, 6, 0, 0, 0, 1],
      [1, 1, 1, 1, 0, 7, 7, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 2, 2, 3, 3, 0, 0, 2, 2, 3, 3, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 5, y: 7 },
    thothStart: { x: 6, y: 7 },
    timeLimit: 75,
  },
  {
    name: "The Sun & Moon Trial",
    description: "The path is narrow and the gates are many. Perfect coordination is required.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 4, 7, 1, 0, 6, 6, 0, 1, 7, 5, 1],
      [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 2, 2, 2, 1, 7, 7, 1, 3, 3, 3, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 6, 0, 1, 0, 0, 1, 0, 6, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 1, y: 8 },
    thothStart: { x: 10, y: 8 },
    timeLimit: 90,
  },
  {
    name: "The Pharaoh's Escape",
    description: "The ultimate test of spirits. Escape the final chamber before it seals forever.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 7, 0, 2, 0, 0, 3, 0, 7, 5, 1],
      [1, 1, 1, 0, 2, 6, 6, 3, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 7, 1, 1, 7, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 6, 0, 0, 0, 0, 6, 0, 0, 1],
      [1, 2, 2, 2, 2, 0, 0, 3, 3, 3, 3, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 5, y: 8 },
    thothStart: { x: 6, y: 8 },
    timeLimit: 100,
  }
];

export function MummyMazeGame({ onBack }: MummyMazeGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [raPos, setRaPos] = useState({ x: 0, y: 0 });
  const [thothPos, setThothPos] = useState({ x: 0, y: 0 });
  const [activeChar, setActiveChar] = useState<'ra' | 'thoth'>('ra');
  const [gateOpen, setGateOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();
  const isMobile = useMobile();

  const level = useMemo(() => levels[currentLevel], [currentLevel]);

  const initLevel = useCallback((index: number) => {
    const current = levels[index];
    setRaPos(current.raStart);
    setThothPos(current.thothStart);
    setGateOpen(false);
    setGameState('playing');
    setTimeLeft(current.timeLimit);
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Timer Interval: Stable interval that doesn't churn on every tick
  const isPlaying = gameState === 'playing';
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
      setTotalTimeSpent(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Game Over Condition: Handle defeat when time runs out
  useEffect(() => {
    if (gameState === 'playing' && timeLeft === 0) {
      setGameState('defeat');
      playSound('defeat');
      stopAmbientMusic();
    }
  }, [gameState, timeLeft, playSound, stopAmbientMusic]);

  const moveChar = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const currentPos = activeChar === 'ra' ? raPos : thothPos;
    const newX = currentPos.x + dx;
    const newY = currentPos.y + dy;

    if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) return;

    const tile = TILE_MAP[level.grid[newY][newX]];

    if (tile === 'wall' || (tile === 'timed-gate' && !gateOpen)) return;

    if (activeChar === 'ra') {
      if (tile === 'water') {
        setGameState('defeat');
        playSound('defeat');
        return;
      }
      setRaPos({ x: newX, y: newY });
    } else {
      if (tile === 'lava') {
        setGameState('defeat');
        playSound('defeat');
        return;
      }
      setThothPos({ x: newX, y: newY });
    }

    playSound('move');
  }, [activeChar, raPos, thothPos, gameState, currentLevel, level, gateOpen, playSound]);

  useEffect(() => {
    const thothOnPlate = TILE_MAP[level.grid[thothPos.y][thothPos.x]] === 'pressure-plate';
    const raOnPlate = TILE_MAP[level.grid[raPos.y][raPos.x]] === 'pressure-plate';
    setGateOpen(raOnPlate || thothOnPlate);

    const raOnExit = TILE_MAP[level.grid[raPos.y][raPos.x]] === 'ra-exit';
    const thothOnExit = TILE_MAP[level.grid[thothPos.y][thothPos.x]] === 'thoth-exit';

    if (raOnExit && thothOnExit) {
      const levelScore = Math.max(100, timeLeft * 20);
      setScore(s => s + levelScore);
      playSound('victory');

      if (currentLevel < levels.length - 1) {
        setGameState('levelUp');
      } else {
        setGameState('victory');
        addScore({
          playerName: 'Scribe',
          score: score + levelScore,
          game: 'maze',
          details: `Master Navigator - ${totalTimeSpent}s total`
        });
      }
    }
  }, [raPos, thothPos, level, timeLeft, gameState, currentLevel, addScore, score, totalTimeSpent, playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowDown' || e.key === 's') moveChar(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') moveChar(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') moveChar(1, 0);
      if (e.key === ' ' || e.key === 'Tab') {
        setActiveChar(prev => prev === 'ra' ? 'thoth' : 'ra');
        playSound('click');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveChar, playSound, gameState]);

  const handleNextLevel = () => {
    const nextIdx = currentLevel + 1;
    setCurrentLevel(nextIdx);
    initLevel(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevel(0);
    setTotalTimeSpent(0);
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
              <Compass className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">TRIAL {currentLevel + 1}/5</span>
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
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg border-2 transition-all duration-500 ${activeChar === 'ra' ? 'bg-primary/20 border-primary shadow-gold-glow scale-110' : 'bg-muted border-transparent opacity-40'}`}>
                <Sun className="text-primary" size={24} />
              </div>
              <div className={`p-2 rounded-lg border-2 transition-all duration-500 ${activeChar === 'thoth' ? 'bg-turquoise/20 border-turquoise shadow-turquoise-glow scale-110' : 'bg-muted border-transparent opacity-40'}`}>
                <Moon className="text-turquoise" size={24} />
              </div>
              <div className="ml-2">
                <h2 className="text-xl font-display text-gold-gradient leading-none">{level.name}</h2>
                <p className="text-xs text-muted-foreground font-body mt-1">Switch: SPACE | Move: ARROWS</p>
              </div>
              <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${timeLeft < 10 ? 'bg-terracotta/20 border-terracotta animate-pulse' : 'bg-obsidian/40 border-gold/20'}`}>
                <Timer size={18} className={timeLeft < 10 ? 'text-terracotta' : 'text-primary'} />
                <span className={`font-display text-xl ${timeLeft < 10 ? 'text-terracotta' : 'text-gold'}`}>{timeLeft}s</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <div
              className="relative bg-obsidian border-4 border-gold/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              style={{ width: GRID_WIDTH * TILE_SIZE, height: GRID_HEIGHT * TILE_SIZE }}
            >
              {/* Grid Rendering */}
              {level.grid.map((row, y) => row.map((tileIdx, x) => {
                const type = TILE_MAP[tileIdx];
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`absolute transition-all duration-500 ${type === 'wall' ? 'bg-sandstone border border-obsidian/30 shadow-inner' :
                      type === 'lava' ? 'bg-terracotta animate-pulse' :
                        type === 'water' ? 'bg-lapis animate-pulse' :
                          type === 'pressure-plate' ? 'bg-primary/20 flex items-center justify-center' :
                            type === 'timed-gate' ? (gateOpen ? 'bg-primary/5 border border-primary/10' : 'bg-primary border-2 border-primary-light shadow-gold-glow z-10') :
                              type === 'ra-exit' ? 'border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/5' :
                                type === 'thoth-exit' ? 'border-2 border-dashed border-turquoise/50 flex items-center justify-center bg-turquoise/5' :
                                  ''
                      }`}
                    style={{
                      left: x * TILE_SIZE,
                      top: y * TILE_SIZE,
                      width: TILE_SIZE,
                      height: TILE_SIZE
                    }}
                  >
                    {type === 'pressure-plate' && <div className={`w-5 h-5 rounded-full border-2 border-primary transition-all duration-300 ${gateOpen ? 'scale-75 bg-primary opacity-50' : 'scale-100 bg-transparent shadow-gold-glow'}`} />}
                    {type === 'ra-exit' && <Sun className="w-6 h-6 text-primary opacity-40 animate-spin-slow" />}
                    {type === 'thoth-exit' && <Moon className="w-6 h-6 text-turquoise opacity-40 animate-pulse" />}
                    {type === 'lava' && <div className="w-full h-full bg-[radial-gradient(circle,_#ef4444_0%,_transparent_70%)] opacity-50" />}
                    {type === 'water' && <div className="w-full h-full bg-[radial-gradient(circle,_#0ea5e9_0%,_transparent_70%)] opacity-50" />}
                  </div>
                );
              }))}

              {/* Characters */}
              <motion.div
                animate={{ x: raPos.x * TILE_SIZE, y: raPos.y * TILE_SIZE }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute z-20 flex items-center justify-center transition-all ${activeChar === 'ra' ? 'z-30' : 'opacity-70 grayscale-[0.5]'}`}
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
              >
                <div className={`w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white border-2 border-gold-light shadow-gold-glow ${activeChar === 'ra' ? 'scale-110' : 'scale-90'}`}>
                  <Sun size={22} className={activeChar === 'ra' ? 'animate-spin-slow' : ''} />
                </div>
              </motion.div>

              <motion.div
                animate={{ x: thothPos.x * TILE_SIZE, y: thothPos.y * TILE_SIZE }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`absolute z-20 flex items-center justify-center transition-all ${activeChar === 'thoth' ? 'z-30' : 'opacity-70 grayscale-[0.5]'}`}
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
              >
                <div className={`w-9 h-9 bg-turquoise rounded-xl flex items-center justify-center text-obsidian border-2 border-turquoise-light shadow-turquoise-glow ${activeChar === 'thoth' ? 'scale-110' : 'scale-90'}`}>
                  <Moon size={22} className={activeChar === 'thoth' ? 'animate-pulse' : ''} />
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Mummy Maze: Solar & Lunar"
                  description="A divine trial of coordination. Guide the spirits of Sun and Moon to their respective gateways while navigating elemental traps."
                  onAction={() => initLevel(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Chamber Cleared!"
                  description={`You have mastered ${level.name}. The path deeper into the pyramid opens.`}
                  stats={[
                    { label: 'Time Bonus', value: `${timeLeft}s` },
                    { label: 'Total Score', value: score }
                  ]}
                  actionLabel="Next Chamber"
                  onAction={handleNextLevel}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Master of the Labyrinth"
                  description="The spirits have reached the final sanctuary. You have proven yourself a master of coordination and spatial logic."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Total Time', value: `${totalTimeSpent}s` },
                    { label: 'Rank', value: 'High Priest' }
                  ]}
                  actionLabel="Enter Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Trapped in Eternity"
                  description="The spirits have faded or the time has run out. The sands of the pyramid have claimed another victim."
                  score={score}
                  stats={[
                    { label: 'Trial', value: level.name },
                    { label: 'Score', value: score }
                  ]}
                  actionLabel="Retry Trial"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          {gameState === 'playing' && isMobile && (
            <div className="p-6 bg-gold/5 border-t border-gold/10 flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-3">
                <div />
                <EgyptianButton size="lg" onClick={() => moveChar(0, -1)} className="w-14 h-14 p-0"><ChevronsUp /></EgyptianButton>
                <div />
                <EgyptianButton size="lg" onClick={() => moveChar(-1, 0)} className="w-14 h-14 p-0"><ChevronsLeft /></EgyptianButton>
                <EgyptianButton size="lg" onClick={() => moveChar(0, 1)} className="w-14 h-14 p-0"><ChevronsDown /></EgyptianButton>
                <EgyptianButton size="lg" onClick={() => moveChar(1, 0)} className="w-14 h-14 p-0"><ChevronsRight /></EgyptianButton>
              </div>
              <EgyptianButton size="xl" variant="hero" className="w-full max-w-xs flex gap-3 shadow-turquoise-glow" onClick={() => { setActiveChar(prev => prev === 'ra' ? 'thoth' : 'ra'); playSound('click'); }}>
                <Users size={24} /> <span>Switch Spirit</span>
              </EgyptianButton>
            </div>
          )}
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Sun size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Ra (Sun Spirit)</h4>
              <p className="text-xs text-muted-foreground mt-1">Immune to Lava. Destroyed by Water. Target: Sun Gateway.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Moon size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Thoth (Moon Spirit)</h4>
              <p className="text-xs text-muted-foreground mt-1">Immune to Water. Destroyed by Lava. Target: Moon Gateway.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><Zap size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Mechanism</h4>
              <p className="text-xs text-muted-foreground mt-1">Pressure plates open Golden Gates. Both spirits must reach exits simultaneously.</p>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}
