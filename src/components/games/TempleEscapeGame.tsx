import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, AlertTriangle, Key, Flame, Shield, ArrowRight, Compass, Heart } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { useMobile } from '@/hooks/use-mobile';
import { GameOverlay } from './GameOverlay';

interface TempleEscapeGameProps {
  onBack: () => void;
}

// Tile Map Definitions
const T_EMPTY = 0;
const T_WALL = 1;
const T_EXIT = 2;
const T_DOOR = 3;
const T_KEY = 4;
const T_DARK = 5;
const T_TORCH = 6;
const T_PIT = 7;
const T_ROPE = 8;
const T_SPIKES = 9;
const T_SHIELD = 10;

const TILE_SIZE = 40;
const GRID_WIDTH = 12;
const GRID_HEIGHT = 10;

interface Level {
  name: string;
  timeLimit: number;
  grid: number[][];
  start: { x: number; y: number };
}

const LEVELS: Level[] = [
  {
    name: "The Crypt Entrance",
    timeLimit: 45,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 3, 0, 0, 0, 0, 0, 0, 4, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x: 10, y: 8 }
  },
  {
    name: "The Dark Corridors",
    timeLimit: 50,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 5, 0, 0, 0, 0, 5, 0, 0, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 6, 0, 0, 0, 5, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 5, 0, 0, 0, 6, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x: 2, y: 7 }
  },
  {
    name: "The Chasm of Souls",
    timeLimit: 55,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 7, 0, 0, 0, 0, 0, 0, 0, 8, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 8, 0, 0, 0, 7, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 7, 0, 0, 8, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x: 2, y: 7 }
  },
  {
    name: "The Guardian's Spikes",
    timeLimit: 60,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 9, 0, 0, 0, 0, 9, 0, 0, 10, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 10, 0, 0, 9, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 9, 0, 0, 0, 10, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x: 2, y: 7 }
  },
  {
    name: "The Divine Escape",
    timeLimit: 90,
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 2, 3, 0, 5, 0, 7, 0, 9, 0, 10, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    start: { x: 2, y: 7 }
  }
];

const CHARACTERS = [
  { id: 'ramesses', name: 'Ramesses II', role: 'Warrior', tool: 'shield', icon: '𓀠', color: 'bg-terracotta', desc: 'Starts with a Shield. Can survive one spike trap without damage.' },
  { id: 'cleopatra', name: 'Cleopatra', role: 'Diplomat', tool: 'torch', icon: '𓁐', color: 'bg-gold', desc: 'Starts with a Torch. Uncover the secrets of the dark mist.' },
  { id: 'tutankhamun', name: 'Tutankhamun', role: 'Pharaoh', tool: 'key', icon: '𓀭', color: 'bg-turquoise', desc: 'Starts with a Key. Unlock ancient doors immediately.' },
  { id: 'nefertiti', name: 'Nefertiti', role: 'Queen', tool: 'rope', icon: '𓁔', color: 'bg-primary', desc: 'Starts with a Rope. Cross perilous pits effortlessly.' }
];

export function TempleEscapeGame({ onBack }: TempleEscapeGameProps) {
  const [gameState, setGameState] = useState<'charSelect' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('charSelect');
  const [selectedCharId, setSelectedCharId] = useState<string>('');

  const [currentLevel, setCurrentLevel] = useState(0);
  const [gridState, setGridState] = useState<number[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });

  const [inventory, setInventory] = useState({ keys: 0, torches: 0, ropes: 0, shields: 0 });
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [message, setMessage] = useState('');

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();
  const isMobile = useMobile();

  const level = useMemo(() => LEVELS[currentLevel], [currentLevel]);
  const activeCharacter = useMemo(() => CHARACTERS.find(c => c.id === selectedCharId) || CHARACTERS[0], [selectedCharId]);

  const initLevel = useCallback((levelIdx: number, carryOverInventory?: typeof inventory, resetScore = false) => {
    const l = LEVELS[levelIdx];
    // Create deep copy of grid
    setGridState(l.grid.map(row => [...row]));
    setPlayerPos(l.start);

    if (!carryOverInventory) {
      const startingInventory = { keys: 0, torches: 0, ropes: 0, shields: 0 };
      if (activeCharacter.tool === 'key') startingInventory.keys = 1;
      if (activeCharacter.tool === 'torch') startingInventory.torches = 1;
      if (activeCharacter.tool === 'rope') startingInventory.ropes = 1;
      if (activeCharacter.tool === 'shield') startingInventory.shields = 1;
      setInventory(startingInventory);
      setLives(3);
    } else {
      setInventory(carryOverInventory);
    }

    if (resetScore) {
      setScore(0);
      setTotalTimeSpent(0);
    }

    setTimeLeft(l.timeLimit);
    setMessage('');
    setGameState('playing');
    playSound('gameStart');
    if (levelIdx === 0) startAmbientMusic();
  }, [activeCharacter, playSound, startAmbientMusic]);

  const startGame = (charId: string) => {
    setSelectedCharId(charId);
    setCurrentLevel(0);
    // Setting state is async, so we pass activeCharacter tool manually or rely on next render.
    // Actually, it's safer to just set charId and rely on useEffect? No, just call init in useEffect.
  };

  // We handle initial level start after character selection
  useEffect(() => {
    if (gameState === 'charSelect' && selectedCharId !== '') {
      initLevel(0, null, true);
    }
  }, [gameState, selectedCharId, initLevel]);

  useEffect(() => {
    if (gameState === 'playing') {
      if (timeLeft > 0) {
        const timer = setInterval(() => {
          setTimeLeft(t => t - 1);
          setTotalTimeSpent(t => t + 1);
        }, 1000);
        return () => clearInterval(timer);
      } else {
        setGameState('defeat');
        playSound('defeat');
        stopAmbientMusic();
      }
    }
  }, [gameState, timeLeft, playSound, stopAmbientMusic]);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) return;

    const targetTile = gridState[newY][newX];
    const updateTile = (t: number) => {
      const newGrid = [...gridState];
      newGrid[newY] = [...newGrid[newY]];
      newGrid[newY][newX] = t;
      setGridState(newGrid);
    };

    if (targetTile === T_WALL) {
      playSound('wrong');
      return;
    }

    if (targetTile === T_DOOR) {
      if (inventory.keys > 0) {
        setInventory(prev => ({ ...prev, keys: prev.keys - 1 }));
        setScore(s => s + 50);
        updateTile(T_EMPTY);
        playSound('unlock');
      } else {
        showMessage("Locked! You need a Key.");
        playSound('wrong');
        return;
      }
    } else if (targetTile === T_DARK) {
      if (inventory.torches > 0) {
        setInventory(prev => ({ ...prev, torches: prev.torches - 1 }));
        setScore(s => s + 50);
        updateTile(T_EMPTY);
        playSound('unlock');
      } else {
        showMessage("It's too dark! You need a Torch.");
        playSound('wrong');
        return;
      }
    } else if (targetTile === T_PIT) {
      if (inventory.ropes > 0) {
        setInventory(prev => ({ ...prev, ropes: prev.ropes - 1 }));
        setScore(s => s + 50);
        updateTile(T_EMPTY);
        playSound('jump');
      } else {
        showMessage("A wide chasm blocks your path! You need a Rope.");
        playSound('wrong');
        return;
      }
    } else if (targetTile === T_SPIKES) {
      if (inventory.shields > 0) {
        setInventory(prev => ({ ...prev, shields: prev.shields - 1 }));
        setScore(s => s + 50);
        updateTile(T_EMPTY);
        playSound('unlock');
        showMessage("Shield protected you from the spikes!");
      } else {
        setLives(l => l - 1);
        playSound('wrong');
        if (lives <= 1) {
          setGameState('defeat');
          playSound('defeat');
          stopAmbientMusic();
          return;
        } else {
          showMessage("Ouch! Spikes hurt you.");
          updateTile(T_EMPTY);
        }
      }
    }

    // Process Pickups
    if (targetTile === T_KEY) {
      setInventory(prev => ({ ...prev, keys: prev.keys + 1 }));
      setScore(s => s + 10);
      updateTile(T_EMPTY);
      playSound('pickup');
      showMessage("Picked up a Key!");
    } else if (targetTile === T_TORCH) {
      setInventory(prev => ({ ...prev, torches: prev.torches + 1 }));
      setScore(s => s + 10);
      updateTile(T_EMPTY);
      playSound('pickup');
      showMessage("Picked up a Torch!");
    } else if (targetTile === T_ROPE) {
      setInventory(prev => ({ ...prev, ropes: prev.ropes + 1 }));
      setScore(s => s + 10);
      updateTile(T_EMPTY);
      playSound('pickup');
      showMessage("Picked up a Rope!");
    } else if (targetTile === T_SHIELD) {
      setInventory(prev => ({ ...prev, shields: prev.shields + 1 }));
      setScore(s => s + 10);
      updateTile(T_EMPTY);
      playSound('pickup');
      showMessage("Picked up a Shield!");
    }

    // Exit Reached
    if (targetTile === T_EXIT) {
      const levelScore = Math.max(0, timeLeft * 10);
      setScore(s => s + levelScore + 100);
      playSound('victory');
      if (currentLevel < LEVELS.length - 1) {
        setGameState('levelUp');
      } else {
        setGameState('victory');
        addScore({
          playerName: activeCharacter.name,
          score: score + levelScore + 100 + (lives * 500),
          game: 'temple-escape',
          details: `Escaped the Temple - ${totalTimeSpent}s total`
        });
      }
      return; // Delay position update slightly so player doesn't clip
    }

    setPlayerPos({ x: newX, y: newY });
    playSound('move');
  }, [gameState, playerPos, gridState, inventory, lives, timeLeft, currentLevel, score, activeCharacter.name, totalTimeSpent, addScore, playSound, stopAmbientMusic]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowUp' || e.key === 'w') movePlayer(0, -1);
      if (e.key === 'ArrowDown' || e.key === 's') movePlayer(0, 1);
      if (e.key === 'ArrowLeft' || e.key === 'a') movePlayer(-1, 0);
      if (e.key === 'ArrowRight' || e.key === 'd') movePlayer(1, 0);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, gameState]);

  const handleNextLevel = () => {
    const nextIdx = currentLevel + 1;
    setCurrentLevel(nextIdx);
    initLevel(nextIdx, inventory, false);
  };

  const restartGame = () => {
    setSelectedCharId('');
    setGameState('charSelect');
  };

  // Render Character Selection
  if (gameState === 'charSelect') {
    return (
      <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 hieroglyph-pattern pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <EgyptianButton variant="nav" onClick={onBack} className="-ml-4 mb-8">
            <ArrowLeft size={20} className="mr-2" /> Back to Games
          </EgyptianButton>

          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-display text-gold-gradient mb-4">Temple Escape</h1>
            <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
              Choose your historical champion. Each begins their escape with a unique tool to circumvent the temple's deadly traps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHARACTERS.map(char => (
              <EgyptianCard key={char.id} variant="interactive" padding="lg" className="border border-gold/20 hover:border-primary/50 group cursor-pointer" onClick={() => startGame(char.id)}>
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-gold-glow ${char.color} border-2 border-gold-light group-hover:scale-110 transition-transform`}>
                    {char.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-display text-gold-light mb-1">{char.name}</h3>
                    <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-2 py-1 rounded inline-block mb-3">{char.role}</span>
                    <p className="text-sm text-foreground leading-relaxed">{char.desc}</p>
                  </div>
                </div>
              </EgyptianCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <EgyptianButton variant="nav" onClick={() => { stopAmbientMusic(); onBack(); }} className="-ml-4">
            <ArrowLeft size={20} className="mr-2" /> Back
          </EgyptianButton>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Compass className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">CHAMBER {currentLevel + 1}/5</span>
            </div>
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Trophy className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">SCORE: {score}</span>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20 flex flex-col md:flex-row">

          {/* Main Game Area */}
          <div className="flex-1 bg-obsidian flex flex-col min-h-[500px]">
            {/* Header HUD */}
            <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${timeLeft < 10 ? 'bg-terracotta/20 border-terracotta animate-pulse' : 'bg-obsidian/40 border-gold/20'}`}>
                  <Timer size={18} className={timeLeft < 10 ? 'text-terracotta' : 'text-primary'} />
                  <span className={`font-display text-xl ${timeLeft < 10 ? 'text-terracotta' : 'text-gold'}`}>{timeLeft}s</span>
                </div>
                <h2 className="text-xl font-display text-gold-gradient hidden sm:block">{level.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(3)].map((_, i) => (
                  <Heart key={i} size={20} className={i < lives ? "text-terracotta fill-terracotta drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" : "text-muted-foreground/30"} />
                ))}
              </div>
            </div>

            <div className="relative flex-1 flex items-center justify-center p-4 md:p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
              <div
                className="relative bg-obsidian border-4 border-gold/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] w-full max-w-[480px] mx-auto aspect-[12/10]"
              >
                {/* Grid Rendering */}
                {gridState.map((row, y) => row.map((tileIdx, x) => {
                  return (
                    <div
                      key={`${x}-${y}`}
                      className={`absolute transition-all duration-300 flex items-center justify-center ${tileIdx === T_EMPTY ? 'bg-obsidian/40 border-[0.5px] border-white/5' :
                          tileIdx === T_WALL ? 'bg-sandstone border border-obsidian/50 shadow-inner' :
                            tileIdx === T_EXIT ? 'bg-gold-light/20 border-2 border-gold shadow-[0_0_15px_#ffbf00]' :
                              tileIdx === T_DOOR ? 'bg-gold-dark/80 border-2 border-gold-light' :
                                tileIdx === T_DARK ? 'bg-black/90 backdrop-blur-xl border border-black z-10' :
                                  tileIdx === T_PIT ? 'bg-obsidian-deep/80 border border-obsidian/40 shadow-[inset_0_0_15px_rgba(0,0,0,1)]' :
                                    tileIdx === T_SPIKES ? 'bg-sandstone border border-obsidian/50' :
                                      'bg-obsidian/40' // Items background
                        }`}
                      style={{
                        left: `${(x / GRID_WIDTH) * 100}%`,
                        top: `${(y / GRID_HEIGHT) * 100}%`,
                        width: `${(1 / GRID_WIDTH) * 100}%`,
                        height: `${(1 / GRID_HEIGHT) * 100}%`
                      }}
                    >
                      {tileIdx === T_EXIT && <Compass className="w-4 h-4 sm:w-6 sm:h-6 text-gold animate-pulse" />}
                      {tileIdx === T_DOOR && <Key className="w-3 h-3 sm:w-5 sm:h-5 text-obsidian" />}
                      {tileIdx === T_DARK && <span className="text-white/20 text-[8px] sm:text-xs text-center leading-tight">Dark<br className="hidden sm:block" />Mist</span>}
                      {tileIdx === T_PIT && <span className="text-white/10 text-[8px] sm:text-[10px]">Chasm</span>}
                      {tileIdx === T_SPIKES && <div className="text-terracotta opacity-80 grid grid-cols-2 gap-1 p-1"><AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3" /><AlertTriangle className="w-2 h-2 sm:w-3 sm:h-3" /></div>}

                      {/* Pickups */}
                      {tileIdx === T_KEY && <Key className="w-3 h-3 sm:w-5 sm:h-5 text-gold animate-bounce-slow" />}
                      {tileIdx === T_TORCH && <Flame className="w-3 h-3 sm:w-5 sm:h-5 text-terracotta animate-pulse" />}
                      {tileIdx === T_ROPE && <ArrowRight className="w-3 h-3 sm:w-5 sm:h-5 text-primary rotate-45" />}
                      {tileIdx === T_SHIELD && <Shield className="w-3 h-3 sm:w-5 sm:h-5 text-turquoise" />}
                    </div>
                  );
                }))}

                {/* Player Character */}
                {gameState === 'playing' && (
                  <motion.div
                    animate={{ left: `${(playerPos.x / GRID_WIDTH) * 100}%`, top: `${(playerPos.y / GRID_HEIGHT) * 100}%` }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className={`absolute z-30 flex items-center justify-center transition-all drop-shadow-lg`}
                    style={{
                      width: `${(1 / GRID_WIDTH) * 100}%`,
                      height: `${(1 / GRID_HEIGHT) * 100}%`
                    }}
                  >
                    <div className={`w-3/4 h-3/4 rounded-full flex items-center justify-center text-sm md:text-lg text-white border border-white/50 shadow-gold-glow ${activeCharacter.color}`}>
                      {activeCharacter.icon}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Message Toast */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 border border-gold/30 text-gold px-6 py-2 rounded-full font-display text-sm z-50 whitespace-nowrap"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {gameState === 'playing' && isMobile && (
              <div className="p-4 bg-gold/5 border-t border-gold/10 flex justify-center">
                <div className="grid grid-cols-3 gap-2">
                  <div />
                  <EgyptianButton size="lg" onClick={() => movePlayer(0, -1)} className="w-14 h-14 p-0">↑</EgyptianButton>
                  <div />
                  <EgyptianButton size="lg" onClick={() => movePlayer(-1, 0)} className="w-14 h-14 p-0">←</EgyptianButton>
                  <EgyptianButton size="lg" onClick={() => movePlayer(0, 1)} className="w-14 h-14 p-0">↓</EgyptianButton>
                  <EgyptianButton size="lg" onClick={() => movePlayer(1, 0)} className="w-14 h-14 p-0">→</EgyptianButton>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Inventory */}
          <div className="w-full md:w-64 bg-black/60 border-t md:border-t-0 md:border-l border-gold/20 p-4 md:p-6 flex flex-col md:flex-shrink-0 z-10 relative">
            <div className="flex md:flex-col items-center md:items-start gap-4 mb-4 md:mb-8">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border border-gold/30 ${activeCharacter.color} flex-shrink-0`}>
                {activeCharacter.icon}
              </div>
              <div>
                <h3 className="text-gold font-display leading-tight">{activeCharacter.name}</h3>
                <span className="text-xs text-muted-foreground">{activeCharacter.role}</span>
              </div>
            </div>

            <div className="flex-1">
              <h4 className="text-xs font-bold tracking-widest text-primary uppercase mb-2 md:mb-4 hidden md:block">Inventory</h4>
              <div className="grid grid-cols-4 md:grid-cols-1 gap-2 md:gap-4">
                <div className="flex flex-col md:flex-row items-center justify-between p-2 md:p-3 bg-obsidian/40 border border-gold/10 rounded-lg text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                    <Key className="text-gold w-4 h-4 md:w-5 md:h-5" /> <span className="text-[10px] md:text-sm font-body text-gray-300">Keys</span>
                  </div>
                  <span className="font-display text-sm md:text-lg text-gold">{inventory.keys}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between p-2 md:p-3 bg-obsidian/40 border border-gold/10 rounded-lg text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                    <Flame className="text-terracotta w-4 h-4 md:w-5 md:h-5" /> <span className="text-[10px] md:text-sm font-body text-gray-300">Torches</span>
                  </div>
                  <span className="font-display text-sm md:text-lg text-terracotta">{inventory.torches}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between p-2 md:p-3 bg-obsidian/40 border border-gold/10 rounded-lg text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                    <ArrowRight className="text-primary w-4 h-4 md:w-5 md:h-5 rotate-45" /> <span className="text-[10px] md:text-sm font-body text-gray-300">Ropes</span>
                  </div>
                  <span className="font-display text-sm md:text-lg text-primary">{inventory.ropes}</span>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between p-2 md:p-3 bg-obsidian/40 border border-gold/10 rounded-lg text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                    <Shield className="text-turquoise w-4 h-4 md:w-5 md:h-5" /> <span className="text-[10px] md:text-sm font-body text-gray-300">Shields</span>
                  </div>
                  <span className="font-display text-sm md:text-lg text-turquoise">{inventory.shields}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-8 hidden md:block">
              <h4 className="text-xs font-bold tracking-widest text-primary uppercase mb-2">Guide</h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Use tools to bypass traps automatically. Keys open Golden Doors. Torches clear Dark Mist. Ropes cross Chasms. Shields block Spikes.
              </p>
            </div>
          </div>
        </EgyptianCard>

        {/* Overlays */}
        <AnimatePresence>
          {gameState === 'levelUp' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <GameOverlay
                type="levelup"
                title="Chamber Cleared!"
                description={`You survived ${level.name}.`}
                stats={[
                  { label: 'Time Bonus', value: `${timeLeft}s` },
                  { label: 'Score', value: score }
                ]}
                actionLabel="Next Chamber"
                onAction={handleNextLevel}
                onSecondaryAction={restartGame}
              />
            </div>
          )}

          {gameState === 'victory' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <GameOverlay
                type="victory"
                title="Master of the Temple"
                description={`You led ${activeCharacter.name} safely out of the crumbling ruins, preserving ancient artifacts.`}
                score={score}
                stars={5}
                stats={[
                  { label: 'Total Time', value: `${totalTimeSpent}s` },
                  { label: 'Lives Remaining', value: lives }
                ]}
                actionLabel="Play Again"
                onAction={restartGame}
                onSecondaryAction={onBack}
              />
            </div>
          )}

          {gameState === 'defeat' && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <GameOverlay
                type="defeat"
                title="Entombed Forever"
                description="The traps have claimed you. Your journey ends here."
                score={score}
                stats={[
                  { label: 'Chamber', value: level.name },
                  { label: 'Score', value: score }
                ]}
                actionLabel="Retry Escape"
                onAction={restartGame}
                onSecondaryAction={onBack}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
