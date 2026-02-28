import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, RotateCcw, Sun, Moon, Zap, ChevronsLeft, ChevronsRight, ChevronsUp, ChevronsDown, Users } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { useMobile } from '@/hooks/use-mobile';

interface MummyMazeGameProps {
  onBack: () => void;
}

type TileType = 'empty' | 'wall' | 'lava' | 'water' | 'ra-exit' | 'thoth-exit' | 'pressure-plate' | 'timed-gate';

interface Level {
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
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 0, 1, 0, 0, 1, 0, 0, 5, 1],
      [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 1, 0, 0, 1, 3, 3, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 6, 0, 0, 7, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 2, y: 3 },
    thothStart: { x: 9, y: 3 },
    timeLimit: 60,
  },
  {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 8, 0, 0, 1, 1, 0, 0, 9, 5, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 6, 7, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 0, 0, 0, 0, 3, 3, 0, 1],
      [1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 5, y: 3 },
    thothStart: { x: 6, y: 3 },
    timeLimit: 90,
  }
];

export function MummyMazeGame({ onBack }: MummyMazeGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [raPos, setRaPos] = useState({ x: 0, y: 0 });
  const [thothPos, setThothPos] = useState({ x: 0, y: 0 });
  const [activeChar, setActiveChar] = useState<'ra' | 'thoth'>('ra');
  const [gateOpen, setGateOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();
  const isMobile = useMobile();

  const level = useMemo(() => levels[currentLevel], [currentLevel]);

  const initLevel = useCallback((index: number) => {
    const current = levels[index];
    setRaPos(current.raStart);
    setThothPos(current.thothStart);
    setGateOpen(false);
    setLevelWon(false);
    setGameOver(false);
    setIsPlaying(true);
    setTimeLeft(current.timeLimit);
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  useEffect(() => {
    if (isPlaying && !levelWon && !gameOver) {
      if (timeLeft > 0) {
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
      } else {
        setGameOver(true);
        playSound('defeat');
        stopAmbientMusic();
      }
    }
  }, [isPlaying, levelWon, gameOver, timeLeft, playSound, stopAmbientMusic]);

  const moveChar = useCallback((dx: number, dy: number) => {
    if (!isPlaying || gameOver || levelWon) return;

    const currentPos = activeChar === 'ra' ? raPos : thothPos;
    const newX = currentPos.x + dx;
    const newY = currentPos.y + dy;

    if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) return;

    const tile = TILE_MAP[level.grid[newY][newX]];

    if (tile === 'wall' || (tile === 'timed-gate' && !gateOpen)) return;

    if (activeChar === 'ra') {
      if (tile === 'water') {
        setGameOver(true);
        playSound('defeat');
        return;
      }
      setRaPos({ x: newX, y: newY });
    } else {
      if (tile === 'lava') {
        setGameOver(true);
        playSound('defeat');
        return;
      }
      setThothPos({ x: newX, y: newY });
    }

    playSound('move');
  }, [activeChar, raPos, thothPos, isPlaying, gameOver, levelWon, level, gateOpen, playSound]);

  useEffect(() => {
    const raOnPlate = TILE_MAP[level.grid[raPos.y][raPos.x]] === 'pressure-plate';
    const thothOnPlate = TILE_MAP[level.grid[thothPos.y][thothPos.x]] === 'pressure-plate';
    setGateOpen(raOnPlate || thothOnPlate);

    const raOnExit = TILE_MAP[level.grid[raPos.y][raPos.x]] === 'ra-exit';
    const thothOnExit = TILE_MAP[level.grid[thothPos.y][thothPos.x]] === 'thoth-exit';

    if (raOnExit && thothOnExit) {
      setLevelWon(true);
      playSound('victory');
      const levelScore = Math.max(100, timeLeft * 10);
      setScore(s => s + levelScore);
    }
  }, [raPos, thothPos, level, timeLeft, playSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') moveChar(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') moveChar(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') moveChar(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') moveChar(1, 0);
      if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault();
        setActiveChar(prev => prev === 'ra' ? 'thoth' : 'ra');
        playSound('click');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveChar, playSound]);

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      const nextIdx = currentLevel + 1;
      setCurrentLevel(nextIdx);
      initLevel(nextIdx);
    } else {
      setIsPlaying(false);
      addScore({ playerName: 'Scribe', score, game: 'maze', details: `Completed all ${levels.length} levels!` });
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
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Mummy Maze: Solar & Lunar</h1>
          <p className="text-xl text-muted-foreground font-body">Cooperate to escape! Ra (Sun) survives Lava, Thoth (Moon) survives Water.</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg" className="relative flex flex-col items-center">
          <div className="flex justify-between w-full mb-6">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg border-2 transition-all ${activeChar === 'ra' ? 'bg-primary/20 border-primary scale-110' : 'bg-muted border-transparent opacity-50'}`}>
                <Sun className="text-primary" />
              </div>
              <div className={`p-2 rounded-lg border-2 transition-all ${activeChar === 'thoth' ? 'bg-turquoise/20 border-turquoise scale-110' : 'bg-muted border-transparent opacity-50'}`}>
                <Moon className="text-turquoise" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Trophy className="text-primary" size={20} />
                <span className="font-display text-xl">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-gold" size={20} />
                <span className="font-display text-xl">Level {currentLevel + 1}</span>
              </div>
              <div className="font-display text-xl">⏳ {timeLeft}s</div>
            </div>
          </div>

          {!isPlaying && !levelWon && !gameOver ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🧟</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Escape the Labyrinth!</h2>
              <p className="text-xl text-muted-foreground font-body mb-8">
                Switch between Ra and Thoth to navigate hazards. <br />
                Use <b>Arrow Keys</b> to move and <b>SPACE</b> to switch spirits.
              </p>
              <EgyptianButton variant="hero" size="xl" onClick={() => initLevel(0)}>
                Begin Journey
              </EgyptianButton>
            </div>
          ) : (
            <div
              className="relative bg-obsidian border-4 border-gold/30 rounded-xl overflow-hidden"
              style={{ width: GRID_WIDTH * TILE_SIZE, height: GRID_HEIGHT * TILE_SIZE }}
            >
              {/* Grid Rendering */}
              {level.grid.map((row, y) => row.map((tileIdx, x) => {
                const type = TILE_MAP[tileIdx];
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`absolute transition-colors duration-300 ${type === 'wall' ? 'bg-sandstone border border-obsidian/20' :
                      type === 'lava' ? 'bg-terracotta animate-pulse' :
                        type === 'water' ? 'bg-lapis animate-pulse' :
                          type === 'pressure-plate' ? 'bg-primary/40 flex items-center justify-center' :
                            type === 'timed-gate' ? (gateOpen ? 'bg-primary/10 border-2 border-primary/20' : 'bg-primary border-2 border-primary-light shadow-[0_0_10px_rgba(255,191,0,0.5)]') :
                              type === 'ra-exit' ? 'border-2 border-dashed border-primary flex items-center justify-center' :
                                type === 'thoth-exit' ? 'border-2 border-dashed border-turquoise flex items-center justify-center' :
                                  ''
                      }`}
                    style={{
                      left: x * TILE_SIZE,
                      top: y * TILE_SIZE,
                      width: TILE_SIZE,
                      height: TILE_SIZE
                    }}
                  >
                    {type === 'pressure-plate' && <div className={`w-4 h-4 rounded-full bg-primary ${gateOpen ? 'scale-75 opacity-50' : 'scale-110 shadow-lg'}`} />}
                    {type === 'ra-exit' && <Sun className="w-6 h-6 text-primary opacity-30" />}
                    {type === 'thoth-exit' && <Moon className="w-6 h-6 text-turquoise opacity-30" />}
                    {type === 'lava' && <span className="text-xs">🔥</span>}
                    {type === 'water' && <span className="text-xs">💧</span>}
                  </div>
                );
              }))}

              {/* Characters */}
              <motion.div
                animate={{ x: raPos.x * TILE_SIZE, y: raPos.y * TILE_SIZE }}
                className={`absolute z-20 flex items-center justify-center transition-all ${activeChar === 'ra' ? 'ring-2 ring-white shadow-lg' : 'opacity-80'}`}
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white border-2 border-gold shadow-gold-glow">
                  <Sun size={20} />
                </div>
              </motion.div>

              <motion.div
                animate={{ x: thothPos.x * TILE_SIZE, y: thothPos.y * TILE_SIZE }}
                className={`absolute z-20 flex items-center justify-center transition-all ${activeChar === 'thoth' ? 'ring-2 ring-white shadow-lg' : 'opacity-80'}`}
                style={{ width: TILE_SIZE, height: TILE_SIZE }}
              >
                <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center text-obsidian border-2 border-turquoise-light shadow-turquoise-glow">
                  <Moon size={20} />
                </div>
              </motion.div>
            </div>
          )}

          <AnimatePresence>
            {levelWon && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 rounded-lg text-center">
                <Zap className="w-16 h-16 text-primary mb-4 animate-bounce" />
                <h2 className="text-4xl font-display text-gold-gradient mb-2">Labyrinth Cleared!</h2>
                <p className="text-xl text-foreground mb-6 font-body">You navigated the ancient traps with {timeLeft}s remaining</p>
                <div className="flex gap-4">
                  <EgyptianButton variant="hero" size="lg" onClick={nextLevel}>
                    {currentLevel < levels.length - 1 ? 'Next Chamber' : 'See Results'}
                  </EgyptianButton>
                </div>
              </motion.div>
            )}

            {gameOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-terracotta/20 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 rounded-lg text-center">
                <div className="text-8xl mb-4">💀</div>
                <h2 className="text-4xl font-display text-terracotta mb-2">A Spirit has Fallen!</h2>
                <p className="text-xl text-foreground mb-6 font-body">The ancient elements were too strong.</p>
                <EgyptianButton variant="default" size="lg" onClick={() => initLevel(currentLevel)}>
                  <RotateCcw className="mr-2" /> Try Again
                </EgyptianButton>
              </motion.div>
            )}

            {!isPlaying && score > 0 && !levelWon && !gameOver && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-obsidian/95 z-40 flex flex-col items-center justify-center p-8 rounded-lg text-center">
                <Trophy className="w-20 h-20 text-primary mb-4" />
                <h2 className="text-5xl font-display text-gold-gradient mb-2">Master Navigator!</h2>
                <p className="text-2xl text-foreground mb-8 font-body">Total Score: {score}</p>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>
                  Back to Temple
                </EgyptianButton>
              </motion.div>
            )}
          </AnimatePresence>

          {isPlaying && (
            <div className="mt-6 flex flex-col items-center gap-4">
              <div className="flex gap-8 text-muted-foreground font-body text-sm">
                <p><b>Arrows:</b> Move Spirit</p>
                <p><b>SPACE:</b> Switch Spirit</p>
                <p><b>Goal:</b> Both spirits to their exits</p>
              </div>

              {isMobile && (
                <div className="flex flex-col items-center gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div />
                    <EgyptianButton size="lg" onClick={() => moveChar(0, -1)}><ChevronsUp /></EgyptianButton>
                    <div />
                    <EgyptianButton size="lg" onClick={() => moveChar(-1, 0)}><ChevronsLeft /></EgyptianButton>
                    <EgyptianButton size="lg" onClick={() => moveChar(0, 1)}><ChevronsDown /></EgyptianButton>
                    <EgyptianButton size="lg" onClick={() => moveChar(1, 0)}><ChevronsRight /></EgyptianButton>
                  </div>
                  <EgyptianButton size="lg" variant="outline" className="w-full flex gap-2" onClick={() => setActiveChar(prev => prev === 'ra' ? 'thoth' : 'ra')}>
                    <Users size={20} /> <span>Switch Spirit</span>
                  </EgyptianButton>
                </div>
              )}
            </div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
