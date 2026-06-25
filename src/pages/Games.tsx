import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Brain, Map, Puzzle, Building, Languages, Timer, Sailboat, Bug, Trophy, Crown, Clock, Users, Star, ChevronRight, Filter, BookOpen, Search, Award, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { PageLoader } from '@/components/layout/PageLoader';
import { DustParticles } from '@/components/effects/DustParticles';
import { useHighScores } from '@/hooks/useHighScores';
import { TiltCard } from '@/components/ui/TiltCard';

// Lazy-load game components to reduce initial bundle size
// @ts-expect-error - lazy loading of game components
const MemoryGame = lazy(() => import('@/components/games/MemoryGame').then(m => ({ default: m.MemoryGame })));
// @ts-expect-error - lazy loading
const MummyMazeGame = lazy(() => import('@/components/games/MummyMazeGame').then(m => ({ default: m.MummyMazeGame })));
// @ts-expect-error - lazy loading
const PharaohRiddlesGame = lazy(() => import('@/components/games/PharaohRiddlesGame').then(m => ({ default: m.PharaohRiddlesGame })));
// @ts-expect-error - lazy loading
const PyramidBuilderGame = lazy(() => import('@/components/games/PyramidBuilderGame').then(m => ({ default: m.PyramidBuilderGame })));
// @ts-expect-error - lazy loading
const HieroglyphDecoderGame = lazy(() => import('@/components/games/HieroglyphDecoderGame').then(m => ({ default: m.HieroglyphDecoderGame })));
// @ts-expect-error - lazy loading
const TempleEscapeGame = lazy(() => import('@/components/games/TempleEscapeGame').then(m => ({ default: m.TempleEscapeGame })));
// @ts-expect-error - lazy loading
const NileNavigatorGame = lazy(() => import('@/components/games/NileNavigatorGame').then(m => ({ default: m.NileNavigatorGame })));
// @ts-expect-error - lazy loading
const ScarabCollectorGame = lazy(() => import('@/components/games/ScarabCollectorGame').then(m => ({ default: m.ScarabCollectorGame })));
// @ts-expect-error - lazy loading
const GuessThePharaohGame = lazy(() => import('@/components/games/GuessThePharaohGame'));
// @ts-expect-error - lazy loading
const PyramidTrailGame = lazy(() => import('@/components/games/PyramidTrailGame').then(m => ({ default: m.PyramidTrailGame })));
// @ts-expect-error - lazy loading
const OrderOfBuildersGame = lazy(() => import('@/components/games/OrderOfBuildersGame').then(m => ({ default: m.OrderOfBuildersGame })));
// @ts-expect-error - lazy loading
const GreatMindsGame = lazy(() => import('@/components/games/GreatMindsGame').then(m => ({ default: m.GreatMindsGame })));
// @ts-expect-error - lazy loading
const ScribesLostJournalGame = lazy(() => import('@/components/games/ScribesLostJournalGame').then(m => ({ default: m.ScribesLostJournalGame })));
// @ts-expect-error - lazy loading
const TombExplorerGame = lazy(() => import('@/components/games/TombExplorerGame').then(m => ({ default: m.TombExplorerGame })));
// @ts-expect-error - lazy loading
const HieroglyphMatchGame = lazy(() => import('@/components/games/HieroglyphMatchGame').then(m => ({ default: m.HieroglyphMatchGame })));
// @ts-expect-error - lazy loading
const GlyphRevealGame = lazy(() => import('@/components/games/GlyphRevealGame').then(m => ({ default: m.GlyphRevealGame })));
// @ts-expect-error - lazy loading
const GamesOfTheNile = lazy(() => import('@/components/games/nile/GamesOfTheNile').then(m => ({ default: m.GamesOfTheNile })));
// @ts-expect-error - lazy loading
const ScribalCrosswordsGame = lazy(() => import('@/components/games/ScribalCrosswordsGame').then(m => ({ default: m.ScribalCrosswordsGame })));
// @ts-expect-error - lazy loading
const Leaderboard = lazy(() => import('@/components/games/Leaderboard').then(m => ({ default: m.Leaderboard })));

type GameType = 'menu' | 'memory' | 'maze' | 'riddles' | 'pyramid' | 'decoder' | 'temple-escape' | 'nile-navigator' | 'scarab-collector' | 'guess-the-pharaoh' | 'pyramid-trail' | 'order-builders' | 'great-minds' | 'scribes-journal' | 'tomb-explorer' | 'hieroglyph-match' | 'glyph-reveal' | 'nile-games' | 'scribal-crosswords';
type CategoryFilter = 'All' | 'Wisdom' | 'Action' | 'History';
type DifficultyFilter = 'All' | 'Easy' | 'Medium' | 'Hard' | 'Expert';

interface Game {
  id: GameType;
  title: string;
  description: string;
  tagline: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
  category: 'Wisdom' | 'Action' | 'History';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  duration: string;
  mode: 'Puzzle' | 'Arcade' | 'History' | 'Board';
  isNew?: boolean;
  isFeatured?: boolean;
}

const games: Game[] = [
  { id: 'scribal-crosswords', title: 'Scribal Crosswords', tagline: 'Ancient literature arrowords', description: 'Decipher Swedish-style crossword grids packed with wisdom from ancient texts, legendary kings, and divine sagas.', icon: BookOpen, color: 'from-gold-dark via-primary to-lapis', emoji: '𓏏', category: 'Wisdom', difficulty: 'Medium', duration: '4-8 min', mode: 'Puzzle', isNew: true, isFeatured: true },
  { id: 'nile-games', title: 'Games of the Nile', tagline: 'Ancient board game collection', description: 'Play Senet now and preview Mehen plus Hounds and Jackals in a premium board-game suite.', icon: Gamepad2, color: 'from-gold-dark via-primary to-lapis', emoji: '𓏏', category: 'Wisdom', difficulty: 'Expert', duration: '8-15 min', mode: 'Board', isNew: true, isFeatured: true },
  { id: 'glyph-reveal', title: 'Hidden Pharaoh', tagline: 'Image reveal strategy', description: 'Cross out identical sacred symbols to reveal the ancient images hidden beneath.', icon: Puzzle, color: 'from-obsidian to-primary', emoji: '🖼️', category: 'Wisdom', difficulty: 'Easy', duration: '3-5 min', mode: 'Puzzle', isNew: true },
  { id: 'tomb-explorer', title: 'Tomb Explorer', tagline: 'Tactical chamber survival', description: 'Navigate dark chambers, avoid traps, and recover lost treasures.', icon: Map, color: 'from-terracotta to-gold-dark', emoji: '𓊖', category: 'Action', difficulty: 'Hard', duration: '4-6 min', mode: 'Arcade', isNew: true },
  { id: 'hieroglyph-match', title: 'Hieroglyph Match', tagline: 'Symbol meaning mastery', description: 'Match sacred symbols to their meanings in this linguistic trial.', icon: Languages, color: 'from-lapis to-turquoise', emoji: '𓇚', category: 'Wisdom', difficulty: 'Medium', duration: '3-5 min', mode: 'Puzzle', isNew: true },
  { id: 'riddles', title: "Pharaoh's Riddles", tagline: 'Sphinx logic gauntlet', description: "Face the Sphinx and answer 4 levels of cryptic ancient wisdom.", icon: Star, color: 'from-scarab to-turquoise', emoji: '🦁', category: 'Wisdom', difficulty: 'Expert', duration: '5-8 min', mode: 'Puzzle' },
  { id: 'scarab-collector', title: 'Scarab Collector', tagline: 'Fast reaction waves', description: 'Catch sacred scarabs in a high-stakes 5-wave desert swarm trial.', icon: Bug, color: 'from-scarab to-gold-dark', emoji: '𓆣', category: 'Action', difficulty: 'Hard', duration: '3-5 min', mode: 'Arcade' },
  { id: 'memory', title: 'Trials of Wisdom', tagline: 'Five-stage memory trial', description: 'Master the divine archives through 5 levels of increasing complexity.', icon: Brain, color: 'from-lapis to-lapis-deep', emoji: '𓂀', category: 'Wisdom', difficulty: 'Medium', duration: '2-4 min', mode: 'Puzzle' },
  { id: 'maze', title: 'Solar & Lunar Maze', tagline: 'Twin-spirit coordination', description: 'Coordinate twin spirits through 5 perilous tomb labyrinths.', icon: Map, color: 'from-gold-dark to-primary', emoji: '🧟', category: 'Action', difficulty: 'Hard', duration: '3-5 min', mode: 'Arcade' },
  { id: 'guess-the-pharaoh', title: 'Guess the Pharaoh', tagline: 'Royal identity challenge', description: 'Identify legendary rulers in this 5-wave historical challenge.', icon: Crown, color: 'from-yellow-400 to-amber-600', emoji: '👑', category: 'History', difficulty: 'Medium', duration: '3-5 min', mode: 'History' },
  { id: 'pyramid', title: 'Pyramid Builder', tagline: 'Precision stacking test', description: 'Stack sacred stones with divine precision in a 4-phase trial.', icon: Building, color: 'from-primary to-gold-light', emoji: '🏛️', category: 'Action', difficulty: 'Medium', duration: '3-5 min', mode: 'Arcade' },
  { id: 'decoder', title: 'Hieroglyph Decoder', tagline: 'Scribal translation run', description: 'Decipher sacred symbols through 5 waves of scribal tests.', icon: Languages, color: 'from-turquoise to-lapis', emoji: '𓇚', category: 'Wisdom', difficulty: 'Hard', duration: '3-5 min', mode: 'Puzzle' },
  { id: 'temple-escape', title: 'Temple Escape', tagline: 'Timed trap gauntlet', description: 'Survive 5 chambers of deadly traps in a high-pressure escape.', icon: Timer, color: 'from-terracotta to-gold-dark', emoji: '🏺', category: 'Action', difficulty: 'Expert', duration: '4-6 min', mode: 'Arcade' },
  { id: 'nile-navigator', title: 'Nile Navigator', tagline: 'River reflex expedition', description: 'Sail 5 dangerous reaches of the Nile to prove your navigation.', icon: Sailboat, color: 'from-lapis to-turquoise', emoji: '⛵', category: 'Action', difficulty: 'Hard', duration: '3-5 min', mode: 'Arcade' },
  { id: 'pyramid-trail', title: 'The Pyramid Trail', tagline: 'Map-based royal route', description: 'Embark on a 3-region cartographic expedition across the royal necropolis.', icon: Map, color: 'from-gold to-amber-600', emoji: '📍', category: 'History', difficulty: 'Hard', duration: '5 min', mode: 'History' },
  { id: 'order-builders', title: 'Chronicles of the Nile', tagline: 'Timeline reconstruction', description: 'Reconstruct the 3-era broken timeline of the Pharaohs through the ages.', icon: Clock, color: 'from-primary to-gold-dark', emoji: '⏳', category: 'History', difficulty: 'Expert', duration: '6 min', mode: 'History' },
  { id: 'great-minds', title: 'The Great Minds', tagline: 'Historical wisdom saga', description: 'Investigate the deeds and wisdom of history in a 2-volume saga.', icon: Users, color: 'from-lapis to-primary', emoji: '🧠', category: 'History', difficulty: 'Hard', duration: '5 min', mode: 'History' },
  { id: 'scribes-journal', title: "Scribe's Journal", tagline: 'Fragmented archive mystery', description: "Piece together historical events from fragmented journal entries.", icon: BookOpen, color: 'from-emerald-500 to-teal-700', emoji: '📓', category: 'History', difficulty: 'Medium', duration: '5 min', mode: 'History' },
];

const gameComponents: Record<GameType, React.FC<{ onBack: () => void }> | null> = {
  menu: null,
  memory: MemoryGame,
  maze: MummyMazeGame,
  riddles: PharaohRiddlesGame,
  pyramid: PyramidBuilderGame,
  decoder: HieroglyphDecoderGame,
  'temple-escape': TempleEscapeGame,
  'nile-navigator': NileNavigatorGame,
  'scarab-collector': ScarabCollectorGame,
  'guess-the-pharaoh': GuessThePharaohGame,
  'pyramid-trail': PyramidTrailGame,
  'order-builders': OrderOfBuildersGame,
  'great-minds': GreatMindsGame,
  'scribes-journal': ScribesLostJournalGame,
  'tomb-explorer': TombExplorerGame,
  'hieroglyph-match': HieroglyphMatchGame,
  'glyph-reveal': GlyphRevealGame,
  'nile-games': GamesOfTheNile,
  'scribal-crosswords': ScribalCrosswordsGame,
};

const categoryFilters: CategoryFilter[] = ['All', 'Wisdom', 'Action', 'History'];
const difficultyFilters: DifficultyFilter[] = ['All', 'Easy', 'Medium', 'Hard', 'Expert'];

const difficultyValue: Record<Game['difficulty'], number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Expert: 4,
};

export default function Games() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [filter, setFilter] = useState<CategoryFilter>(() => {
    return (sessionStorage.getItem('games_filter') as CategoryFilter) || 'All';
  });
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>(() => {
    return (sessionStorage.getItem('games_difficultyFilter') as DifficultyFilter) || 'All';
  });
  const [query, setQuery] = useState(() => {
    return sessionStorage.getItem('games_query') || '';
  });
  
  const currentGame = (searchParams.get('id') as GameType) || 'menu';

  const { getGameSummary, getPlayerProgression } = useHighScores();
  const progression = getPlayerProgression();

  useEffect(() => {
    sessionStorage.setItem('games_filter', filter);
  }, [filter]);

  useEffect(() => {
    sessionStorage.setItem('games_difficultyFilter', difficultyFilter);
  }, [difficultyFilter]);

  useEffect(() => {
    sessionStorage.setItem('games_query', query);
  }, [query]);

  useEffect(() => {
    if (currentGame !== 'menu') {
      window.scrollTo(0, 0);
    } else {
      const savedScrollY = sessionStorage.getItem('games_scroll_position');
      if (savedScrollY) {
        const timer = setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollY, 10));
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [currentGame]);

  useEffect(() => {
    if (currentGame === 'menu') {
      const handleScroll = () => {
        sessionStorage.setItem('games_scroll_position', String(window.scrollY));
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [currentGame]);

  const handleBackToMenu = () => {
    setSearchParams({});
  };

  const handleGameSelect = (gameId: GameType) => {
    setSearchParams({ id: gameId });
  };

  if (currentGame !== 'menu') {
    const GameComponent = gameComponents[currentGame];
    if (GameComponent) {
      return (
        <Suspense fallback={<PageLoader />}>
          <GameComponent onBack={handleBackToMenu} />
        </Suspense>
      );
    }
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGames = games.filter((game) => {
    const matchesCategory = filter === 'All' || game.category === filter;
    const matchesDifficulty = difficultyFilter === 'All' || game.difficulty === difficultyFilter;
    const matchesSearch = !normalizedQuery ||
      `${game.title} ${game.description} ${game.tagline} ${game.mode}`.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-hero-gradient relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-full overflow-hidden pointer-events-none">
        <DustParticles />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-8 md:mb-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-bold mb-5">
                <Sparkles size={14} /> PROFESSIONAL TRIALS ARCADE
              </div>
              <h1 className="text-4xl md:text-7xl font-display text-gold-gradient mb-4 md:mb-6">Ancient Games</h1>
              <p className="text-base md:text-xl text-muted-foreground font-body leading-relaxed">
                Choose a polished trial, chase cleaner runs, and build your Hall of Records across puzzles, action challenges, history quests, and ancient board games.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 lg:min-w-[420px]">
              {[
                { label: 'Rank', value: progression.rankTitle, icon: Award },
                { label: 'Best', value: progression.bestScore.toLocaleString(), icon: Trophy },
                { label: 'Records', value: progression.totalPlays, icon: ShieldCheck },
              ].map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="rounded-lg border border-gold/20 bg-black/35 px-3 py-4 text-center backdrop-blur-md">
                    <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{metric.label}</div>
                    <div className="mt-1 text-sm md:text-base font-display text-gold-light truncate">{metric.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="sticky top-[70px] z-40 bg-hero-gradient md:bg-transparent pb-4 pt-2 -mx-4 px-4 md:mx-0 md:px-0 mb-8 border-b border-white/5 md:border-none shadow-xl shadow-black/20 md:shadow-none backdrop-blur-md md:backdrop-blur-0">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <EgyptianButton variant="lapis" size="lg" onClick={() => setShowLeaderboard(!showLeaderboard)} className="w-full sm:w-auto">
                <Trophy size={20} className="mr-2" /> {showLeaderboard ? 'Hide Leaderboard' : 'Hall of Records'}
              </EgyptianButton>
            </div>

            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
              <div className="relative w-full lg:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search trials"
                  className="h-11 w-full rounded-lg border border-white/10 bg-black/40 pl-10 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50"
                />
              </div>

              <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory lg:w-auto">
                <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10 w-max mx-auto lg:mx-0">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all snap-center whitespace-nowrap ${filter === cat ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'
                        }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full overflow-x-auto scrollbar-none snap-x snap-mandatory lg:w-auto">
                <div className="flex bg-black/35 backdrop-blur-md p-1 rounded-xl border border-white/10 w-max mx-auto lg:mx-0">
                  {difficultyFilters.map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficultyFilter(level)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all snap-center whitespace-nowrap ${difficultyFilter === level ? 'bg-lapis text-white shadow-lg' : 'text-muted-foreground hover:text-white'
                      }`}
                  >
                    {level}
                  </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showLeaderboard && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
            <Suspense fallback={<PageLoader className="min-h-[400px]" />}>
              <Leaderboard />
            </Suspense>
          </motion.div>
        )}

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4 text-primary" />
            <span>{filteredGames.length} trials available</span>
          </div>
          {progression.favoriteGame && (
            <div className="hidden sm:block text-xs uppercase tracking-widest text-muted-foreground">
              Favorite: <span className="text-primary">{games.find(game => game.id === progression.favoriteGame)?.title || progression.favoriteGame}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => {
              let summary = getGameSummary(game.id);
              if (game.id === 'nile-games') {
                const senetSum = getGameSummary('senet');
                const mehenSum = getGameSummary('mehen');
                const houndsSum = getGameSummary('hounds');
                
                const summaries = [senetSum, mehenSum, houndsSum].filter(Boolean);
                if (summaries.length > 0) {
                  summary = {
                    game: 'nile-games',
                    plays: summaries.reduce((sum, s) => sum + s.plays, 0),
                    bestScore: Math.max(...summaries.map(s => s.bestScore)),
                    averageScore: Math.round(summaries.reduce((sum, s) => sum + s.averageScore, 0) / summaries.length),
                    latestScore: summaries[0].latestScore,
                  };
                }
              }
              return (
                <motion.div
                  layout
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <TiltCard 
                    className="p-0 border-gold/20 hover:border-gold/50 cursor-pointer"
                    containerClassName="h-full"
                  >
                    <div 
                      className="flex flex-col sm:flex-row h-full w-full relative z-20"
                      onClick={() => handleGameSelect(game.id as GameType)}
                    >
                      {/* Left/Top Icon Section */}
                      <div className={`w-full sm:w-[32%] shrink-0 bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-25 hieroglyph-pattern pointer-events-none" />
                        <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                        
                        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-black/30 text-gold-light shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110" style={{ transform: "translateZ(40px)" } as React.CSSProperties}>
                          <game.icon className="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-md" />
                        </div>

                        {game.isFeatured && (
                          <div className="absolute -top-1 -left-1 z-30 px-3 py-1 bg-gold text-black font-display text-[9px] font-bold uppercase tracking-widest rounded-br-lg shadow-lg">
                            Featured Collection
                          </div>
                        )}
                      </div>

                      {/* Right/Bottom Content Section */}
                      <div className="flex-1 p-6 flex flex-col justify-between bg-black/20 min-w-0" style={{ transform: "translateZ(20px)" } as React.CSSProperties}>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] text-primary uppercase">{game.category}</span>
                            <span className="rounded-md border border-turquoise/25 bg-turquoise/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] text-turquoise uppercase">{game.mode}</span>
                            {game.isNew && (
                              <span className="flex items-center gap-1 rounded-md border border-gold/25 bg-gold/10 px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] text-gold-light uppercase">
                                <Zap className="h-2 w-2 animate-pulse" /> New
                              </span>
                            )}
                          </div>

                          <div className="mb-3">
                            <h3 className="text-2xl sm:text-3xl font-display text-white group-hover:text-gold-light transition-colors leading-tight">{game.title}</h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold/40 font-medium">{game.tagline}</p>
                          </div>

                          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2 font-body italic opacity-80">
                            "{game.description}"
                          </p>

                          {summary ? (
                            <div className="mb-6 grid grid-cols-3 gap-3">
                              <div className="rounded-lg border border-white/5 bg-white/5 p-2 text-center">
                                <div className="text-[8px] uppercase tracking-widest text-muted-foreground mb-0.5">Best</div>
                                <div className="font-display text-sm text-gold-light">{summary.bestScore.toLocaleString()}</div>
                              </div>
                              <div className="rounded-lg border border-white/5 bg-white/5 p-2 text-center">
                                <div className="text-[8px] uppercase tracking-widest text-muted-foreground mb-0.5">Runs</div>
                                <div className="font-display text-sm text-foreground">{summary.plays}</div>
                              </div>
                              <div className="rounded-lg border border-white/5 bg-white/5 p-2 text-center">
                                <div className="text-[8px] uppercase tracking-widest text-muted-foreground mb-0.5">Avg</div>
                                <div className="font-display text-sm text-turquoise">{summary.averageScore.toLocaleString()}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-6 flex items-center gap-3 rounded-lg border border-gold/10 bg-gold/5 px-4 py-3 text-[10px] text-gold/60 uppercase tracking-widest font-display">
                              <Sparkles className="h-3 w-3 animate-pulse" />
                              Uncharted Trial: Seek the First Record
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} size={12} className={i < difficultyValue[game.difficulty] ? "text-gold fill-gold" : "text-white/10"} />
                              ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-turquoise font-bold uppercase tracking-wider">
                              <Timer size={12} className="animate-pulse" /> {game.duration}
                            </div>
                          </div>
                          <div className="text-gold-light group-hover:translate-x-2 transition-transform flex items-center text-xs font-bold uppercase tracking-widest">
                            Enter Trial <ChevronRight size={14} className="ml-1" />
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
              );
            })}
          </AnimatePresence>
          {filteredGames.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2 rounded-lg border border-gold/20 bg-black/30 p-10 text-center"
            >
              <Search className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h2 className="mb-2 font-display text-2xl text-gold-light">No trials found</h2>
              <p className="text-sm text-muted-foreground">Try a different search, category, or difficulty.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
