import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Brain, Map, Puzzle, Building, Languages, Timer, Sailboat, Bug, Trophy, Crown } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription, EgyptianCardContent } from '@/components/ui/EgyptianCard';
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
import { Leaderboard } from '@/components/games/Leaderboard';
import { DustParticles } from '@/components/effects/DustParticles';

type GameType = 'menu' | 'memory' | 'maze' | 'riddles' | 'pyramid' | 'decoder' | 'temple-escape' | 'nile-navigator' | 'scarab-collector' | 'guess-the-pharaoh';

const games = [
  { id: 'guess-the-pharaoh' as const, title: 'Guess the Pharaoh', description: 'Identify the pharaoh from the given clue', icon: Crown, color: 'from-yellow-400 to-amber-600', emoji: '👑' },
  { id: 'memory' as const, title: 'Sacred Symbols Memory', description: 'Match pairs of ancient Egyptian hieroglyphs and sacred symbols', icon: Puzzle, color: 'from-lapis to-lapis-deep', emoji: '𓋹' },
  { id: 'maze' as const, title: 'Mummy Maze Runner', description: 'Navigate the tomb labyrinth while escaping the pursuing mummy', icon: Map, color: 'from-gold-dark to-primary', emoji: '🧟' },
  { id: 'riddles' as const, title: "Pharaoh's Riddles", description: "Answer the sphinx's riddles and prove your ancient wisdom", icon: Brain, color: 'from-scarab to-turquoise', emoji: '🦁' },
  { id: 'pyramid' as const, title: 'Pyramid Builder', description: 'Stack sacred blocks with precision to construct the perfect pyramid', icon: Building, color: 'from-primary to-gold-light', emoji: '🏛️' },
  { id: 'decoder' as const, title: 'Hieroglyph Decoder', description: 'Decipher ancient symbols and unlock the secrets of the pharaohs', icon: Languages, color: 'from-turquoise to-lapis', emoji: '𓂀' },
  { id: 'temple-escape' as const, title: 'Temple Escape', description: 'Navigate deadly traps and puzzles to escape the cursed temple', icon: Timer, color: 'from-terracotta to-gold-dark', emoji: '🏛️' },
  { id: 'nile-navigator' as const, title: 'Nile Navigator', description: 'Sail the sacred river dodging obstacles and collecting treasures', icon: Sailboat, color: 'from-lapis to-turquoise', emoji: '⛵' },
  { id: 'scarab-collector' as const, title: 'Scarab Collector', description: 'Catch sacred scarabs before they vanish, avoid cursed scorpions!', icon: Bug, color: 'from-scarab to-gold-dark', emoji: '𓆣' },
];

const gameComponents: Record<string, React.FC<{ onBack: () => void }>> = {
  memory: MemoryGame,
  maze: MummyMazeGame,
  riddles: PharaohRiddlesGame,
  pyramid: PyramidBuilderGame,
  decoder: HieroglyphDecoderGame,
  'temple-escape': TempleEscapeGame,
  'nile-navigator': NileNavigatorGame,
  'scarab-collector': ScarabCollectorGame,
  'guess-the-pharaoh': GuessThePharaohGame,
};

export default function Games() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');
  const [showLeaderboard, setShowLeaderboard] = useState(false);

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

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-hero-gradient relative">
      <DustParticles />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient">Ancient Games</h1>
          </div>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-6">
            Challenge your mind with games inspired by ancient Egyptian culture, mythology, and history
          </p>
          <EgyptianButton
            variant={showLeaderboard ? 'default' : 'lapis'}
            size="lg"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Trophy size={20} /> {showLeaderboard ? 'Hide Leaderboard' : 'Hall of Records'}
          </EgyptianButton>
        </motion.div>

        {showLeaderboard && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <Leaderboard />
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EgyptianCard variant="interactive" padding="none" glowOnHover className="h-full">
                <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                  <span className="text-6xl">{game.emoji}</span>
                </div>
                <div className="p-5">
                  <EgyptianCardHeader className="mb-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <game.icon className="w-4 h-4 text-primary" />
                      </div>
                      <EgyptianCardTitle className="text-lg">{game.title}</EgyptianCardTitle>
                    </div>
                  </EgyptianCardHeader>
                  <EgyptianCardContent>
                    <EgyptianCardDescription className="mb-4 text-base">
                      {game.description}
                    </EgyptianCardDescription>
                    <EgyptianButton variant="default" className="w-full" onClick={() => handleGameSelect(game.id)}>
                      Play Now
                    </EgyptianButton>
                  </EgyptianCardContent>
                </div>
              </EgyptianCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
