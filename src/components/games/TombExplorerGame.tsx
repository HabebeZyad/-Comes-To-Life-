import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Compass, Timer, Map as MapIcon, Key, Gem, Skull, Shield, ChevronRight } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface TombExplorerGameProps {
  onBack: () => void;
}

type TileType = 'hidden' | 'empty' | 'wall' | 'trap' | 'artifact' | 'key' | 'exit';

interface Tile {
  type: TileType;
  isRevealed: boolean;
  content?: string;
}

interface Level {
  name: string;
  size: number;
  trapCount: number;
  artifactCount: number;
  timeLimit: number;
}

const LEVELS: Level[] = [
  { name: "The Sunken Antechamber", size: 5, trapCount: 2, artifactCount: 3, timeLimit: 40 },
  { name: "Hall of Whispers", size: 6, trapCount: 4, artifactCount: 4, timeLimit: 60 },
  { name: "The Gilded Labyrinth", size: 7, trapCount: 6, artifactCount: 5, timeLimit: 80 },
  { name: "Sanctuary of Thoth", size: 8, trapCount: 8, artifactCount: 6, timeLimit: 100 },
];

export function TombExplorerGame({ onBack }: TombExplorerGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [hasKey, setHasKey] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [artifactsFound, setArtifactsFound] = useState(0);
  const [moves, setMoves] = useState(0);

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentLevel = LEVELS[currentLevelIdx];

  const initLevel = useCallback((levelIdx: number) => {
    const level = LEVELS[levelIdx];
    const size = level.size;

    // Create empty grid
    const newGrid: Tile[][] = Array(size).fill(null).map(() =>
      Array(size).fill(null).map(() => ({ type: 'empty', isRevealed: false }))
    );

    // Place Exit (always far from start)
    const exitX = size - 1;
    const exitY = size - 1;
    newGrid[exitY][exitX].type = 'exit';

    // Place Key
    let keyPlaced = false;
    while (!keyPlaced) {
      const rx = Math.floor(Math.random() * size);
      const ry = Math.floor(Math.random() * size);
      if (newGrid[ry][rx].type === 'empty' && (rx !== 0 || ry !== 0)) {
        newGrid[ry][rx].type = 'key';
        keyPlaced = true;
      }
    }

    // Place Traps
    let trapsPlaced = 0;
    while (trapsPlaced < level.trapCount) {
      const rx = Math.floor(Math.random() * size);
      const ry = Math.floor(Math.random() * size);
      if (newGrid[ry][rx].type === 'empty' && (rx !== 0 || ry !== 0)) {
        newGrid[ry][rx].type = 'trap';
        trapsPlaced++;
      }
    }

    // Place Artifacts
    let artifactsPlaced = 0;
    while (artifactsPlaced < level.artifactCount) {
      const rx = Math.floor(Math.random() * size);
      const ry = Math.floor(Math.random() * size);
      if (newGrid[ry][rx].type === 'empty' && (rx !== 0 || ry !== 0)) {
        newGrid[ry][rx].type = 'artifact';
        artifactsPlaced++;
      }
    }

    // Start position revealed
    newGrid[0][0].isRevealed = true;

    setGrid(newGrid);
    setPlayerPos({ x: 0, y: 0 });
    setHasKey(false);
    setArtifactsFound(0);
    setMoves(0);
    setTimeLeft(level.timeLimit);
    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (timeLeft <= 5) playSound('tick');
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('defeat');
      playSound('defeat');
      stopAmbientMusic();
    }
  }, [timeLeft, gameState, playSound, stopAmbientMusic]);

  const handleLevelComplete = useCallback(() => {
    const timeBonus = timeLeft * 10;
    const levelScore = 500 + timeBonus + (artifactsFound * 200);
    setScore(s => s + levelScore);
    playSound('victory');

    if (currentLevelIdx < LEVELS.length - 1) {
      setGameState('levelUp');
    } else {
      setGameState('victory');
      addScore({
        playerName: 'Master Explorer',
        score: score + levelScore,
        game: 'tomb-explorer',
        details: 'Uncovered all hidden tombs'
      });
    }
  }, [timeLeft, artifactsFound, currentLevelIdx, score, playSound, addScore]);

  const handleMove = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX < 0 || newX >= currentLevel.size || newY < 0 || newY >= currentLevel.size) return;

    const targetTile = grid[newY][newX];
    const newGrid = [...grid.map(row => [...row])];
    newGrid[newY][newX].isRevealed = true;

    setPlayerPos({ x: newX, y: newY });
    setGrid(newGrid);
    setMoves(m => m + 1);
    playSound('move');

    if (targetTile.type === 'trap') {
      setGameState('defeat');
      playSound('defeat');
      stopAmbientMusic();
    } else if (targetTile.type === 'key') {
      setHasKey(true);
      playSound('correct');
      newGrid[newY][newX].type = 'empty'; // Remove key from grid
    } else if (targetTile.type === 'artifact') {
      setArtifactsFound(a => a + 1);
      setScore(s => s + 200);
      playSound('match');
      newGrid[newY][newX].type = 'empty'; // Remove artifact
    } else if (targetTile.type === 'exit') {
      if (hasKey) {
        handleLevelComplete();
      }
    }
  }, [gameState, playerPos, grid, currentLevel.size, hasKey, handleLevelComplete, playSound, stopAmbientMusic]);

  const handleNextLevel = () => {
    const nextIdx = currentLevelIdx + 1;
    setCurrentLevelIdx(nextIdx);
    initLevel(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevelIdx(0);
    initLevel(0);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      switch (e.key) {
        case 'ArrowUp': case 'w': handleMove(0, -1); break;
        case 'ArrowDown': case 's': handleMove(0, 1); break;
        case 'ArrowLeft': case 'a': handleMove(-1, 0); break;
        case 'ArrowRight': case 'd': handleMove(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, playerPos, grid, hasKey, handleMove]);

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
              <span className="text-sm font-display text-gold">CHAMBER {currentLevelIdx + 1}/4</span>
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
                <MapIcon className="text-primary" size={20} />
                <span className="font-display text-gold uppercase text-xs tracking-widest">Region: {currentLevel.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${hasKey ? 'bg-primary/20 border-primary shadow-gold-glow' : 'bg-black/40 border-gold/10 opacity-30'}`}>
                  <Key size={16} className={hasKey ? "text-primary" : "text-muted-foreground"} />
                  <span className="text-[10px] font-bold text-gold uppercase">{hasKey ? 'Key Found' : 'Key Missing'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg border bg-turquoise/10 border-turquoise/20">
                  <Gem size={16} className="text-turquoise" />
                  <span className="text-[10px] font-bold text-turquoise uppercase">{artifactsFound}/{currentLevel.artifactCount} Found</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${timeLeft < 10 ? 'bg-terracotta/20 border-terracotta animate-pulse' : 'bg-obsidian/40 border-gold/20'}`}>
                <Timer size={18} className={timeLeft < 10 ? 'text-terracotta' : 'text-primary'} />
                <span className={`font-display text-xl ${timeLeft < 10 ? 'text-terracotta' : 'text-gold'}`}>{timeLeft}s</span>
              </div>
            </div>
          </div>

          <div className="relative p-8 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] flex items-center justify-center min-h-[500px]">
            {gameState === 'playing' && (
              <div
                className="grid gap-2 p-4 bg-obsidian/80 rounded-xl border-4 border-gold/30 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                style={{
                  gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)`,
                  width: 'fit-content'
                }}
              >
                {grid.map((row, y) => row.map((tile, x) => (
                  <motion.div
                    key={`${x}-${y}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                      !tile.isRevealed
                        ? 'bg-gradient-to-br from-gold-dark/20 to-obsidian border border-gold/10'
                        : tile.type === 'trap' ? 'bg-terracotta/20 border-terracotta/50 shadow-inner'
                        : 'bg-obsidian border border-gold/5'
                    }`}
                  >
                    {!tile.isRevealed ? (
                      <div className="text-gold/10 font-display text-xl select-none">𓊖</div>
                    ) : (
                      <>
                        {tile.type === 'empty' && <div className="w-1 h-1 bg-gold/10 rounded-full" />}
                        {tile.type === 'trap' && <Skull className="text-terracotta w-8 h-8 opacity-60" />}
                        {tile.type === 'key' && <Key className="text-primary w-8 h-8 animate-pulse shadow-gold-glow" />}
                        {tile.type === 'artifact' && <Gem className="text-turquoise w-8 h-8 animate-bounce" />}
                        {tile.type === 'exit' && (
                          <div className={`w-full h-full flex items-center justify-center border-2 border-dashed ${hasKey ? 'border-primary bg-primary/10' : 'border-gold/20'}`}>
                            <div className="text-xs font-display text-center leading-none opacity-40">EXIT</div>
                          </div>
                        )}
                      </>
                    )}

                    {playerPos.x === x && playerPos.y === y && (
                      <motion.div
                        layoutId="player"
                        className="absolute inset-0 z-10 flex items-center justify-center"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full border-2 border-white shadow-gold-glow flex items-center justify-center">
                          <span className="text-2xl">🤠</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )))}
              </div>
            )}

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Tomb Explorer"
                  description="Ancient tombs are filled with both treasures and treachery. Navigate the dark chambers, recover the golden key, and escape before the sands of time run out. Watch your step—one false move could lead to a deadly trap."
                  onAction={() => initLevel(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Chamber Cleared!"
                  description={`You have successfully navigated ${currentLevel.name}. The path deeper into the necropolis beckons.`}
                  stats={[
                    { label: 'Time Bonus', value: `+${timeLeft * 10}` },
                    { label: 'Artifacts', value: artifactsFound },
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
                  title="Master of Tombs"
                  description="You have conquered the deepest sanctuaries of the pharaohs. Your name shall be recorded among the greatest explorers of history."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Chambers Explored', value: '4/4' },
                    { label: 'Rank', value: 'Royal Archeologist' }
                  ]}
                  actionLabel="Explore Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="The Tomb's Curse"
                  description={timeLeft === 0 ? "The chamber has sealed shut. You are trapped in darkness forever." : "A hidden trap has ended your journey. The secrets of the tomb remain buried."}
                  score={score}
                  stats={[
                    { label: 'Chamber', value: currentLevel.name },
                    { label: 'Moves Made', value: moves }
                  ]}
                  actionLabel="Retry Chamber"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-black/60 border-t border-gold/20 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Key size={16} className="text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Find the Key</span>
            </div>
            <div className="flex items-center gap-2">
              <Skull size={16} className="text-terracotta" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Avoid Traps</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronRight size={16} className="text-turquoise" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Reach the Exit</span>
            </div>
          </div>
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Shield size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm uppercase tracking-widest">Caution</h4>
              <p className="text-xs text-muted-foreground mt-1">Movement uncovers tiles. Be careful not to step blindly into a trap.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Gem size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm uppercase tracking-widest">Treasure</h4>
              <p className="text-xs text-muted-foreground mt-1">Collecting artifacts significantly boosts your score but may lead you off course.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><MapIcon size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm uppercase tracking-widest">Pathfinding</h4>
              <p className="text-xs text-muted-foreground mt-1">The exit is always located at the far end of the chamber. You must have the key to pass.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
