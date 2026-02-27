import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Brain, Map, Puzzle, Building, Languages } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { MemoryGame } from '@/components/games/MemoryGame';
import { PharaohRiddlesGame } from '@/components/games/PharaohRiddlesGame';
import { PyramidBuilderGame } from '@/components/games/PyramidBuilderGame';
import { HieroglyphDecoderGame } from '@/components/games/HieroglyphDecoderGame';
import { DustParticles } from '@/components/effects/DustParticles';

type GameType = 'menu' | 'memory' | 'maze' | 'riddles' | 'pyramid' | 'decoder';

const games = [
  {
    id: 'memory' as const,
    title: 'Sacred Symbols Memory',
    description: 'Match pairs of ancient Egyptian hieroglyphs and sacred symbols',
    icon: Puzzle,
    color: 'from-lapis to-lapis-deep',
    emoji: '𓋹'
  },
  {
    id: 'riddles' as const,
    title: "Pharaoh's Riddles",
    description: 'Answer the sphinx\'s riddles and prove your ancient wisdom',
    icon: Brain,
    color: 'from-scarab to-turquoise',
    emoji: '🦁'
  },
  {
    id: 'pyramid' as const,
    title: 'Pyramid Builder',
    description: 'Stack sacred blocks with precision to construct the perfect pyramid',
    icon: Building,
    color: 'from-primary to-gold-light',
    emoji: '🏛️'
  },
  {
    id: 'decoder' as const,
    title: 'Hieroglyph Decoder',
    description: 'Decipher ancient symbols and unlock the secrets of the pharaohs',
    icon: Languages,
    color: 'from-turquoise to-lapis',
    emoji: '𓂀'
  }
];

export default function Games() {
  const [currentGame, setCurrentGame] = useState<GameType>('menu');

  if (currentGame === 'memory') {
    return <MemoryGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'riddles') {
    return <PharaohRiddlesGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'pyramid') {
    return <PyramidBuilderGame onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'decoder') {
    return <HieroglyphDecoderGame onBack={() => setCurrentGame('menu')} />;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-hero-gradient relative">
      <DustParticles />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gamepad2 className="w-10 h-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient">
              Ancient Games
            </h1>
          </div>
          <p className="text-xl text-muted-foreground font-body max-w-2xl mx-auto">
            Challenge your mind with games inspired by ancient Egyptian culture, mythology, and history
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <EgyptianCard 
                variant="interactive" 
                padding="none"
                glowOnHover
                className="h-full"
              >
                <div className={`h-40 bg-gradient-to-br ${game.color} flex items-center justify-center`}>
                  <span className="text-7xl">{game.emoji}</span>
                </div>
                <div className="p-6">
                  <EgyptianCardHeader className="mb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <game.icon className="w-5 h-5 text-primary" />
                      </div>
                      <EgyptianCardTitle className="text-xl">{game.title}</EgyptianCardTitle>
                    </div>
                  </EgyptianCardHeader>
                  <EgyptianCardContent>
                    <EgyptianCardDescription className="mb-6">
                      {game.description}
                    </EgyptianCardDescription>
                    <EgyptianButton 
                      variant="default" 
                      className="w-full"
                      onClick={() => setCurrentGame(game.id)}
                    >
                      Play Now
                    </EgyptianButton>
                  </EgyptianCardContent>
                </div>
              </EgyptianCard>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <EgyptianCard variant="tomb" padding="lg" className="max-w-2xl mx-auto">
            <div className="text-6xl mb-4">🏺</div>
            <h3 className="text-2xl font-display text-gold-gradient mb-2">More Games Coming Soon</h3>
            <p className="text-muted-foreground font-body">
              We're crafting more ancient adventures including Temple Escape, Chariot Race, and Nile Navigator
            </p>
          </EgyptianCard>
        </motion.div>
      </div>
    </div>
  );
}


