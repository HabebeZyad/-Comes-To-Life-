import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Brain, Map, Puzzle, Building, Languages, Timer, Sailboat, Bug, Trophy, Crown, Clock, Users, Star, ChevronRight, Filter, BookOpen, Search, Award, ShieldCheck, Sparkles } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { MemoryGame } from '@/components/games/MemoryGame';
import { MummyMazeGame } from '@/components/games/MummyMazeGame';
import { PharaohRiddlesGame } from '@/components/games/PharaohRiddlesGame';
import { PyramidBuilderGame } from '@/components/games/PyramidBuilderGame';
import { HieroglyphDecoderGame } from '@/components/games/HieroglyphDecoderGame';
import { TempleEscapeGame } from '@/components/games/TempleEscapeGame';
import { NileNavigatorGame } from '@/components/games/NileNavigatorGame';
import { ScarabCollectorGame } from '@/components/games/ScarabCollectorGame';
import GuessThePharaohGame from '@/components/games/GuessThePharaohGame';
import { PyramidTrailGame } from '@/components/games/PyramidTrailGame';
import { OrderOfBuildersGame } from '@/components/games/OrderOfBuildersGame';
import { GreatMindsGame } from '@/components/games/GreatMindsGame';
import { ScribesLostJournalGame } from '@/components/games/ScribesLostJournalGame';
import { TombExplorerGame } from '@/components/games/TombExplorerGame';
import { HieroglyphMatchGame } from '@/components/games/HieroglyphMatchGame';
import { GlyphRevealGame } from '@/components/games/GlyphRevealGame';
import { Leaderboard } from '@/components/games/Leaderboard';
import { GamesOfTheNile } from '@/components/games/nile/GamesOfTheNile';
import { DustParticles } from '@/components/effects/DustParticles';
import { useHighScores } from '@/hooks/useHighScores';

type GameType = 'menu' | 'memory' | 'maze' | 'riddles' | 'pyramid' | 'decoder' | 'temple-escape' | 'nile-navigator' | 'scarab-collector' | 'guess-the-pharaoh' | 'pyramid-trail' | 'order-builders' | 'great-minds' | 'scribes-journal' | 'tomb-explorer' | 'hieroglyph-match' | 'glyph-reveal' | 'nile-games';
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
  { id: 'great-minds', title: 'Hall of Records', tagline: 'Historical wisdom saga', description: 'Investigate the deeds and wisdom of history in a 2-volume saga.', icon: Users, color: 'from-lapis to-primary', emoji: '🧠', category: 'History', difficulty: 'Hard', duration: '5 min', mode: 'History' },
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
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [filter, setFilter] = useState<CategoryFilter>('All');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
  const [query, setQuery] = useState('');
  const { getGameSummary, getPlayerProgression } = useHighScores();
  const progression = getPlayerProgression();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentGame]);

  const handleBackToMenu = () => {
    setCurrentGame('menu');
  };

  const handleGameSelect = (gameId: GameType) => {
    setCurrentGame(gameId);
  };

  if (currentGame !== 'menu') {
    const GameComponent = gameComponents[currentGame];
    if (GameComponent) return <GameComponent onBack={handleBackToMenu} />;
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
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-hero-gradient relative">
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
            <EgyptianButton variant="lapis" size="lg" onClick={() => setShowLeaderboard(!showLeaderboard)} className="w-full sm:w-auto">
              <Trophy size={20} className="mr-2" /> {showLeaderboard ? 'Hide Leaderboard' : 'Hall of Records'}
            </EgyptianButton>

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
            <Leaderboard />
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

        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group relative cursor-pointer"
                onClick={() => handleGameSelect(game.id as GameType)}
              >
                {game.isFeatured && (
                  <div className="absolute -top-3 left-5 z-20 rounded-full border border-primary/30 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-gold-glow">
                    Featured Collection
                  </div>
                )}
                <EgyptianCard
                  variant="interactive"
                  padding="none"
                  className="h-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors flex"
                >
                  <div className="flex flex-row h-full w-full">
                    <div className={`w-[34%] sm:w-1/4 md:w-[30%] shrink-0 min-w-[112px] bg-gradient-to-br ${game.color} flex items-center justify-center relative overflow-hidden group-hover:opacity-95 transition-opacity`}>
                      <div className="absolute inset-0 opacity-20 hieroglyph-pattern" />
                      <div className="absolute inset-x-4 top-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                      <span className="text-5xl sm:text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10 drop-shadow-gold-glow">{game.emoji}</span>
                    </div>
                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between bg-obsidian/45 min-w-0">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">{game.category}</span>
                          <span className="rounded-full border border-turquoise/25 bg-turquoise/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-turquoise uppercase">{game.mode}</span>
                          {game.isNew && (
                            <span className="rounded-full border border-gold/25 bg-gold/10 px-2 py-0.5 text-[10px] font-bold tracking-widest text-gold-light uppercase">New</span>
                          )}
                        </div>

                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-xl sm:text-2xl font-display text-white group-hover:text-primary transition-colors truncate sm:whitespace-normal">{game.title}</h3>
                            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{game.tagline}</p>
                          </div>
                          <game.icon className="mt-1 hidden h-6 w-6 shrink-0 text-primary/80 sm:block" />
                        </div>

                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2">{game.description}</p>

                        {(() => {
                          const summary = getGameSummary(game.id);
                          return summary ? (
                            <div className="mb-4 grid grid-cols-3 gap-2">
                              <div className="rounded-md border border-white/10 bg-black/25 p-2">
                                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Best</div>
                                <div className="font-display text-sm text-primary">{summary.bestScore.toLocaleString()}</div>
                              </div>
                              <div className="rounded-md border border-white/10 bg-black/25 p-2">
                                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Runs</div>
                                <div className="font-display text-sm text-foreground">{summary.plays}</div>
                              </div>
                              <div className="rounded-md border border-white/10 bg-black/25 p-2">
                                <div className="text-[9px] uppercase tracking-widest text-muted-foreground">Avg</div>
                                <div className="font-display text-sm text-turquoise">{summary.averageScore.toLocaleString()}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-4 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-xs text-muted-foreground">
                              New record slot ready
                            </div>
                          );
                        })()}

                        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-turquoise"
                            style={{ width: `${(difficultyValue[game.difficulty] / 4) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-auto gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1" aria-label={`${game.difficulty} difficulty`}>
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} size={13} className={i < difficultyValue[game.difficulty] ? "text-primary fill-primary" : "text-white/10"} />
                            ))}
                          </div>
                          <div className="hidden sm:flex items-center gap-1 text-[10px] text-turquoise font-bold uppercase">
                            <Timer size={12} /> {game.duration}
                          </div>
                        </div>
                        <div className="text-primary group-hover:translate-x-1 transition-transform flex items-center text-xs sm:text-sm font-bold ml-auto">
                          PLAY NOW <ChevronRight size={14} className="sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </EgyptianCard>
              </motion.div>
            ))}
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
