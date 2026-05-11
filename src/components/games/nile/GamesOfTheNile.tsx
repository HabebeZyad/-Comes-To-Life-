import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Lock, Gamepad2, Trophy, Info, Sparkles, Star, Timer, ChevronRight, Zap, Target } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { SenetGame } from './senet/SenetGame';
import { MehenGame } from './mehen/MehenGame';
import { HoundsGame } from './hounds/HoundsGame';

interface GamesOfTheNileProps {
  onBack: () => void;
}

type SubGame = 'hub' | 'senet' | 'mehen' | 'hounds';

const difficultyValue: Record<string, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
  Expert: 4,
};

export const GamesOfTheNile: React.FC<GamesOfTheNileProps> = ({ onBack }) => {
  const [view, setView] = useState<SubGame>('hub');

  if (view === 'senet') {
    return <SenetGame onBack={() => setView('hub')} />;
  }

  if (view === 'mehen') {
    return <MehenGame onBack={() => setView('hub')} />;
  }

  if (view === 'hounds') {
    return <HoundsGame onBack={() => setView('hub')} />;
  }

  const subGames = [
    {
      id: 'senet',
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
      id: 'mehen',
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
      id: 'hounds',
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
                  onClick={() => !game.isLocked && setView(game.id as SubGame)}
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
                        {game.isLocked ? 'Locked' : 'Play Trial'} <ChevronRight size={14} className="ml-1" />
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
