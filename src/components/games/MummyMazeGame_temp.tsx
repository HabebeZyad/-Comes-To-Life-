import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, RotateCcw, Sun, Moon, Zap } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';

interface MummyMazeGameProps {
  onBack: () => void;
}

type TileType = 'empty' | 'wall' | 'lava' | 'water' | 'ra-exit' | 'thoth-exit' | 'red-button' | 'blue-button' | 'red-gate' | 'blue-gate';

interface Level {
  grid: number[][];
  raStart: { x: number; y: number };
  thothStart: { x: number; y: number };
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
  6: 'red-button',
  7: 'blue-button',
  8: 'red-gate',
  9: 'blue-gate',
};

const levels: Level[] = [
  {
    // Level 1: Basics
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 4, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 5, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
      [1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 1, y: 1 },
    thothStart: { x: 1, y: 5 },
  },
  {
    // Level 2: Buttons and Gates
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 6, 1, 4, 8, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1],
      [1, 0, 0, 0, 7, 1, 5, 9, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 1, y: 1 },
    thothStart: { x: 1, y: 5 },
  },
  {
    // Level 3: Cross paths
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 8, 0, 0, 3, 3, 0, 0, 9, 5, 1],
      [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 2, 2, 0, 6, 7, 0, 3, 3, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 5, y: 3 },
    thothStart: { x: 6, y: 3 },
  },
  {
    // Level 4: Cooperation Required
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 6, 1, 5, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 0, 1, 9, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      [1, 1, 1, 8, 1, 0, 1, 0, 1, 1, 1, 1],
      [1, 0, 0, 0, 1, 7, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 1, y: 1 },
    thothStart: { x: 10, y: 8 },
  },
  {
    // Level 5: The Grand Hall
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 4, 0, 2, 2, 0, 0, 3, 3, 0, 5, 1],
      [1, 1, 0, 1, 1, 8, 9, 1, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 6, 7, 0, 1, 1, 0, 1],
      [1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 2, 2, 3, 3, 0, 0, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ],
    raStart: { x: 1, y: 8 },
    thothStart: { x: 10, y: 8 },
  }
];

export function MummyMazeGame({ onBack }: MummyMazeGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [raPos, setRaPos] = useState({ x: 0, y: 0 });
  const [thothPos, setThothPos] = useState({ x: 0, y: 0 });
  const [activeChar, setActiveChar] = useState<'ra' | 'thoth'>('ra');
  const [redGateOpen, setRedGateOpen] = useState(false);
  const [blueGateOpen, setBlueGateOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const initLevel = useCallback((index: number) => {
    const level = levels[index];
    setRaPos(level.raStart);
    setThothPos(level.thothStart);
    setRedGateOpen(false);
    setBlueGateOpen(false);
    setLevelWon(false);
    setGameOver(false);
    setIsPlaying(true);
    setTime(0);
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  useEffect(() => {
    if (isPlaying && !levelWon && !gameOver) {
      const timer = setInterval(() => setTime(t => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying, levelWon, gameOver]);

  const moveChar = useCallback((dx: number, dy: number) => {
    if (!isPlaying || gameOver || levelWon) return;

    const level = levels[currentLevel];
    const currentPos = activeChar === 'ra' ? raPos : thothPos;
    const newX = currentPos.x + dx;
    const newY = currentPos.y + dy;

    if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) return;

    const tile = TILE_MAP[level.grid[newY][newX]];

    // Check walls and closed gates
    if (tile === 'wall') return;
    if (tile === 'red-gate' && !redGateOpen) return;
    if (tile === 'blue-gate' && !blueGateOpen) return;

    // Move
    if (activeChar === 'ra') {
      setRaPos({ x: newX, y: newY });
      if (tile === 'water') {
        setGameOver(true);
        playSound('defeat');
      }
    } else {
      setThothPos({ x: newX, y: newY });
      if (tile === 'lava') {
        setGameOver(true);
        playSound('defeat');
      }
    }

    playSound('move');

    // Check buttons (only if someone is on them, but here we toggle)
    // Actually, in Fireboy/Watergirl it's usually stay-on or toggle.
    // Let's do toggle for simplicity or better yet: check all buttons after movement.
  }, [activeChar, raPos, thothPos, isPlaying, gameOver, levelWon, currentLevel, redGateOpen, blueGateOpen, playSound]);

  // Update button states
  useEffect(() => {
    const level = levels[currentLevel];
    let redOn = false;
    let blueOn = false;

    const checkTile = (pos: { x: number; y: number }) => {
      const tile = TILE_MAP[level.grid[pos.y][pos.x]];
      if (tile === 'red-button') redOn = true;
      if (tile === 'blue-button') blueOn = true;
    };

    checkTile(raPos);
    checkTile(thothPos);

    setRedGateOpen(redOn);
    setBlueGateOpen(blueOn);

    // Check Win
    const raTile = TILE_MAP[level.grid[raPos.y][raPos.x]];
    const thothTile = TILE_MAP[level.grid[thothPos.y][thothPos.x]];
    if (raTile === 'ra-exit' && thothTile === 'thoth-exit') {
      setLevelWon(true);
      playSound('victory');
      const levelScore = Math.max(100, 1000 - time * 10);
      setScore(s => s + levelScore);
    }
  }, [raPos, thothPos, currentLevel, time, playSound]);

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
      setCurrentLevel(prev => prev + 1);
      initLevel(currentLevel + 1);
    } else {
      setIsPlaying(false);
      addScore({ playerName: 'Scribe', score, game: 'maze', details: `Completed all ${levels.length} levels!` });
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => { stopAmbientMusic(); onBack(); }} className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg">
            <ArrowLeft size={20} /> Back to Games
          </button>
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
              <div className="font-display text-xl">ظ│ {time}s</div>
            </div>
          </div>

          {!isPlaying && !levelWon && !gameOver ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">≡ادا</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Escape the Labyrinth!</h2>
              <p className="text-xl text-muted-foreground font-body mb-8">
                Switch between Ra and Thoth to navigate hazards. <br/>
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
              {levels[currentLevel].grid.map((row, y) => row.map((tileIdx, x) => {
                const type = TILE_MAP[tileIdx];
                return (
                  <div
                    key={`${x}-${y}`}
                    className={`absolute transition-colors duration-300 ${
                      type === 'wall' ? 'bg-sandstone border border-obsidian/20' :
                      type === 'lava' ? 'bg-terracotta animate-pulse' :
                      type === 'water' ? 'bg-lapis animate-pulse' :
                      type === 'red-button' ? 'bg-primary/40 flex items-center justify-center' :
                      type === 'blue-button' ? 'bg-turquoise/40 flex items-center justify-center' :
                      type === 'red-gate' ? (redGateOpen ? 'bg-primary/10 border-2 border-primary/20' : 'bg-primary border-2 border-primary-light shadow-[0_0_10px_rgba(255,191,0,0.5)]') :
                      type === 'blue-gate' ? (blueGateOpen ? 'bg-turquoise/10 border-2 border-turquoise/20' : 'bg-turquoise border-2 border-turquoise-light shadow-[0_0_10px_rgba(0,255,255,0.5)]') :
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
                    {type === 'red-button' && <div className={`w-4 h-4 rounded-full bg-primary ${redGateOpen ? 'scale-75 opacity-50' : 'scale-110 shadow-lg'}`} />}
                    {type === 'blue-button' && <div className={`w-4 h-4 rounded-full bg-turquoise ${blueGateOpen ? 'scale-75 opacity-50' : 'scale-110 shadow-lg'}`} />}
                    {type === 'ra-exit' && <Sun className="w-6 h-6 text-primary opacity-30" />}
                    {type === 'thoth-exit' && <Moon className="w-6 h-6 text-turquoise opacity-30" />}
                    {type === 'lava' && <span className="text-xs">≡ا¤ح</span>}
                    {type === 'water' && <span className="text-xs">≡اْد</span>}
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

          {levelWon && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 rounded-lg text-center">
              <Zap className="w-16 h-16 text-primary mb-4 animate-bounce" />
              <h2 className="text-4xl font-display text-gold-gradient mb-2">Labyrinth Cleared!</h2>
              <p className="text-xl text-foreground mb-6 font-body">You navigated the ancient traps in {time}s</p>
              <div className="flex gap-4">
                <EgyptianButton variant="hero" size="lg" onClick={nextLevel}>
                  {currentLevel < levels.length - 1 ? 'Next Chamber' : 'See Results'}
                </EgyptianButton>
              </div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-terracotta/20 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 rounded-lg text-center">
              <div className="text-8xl mb-4">≡اْ</div>
              <h2 className="text-4xl font-display text-terracotta mb-2">A Spirit has Fallen!</h2>
              <p className="text-xl text-foreground mb-6 font-body">The ancient elements were too strong.</p>
              <EgyptianButton variant="default" size="lg" onClick={() => initLevel(currentLevel)}>
                <RotateCcw className="mr-2" /> Try Again
              </EgyptianButton>
            </motion.div>
          )}

          {!isPlaying && score > 0 && !levelWon && !gameOver && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-obsidian/95 z-40 flex flex-col items-center justify-center p-8 rounded-lg text-center">
                <Trophy className="w-20 h-20 text-primary mb-4" />
                <h2 className="text-5xl font-display text-gold-gradient mb-2">Master Architect!</h2>
                <p className="text-2xl text-foreground mb-8 font-body">Total Score: {score}</p>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>
                  Back to Temple
                </EgyptianButton>
             </motion.div>
          )}

          {isPlaying && (
            <div className="mt-6 flex gap-8 text-muted-foreground font-body text-sm">
              <p><b>Arrows:</b> Move Spirit</p>
              <p><b>SPACE:</b> Switch Spirit</p>
              <p><b>Goal:</b> Both spirits to their exits</p>
            </div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
