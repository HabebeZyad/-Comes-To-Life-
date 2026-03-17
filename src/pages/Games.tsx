import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Brain, Map, Puzzle, Building, Languages, Timer, Sailboat, Bug, Trophy, Crown, Clock, Users, Star, ChevronRight, Filter, BookOpen, Loader2 } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { Leaderboard } from '@/components/games/Leaderboard';
import { DustParticles } from '@/components/effects/DustParticles';

// Lazy load game components to reduce the main bundle size
const MemoryGame = lazy(() => import('@/components/games/MemoryGame').then(m => ({ default: m.MemoryGame })));
const MummyMazeGame = lazy(() => import('@/components/games/MummyMazeGame').then(m => ({ default: m.MummyMazeGame })));
const PharaohRiddlesGame = lazy(() => import('@/components/games/PharaohRiddlesGame').then(m => ({ default: m.PharaohRiddlesGame })));
const PyramidBuilderGame = lazy(() => import('@/components/games/PyramidBuilderGame').then(m => ({ default: m.PyramidBuilderGame })));
const HieroglyphDecoderGame = lazy(() => import('@/components/games/HieroglyphDecoderGame').then(m => ({ default: m.HieroglyphDecoderGame })));
const TempleEscapeGame = lazy(() => import('@/components/games/TempleEscapeGame').then(m => ({ default: m.TempleEscapeGame })));
const NileNavigatorGame = lazy(() => import('@/components/games/NileNavigatorGame').then(m => ({ default: m.NileNavigatorGame })));
const ScarabCollectorGame = lazy(() => import('@/components/games/ScarabCollectorGame').then(m => ({ default: m.ScarabCollectorGame })));
const GuessThePharaohGame = lazy(() => import('@/components/games/GuessThePharaohGame'));
const PyramidTrailGame = lazy(() => import('@/components/games/PyramidTrailGame').then(m => ({ default: m.PyramidTrailGame })));
const OrderOfBuildersGame = lazy(() => import('@/components/games/OrderOfBuildersGame').then(m => ({ default: m.OrderOfBuildersGame })));
const GreatMindsGame = lazy(() => import('@/components/games/GreatMindsGame').then(m => ({ default: m.GreatMindsGame })));
const ScribesLostJournalGame = lazy(() => import('@/components/games/ScribesLostJournalGame').then(m => ({ default: m.ScribesLostJournalGame })));
const TombExplorerGame = lazy(() => import('@/components/games/TombExplorerGame').then(m => ({ default: m.TombExplorerGame })));
const HieroglyphMatchGame = lazy(() => import('@/components/games/HieroglyphMatchGame').then(m => ({ default: m.HieroglyphMatchGame })));

type GameType = 'menu' | 'memory' | 'maze' | 'riddles' | 'pyramid' | 'decoder' | 'temple-escape' | 'nile-navigator' | 'scarab-collector' | 'guess-the-pharaoh' | 'pyramid-trail' | 'order-builders' | 'great-minds' | 'scribes-journal' | 'tomb-explorer' | 'hieroglyph-match';

interface Game {
  id: GameType;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
  category: 'Wisdom' | 'Action' | 'History';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  duration: string;
  isNew?: boolean;
}

const games: Game[] = [
  { id: 'tomb-explorer', title: 'Tomb Explorer', description: 'Navigate dark chambers, avoid traps, and recover lost treasures.', icon: Map, color: 'from-terracotta to-gold-dark', emoji: '𓊖', category: 'Action', difficulty: 'Hard', duration: '4-6 min', isNew: true },
  { id: 'hieroglyph-match', title: 'Hieroglyph Match', description: 'Match sacred symbols to their meanings in this linguistic trial.', icon: Languages, color: 'from-lapis to-turquoise', emoji: '𓇚', category: 'Wisdom', difficulty: 'Medium', duration: '3-5 min', isNew: true },
  { id: 'riddles', title: "Pharaoh's Riddles", description: "Face the Sphinx and answer 4 levels of cryptic ancient wisdom.", icon: Star, color: 'from-scarab to-turquoise', emoji: '🦁', category: 'Wisdom', difficulty: 'Expert', duration: '5-8 min' },
  { id: 'scarab-collector', title: 'Scarab Collector', description: 'Catch sacred scarabs in a high-stakes 5-wave desert swarm trial.', icon: Bug, color: 'from-scarab to-gold-dark', emoji: '𓆣', category: 'Action', difficulty: 'Hard', duration: '3-5 min' },
  { id: 'memory', title: 'Trials of Wisdom', description: 'Master the divine archives through 5 levels of increasing complexity.', icon: Brain, color: 'from-lapis to-lapis-deep', emoji: '𓂀', category: 'Wisdom', difficulty: 'Medium', duration: '2-4 min' },
  { id: 'maze', title: 'Solar & Lunar Maze', description: 'Coordinate twin spirits through 5 perilous tomb labyrinths.', icon: Map, color: 'from-gold-dark to-primary', emoji: '🧟', category: 'Action', difficulty: 'Hard', duration: '3-5 min' },
  { id: 'guess-the-pharaoh', title: 'Guess the Pharaoh', description: 'Identify legendary rulers in this 5-wave historical challenge.', icon: Crown, color: 'from-yellow-400 to-amber-600', emoji: '👑', category: 'History', difficulty: 'Medium', duration: '3-5 min' },
  { id: 'pyramid', title: 'Pyramid Builder', description: 'Stack sacred stones with divine precision in a 4-phase trial.', icon: Building, color: 'from-primary to-gold-light', emoji: '🏛️', category: 'Action', difficulty: 'Medium', duration: '3-5 min' },
  { id: 'decoder', title: 'Hieroglyph Decoder', description: 'Decipher sacred symbols through 5 waves of scribal tests.', icon: Languages, color: 'from-turquoise to-lapis', emoji: '𓇚', category: 'Wisdom', difficulty: 'Hard', duration: '3-5 min' },
  { id: 'temple-escape', title: 'Temple Escape', description: 'Survive 5 chambers of deadly traps in a high-pressure escape.', icon: Timer, color: 'from-terracotta to-gold-dark', emoji: '🏺', category: 'Action', difficulty: 'Expert', duration: '4-6 min' },
  { id: 'nile-navigator', title: 'Nile Navigator', description: 'Sail 5 dangerous reaches of the Nile to prove your navigation.', icon: Sailboat, color: 'from-lapis to-turquoise', emoji: '⛵', category: 'Action', difficulty: 'Hard', duration: '3-5 min' },
  { id: 'pyramid-trail', title: 'The Pyramid Trail', description: 'Embark on a 3-region cartographic expedition across the royal necropolis.', icon: Map, color: 'from-gold to-amber-600', emoji: '📍', category: 'History', difficulty: 'Hard', duration: '5 min' },
  { id: 'order-builders', title: 'Chronicles of the Nile', description: 'Reconstruct the 3-era broken timeline of the Pharaohs through the ages.', icon: Clock, color: 'from-primary to-gold-dark', emoji: '⏳', category: 'History', difficulty: 'Expert', duration: '6 min' },
  { id: 'great-minds', title: 'Hall of Records', description: 'Investigate the deeds and wisdom of history in a 2-volume saga.', icon: Users, color: 'from-lapis to-primary', emoji: '🧠', category: 'History', difficulty: 'Hard', duration: '5 min' },
  { id: 'scribes-journal', title: "Scribe's Journal", description: "Piece together historical events from fragmented journal entries.", icon: BookOpen, color: 'from-emerald-500 to-teal-700', emoji: '📓', category: 'History', difficulty: 'Medium', duration: '5 min' },
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
};

export default function Games() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [filter, setFilter] = useState<'All' | 'Wisdom' | 'Action' | 'History'>('All');

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
    if (GameComponent) {
      return (
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="font-display text-gold tracking-widest uppercase">Preparing Trial...</p>
            </div>
          </div>
        }>
          <GameComponent onBack={handleBackToMenu} />
        </Suspense>
      );
    }
  }

  const filteredGames = filter === 'All' ? games : games.filter(g => g.category === (filter as 'Wisdom' | 'Action' | 'History'));

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-hero-gradient relative overflow-hidden">
      <DustParticles />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-6">
            <Trophy size={14} /> NEW PROFESSIONAL TRIALS AVAILABLE
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-gold-gradient mb-6">Ancient Games</h1>
          <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto mb-10 leading-relaxed">
            Test your prowess in the courts of the Pharaohs. From mental puzzles to swift action,
            prove your worth and etch your name into the Hall of Records.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <EgyptianButton variant="lapis" size="lg" onClick={() => setShowLeaderboard(!showLeaderboard)}>
              <Trophy size={20} className="mr-2" /> {showLeaderboard ? 'Hide Leaderboard' : 'Hall of Records'}
            </EgyptianButton>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
            <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-xl border border-white/10">
              {['All', 'Wisdom', 'Action', 'History'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as 'All' | 'Wisdom' | 'Action' | 'History')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === cat ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {showLeaderboard && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12">
            <Leaderboard />
          </motion.div>
        )}

        {/* Featured Section */}
        {/* Games Grid */}
        <div className="grid md:grid-cols-2 gap-8">
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
                <EgyptianCard
                  variant="interactive"
                  padding="none"
                  className="h-full overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className={`md:w-1/3 min-h-[160px] bg-gradient-to-br ${game.color} flex items-center justify-center p-8 relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-20 hieroglyph-pattern" />
                      <span className="text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10">{game.emoji}</span>
                    </div>
                    <div className="md:w-2/3 p-6 flex flex-col justify-between bg-obsidian/40">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold tracking-widest text-primary uppercase">{game.category}</span>
                          <div className="flex items-center gap-1 text-[10px] text-turquoise font-bold uppercase">
                            <Timer size={12} /> {game.duration}
                          </div>
                        </div>
                        <h3 className="text-2xl font-display text-white mb-2 group-hover:text-primary transition-colors">{game.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{game.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} size={14} className={i < (game.difficulty === 'Hard' || game.difficulty === 'Expert' ? 3 : 2) ? "text-primary fill-primary" : "text-white/10"} />
                          ))}
                        </div>
                        <div className="text-primary group-hover:translate-x-1 transition-transform flex items-center text-sm font-bold">
                          PLAY NOW <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </EgyptianCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
