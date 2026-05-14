import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BookOpen, ScrollText, Sparkles, Lock, Scroll } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { ImageSequenceViewer } from './ImageSequenceViewer';
import { getStoryById } from '@/data/egyptianStories';
import { getAssetUrl } from '@/lib/utils';

// Define the static sequences based on the public folders
const TALE_ONE_IMAGES = Array.from({ length: 9 }, (_, i) => encodeURI(`/First Tale/Page ${i + 1}.jpg`));
const TALE_TWO_IMAGES = Array.from({ length: 17 }, (_, i) => encodeURI(`/Second Tale/${i + 1}.jpg`));
const TALE_THREE_IMAGES = Array.from({ length: 19 }, (_, i) => encodeURI(`/Third Tale/${i + 1}.jpg`));

interface WestcarPapyrusHubProps {
  onReadPrologue: () => void;
}

export function WestcarPapyrusHub({ onReadPrologue }: WestcarPapyrusHubProps) {
  const [activeTale, setActiveTale] = useState<'tale-one' | 'tale-two' | 'tale-three' | 'tale-four' | 'tale-five' | null>(null);
  const story = getStoryById('westcar-papyrus');

  if (!story) return null;

  const tales = [
    {
      id: 'tale-one',
      title: 'The First Tale',
      subtitle: 'The Wonder of Imhotep',
      description: 'The legendary story of the architect Imhotep and the wonder he performed for King Djoser.',
      icon: Sparkles,
      color: 'from-gold to-gold-dark',
      accent: 'text-gold',
      action: () => setActiveTale('tale-one'),
      image: '/charcahters of the first tale.jpg',
      locked: false
    },
    {
      id: 'tale-two',
      title: 'The Second Tale',
      subtitle: 'The Wax Crocodile',
      description: 'The magical tale of the priest Ubaoner and the retribution of his wax crocodile.',
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-700',
      accent: 'text-emerald-500',
      action: () => setActiveTale('tale-two'),
      image: '/Charachters of The second tale.jpg',
      locked: false
    },
    {
      id: 'tale-three',
      title: 'The Third Tale',
      subtitle: 'The Wonder of King Sneferu',
      description: 'The famous tale of the magician Djadjaemankh parting the waters for King Sneferu.',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-700',
      accent: 'text-blue-400',
      action: () => setActiveTale('tale-three'),
      image: '/Charachters of the third tale.jpg',
      locked: false
    },
    {
      id: 'tale-four',
      title: 'The Fourth Tale',
      subtitle: 'Djedi the Magician',
      description: 'Follow the incredible visual story of Djedi, the 110-year-old sage.',
      icon: Lock,
      color: 'from-slate-500 to-slate-700',
      accent: 'text-slate-400',
      action: () => {},
      image: '/tale-four-cover.jpg',
      locked: true
    },
    {
      id: 'tale-five',
      title: 'The Fifth Tale',
      subtitle: 'The Royal Children',
      description: 'The prophecy of the birth of the kings of the Fifth Dynasty.',
      icon: Lock,
      color: 'from-slate-500 to-slate-700',
      accent: 'text-slate-400',
      action: () => {},
      image: '/tale-five-cover.jpg',
      locked: true
    }
  ];

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      <DustParticles count={25} />
      
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="hubBg" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="10" cy="10" r="1" fill="hsl(var(--gold))" opacity="0.5" />
              <path d="M15,5 Q17,8 15,11" stroke="hsl(var(--gold))" strokeWidth="0.3" fill="none" opacity="0.6" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hubBg)" />
        </svg>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/stories">
              <EgyptianButton variant="ghost" size="sm" className="hover:bg-white/5">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Library
              </EgyptianButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-24 pb-12 px-6 max-w-6xl mx-auto w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-4xl mb-4 inline-block animate-glow-pulse">📜</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient mb-6 tracking-wide uppercase">
            The Westcar Papyrus
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Journey through the ancient Westcar Papyrus, a collection of magical tales from the Old Kingdom. Experience these legendary wonders through vividly illustrated adaptations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tales.map((tale, index) => (
            <motion.div
              key={tale.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="h-full"
            >
              <div onClick={tale.locked ? undefined : tale.action} className="h-full cursor-pointer">
              <TiltCard className={`p-0 overflow-hidden flex flex-col group h-full border-white/5 ${tale.locked ? 'bg-background/20 opacity-70 grayscale' : 'bg-background/40 hover:bg-background/60'}`} tilt={!tale.locked}>
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors duration-500" />
                  <img 
                    src={getAssetUrl(tale.image)} 
                    alt={tale.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = '/westcar.jpg'; }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
                </div>
                
                <div className={`h-1 bg-gradient-to-r ${tale.color} relative z-30`} />
                
                <div className="p-6 flex flex-col flex-grow relative z-30 transform-gpu [transform:translateZ(30px)]">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg bg-black/40 border border-white/10`}>
                      <tale.icon className={`w-5 h-5 ${tale.accent}`} />
                    </div>
                  </div>
                  
                  <div className="space-y-2 flex-grow">
                    <div className={`text-xs font-bold uppercase tracking-widest ${tale.accent} opacity-80`}>
                      {tale.subtitle}
                    </div>
                    <h3 className="font-display text-2xl text-foreground group-hover:text-gold-light transition-colors uppercase tracking-tight">
                      {tale.title}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground/80 leading-relaxed pt-2">
                      {tale.description}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <span className={`text-xs font-display uppercase tracking-widest font-bold flex items-center ${tale.locked ? 'text-slate-500' : `${tale.accent} group-hover:pl-2 transition-all duration-300`}`}>
                      {tale.locked ? 'Coming Soon' : 'Read Tale'} {!tale.locked && <ChevronLeft className="w-4 h-4 ml-1 rotate-180" />}
                    </span>
                  </div>
                </div>
              </TiltCard>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Image Sequence Modals */}
      <AnimatePresence>
        {activeTale === 'tale-one' && (
          <ImageSequenceViewer 
            title="The First Tale: The Wonder of Imhotep"
            images={TALE_ONE_IMAGES}
            onClose={() => setActiveTale(null)}
          />
        )}
        {activeTale === 'tale-two' && (
          <ImageSequenceViewer 
            title="The Second Tale: The Wax Crocodile"
            images={TALE_TWO_IMAGES}
            onClose={() => setActiveTale(null)}
          />
        )}
        {activeTale === 'tale-three' && (
          <ImageSequenceViewer 
            title="The Third Tale: The Wonder of King Sneferu"
            images={TALE_THREE_IMAGES}
            onClose={() => setActiveTale(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
