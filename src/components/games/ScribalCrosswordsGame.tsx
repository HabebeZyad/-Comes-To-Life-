import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Sparkles, HelpCircle, AlertCircle, RefreshCw, Key, ArrowRight, ArrowDown, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';
import { cn } from '@/lib/utils';


// Types for Arroword definitions
interface ClueDef {
  id: string;
  text: string;
  direction: 'right' | 'down';
  clueRow: number;
  clueCol: number;
  startRow: number;
  startCol: number;
  length: number;
  answer: string;
}

interface LevelDef {
  id: number;
  name: string;
  difficulty: 'Very Easy' | 'Easy' | 'Medium' | 'Hard' | 'Expert';
  gridSize: { rows: number; cols: number };
  description: string;
  clues: ClueDef[];
}

const LEVELS: LevelDef[] = [
  {
    id: 1,
    name: "Scribe Apprentice",
    difficulty: "Very Easy",
    gridSize: { rows: 5, cols: 5 },
    description: "Welcome, novice scribe. Practice your glyphs on this simple tablet. Match key symbols of divinity and rivers.",
    clues: [
      { id: 'ankh', text: 'Key of life symbol', direction: 'right', clueRow: 1, clueCol: 0, startRow: 1, startCol: 1, length: 4, answer: 'ANKH' },
      { id: 'nile', text: 'Sacred river of Egypt', direction: 'down', clueRow: 0, clueCol: 2, startRow: 1, startCol: 2, length: 4, answer: 'NILE' },
      { id: 'hapi', text: 'God of the Nile flood', direction: 'down', clueRow: 0, clueCol: 4, startRow: 1, startCol: 4, length: 4, answer: 'HAPI' },
      { id: 'giza', text: 'Great Pyramid plateau', direction: 'right', clueRow: 2, clueCol: 0, startRow: 2, startCol: 1, length: 4, answer: 'GIZA' },
      { id: 're', text: 'Sun god name variant', direction: 'right', clueRow: 4, clueCol: 0, startRow: 4, startCol: 1, length: 2, answer: 'RE' }
    ]
  },
  {
    id: 2,
    name: "Chronicles of Giza",
    difficulty: "Easy",
    gridSize: { rows: 6, cols: 7 },
    description: "Deepen your knowledge of the burial grounds. Translate terms of mummification and majestic sanctuaries.",
    clues: [
      { id: 'tomb', text: 'Royal burial chamber', direction: 'right', clueRow: 1, clueCol: 0, startRow: 1, startCol: 1, length: 4, answer: 'TOMB' },
      { id: 'mummy', text: 'Preserved royal body', direction: 'down', clueRow: 0, clueCol: 3, startRow: 1, startCol: 3, length: 5, answer: 'MUMMY' },
      { id: 'temple', text: 'Sacred place of worship', direction: 'right', clueRow: 4, clueCol: 0, startRow: 4, startCol: 1, length: 6, answer: 'TEMPLE' },
      { id: 'nile', text: 'Egypt\'s great river', direction: 'down', clueRow: 1, clueCol: 5, startRow: 2, startCol: 5, length: 4, answer: 'NILE' }
    ]
  },
  {
    id: 3,
    name: "Westcar Wisdom",
    difficulty: "Medium",
    gridSize: { rows: 7, cols: 7 },
    description: "Explore the magic of the Westcar Papyrus and the ancient spells of the high priests.",
    clues: [
      { id: 'sphinx', text: 'Lion-bodied stone guardian', direction: 'right', clueRow: 1, clueCol: 0, startRow: 1, startCol: 1, length: 6, answer: 'SPHINX' },
      { id: 'scarab', text: 'Sacred beetle amulet of rebirth', direction: 'down', clueRow: 0, clueCol: 1, startRow: 1, startCol: 1, length: 6, answer: 'SCARAB' },
      { id: 'anubis', text: 'Jackal-headed guide of souls', direction: 'right', clueRow: 3, clueCol: 0, startRow: 3, startCol: 1, length: 6, answer: 'ANUBIS' },
      { id: 'isis', text: 'Goddess of magic and motherhood', direction: 'down', clueRow: 2, clueCol: 5, startRow: 3, startCol: 5, length: 4, answer: 'ISIS' },
      { id: 'book', text: 'Sacred scroll for the dead', direction: 'right', clueRow: 6, clueCol: 0, startRow: 6, startCol: 1, length: 4, answer: 'BOOK' }
    ]
  },
  {
    id: 4,
    name: "Library of Alexandria",
    difficulty: "Hard",
    gridSize: { rows: 8, cols: 8 },
    description: "Enter the halls of immense ancient literature. Synthesize words of pharaohs, reeds, and red desert crowns.",
    clues: [
      { id: 'pharao', text: 'Divine sovereign ruler title', direction: 'right', clueRow: 1, clueCol: 0, startRow: 1, startCol: 1, length: 7, answer: 'PHARAOH' },
      { id: 'papyrus', text: 'Ancient paper-making reed plant', direction: 'down', clueRow: 0, clueCol: 1, startRow: 1, startCol: 1, length: 7, answer: 'PAPYRUS' },
      { id: 'ramses', text: 'Warrior King of 19th Dynasty (II)', direction: 'down', clueRow: 0, clueCol: 4, startRow: 1, startCol: 4, length: 6, answer: 'RAMSES' },
      { id: 'poem', text: 'Literary verse written by a scribe', direction: 'right', clueRow: 3, clueCol: 0, startRow: 3, startCol: 1, length: 4, answer: 'POEM' },
      { id: 'ruler', text: 'Sovereign of Upper and Lower lands', direction: 'right', clueRow: 5, clueCol: 0, startRow: 5, startCol: 1, length: 5, answer: 'RULER' },
      { id: 'red', text: 'Lower Egypt crown color (Deshret)', direction: 'down', clueRow: 4, clueCol: 5, startRow: 5, startCol: 5, length: 3, answer: 'RED' }
    ]
  },
  {
    id: 5,
    name: "The Book of the Dead",
    difficulty: "Expert",
    gridSize: { rows: 9, cols: 9 },
    description: "The ultimate trial. Harness the absolute secrets of the underworld and high literature. Decipher Cleopatra and royal papyri.",
    clues: [
      { id: 'cleo', text: 'Last active queen of Ptolemaic Egypt', direction: 'down', clueRow: 0, clueCol: 0, startRow: 0, startCol: 1, length: 9, answer: 'CLEOPATRA' },
      { id: 'westcar', text: 'Famous papyrus of magical tales', direction: 'right', clueRow: 1, clueCol: 0, startRow: 2, startCol: 0, length: 7, answer: 'WESTCAR' },
      { id: 'tut', text: 'Famous golden boy pharaoh (short)', direction: 'down', clueRow: 1, clueCol: 3, startRow: 2, startCol: 3, length: 3, answer: 'TUT' },
      { id: 'path', text: 'Scribe path/road of divine souls', direction: 'right', clueRow: 4, clueCol: 0, startRow: 4, startCol: 1, length: 4, answer: 'PATH' },
      { id: 'papyrus', text: 'Ancient writing scroll of reeds', direction: 'down', clueRow: 0, clueCol: 5, startRow: 1, startCol: 5, length: 7, answer: 'PAPYRUS' },
      { id: 'amulets', text: 'Protective gold/stone sacred charms', direction: 'right', clueRow: 8, clueCol: 0, startRow: 8, startCol: 1, length: 7, answer: 'AMULETS' }
    ]
  },
  {
    id: 6,
    name: "The Shipwrecked Sailor",
    difficulty: "Expert",
    gridSize: { rows: 8, cols: 8 },
    description: "Decipher the tale of the stranded mariner and the giant talking serpent on the phantom island of the double.",
    clues: [
      { id: 'serpent', text: 'Giant golden talking serpent deity of the isle', direction: 'right', clueRow: 1, clueCol: 0, startRow: 1, startCol: 1, length: 7, answer: 'SERPENT' },
      { id: 'scribe', text: 'Keeper of sacred texts and court records', direction: 'down', clueRow: 0, clueCol: 1, startRow: 1, startCol: 1, length: 6, answer: 'SCRIBE' },
      { id: 'reed', text: 'Nile marsh plant used to manufacture papyrus', direction: 'right', clueRow: 3, clueCol: 0, startRow: 3, startCol: 1, length: 4, answer: 'REED' },
      { id: 'island', text: 'Mystical phantom island of the double', direction: 'down', clueRow: 1, clueCol: 5, startRow: 2, startCol: 5, length: 6, answer: 'ISLAND' },
      { id: 'gold', text: 'Skin color of the great talkative serpent', direction: 'right', clueRow: 4, clueCol: 2, startRow: 4, startCol: 3, length: 4, answer: 'GOLD' }
    ]
  }
];

export function ScribalCrosswordsGame({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelSummary' | 'levelUp' | 'victory'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  
  // Grid state: maps 'row-col' key to currently entered letter
  const [gridValues, setGridValues] = useState<Record<string, string>>({});
  
  // Selection state
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'right' | 'down'>('right');

  const [score, setScore] = useState(0);
  const [levelScore, setLevelScore] = useState(0);
  const [revealCount, setRevealCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentLevel = LEVELS[currentLevelIdx];

  // Helper to compile grid metadata dynamically
  const gridMetadata = useMemo(() => {
    const rows = currentLevel.gridSize.rows;
    const cols = currentLevel.gridSize.cols;
    
    // Initialize 2D structure
    const meta: any[][] = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => ({
        type: 'block' as 'block' | 'clue' | 'letter',
        clueText: '',
        arrow: null as 'right' | 'down' | null,
        correctLetter: '',
        wordIds: [] as string[],
        isStart: false
      }))
    );

    // Write clues and letters
    currentLevel.clues.forEach((clue) => {
      // Set clue cell
      if (clue.clueRow >= 0 && clue.clueRow < rows && clue.clueCol >= 0 && clue.clueCol < cols) {
        meta[clue.clueRow][clue.clueCol] = {
          type: 'clue',
          clueText: clue.text,
          arrow: clue.direction,
          correctLetter: '',
          wordIds: [clue.id],
          isStart: false
        };
      }

      // Set letter cells
      for (let i = 0; i < clue.length; i++) {
        const r = clue.direction === 'right' ? clue.startRow : clue.startRow + i;
        const c = clue.direction === 'right' ? clue.startCol + i : clue.startCol;
        
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          const existing = meta[r][c];
          const newWordIds = existing.type === 'letter' ? [...existing.wordIds, clue.id] : [clue.id];
          
          meta[r][c] = {
            type: 'letter',
            clueText: '',
            arrow: null,
            correctLetter: clue.answer[i] || '',
            wordIds: newWordIds,
            isStart: i === 0 || existing.isStart
          };
        }
      }
    });

    return meta;
  }, [currentLevel]);

  // Find word details by cell coordination
  const getActiveWord = useCallback((r: number, c: number, preferredDir?: 'right' | 'down') => {
    const cell = gridMetadata[r]?.[c];
    if (!cell || cell.type !== 'letter') return null;

    // Filter clues matching wordIds
    const matchingClues = currentLevel.clues.filter(clue => cell.wordIds.includes(clue.id));
    if (matchingClues.length === 0) return null;

    // Pick preferred direction or first matching
    const pickedClue = matchingClues.find(clue => clue.direction === preferredDir) || matchingClues[0];
    return pickedClue;
  }, [gridMetadata, currentLevel]);

  // Initialize a Level
  const initLevel = useCallback((levelIdx: number) => {
    setCurrentLevelIdx(levelIdx);
    setGridValues({});
    setSelectedCell(null);
    setSelectedWordId(null);
    setRevealCount(0);
    setStreak(0);
    setLevelScore(1000); // Level starting score base
    
    // Select first letter of first word automatically
    const firstClue = LEVELS[levelIdx].clues[0];
    setSelectedCell({ r: firstClue.startRow, c: firstClue.startCol });
    setSelectedWordId(firstClue.id);
    setSelectedDirection(firstClue.direction);

    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Handle cell click
  const handleCellClick = (r: number, c: number) => {
    const cell = gridMetadata[r]?.[c];
    if (!cell) return;

    if (cell.type === 'clue') {
      // Find the word this clue points to
      const targetClue = currentLevel.clues.find(clue => clue.clueRow === r && clue.clueCol === c);
      if (targetClue) {
        setSelectedCell({ r: targetClue.startRow, c: targetClue.startCol });
        setSelectedWordId(targetClue.id);
        setSelectedDirection(targetClue.direction);
        playSound('click');
      }
    } else if (cell.type === 'letter') {
      // Toggle direction if clicking current selected cell
      let dir = selectedDirection;
      if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
        dir = selectedDirection === 'right' ? 'down' : 'right';
      }

      const activeWord = getActiveWord(r, c, dir);
      if (activeWord) {
        setSelectedCell({ r, c });
        setSelectedWordId(activeWord.id);
        setSelectedDirection(activeWord.direction);
        playSound('click');
      }
    }
  };

  // Keyboard navigation & typing
  const handleInputChar = useCallback((char: string) => {
    if (!selectedCell || gameState !== 'playing') return;
    const { r, c } = selectedCell;
    const cell = gridMetadata[r]?.[c];
    if (!cell || cell.type !== 'letter') return;

    const upperChar = char.toUpperCase();
    const cellKey = `${r}-${c}`;
    const isCorrect = cell.correctLetter === upperChar;

    setGridValues(prev => ({
      ...prev,
      [cellKey]: upperChar
    }));

    if (isCorrect) {
      setStreak(prev => {
        const next = prev + 1;
        if (next >= 3) {
          playSound('correct');
          setLevelScore(s => s + 50); // Gold score streak boost!
        } else {
          playSound('click');
        }
        return next;
      });
    } else {
      setStreak(0);
      playSound('wrong');
    }

    // Move to next cell in current word
    const activeWord = currentLevel.clues.find(clue => clue.id === selectedWordId);
    if (activeWord) {
      const idx = activeWord.direction === 'right' ? c - activeWord.startCol : r - activeWord.startRow;
      if (idx < activeWord.length - 1) {
        const nextR = activeWord.direction === 'right' ? r : r + 1;
        const nextC = activeWord.direction === 'right' ? c + 1 : c;
        setSelectedCell({ r: nextR, c: nextC });
      }
    }
  }, [selectedCell, selectedWordId, gridMetadata, currentLevel, gameState, playSound]);

  const handleBackspace = useCallback(() => {
    if (!selectedCell || gameState !== 'playing') return;
    const { r, c } = selectedCell;
    const cellKey = `${r}-${c}`;

    // Clear current cell first
    setGridValues(prev => {
      const next = { ...prev };
      delete next[cellKey];
      return next;
    });

    playSound('click');
    setStreak(0); // Corrections break the streak

    // Move focus back
    const activeWord = currentLevel.clues.find(clue => clue.id === selectedWordId);
    if (activeWord) {
      const idx = activeWord.direction === 'right' ? c - activeWord.startCol : r - activeWord.startRow;
      if (idx > 0) {
        const prevR = activeWord.direction === 'right' ? r : r - 1;
        const prevC = activeWord.direction === 'right' ? c - 1 : c;
        setSelectedCell({ r: prevR, c: prevC });
      }
    }
  }, [selectedCell, selectedWordId, currentLevel, gameState, playSound]);

  // Physical keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || !selectedCell) return;

      const key = e.key;

      if (/^[a-zA-Z]$/.test(key)) {
        handleInputChar(key);
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'ArrowRight') {
        const nextC = Math.min(currentLevel.gridSize.cols - 1, selectedCell.c + 1);
        if (gridMetadata[selectedCell.r][nextC].type === 'letter') {
          handleCellClick(selectedCell.r, nextC);
        }
      } else if (key === 'ArrowLeft') {
        const prevC = Math.max(0, selectedCell.c - 1);
        if (gridMetadata[selectedCell.r][prevC].type === 'letter') {
          handleCellClick(selectedCell.r, prevC);
        }
      } else if (key === 'ArrowDown') {
        const nextR = Math.min(currentLevel.gridSize.rows - 1, selectedCell.r + 1);
        if (gridMetadata[nextR][selectedCell.c].type === 'letter') {
          handleCellClick(nextR, selectedCell.c);
        }
      } else if (key === 'ArrowUp') {
        const prevR = Math.max(0, selectedCell.r - 1);
        if (gridMetadata[prevR][selectedCell.c].type === 'letter') {
          handleCellClick(prevR, selectedCell.c);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, gameState, handleInputChar, handleBackspace, gridMetadata, currentLevel]);

  // Check board validation
  const validateGrid = () => {
    let allFilled = true;
    let allCorrect = true;

    for (let r = 0; r < currentLevel.gridSize.rows; r++) {
      for (let c = 0; c < currentLevel.gridSize.cols; c++) {
        const cell = gridMetadata[r][c];
        if (cell.type === 'letter') {
          const userVal = gridValues[`${r}-${c}`] || '';
          if (!userVal) allFilled = false;
          if (userVal !== cell.correctLetter) allCorrect = false;
        }
      }
    }

    if (!allFilled) {
      playSound('wrong');
      return { status: 'incomplete', message: 'The stone tablet is incomplete. Scribe your answers in all cells.' };
    }

    if (!allCorrect) {
      playSound('wrong');
      setStreak(0);
      setLevelScore(s => Math.max(100, s - 100)); // Lose points for invalid checks
      return { status: 'incorrect', message: 'The divine wisdom rejects your glyph configuration. Rectify the errors.' };
    }

    // Success!
    handleLevelComplete();
    return { status: 'correct', message: 'Excellent! The spirits of Thoth and Anubis are pleased.' };
  };

  const handleLevelComplete = () => {
    playSound('victory');
    const finalLevelScore = Math.max(100, levelScore - (revealCount * 50));
    setScore(prev => prev + finalLevelScore);
    setGameState('levelSummary');
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      initLevel(currentLevelIdx + 1);
    } else {
      // Victory completion!
      const totalFinalScore = score;
      addScore({
        playerName: 'Royal Scribe',
        score: totalFinalScore,
        game: 'scribal-crosswords',
        details: `Deciphered all ${LEVELS.length} divine papyri`
      });
      setGameState('victory');
    }
  };

  const handleHint = () => {
    if (!selectedCell || gameState !== 'playing') return;
    const { r, c } = selectedCell;
    const cell = gridMetadata[r][c];
    if (cell.type !== 'letter') return;

    const cellKey = `${r}-${c}`;
    const correctLetter = cell.correctLetter;

    if (gridValues[cellKey] === correctLetter) return; // Already correct

    playSound('hint');
    setStreak(0); // Using hints breaks typing streak
    setGridValues(prev => ({
      ...prev,
      [cellKey]: correctLetter
    }));
    setRevealCount(c => c + 1);
  };

  const activeClueObj = useMemo(() => {
    return currentLevel.clues.find(clue => clue.id === selectedWordId) || null;
  }, [currentLevel, selectedWordId]);

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background overflow-hidden relative selection:bg-gold/30 selection:text-gold-light">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top HUD */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <EgyptianButton
            variant="nav"
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="-ml-4 sm:ml-0"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Games
          </EgyptianButton>
          <div className="flex flex-wrap gap-2 sm:gap-4 w-full sm:w-auto items-center">
            {/* Clickable Level Switcher in HUD */}
            <div className="flex-1 sm:flex-none px-2 py-1 bg-obsidian/60 border border-gold/30 rounded-full flex items-center justify-center gap-1">
              <button
                onClick={() => {
                  if (currentLevelIdx > 0) initLevel(currentLevelIdx - 1);
                }}
                disabled={currentLevelIdx === 0}
                className="p-1 hover:bg-gold/10 rounded-full transition-colors text-gold disabled:opacity-20 disabled:pointer-events-none"
                title="Previous Level"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1.5 px-1">
                <Star className="text-primary w-4 h-4 shrink-0" />
                <span className="text-xs sm:text-sm font-display text-gold whitespace-nowrap">LEVEL {currentLevelIdx + 1}/{LEVELS.length}</span>
              </div>
              <button
                onClick={() => {
                  if (currentLevelIdx < LEVELS.length - 1) initLevel(currentLevelIdx + 1);
                }}
                disabled={currentLevelIdx === LEVELS.length - 1}
                className="p-1 hover:bg-gold/10 rounded-full transition-colors text-gold disabled:opacity-20 disabled:pointer-events-none"
                title="Next Level"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="flex-1 sm:flex-none px-3 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center justify-center gap-2">
              <Trophy className="text-primary w-4 h-4 shrink-0" />
              <span className="text-xs sm:text-sm font-display text-gold whitespace-nowrap">SCORE: {score}</span>
            </div>
            {streak >= 3 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.1, 1], opacity: 1 }}
                className="flex-1 sm:flex-none px-3 py-2 bg-gradient-to-r from-gold/20 via-amber-500/20 to-gold/20 border border-gold/40 rounded-full flex items-center justify-center gap-2 shadow-gold-glow animate-pulse"
              >
                <Sparkles className="text-primary w-4 h-4 shrink-0 animate-pulse" />
                <span className="text-xs sm:text-sm font-display text-primary whitespace-nowrap uppercase tracking-wider">
                  Streak x{Math.floor(streak / 3) + 1}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20 min-h-[70vh]">
          {/* Header Info */}
          <div className="p-4 border-b border-gold/10 bg-gold/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
              <Sparkles className="text-primary hidden sm:block shrink-0" size={20} />
              <div>
                <h3 className="font-display text-gold uppercase tracking-widest text-sm sm:text-base leading-none">
                  {currentLevel.name}
                </h3>
                <p className="text-[10px] text-muted-foreground uppercase font-body mt-1">
                  Difficulty: <span className="text-turquoise font-bold">{currentLevel.difficulty}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <EgyptianButton variant="ghost" size="sm" onClick={handleHint} className="text-xs px-3">
                Reveal Cell (-50)
              </EgyptianButton>
              <EgyptianButton variant="lapis" size="sm" onClick={validateGrid} className="text-xs px-3">
                Check Tablet
              </EgyptianButton>
            </div>
          </div>

          {/* Game Body */}
          <div className="grid lg:grid-cols-12 bg-obsidian min-h-[500px]">
            
            {/* Grid Container */}
            <div className="lg:col-span-7 p-4 sm:p-6 md:p-8 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-gold/10">
              <div 
                className="grid gap-1 sm:gap-1.5 p-2 bg-black/40 rounded-xl border border-gold/25 shadow-2xl shadow-black/80 w-full"
                style={{
                  gridTemplateColumns: `repeat(${currentLevel.gridSize.cols}, minmax(0, 1fr))`,
                  maxWidth: `${currentLevel.gridSize.cols * 65}px`
                }}
              >
                {gridMetadata.map((row, r) => 
                  row.map((cell, c) => {
                    const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
                    const isSelectedWord = selectedWordId && cell.wordIds.includes(selectedWordId);
                    const cellKey = `${r}-${c}`;
                    const val = gridValues[cellKey] || '';

                    if (cell.type === 'clue') {
                      return (
                        <div
                          key={`cell-${r}-${c}`}
                          onClick={() => handleCellClick(r, c)}
                          className={cn(
                            "aspect-square rounded border relative flex flex-col justify-between items-center p-1 sm:p-1.5 cursor-pointer select-none transition-all duration-300",
                            "bg-gradient-to-br from-gold/15 to-gold/5 border-gold/30 hover:border-gold/60",
                            isSelectedWord && "ring-2 ring-primary ring-offset-2 ring-offset-obsidian"
                          )}
                        >
                          <span className="text-[7px] sm:text-[9px] md:text-[10px] leading-tight font-body text-gold/80 italic text-center break-words w-full h-[70%] overflow-y-auto scrollbar-none font-bold">
                            {cell.clueText}
                          </span>
                          <div className="h-[25%] flex items-center justify-center">
                            {cell.arrow === 'right' ? (
                              <ArrowRight className="text-primary w-3 h-3 animate-pulse" />
                            ) : (
                              <ArrowDown className="text-primary w-3 h-3 animate-pulse" />
                            )}
                          </div>
                        </div>
                      );
                    }

                    if (cell.type === 'letter') {
                      return (
                        <button
                          key={`cell-${r}-${c}`}
                          onClick={() => handleCellClick(r, c)}
                          className={cn(
                            "aspect-square rounded border flex items-center justify-center font-display text-sm sm:text-base md:text-xl font-bold transition-all duration-200 select-none",
                            "bg-black/60 border-gold/15 text-white hover:bg-gold/5",
                            isSelected && "bg-primary/25 border-primary shadow-gold-glow",
                            !isSelected && isSelectedWord && "bg-lapis/20 border-lapis/40 text-gold-light"
                          )}
                        >
                          {val}
                        </button>
                      );
                    }

                    // Blocker cell
                    return (
                      <div
                        key={`cell-${r}-${c}`}
                        className="aspect-square rounded bg-obsidian-dark border border-white/5 opacity-40 hieroglyph-pattern flex items-center justify-center"
                      >
                        <span className="text-xs text-gold/5 font-display select-none">𓏏</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Clue and Keyboard Panel */}
            <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-8 bg-black/20">
              
              {/* Clue Card */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold/60 font-display">
                  <HelpCircle size={14} /> Active Clue
                </div>
                {activeClueObj ? (
                  <motion.div
                    key={activeClueObj.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border border-gold/20 bg-gold/5 space-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    <div className="flex items-center gap-2">
                      {activeClueObj.direction === 'right' ? (
                        <span className="text-[10px] bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                          <ArrowRight size={10} /> Horizontal
                        </span>
                      ) : (
                        <span className="text-[10px] bg-turquoise/20 text-turquoise border border-turquoise/20 px-2 py-0.5 rounded uppercase font-bold flex items-center gap-1">
                          <ArrowDown size={10} /> Vertical
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground uppercase font-body">Length: {activeClueObj.length} glyphs</span>
                    </div>
                    <p className="text-base sm:text-lg font-body font-bold text-foreground italic">
                      "{activeClueObj.text}"
                    </p>
                  </motion.div>
                ) : (
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-sm text-muted-foreground italic">
                    Select a letter cell to view the corresponding clue.
                  </div>
                )}
              </div>

              {/* virtual keyboard */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs uppercase tracking-widest text-gold/60 font-display">
                  <span className="flex items-center gap-1"><Key size={14} /> Scribal Keyboard</span>
                  <span className="text-[10px] text-muted-foreground font-body">(Physical keyboard supported)</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5">
                  {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((char) => (
                    <button
                      key={`key-${char}`}
                      onClick={() => handleInputChar(char)}
                      className="aspect-square rounded border border-gold/20 bg-obsidian-dark text-gold font-display font-bold text-xs sm:text-sm shadow-md hover:bg-gold/10 transition-colors flex items-center justify-center"
                    >
                      {char}
                    </button>
                  ))}
                  {["A", "S", "D", "F", "G", "H", "J", "K", "L", "-"].map((char) => (
                    char === "-" ? <div key="key-blank-1" /> : (
                      <button
                        key={`key-${char}`}
                        onClick={() => handleInputChar(char)}
                        className="aspect-square rounded border border-gold/20 bg-obsidian-dark text-gold font-display font-bold text-xs sm:text-sm shadow-md hover:bg-gold/10 transition-colors flex items-center justify-center"
                      >
                        {char}
                      </button>
                    )
                  ))}
                  <button
                    onClick={handleBackspace}
                    className="col-span-2 rounded border border-terracotta/40 bg-terracotta/10 text-terracotta font-display font-bold text-[10px] sm:text-xs shadow-md hover:bg-terracotta/20 transition-colors flex items-center justify-center uppercase"
                  >
                    DEL
                  </button>
                  {["Z", "X", "C", "V", "B", "N", "M"].map((char) => (
                    <button
                      key={`key-${char}`}
                      onClick={() => handleInputChar(char)}
                      className="aspect-square rounded border border-gold/20 bg-obsidian-dark text-gold font-display font-bold text-xs sm:text-sm shadow-md hover:bg-gold/10 transition-colors flex items-center justify-center"
                    >
                      {char}
                    </button>
                  ))}
                  <button
                    onClick={validateGrid}
                    className="col-span-1 rounded border border-turquoise/40 bg-turquoise/10 text-turquoise font-display font-bold text-[10px] sm:text-xs shadow-md hover:bg-turquoise/20 transition-colors flex items-center justify-center uppercase"
                  >
                    ✓
                  </button>
                </div>
              </div>

            </div>

          </div>
        </EgyptianCard>

        {/* Level Modals */}
        <AnimatePresence>
          {gameState === 'intro' && (
            <div className="absolute inset-0 z-50 bg-obsidian/98 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto scrollbar-none">
              <div className="relative z-10 w-full max-w-4xl bg-obsidian-dark/95 border-2 border-gold/30 rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
                
                {/* Visual accents */}
                <div className="absolute inset-0 opacity-[0.05] hieroglyph-pattern" />
                <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
                <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                <div className="absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

                <div className="text-center space-y-4 relative z-10 mb-8">
                  <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-light">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Scribal Chamber
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display text-gold-gradient leading-tight">
                    Scribal Crosswords
                  </h1>
                  <p className="mx-auto max-w-2xl text-sm md:text-base text-foreground/80 font-body leading-relaxed">
                    Harness the wisdom of the high scribes! Decipher the Swedish-style crossword tablets where clues and direction arrows are written directly inside the stones. Navigate with mouse, keyboard, or virtual keys.
                  </p>
                  <p className="text-turquoise text-xs font-display uppercase tracking-widest mt-2">
                    Choose Your Level of Initiation:
                  </p>
                </div>

                {/* Level list/cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3 relative z-10 mb-8">
                  {LEVELS.map((lvl, index) => (
                    <motion.button
                      key={lvl.id}
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => initLevel(index)}
                      className="flex flex-col justify-between text-left p-4 rounded-xl border border-gold/20 bg-black/40 hover:bg-gold/5 hover:border-gold/60 transition-all duration-300 min-h-[170px]"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded uppercase font-bold font-display">
                            Tablet {lvl.id}
                          </span>
                          <span className="text-[9px] text-turquoise uppercase font-bold font-body">
                            {lvl.gridSize.rows}x{lvl.gridSize.cols}
                          </span>
                        </div>
                        <h3 className="font-display text-gold font-bold text-sm tracking-wide leading-tight">
                          {lvl.name}
                        </h3>
                        <p className="text-[11px] text-muted-foreground font-body leading-normal line-clamp-3">
                          {lvl.description}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-white/5 flex justify-between items-center w-full">
                        <span className="text-[10px] text-muted-foreground uppercase font-body">Difficulty</span>
                        <span className={cn(
                          "text-[10px] uppercase font-bold font-body",
                          lvl.difficulty === 'Very Easy' && "text-emerald-400",
                          lvl.difficulty === 'Easy' && "text-turquoise",
                          lvl.difficulty === 'Medium' && "text-gold",
                          lvl.difficulty === 'Hard' && "text-amber-500",
                          lvl.difficulty === 'Expert' && "text-terracotta"
                        )}>
                          {lvl.difficulty}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-center relative z-10">
                  <EgyptianButton variant="nav" onClick={onBack} className="min-w-[170px]">
                    Back to Games
                  </EgyptianButton>
                </div>

              </div>
            </div>
          )}

          {gameState === 'levelSummary' && (
            <div className="absolute inset-0 z-50 bg-gradient-to-t from-obsidian/95 via-obsidian/60 to-transparent flex items-end justify-center p-6">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-2xl bg-obsidian-dark/95 border-2 border-gold/30 rounded-2xl p-6 shadow-2xl space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-full text-primary border border-primary/30">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h4 className="text-primary font-display text-xs tracking-widest uppercase">Tablet Deciphered!</h4>
                    <h2 className="text-3xl font-display text-gold leading-tight">{currentLevel.name}</h2>
                  </div>
                </div>
                <p className="text-muted-foreground font-body leading-relaxed text-sm italic">
                  "{currentLevel.description}"
                </p>
                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-4">
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Base Value</div>
                    <div className="font-display text-2xl text-gold-light">1,000</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-muted-foreground tracking-widest">Glyph Reveals</div>
                    <div className="font-display text-2xl text-terracotta">-{revealCount * 50}</div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <EgyptianButton onClick={handleNextLevel} variant="hero" className="w-full sm:w-auto">
                    {currentLevelIdx < LEVELS.length - 1 ? 'Next Stone Tablet' : 'Finalize Chronicles'}
                  </EgyptianButton>
                </div>
              </motion.div>
            </div>
          )}

          {gameState === 'levelUp' && (
            <div className="absolute inset-0 z-50 bg-obsidian/95 backdrop-blur-md flex items-center justify-center p-4">
              <GameOverlay
                type="levelup"
                title="Tablet Complete!"
                description={`You have flawlessly unlocked the mysteries of the ${currentLevel.name}. Proceed deeper into the royal tombs.`}
                stats={[
                  { label: 'Current Score', value: score },
                  { label: 'Chronicle', value: `${currentLevelIdx + 1}/5` }
                ]}
                actionLabel="Proceed"
                onAction={handleNextLevel}
                onSecondaryAction={onBack}
              />
            </div>
          )}

          {gameState === 'victory' && (
            <div className="absolute inset-0 z-50 bg-obsidian/95 backdrop-blur-md flex items-center justify-center p-4">
              <GameOverlay
                type="victory"
                title="Master Royal Scribe"
                description="The ultimate Egyptian Chronicles have been completely decoded. The legends of the Nile shall immortalize your scribal wisdom across the cosmos."
                score={score}
                stars={5}
                stats={[
                  { label: 'Final Score', value: score },
                  { label: 'Deciphered Tablets', value: LEVELS.length }
                ]}
                actionLabel="Decipher Anew"
                onAction={() => initLevel(0)}
                onSecondaryAction={onBack}
              />
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
