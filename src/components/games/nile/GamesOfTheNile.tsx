import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Lock, Gamepad2, Trophy, Sparkles, Star, Timer, ChevronRight, Zap, Target, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { SenetGame } from './senet/SenetGame';
import { MehenGame } from './mehen/MehenGame';
import { HoundsGame } from './hounds/HoundsGame';

interface GamesOfTheNileProps {
  onBack: () => void;
}

type SubGame = 'hub' | 'level-select' | 'senet' | 'mehen' | 'hounds';

const difficultyValue: Record<string, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Expert: 4,
};

export const GAME_LEVELS = {
  senet: [
    {
      name: "Scribe's Initiation",
      description: "Learn the paths of Senet. Easy AI, and you start with only 3 pieces to escape, while the AI has 5. Complete this to advance.",
      aiDifficulty: 'beginner' as const,
      playerPieces: 3,
      aiPieces: 5,
    },
    {
      name: "Court Duel",
      description: "Challenge an apprentice scribe in a standard duel. Standard rules apply.",
      aiDifficulty: 'beginner' as const,
      playerPieces: 5,
      aiPieces: 5,
    },
    {
      name: "Temple of Thoth",
      description: "Challenge the Temple Priest. The AI is smarter and makes strategic blocks.",
      aiDifficulty: 'normal' as const,
      playerPieces: 5,
      aiPieces: 5,
    },
    {
      name: "Vizier's Passage",
      description: "Engage the Grand Vizier. AI is aggressive and will actively target your vulnerable pieces.",
      aiDifficulty: 'pro' as const,
      playerPieces: 5,
      aiPieces: 5,
    },
    {
      name: "Rebirth of Pharaoh",
      description: "The ultimate trial. Battle the spirit of the Pharaoh. AI is extremely smart and plans turns ahead.",
      aiDifficulty: 'pro' as const,
      playerPieces: 5,
      aiPieces: 5,
    }
  ],
  mehen: [
    {
      name: "The Tail Spiral",
      description: "A short spiral course (30 spaces). Race 2 marbles to the center snake head. No lions active.",
      boardSize: 30,
      marblesCount: 2,
      lionCount: 0,
      aiDifficulty: 'beginner' as const,
    },
    {
      name: "Lapis Journey",
      description: "A medium-sized spiral (50 spaces) with 3 marbles. Take advantage of early pathways.",
      boardSize: 50,
      marblesCount: 3,
      lionCount: 0,
      aiDifficulty: 'beginner' as const,
    },
    {
      name: "The Serpent's Heart",
      description: "Full coiled board (72 spaces). Watch out! 1 hungry Hunter Lion is now active in the spiral.",
      boardSize: 72,
      marblesCount: 3,
      lionCount: 1,
      aiDifficulty: 'beginner' as const,
    },
    {
      name: "Sandstone Gates",
      description: "Full board (72 spaces). The AI plays aggressively, hunting your marbles with its lion.",
      boardSize: 72,
      marblesCount: 3,
      lionCount: 1,
      aiDifficulty: 'pro' as const,
    },
    {
      name: "Crown of Mehen",
      description: "The ultimate coiled race. Command 4 marbles and 1 lion against the smartest spirits of the Nile.",
      boardSize: 72,
      marblesCount: 4,
      lionCount: 1,
      aiDifficulty: 'pro' as const,
    }
  ],
  hounds: [
    {
      name: "Desert Run",
      description: "A short, fast sprint to the tomb. Race only 2 animal pegs to the finish line.",
      pegCount: 2,
      aiDifficulty: 'beginner' as const,
    },
    {
      name: "Oasis Sprint",
      description: "Increase coordination. Race 3 animal pegs using the central shortcuts.",
      pegCount: 3,
      aiDifficulty: 'beginner' as const,
    },
    {
      name: "The Double Valley",
      description: "A tactical race with 4 pegs. Keep an eye on trap spaces that penalize movement.",
      pegCount: 4,
      aiDifficulty: 'beginner' as const,
    },
    {
      name: "Tomb Shadows",
      description: "Challenge the Desert Jackals. A full 5-peg race with aggressive AI move scoring.",
      pegCount: 5,
      aiDifficulty: 'pro' as const,
    },
    {
      name: "Jackal's Lair",
      description: "The ultimate desert race. 5 pegs on a highly competitive course against the master Jackal AI.",
      pegCount: 5,
      aiDifficulty: 'pro' as const,
    }
  ]
};

export const GamesOfTheNile: React.FC<GamesOfTheNileProps> = ({ onBack }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sub = searchParams.get('sub') as 'senet' | 'mehen' | 'hounds' | null;
  const levelStr = searchParams.get('level');
  
  const selectedGameId = sub;
  const activeLevelIdx = levelStr ? parseInt(levelStr, 10) - 1 : null;
  
  const view: SubGame = activeLevelIdx !== null && selectedGameId
    ? selectedGameId
    : selectedGameId
      ? 'level-select'
      : 'hub';
  
  // Progression: { senet: highestUnlockedLevel, mehen: highestUnlockedLevel, hounds: highestUnlockedLevel }
  const [progression, setProgression] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('comesToLife_nile_progression');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            senet: typeof parsed.senet === 'number' ? parsed.senet : 1,
            mehen: typeof parsed.mehen === 'number' ? parsed.mehen : 1,
            hounds: typeof parsed.hounds === 'number' ? parsed.hounds : 1
          };
        }
      } catch {
        // Fallback
      }
    }
    return { senet: 1, mehen: 1, hounds: 1 };
  });

  const handleLevelComplete = (gameId: 'senet' | 'mehen' | 'hounds', completedIdx: number) => {
    const currentUnlocked = progression[gameId] || 1;
    // If completing the currently unlocked level, unlock the next one!
    if (completedIdx + 1 === currentUnlocked && currentUnlocked < 5) {
      const newProg = { ...progression, [gameId]: currentUnlocked + 1 };
      setProgression(newProg);
      localStorage.setItem('comesToLife_nile_progression', JSON.stringify(newProg));
    }
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('level');
    setSearchParams(newParams);
  };

  if (view === 'senet' && selectedGameId === 'senet' && activeLevelIdx !== null) {
    const lvl = GAME_LEVELS.senet[activeLevelIdx];
    return (
      <SenetGame 
        onBack={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('level');
          setSearchParams(newParams);
        }}
        levelIndex={activeLevelIdx}
        levelName={lvl.name}
        aiDifficulty={lvl.aiDifficulty}
        playerPieces={lvl.playerPieces}
        aiPieces={lvl.aiPieces}
        onComplete={() => handleLevelComplete('senet', activeLevelIdx)}
      />
    );
  }

  if (view === 'mehen' && selectedGameId === 'mehen' && activeLevelIdx !== null) {
    const lvl = GAME_LEVELS.mehen[activeLevelIdx];
    return (
      <MehenGame 
        onBack={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('level');
          setSearchParams(newParams);
        }}
        levelIndex={activeLevelIdx}
        levelName={lvl.name}
        aiDifficulty={lvl.aiDifficulty}
        boardSize={lvl.boardSize}
        marblesCount={lvl.marblesCount}
        lionCount={lvl.lionCount}
        onComplete={() => handleLevelComplete('mehen', activeLevelIdx)}
      />
    );
  }

  if (view === 'hounds' && selectedGameId === 'hounds' && activeLevelIdx !== null) {
    const lvl = GAME_LEVELS.hounds[activeLevelIdx];
    return (
      <HoundsGame 
        onBack={() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.delete('level');
          setSearchParams(newParams);
        }}
        levelIndex={activeLevelIdx}
        levelName={lvl.name}
        aiDifficulty={lvl.aiDifficulty}
        pegCount={lvl.pegCount}
        onComplete={() => handleLevelComplete('hounds', activeLevelIdx)}
      />
    );
  }

  const subGames = [
    {
      id: 'senet' as const,
      title: 'Senet',
      tagline: 'Game of Passage',
      description: 'The sacred "Game of Passage". Navigate your pieces through the underworld squares to achieve rebirth and eternal life.',
      icon: Gamepad2,
      difficulty: 'Expert',
      isLocked: false,
      color: 'from-gold-dark via-primary to-lapis',
      duration: '8-15 min',
      category: 'Wisdom',
      mode: 'Board'
    },
    {
      id: 'mehen' as const,
      title: 'Mehen',
      tagline: 'The Coiled Serpent',
      description: 'A mysterious race through the spirals of the snake god Mehen. Protect your tokens as you journey from tail to head.',
      icon: Target,
      difficulty: 'Medium',
      isLocked: false,
      color: 'from-scarab to-turquoise',
      duration: '5-10 min',
      category: 'Wisdom',
      mode: 'Board'
    },
    {
      id: 'hounds' as const,
      title: 'Hounds & Jackals',
      tagline: 'The 58 Holes',
      description: 'A fast-paced tactical race game with animal pegs. Move your sacred animal pegs across the desert board to reach the goal.',
      icon: Trophy,
      difficulty: 'Hard',
      isLocked: false,
      color: 'from-terracotta to-gold-dark',
      duration: '5-12 min',
      category: 'Strategy',
      mode: 'Board'
    }
  ];

  if (view === 'level-select' && selectedGameId) {
    const levels = GAME_LEVELS[selectedGameId];
    const unlockedLevel = progression[selectedGameId] || 1;
    const gameMeta = subGames.find(g => g.id === selectedGameId)!;

    return (
      <div className="min-h-screen pt-24 pb-12 px-6 bg-hero-gradient relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <EgyptianButton
            variant="ghost"
            onClick={() => {
              const newParams = new URLSearchParams(searchParams);
              newParams.delete('sub');
              newParams.delete('level');
              setSearchParams(newParams);
            }}
            className="-ml-4 mb-8 text-muted-foreground hover:text-white transition-colors"
          >
            <ChevronLeft className="mr-2" /> Back to Collection
          </EgyptianButton>

          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <gameMeta.icon className="text-primary w-8 h-8" />
                <h1 className="text-4xl md:text-5xl font-display text-gold-gradient uppercase">{gameMeta.title} Campaign</h1>
              </div>
              <p className="text-muted-foreground font-body text-base max-w-xl">
                Conquer the 5 progressive trials of the Nile to gain divine rank in the Hall of Records.
              </p>
            </div>
            <div className="px-6 py-4 bg-black/40 border border-gold/25 rounded-xl backdrop-blur-md flex items-center gap-3 w-fit mx-auto md:mx-0">
              <ShieldCheck className="text-primary w-6 h-6 animate-pulse" />
              <div>
                <p className="text-[9px] font-display text-gold/50 tracking-widest uppercase">PROGRESSION</p>
                <p className="text-sm font-display text-white">{unlockedLevel}/5 Trials Unlocked</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {levels.map((lvl, index) => {
              const isLvlLocked = index + 1 > unlockedLevel;
              const isCompleted = index + 1 < unlockedLevel;
              const isActive = index + 1 === unlockedLevel;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <EgyptianCard 
                    variant={isLvlLocked ? "default" : isActive ? "tomb" : "default"}
                    className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
                      isLvlLocked 
                        ? 'opacity-40 grayscale pointer-events-none' 
                        : isActive 
                          ? 'border-gold border-2 shadow-[0_0_15px_rgba(var(--primary-rgb),0.15)] bg-gold/5' 
                          : 'hover:bg-white/5 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isLvlLocked) {
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('level', String(index + 1));
                        setSearchParams(newParams);
                      }
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border font-display text-lg font-bold ${
                        isCompleted 
                          ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                          : isActive 
                            ? 'bg-primary/20 border-primary/40 text-primary shadow-gold-glow animate-pulse' 
                            : 'bg-black/35 border-white/10 text-muted-foreground'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={`font-display text-xl uppercase ${isActive ? 'text-gold' : 'text-white'}`}>{lvl.name}</h3>
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                            lvl.aiDifficulty === 'beginner' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : lvl.aiDifficulty === 'normal'
                                ? 'bg-sky-500/10 border-sky-500/20 text-sky-400'
                                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          }`}>
                            AI: {lvl.aiDifficulty}
                          </span>
                        </div>
                        <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-2xl">{lvl.description}</p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center justify-end">
                      {isLvlLocked ? (
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-display uppercase tracking-widest">
                          <Lock className="w-4 h-4" /> Locked
                        </div>
                      ) : isCompleted ? (
                        <EgyptianButton variant="ghost" className="text-emerald-400 hover:text-emerald-300">
                          Replay <ChevronRight className="ml-1 w-4 h-4" />
                        </EgyptianButton>
                      ) : (
                        <EgyptianButton variant="lapis" shadow="gold" className="w-full md:w-auto font-display font-bold uppercase tracking-wider">
                          Enter Trial <ChevronRight className="ml-1 w-4 h-4 animate-bounce" />
                        </EgyptianButton>
                      )}
                    </div>
                  </EgyptianCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-hero-gradient relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <EgyptianButton variant="ghost" onClick={onBack} className="-ml-4 mb-8 text-muted-foreground hover:text-white transition-colors">
            <ChevronLeft className="mr-2" /> Back to Main Games
          </EgyptianButton>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <h1 className="text-5xl md:text-7xl font-display text-gold-gradient whitespace-nowrap">Games of the Nile</h1>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold whitespace-nowrap h-fit">
                <Sparkles size={14} /> ANCIENT WISDOM SERIES
              </div>
            </div>
            
            <div className="hidden lg:flex px-8 py-5 bg-black/40 border border-gold/20 rounded-2xl backdrop-blur-md items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                 <Trophy className="text-gold w-6 h-6" />
               </div>
               <div>
                 <p className="text-[10px] font-display text-gold/40 tracking-[0.4em] uppercase mb-1">Current Series</p>
                 <p className="text-sm font-display text-white tracking-widest uppercase">Master of Boards</p>
               </div>
            </div>
          </div>
          <p className="text-xl text-muted-foreground font-body leading-relaxed italic opacity-80 max-w-3xl">
            "To play Senet is to walk the path of the soul through the Duat..."
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {subGames.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="h-full"
            >
              <TiltCard 
                className="p-0 border-gold/20 hover:border-gold/50 cursor-pointer"
                containerClassName="h-full"
              >
                <div 
                  className="flex flex-col h-full w-full relative z-20"
                  onClick={() => {
                    if (!game.isLocked) {
                      const newParams = new URLSearchParams(searchParams);
                      newParams.set('sub', game.id);
                      newParams.delete('level');
                      setSearchParams(newParams);
                    }
                  }}
                >
                  {/* Top Icon Section */}
                  <div className={`w-full h-48 shrink-0 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-25 hieroglyph-pattern pointer-events-none" />
                    <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-gold-light shadow-[0_0_30px_rgba(0,0,0,0.5)]" style={{ transform: "translateZ(40px)" } as any}>
                      <game.icon className="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-md" />
                    </div>

                    {game.isLocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <Lock className="w-10 h-10 text-white/40" />
                      </div>
                    )}
                  </div>

                  {/* Bottom Content Section */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between bg-black/20 min-w-0" style={{ transform: "translateZ(20px)" } as any}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[8px] lg:text-[10px] font-bold tracking-[0.15em] text-primary uppercase">{game.category}</span>
                        <span className="rounded-md border border-turquoise/25 bg-turquoise/10 px-2 py-0.5 text-[8px] lg:text-[10px] font-bold tracking-[0.15em] text-turquoise uppercase">{game.mode}</span>
                      </div>

                      <div className="mb-4">
                        <h3 className="text-2xl lg:text-3xl font-display text-white group-hover:text-gold-light transition-colors leading-tight uppercase">{game.title}</h3>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gold/40 font-medium">{game.tagline}</p>
                      </div>

                      <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-8 line-clamp-3 font-body italic opacity-80">
                        "{game.description}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-4 lg:pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} size={12} className={i < difficultyValue[game.difficulty] ? "text-gold fill-gold" : "text-white/10"} />
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-turquoise font-bold uppercase tracking-wider">
                          <Timer size={12} className="animate-pulse" /> {game.duration}
                        </div>
                      </div>
                      <div className="text-gold-light group-hover:translate-x-2 transition-transform flex items-center text-[10px] font-bold uppercase tracking-widest">
                        {game.isLocked ? 'Locked' : 'Open Campaign'} <ChevronRight size={14} className="ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Faint Background Icon */}
                  <div className="absolute -bottom-6 -right-6 opacity-[0.02] grayscale transition-all duration-700 group-hover:opacity-[0.08] group-hover:scale-110 pointer-events-none z-0">
                    <game.icon className="h-48 w-48" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
