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
const TALE_FOUR_IMAGES = Array.from({ length: 16 }, (_, i) => encodeURI(`/fouth tale/${i + 1}.jpg`));
const TALE_FIVE_IMAGES = [
  encodeURI('/the fifth tale/begining.jpg'),
  ...Array.from({ length: 23 }, (_, i) => encodeURI(`/the fifth tale/${i + 1}.jpg`))
];

interface WestcarPapyrusHubProps {
  onReadPrologue: () => void;
}

export function WestcarPapyrusHub({ onReadPrologue }: WestcarPapyrusHubProps) {
  const [activeTale, setActiveTale] = useState<'tale-one' | 'tale-two' | 'tale-three' | 'tale-four' | 'tale-five' | null>(null);
  const story = getStoryById('westcar-papyrus');

  const playHoverSound = () => {
    const audio = new Audio(getAssetUrl('/sounds/paper-transition.mp3'));
    audio.volume = 0.05;
    audio.play().catch(() => {});
  };

  if (!story) return null;

  const tales = [
    {
      id: 'tale-one',
      title: 'The First Tale',
      subtitle: 'The Wonder of Imhotep',
      description: 'The legendary story of the architect Imhotep and the wonder he performed for King Djoser.',
      icon: Sparkles,
      color: 'from-[#b8860b] to-[#8a642f]',
      accent: 'text-amber-800',
      action: () => setActiveTale('tale-one'),
      image: '/charcahters of the first tale.jpg',
      locked: false,
      pages: 9,
      num: 'I'
    },
    {
      id: 'tale-two',
      title: 'The Second Tale',
      subtitle: 'The Wax Crocodile',
      description: 'The magical tale of the priest Ubaoner and the retribution of his wax crocodile.',
      icon: BookOpen,
      color: 'from-emerald-600 to-emerald-800',
      accent: 'text-emerald-800',
      action: () => setActiveTale('tale-two'),
      image: '/Charachters of The second tale.jpg',
      locked: false,
      pages: 17,
      num: 'II'
    },
    {
      id: 'tale-three',
      title: 'The Third Tale',
      subtitle: 'The Wonder of King Sneferu',
      description: 'The famous tale of the magician Djadjaemankh parting the waters for King Sneferu.',
      icon: Sparkles,
      color: 'from-blue-600 to-blue-800',
      accent: 'text-blue-800',
      action: () => setActiveTale('tale-three'),
      image: '/Charachters of the third tale.jpg',
      locked: false,
      pages: 19,
      num: 'III'
    },
    {
      id: 'tale-four',
      title: 'The Fourth Tale',
      subtitle: 'Djedi the Magician',
      description: 'Follow the incredible visual story of Djedi, the 110-year-old sage.',
      icon: Sparkles,
      color: 'from-purple-600 to-purple-800',
      accent: 'text-purple-800',
      action: () => setActiveTale('tale-four'),
      image: '/Charachters of the Fourth tale.jpg',
      locked: false,
      pages: 16,
      num: 'IV'
    },
    {
      id: 'tale-five',
      title: 'The Fifth Tale',
      subtitle: 'The Royal Children',
      description: 'The prophecy of the birth of the kings of the Fifth Dynasty.',
      icon: BookOpen,
      color: 'from-amber-600 to-amber-800',
      accent: 'text-amber-800',
      action: () => setActiveTale('tale-five'),
      image: '/Charachters of the Fifth tale.jpg',
      locked: false,
      pages: 24,
      num: 'V'
    }
  ];

  return (
    <div className="min-h-screen bg-background relative flex flex-col pb-16">
      <DustParticles count={30} />
      
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
          <div className="flex items-center justify-between">
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
      <main className="flex-1 flex flex-col pt-24 px-6 max-w-6xl mx-auto w-full z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-4xl mb-4 inline-block animate-glow-pulse">📜</span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient mb-6 tracking-wide uppercase">
            The Westcar Papyrus
          </h1>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
            Journey through the ancient Westcar Papyrus, a collection of magical tales from the Old Kingdom. Experience these legendary wonders through vividly illustrated adaptations.
          </p>

          <div className="flex justify-center">
            <EgyptianButton 
              variant="interactive"
              size="lg"
              onClick={onReadPrologue}
              className="font-display font-extrabold tracking-widest text-xs px-8 py-3.5 border border-gold/40 shadow-gold-glow animate-pulse"
            >
              𓂀 DECIPHER ROYAL PROLOGUE
            </EgyptianButton>
          </div>
        </motion.div>

        {/* The Papyrus Scroll Display Board */}
        <div className="relative my-8 p-6 md:p-10 bg-[#f4ebd0] border-2 border-[#b8860b]/40 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.85),inset_0_0_80px_rgba(139,94,26,0.2)] max-w-5xl mx-auto w-full">
          {/* Decorative Papyrus Fiber Texture Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,94,26,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,94,26,0.03)_1px,transparent_1px)] bg-[size:16px_16px] rounded-3xl pointer-events-none" />
          
          {/* Left Wooden Roller */}
          <div className="absolute top-[-8px] bottom-[-8px] left-[-16px] w-6 bg-gradient-to-r from-[#2a1708] via-[#42220f] to-[#1e1005] rounded-full shadow-[5px_0_15px_rgba(0,0,0,0.5)] z-20 hidden lg:block">
            {/* Top Gold Knob */}
            <div className="absolute top-[-14px] left-[-3px] right-[-3px] h-6 bg-gradient-to-r from-gold via-gold-light to-gold-dark rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.3)] border border-gold/45" />
            {/* Bottom Gold Knob */}
            <div className="absolute bottom-[-14px] left-[-3px] right-[-3px] h-6 bg-gradient-to-r from-gold via-gold-light to-gold-dark rounded-full shadow-[0_-2px_5px_rgba(0,0,0,0.3)] border border-gold/45" />
          </div>

          {/* Right Wooden Roller */}
          <div className="absolute top-[-8px] bottom-[-8px] right-[-16px] w-6 bg-gradient-to-r from-[#1e1005] via-[#42220f] to-[#2a1708] rounded-full shadow-[-5px_0_15px_rgba(0,0,0,0.5)] z-20 hidden lg:block">
            {/* Top Gold Knob */}
            <div className="absolute top-[-14px] left-[-3px] right-[-3px] h-6 bg-gradient-to-r from-gold via-gold-light to-gold-dark rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.3)] border border-gold/45" />
            {/* Bottom Gold Knob */}
            <div className="absolute bottom-[-14px] left-[-3px] right-[-3px] h-6 bg-gradient-to-r from-gold via-gold-light to-gold-dark rounded-full shadow-[0_-2px_5px_rgba(0,0,0,0.3)] border border-gold/45" />
          </div>

          {/* Ornate Gold Border Line */}
          <div className="absolute inset-4 border border-[#b8860b]/25 rounded-2xl pointer-events-none z-10" />

          {/* Grid of Tales */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tales.map((tale, index) => (
              <motion.div
                key={tale.id}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6, ease: "easeOut" }}
                className="h-full"
              >
                <div 
                  onClick={tale.locked ? undefined : tale.action} 
                  onMouseEnter={playHoverSound}
                  className="h-full cursor-pointer"
                >
                  <TiltCard 
                    className={`p-0 overflow-hidden flex flex-col group h-full !border-[#8a642f]/35 !bg-[#faebd7] shadow-[0_12px_24px_rgba(64,39,18,0.15)] hover:shadow-[0_20px_35px_rgba(64,39,18,0.25)] transition-all duration-500`} 
                    tilt={!tale.locked}
                  >
                    <div className="relative h-44 overflow-hidden bg-stone-900">
                      <div className="absolute inset-0 bg-black/25 z-10 group-hover:bg-transparent transition-colors duration-500" />
                      <img 
                        src={getAssetUrl(tale.image)} 
                        alt={tale.title} 
                        className="w-full h-full object-cover sepia-[35%] contrast-[105%] transition-all duration-700 group-hover:scale-105 group-hover:sepia-0"
                        onError={(e) => { e.currentTarget.src = '/westcar.jpg'; }}
                      />
                      {/* Glowing diagonal sheen sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out z-20" />
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#faebd7] to-transparent z-15" />
                    </div>
                    
                    <div className={`h-[3px] bg-gradient-to-r ${tale.color} relative z-30`} />
                    
                    <div className="p-5 flex flex-col flex-grow relative z-30 transform-gpu [transform:translateZ(30px)]">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#b22222] bg-[#b22222]/5 px-2 py-0.5 rounded border border-[#b22222]/15">
                          Scroll {tale.num}
                        </span>
                        <span className="text-[10px] font-display font-extrabold uppercase tracking-widest text-[#8a642f] bg-[#8a642f]/5 px-2 py-0.5 rounded border border-[#8a642f]/15">
                          {tale.pages} Pages
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 flex-grow">
                        <div className="text-[11px] font-display font-bold uppercase tracking-widest text-[#8a642f]/90 leading-tight">
                          {tale.subtitle}
                        </div>
                        <h3 className="font-display text-xl text-stone-900 group-hover:text-amber-800 transition-colors uppercase tracking-tight font-extrabold">
                          {tale.title}
                        </h3>
                        <p className="font-body text-xs text-stone-700/95 leading-relaxed pt-2">
                          {tale.description}
                        </p>
                      </div>
                      
                      <div className="mt-5 pt-3 border-t border-[#8a642f]/10">
                        <span className="text-xs font-display uppercase tracking-widest font-extrabold flex items-center text-amber-700 group-hover:text-amber-900 transition-all duration-300">
                          Unroll Scroll <ChevronLeft className="w-4 h-4 ml-1 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Image Sequence Modals */}
      <AnimatePresence>
        {activeTale === 'tale-one' && (
          <ImageSequenceViewer 
            title="The First Tale: The Wonder of Imhotep"
            images={TALE_ONE_IMAGES}
            onClose={() => setActiveTale(null)}
            onNextTale={() => setActiveTale('tale-two')}
            nextTaleTitle="The Second Tale: The Wax Crocodile"
          />
        )}
        {activeTale === 'tale-two' && (
          <ImageSequenceViewer 
            title="The Second Tale: The Wax Crocodile"
            images={TALE_TWO_IMAGES}
            onClose={() => setActiveTale(null)}
            onNextTale={() => setActiveTale('tale-three')}
            nextTaleTitle="The Third Tale: The Wonder of King Sneferu"
          />
        )}
        {activeTale === 'tale-three' && (
          <ImageSequenceViewer 
            title="The Third Tale: The Wonder of King Sneferu"
            images={TALE_THREE_IMAGES}
            onClose={() => setActiveTale(null)}
            onNextTale={() => setActiveTale('tale-four')}
            nextTaleTitle="The Fourth Tale: Djedi the Magician"
          />
        )}
        {activeTale === 'tale-four' && (
          <ImageSequenceViewer 
            title="The Fourth Tale: Djedi the Magician"
            images={TALE_FOUR_IMAGES}
            onClose={() => setActiveTale(null)}
            onNextTale={() => setActiveTale('tale-five')}
            nextTaleTitle="The Fifth Tale: The Royal Children"
          />
        )}
        {activeTale === 'tale-five' && (
          <ImageSequenceViewer 
            title="The Fifth Tale: The Royal Children"
            images={TALE_FIVE_IMAGES}
            onClose={() => setActiveTale(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
