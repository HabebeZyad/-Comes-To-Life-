import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Lock, Gamepad2, Trophy, Info, Sparkles } from 'lucide-react';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { SenetGame } from './senet/SenetGame';

interface GamesOfTheNileProps {
  onBack: () => void;
}

type SubGame = 'hub' | 'senet' | 'mehen' | 'hounds';

export const GamesOfTheNile: React.FC<GamesOfTheNileProps> = ({ onBack }) => {
  const [view, setView] = useState<SubGame>('hub');

  if (view === 'senet') {
    return <SenetGame onBack={() => setView('hub')} />;
  }

  const subGames = [
    {
      id: 'senet',
      title: 'Senet',
      description: 'The "Game of Passage". Navigate your pieces through the underworld squares to achieve rebirth.',
      icon: Gamepad2,
      difficulty: 'Expert',
      isLocked: false,
    },
    {
      id: 'mehen',
      title: 'Mehen',
      description: 'The Coiled Serpent. A race from the tail to the head of the snake god Mehen.',
      icon: Sparkles,
      difficulty: 'Medium',
      isLocked: true,
    },
    {
      id: 'hounds',
      title: 'Hounds & Jackals',
      description: '58 Holes. A tactical race game with pegs shaped like sacred animals.',
      icon: Trophy,
      difficulty: 'Hard',
      isLocked: true,
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-hero-gradient relative">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <EgyptianButton variant="ghost" onClick={onBack} className="-ml-4 mb-6">
            <ChevronLeft className="mr-2" /> Back to Main Games
          </EgyptianButton>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl md:text-7xl font-display text-gold-gradient mb-4">Games of the Nile</h1>
              <p className="text-xl text-muted-foreground font-body max-w-2xl italic">
                "To play Senet is to walk the path of the soul through the Duat..."
              </p>
            </div>
            
            <div className="px-6 py-3 bg-primary/10 border border-primary/30 rounded-xl flex items-center gap-3">
               <Info className="text-primary" />
               <p className="text-xs font-display text-gold tracking-widest uppercase">Ancient Wisdom Series</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subGames.map((game) => (
            <motion.div
              key={game.id}
              whileHover={!game.isLocked ? { y: -10 } : {}}
              className="relative"
            >
              <EgyptianCard 
                variant={game.isLocked ? "museum" : "interactive"}
                padding="none"
                className={`h-full overflow-hidden border border-gold/20 ${game.isLocked ? 'opacity-70' : ''}`}
                onClick={() => !game.isLocked && setView(game.id as SubGame)}
              >
                <div className={`h-48 flex items-center justify-center relative bg-gradient-to-br ${game.isLocked ? 'from-obsidian to-black' : 'from-gold-dark/40 to-primary/20'}`}>
                   <div className="absolute inset-0 hieroglyph-pattern opacity-10" />
                   {game.isLocked ? (
                     <Lock className="w-16 h-16 text-white/20" />
                   ) : (
                     <game.icon className="w-20 h-20 text-gold drop-shadow-gold-glow" />
                   )}
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-display text-white">{game.title}</h3>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest px-2 py-0.5 border border-primary/30 rounded">
                      {game.difficulty}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed mb-6 h-12 overflow-hidden line-clamp-2">
                    {game.description}
                  </p>
                  
                  <EgyptianButton 
                    variant={game.isLocked ? "ghost" : "default"} 
                    className="w-full"
                    disabled={game.isLocked}
                  >
                    {game.isLocked ? "EXPANSION COMING SOON" : "PLAY GAME"}
                  </EgyptianButton>
                </div>
              </EgyptianCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
