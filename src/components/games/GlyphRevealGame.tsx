import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { GameOverlay } from './GameOverlay';
import { hieroglyphDatabase } from '@/data/hieroglyphDatabase';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext';
import imhotepBg from '@/assets/games/imhotep_vizier_bg.png';
import sinuheBg from '@/assets/games/sinuhe_figure_bg.png';
import ramsesBg from '@/assets/games/ramses_ii_bg.png';
import djoserBg from '@/assets/games/djoser_real_bg.png';
import khufuBg from '@/assets/games/khufu_real_bg.png';
import hatshepsutBg from '@/assets/games/hatshepsut_real_bg.png';
import akhenatenBg from '@/assets/games/akhenaten_real_bg.png';

interface GlyphRevealGameProps {
  onBack: () => void;
}

const LEVELS = [
  { name: "King Djoser", rows: 4, cols: 6, pairs: 12, bgImage: djoserBg, difficulty: 'Very Easy', description: "The 3rd Dynasty king who commissioned the Step Pyramid at Saqqara, the first monumental stone building in history." },
  { name: "Pharaoh Khufu", rows: 5, cols: 6, pairs: 15, bgImage: khufuBg, difficulty: 'Very Easy', description: "The 4th Dynasty ruler who commissioned the Great Pyramid of Giza. Ironically, the only surviving complete portrait of him is a tiny 3-inch ivory statuette." },
  { name: "Queen Hatshepsut", rows: 6, cols: 7, pairs: 21, bgImage: hatshepsutBg, difficulty: 'Easy', description: "One of the most successful female pharaohs, who ruled during the 18th Dynasty and built the magnificent temple at Deir el-Bahari." },
  { name: "Vizier Imhotep", rows: 6, cols: 8, pairs: 24, bgImage: imhotepBg, difficulty: 'Easy', description: "The brilliant vizier and architect who designed Djoser's Step Pyramid and was later deified as a god of medicine and healing." },
  { name: "Pharaoh Akhenaten", rows: 8, cols: 8, pairs: 32, bgImage: akhenatenBg, difficulty: 'Medium', description: "The 'heretic king' who abandoned traditional polytheism in favor of worshipping the Aten (the sun disc) and moved the capital to Amarna." },
  { name: "Sinuhe the Wanderer", rows: 8, cols: 9, pairs: 36, bgImage: sinuheBg, difficulty: 'Medium', description: "The protagonist of 'The Story of Sinuhe,' considered the masterpiece of ancient Egyptian literature, following an official who fled into exile and eventually returned." },
  { name: "Ramses II the Great", rows: 10, cols: 9, pairs: 45, bgImage: ramsesBg, difficulty: 'Hard', description: "The legendary 19th Dynasty pharaoh known for his extensive building programs (like Abu Simbel) and his military campaigns." },
];

export function GlyphRevealGame({ onBack }: GlyphRevealGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelSummary' | 'levelUp' | 'victory'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [grid, setGrid] = useState<(string | null)[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [clearedPairs, setClearedPairs] = useState(0);
  const [hintPath, setHintPath] = useState<number[] | null>(null);

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { incrementPuzzlesSolved, recordPlayTime } = useGame();

  const level = LEVELS[currentLevelIdx];

  const initLevel = useCallback((levelIdx: number) => {
    const currentLevel = LEVELS[levelIdx];
    
    // Pick random unique symbols from database
    const shuffledSymbols = [...hieroglyphDatabase].sort(() => Math.random() - 0.5).slice(0, currentLevel.pairs);
    
    // Duplicate to make pairs
    let pairs = [...shuffledSymbols, ...shuffledSymbols].map(entry => entry.symbol);
    
    // Shuffle the board to ensure random placement
    pairs.sort(() => Math.random() - 0.5);
    
    setGrid(pairs);
    setSelectedIdx(null);
    setClearedPairs(0);
    setHintPath(null);
    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  const isValidMatch = useCallback((idx1: number, idx2: number, currentGrid: (string | null)[]) => {
    if (idx1 === idx2 || currentGrid[idx1] === null || currentGrid[idx2] === null) return false;
    if (currentGrid[idx1] !== currentGrid[idx2]) return false;
    
    const cols = level.cols;
    const minIdx = Math.min(idx1, idx2);
    const maxIdx = Math.max(idx1, idx2);
    
    const r1 = Math.floor(idx1 / cols);
    const c1 = idx1 % cols;
    const r2 = Math.floor(idx2 / cols);
    const c2 = idx2 % cols;
    
    // 1. Linear Adjacency (Wrap-around / Horizontal ignoring empty)
    let isLinearAdjacent = true;
    for (let i = minIdx + 1; i < maxIdx; i++) {
      if (currentGrid[i] !== null) {
        isLinearAdjacent = false;
        break;
      }
    }
    if (isLinearAdjacent) return true;
    
    // 2. Vertical Adjacency
    if (c1 === c2) {
      let isVerticalAdjacent = true;
      const minR = Math.min(r1, r2);
      const maxR = Math.max(r1, r2);
      for (let r = minR + 1; r < maxR; r++) {
        if (currentGrid[r * cols + c1] !== null) {
          isVerticalAdjacent = false;
          break;
        }
      }
      if (isVerticalAdjacent) return true;
    }
    
    // 3. Diagonal Adjacency
    if (Math.abs(r1 - r2) === Math.abs(c1 - c2)) {
      let isDiagonalAdjacent = true;
      const minR = Math.min(r1, r2);
      const maxR = Math.max(r1, r2);
      const startC = minR === r1 ? c1 : c2;
      const endC = minR === r1 ? c2 : c1;
      const cStep = startC < endC ? 1 : -1;
      
      let c = startC + cStep;
      for (let r = minR + 1; r < maxR; r++) {
        if (currentGrid[r * cols + c] !== null) {
          isDiagonalAdjacent = false;
          break;
        }
        c += cStep;
      }
      if (isDiagonalAdjacent) return true;
    }
    
    return false;
  }, [level.cols]);

  const findHint = useCallback((currentGrid: (string | null)[]) => {
    for (let i = 0; i < currentGrid.length; i++) {
      if (currentGrid[i] !== null) {
        for (let j = i + 1; j < currentGrid.length; j++) {
          if (currentGrid[j] !== null && currentGrid[i] === currentGrid[j]) {
            if (isValidMatch(i, j, currentGrid)) {
              return [i, j];
            }
          }
        }
      }
    }
    return null;
  }, [isValidMatch]);

  const handleCellClick = (idx: number) => {
    if (grid[idx] === null) return;
    setHintPath(null); // Clear hint on interaction

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      playSound('click');
    } else {
      if (selectedIdx === idx) {
        // Deselect
        setSelectedIdx(null);
        playSound('click');
        return;
      }

      if (isValidMatch(selectedIdx, idx, grid)) {
        // Match found!
        const newGrid = [...grid];
        newGrid[selectedIdx] = null;
        newGrid[idx] = null;
        setGrid(newGrid);
        setSelectedIdx(null);
        playSound('correct');
        setScore(s => s + 100);
        
        const newCleared = clearedPairs + 1;
        setClearedPairs(newCleared);

        if (newCleared >= level.pairs) {
          handleLevelComplete();
        }
      } else {
        // Invalid match
        playSound('wrong');
        setSelectedIdx(idx); // Switch selection to new cell
      }
    }
  };

  const handleLevelComplete = () => {
    playSound('victory');
    setGameState('levelSummary');
    incrementPuzzlesSolved();
    recordPlayTime(4); // Rough estimate per level
  };

  const handleLevelSummaryNext = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setGameState('levelUp');
    } else {
      setGameState('victory');
    }
  };

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

  // Check if board is deadlocked
  useEffect(() => {
    if (gameState === 'playing' && clearedPairs < level.pairs && grid.length > 0) {
      const possibleMatch = findHint(grid);
      if (!possibleMatch) {
        let hasMatch = false;
        let attempts = 0;
        let candidateGrid = [...grid];

        // Try shuffling until we get a valid match
        while (!hasMatch && attempts < 100) {
          const remainingSymbols = candidateGrid.filter(s => s !== null);
          remainingSymbols.sort(() => Math.random() - 0.5);
          
          candidateGrid = grid.map(cell => cell !== null ? remainingSymbols.pop()! : null);
          
          if (findHint(candidateGrid)) {
            hasMatch = true;
          }
          attempts++;
        }

        if (hasMatch) {
          setGrid(candidateGrid);
          playSound('click');
        } else {
          // Force a match if random shuffling failed
          const fallbackGrid = [...candidateGrid];
          const remainingPositions = [];
          for (let i = 0; i < fallbackGrid.length; i++) {
            if (fallbackGrid[i] !== null) remainingPositions.push(i);
          }
          
          if (remainingPositions.length >= 2) {
            const firstPos = remainingPositions[0];
            const sym = fallbackGrid[firstPos];
            let matchPos = -1;
            for (let i = 1; i < remainingPositions.length; i++) {
              if (fallbackGrid[remainingPositions[i]] === sym) {
                matchPos = remainingPositions[i];
                break;
              }
            }
            if (matchPos !== -1) {
              const secondPos = remainingPositions[1];
              const temp = fallbackGrid[secondPos];
              fallbackGrid[secondPos] = fallbackGrid[matchPos];
              fallbackGrid[matchPos] = temp;
              
              setGrid(fallbackGrid);
              playSound('click');
            }
          }
        }
      }
    }
  }, [grid, gameState, clearedPairs, level.pairs, findHint, playSound]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <EgyptianButton
            variant="nav"
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="-ml-4 sm:ml-0"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Games
          </EgyptianButton>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none px-3 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center justify-center gap-2">
              <ImageIcon className="text-primary w-4 h-4 shrink-0" />
              <span className="text-xs sm:text-sm font-display text-gold whitespace-nowrap">LEVEL {currentLevelIdx + 1}/{LEVELS.length}</span>
            </div>
            <div className="flex-1 sm:flex-none px-3 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center justify-center gap-2">
              <Trophy className="text-primary w-4 h-4 shrink-0" />
              <span className="text-xs sm:text-sm font-display text-gold whitespace-nowrap">SCORE: {score}</span>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20">
          <div className="p-3 sm:p-4 border-b border-gold/10 bg-gold/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto flex-1">
              <h3 className="font-display text-gold uppercase tracking-widest text-sm sm:text-base whitespace-nowrap truncate">{level.name}</h3>
              <div className="flex-1 h-2 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden min-w-[60px] max-w-[200px]">
                <motion.div 
                  className="h-full bg-primary shadow-gold-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${(clearedPairs / level.pairs) * 100}%` }}
                />
              </div>
            </div>
            <EgyptianButton 
              variant="ghost" 
              size="sm" 
              className="w-full sm:w-auto"
              onClick={() => {
                const hint = findHint(grid);
                if (hint) {
                  setHintPath(hint);
                  setScore(s => Math.max(0, s - 20)); // Penalty for hint
                }
              }}
            >
              Hint (-20)
            </EgyptianButton>
          </div>

          <div className="relative w-full min-h-[65vh] sm:min-h-[600px] lg:min-h-[700px] bg-obsidian flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image Reveal */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{ backgroundImage: `url(${level.bgImage})` }}
            />
            {/* Dark overlay that fades out as you clear pairs */}
            <div 
              className="absolute inset-0 bg-obsidian transition-opacity duration-500 pointer-events-none"
              style={{ opacity: 1 - (clearedPairs / level.pairs) }}
            />

            {gameState === 'playing' && (
              <div 
                className="relative z-10 w-full h-full p-2 sm:p-4 md:p-8 flex items-center justify-center overflow-y-auto"
              >
                <div 
                  className="grid gap-1 sm:gap-1.5 md:gap-2 my-auto"
                  style={{ 
                    gridTemplateColumns: `repeat(${level.cols}, minmax(0, 1fr))`,
                    width: '100%',
                    maxWidth: `${level.cols * 60}px` 
                  }}
                >
                  <AnimatePresence>
                    {grid.map((symbol, idx) => (
                      <div key={`cell-wrap-${idx}`} className="aspect-square">
                        {symbol !== null && (
                          <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCellClick(idx)}
                            className={cn(
                              "w-full h-full flex items-center justify-center rounded border transition-colors duration-200 aspect-square",
                              level.cols > 7 ? "text-base sm:text-lg md:text-xl lg:text-2xl" : "text-lg sm:text-xl md:text-3xl lg:text-4xl",
                              "bg-obsidian border-gold/30 text-gold shadow-md hover:bg-gold/10",
                              selectedIdx === idx && "bg-primary/30 border-primary text-primary shadow-gold-glow",
                              hintPath?.includes(idx) && "bg-turquoise/30 border-turquoise text-turquoise animate-pulse"
                            )}
                          >
                            {symbol}
                          </motion.button>
                        )}
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <AnimatePresence>
              {gameState === 'intro' && (
                <div className="absolute inset-0 z-20 bg-obsidian/90 backdrop-blur-sm">
                  <GameOverlay
                    type="intro"
                    title="Hidden Pharaoh"
                    description="Clear the matching sacred hieroglyphs to reveal the ancient image hidden beneath. Symbols can be matched if they are identical and connect horizontally, vertically, diagonally, or wrap around the lines with no other symbols blocking the path."
                    onAction={() => initLevel(0)}
                    onSecondaryAction={onBack}
                  />
                </div>
              )}

              {gameState === 'levelSummary' && (
                <div className="absolute inset-0 z-20 flex items-end justify-center p-6 bg-gradient-to-t from-obsidian/90 via-obsidian/40 to-transparent">
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl bg-obsidian/90 backdrop-blur-md border border-gold/30 rounded-xl p-6 shadow-2xl"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-primary font-display text-sm tracking-widest uppercase mb-1">Authentic Artifact</h4>
                        <h2 className="text-3xl font-display text-gold mb-3">{level.name}</h2>
                        <p className="text-muted-foreground font-body leading-relaxed mb-6">
                          {level.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-white/10 pt-4">
                      <EgyptianButton onClick={handleLevelSummaryNext} variant="default">
                         {currentLevelIdx < LEVELS.length - 1 ? 'Continue to Next Level' : 'Complete Journey'} <ArrowLeft size={16} className="ml-2 rotate-180" />
                      </EgyptianButton>
                    </div>
                  </motion.div>
                </div>
              )}

              {gameState === 'levelUp' && (
                <div className="absolute inset-0 z-20 bg-obsidian/90 backdrop-blur-sm">
                  <GameOverlay
                    type="levelup"
                    title="Image Revealed!"
                    description={`You have fully uncovered the ${level.name}. The spirits are pleased.`}
                    stats={[
                      { label: 'Level Score', value: score },
                      { label: 'Matches', value: level.pairs }
                    ]}
                    actionLabel="Next Level"
                    onAction={handleNextLevel}
                    onSecondaryAction={onBack}
                  />
                </div>
              )}

              {gameState === 'victory' && (
                <div className="absolute inset-0 z-20 bg-obsidian/90 backdrop-blur-sm">
                  <GameOverlay
                    type="victory"
                    title="Master Revealer"
                    description="You have uncovered all the hidden images of the ancients. Your eyes are as sharp as the falcon of Horus!"
                    score={score}
                    stars={5}
                    stats={[
                      { label: 'Final Score', value: score },
                      { label: 'Images Revealed', value: LEVELS.length }
                    ]}
                    actionLabel="Play Again"
                    onAction={resetGame}
                    onSecondaryAction={onBack}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-black/60 border-t border-gold/20 flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">1. Select Symbol</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">2. Match Identical Symbol</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-turquoise" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Auto-shuffles if stuck</span>
            </div>
          </div>
        </EgyptianCard>
      </div>
    </div>
  );
}
