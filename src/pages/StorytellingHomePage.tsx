import { BookOpen, Play, Clock, BookOpen as BookIcon, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { CelestialSimulation } from '@/components/effects/CelestialSimulation';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { ScryingOrb } from '@/components/storytelling/ScryingOrb';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function StorytellingHomePage() {
  const [isPanoOpen, setIsPanoOpen] = useState(false);

  const getAssetUrl = (path?: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const base = import.meta.env.BASE_URL || '/';
    if (path.startsWith('/')) {
      return `${base}${path.slice(1)}`.replace(/\/\//g, '/');
    }
    return `${base}${path}`.replace(/\/\//g, '/');
  };

  const storytellingEpisodes = [
    {
      id: "shipwrecked-sailor",
      title: "The Shipwrecked Sailor",
      subtitle: "A Tale of Survival and the Serpent King",
      description: "A miraculous tale of a sailor whose ship is destroyed by a colossal wave. Washed ashore on a mystical island, he encounters a giant, golden serpent—the Lord of Punt—who teaches him courage and the true meaning of home.",
      image: getAssetUrl("/shipwrecked-sailor.jpeg"),
      path: "/stories/shipwrecked-sailor",
      color: "from-gold to-gold-dark",
      period: "Middle Kingdom",
      readTime: 15,
      panels: 24,
      locations: ["Red Sea", "Island of Ka"]
    },
    {
      id: "capture-of-joppa",
      title: "The Capture Of Joppa",
      subtitle: "The First Trojan Horse",
      description: "A brilliant military strategy involving cunning soldiers hidden inside large baskets, leading to the surrender of the rebel city of Joppa. A precursor to the legendary Trojan Horse.",
      image: getAssetUrl("/images/stories/joppa_baskets.png"),
      path: "#",
      color: "from-sandstone to-sandstone-dark",
      period: "New Kingdom",
      readTime: 12,
      panels: 18,
      locations: ["Joppa", "Military Camp"]
    },
    {
      id: "tale-of-sinuhe",
      title: "The Tale of Sinuhe",
      subtitle: "Exile and Redemption",
      description: "The classic Egyptian masterpiece of an official who flees into exile in the Levant, rises to power among the Bedouin, but longs for his homeland and a proper Egyptian burial.",
      image: getAssetUrl("/images/stories/sinuhe_exile.png"),
      path: "/stories/tale-of-sinuhe",
      color: "from-terracotta to-terracotta-dark",
      period: "Middle Kingdom",
      readTime: 20,
      panels: 32,
      locations: ["Itjtawy", "Retjenu"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0805] text-foreground pt-24 pb-20 relative overflow-hidden">
      <CelestialSimulation timeOfDay="night" />
      <DustParticles count={30} />
      <HieroglyphBackground density="low" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-block p-4 rounded-full bg-gold/5 border border-gold/10 mb-6">
            <BookOpen className="w-12 h-12 text-gold animate-glow-pulse" />
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-gold-gradient mb-4 tracking-tighter">
            Animated Legends
          </h1>
          <p className="font-body text-xl text-gold/60 max-w-2xl mx-auto italic">
            "Experience the myths and history of Ancient Egypt brought to life through breathtaking animated storytelling."
          </p>
        </motion.header>

        {/* Story Cards */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {storytellingEpisodes.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <TiltCard containerClassName="w-full" className="p-0 overflow-hidden group" tilt={false}>
                <div className={`h-1.5 bg-gradient-to-r ${story.color} relative z-20`} />
                <div className="p-8 md:p-10 relative z-10">
                  <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center`}>

                    {/* Visual Side */}
                    <div className="w-full lg:w-1/2 relative aspect-video rounded-xl overflow-hidden border border-gold/20 shadow-2xl group-hover:border-gold/40 transition-all duration-500">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Scrying Orb for Artifact Stories */}
                      {story.id === 'shipwrecked-sailor' && (
                        <div
                          className="absolute top-4 right-4 z-40 group/orb-trigger cursor-pointer"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsPanoOpen(true); }}
                        >
                          <div className="absolute right-full mr-4 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                            See where The Papyrus is kept in Now
                          </div>
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/60 shadow-[0_0_20px_rgba(218,165,32,0.4)] bg-black/80">
                            <ScryingOrb mode="globe" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl text-gold-light drop-shadow-glow">𓂀</span>
                        <span className="text-xs font-display text-primary uppercase tracking-[0.3em] font-bold">
                          {story.period} • ANIMATED TALE
                        </span>
                      </div>

                      <h2 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-2">
                        {story.title}
                      </h2>
                      <p className="text-xl text-gold-light/60 font-display mb-6 italic">
                        "{story.subtitle}"
                      </p>
                      <p className="font-body text-lg leading-relaxed text-foreground/80 mb-8">
                        {story.description}
                      </p>

                      <div className="flex flex-wrap gap-6 mb-8 text-sm font-display uppercase tracking-widest text-muted-foreground/70">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          {story.readTime} min read
                        </div>
                        <div className="flex items-center gap-2">
                          <BookIcon className="w-4 h-4 text-primary" />
                          {story.panels} panels
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          {story.locations.join(', ')}
                        </div>
                      </div>

                      <Link to={story.path}>
                        <EgyptianButton variant="hero" size="lg" shimmer className="px-12 group h-14">
                          <Play className="w-5 h-5 transition-transform group-hover:scale-125" />
                          Begin Journey
                        </EgyptianButton>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative Background Icon */}
                <div className="absolute -bottom-10 -right-10 opacity-[0.02] grayscale transition-all duration-700 group-hover:opacity-[0.05] pointer-events-none">
                  <Sparkles className="h-64 w-64" />
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 pt-12 border-t border-gold/10 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-8 text-gold/40 font-display text-xs tracking-[0.3em] uppercase">
              <span>Oral Tradition Preserved</span>
              <span>Timeless Narrative</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              The authoritative data source for animated visual adaptations of Egypt's sacred literature.
            </p>
          </div>
        </motion.footer>
      </div>

      {/* Panorama Modal */}
      <AnimatePresence>
        {isPanoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md overflow-y-auto"
          >
            <div className="min-h-full flex items-center justify-center p-4 sm:p-6 py-12">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-7xl bg-[#0a0805] border-2 border-gold/30 rounded-[2rem] shadow-[0_0_50px_rgba(218,165,32,0.15)] relative flex flex-col overflow-hidden"
              >
                <button
                  onClick={() => setIsPanoOpen(false)}
                  className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-gold/20 text-gold rounded-full border border-gold/30 transition-colors"
                  aria-label="Close viewer"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-full h-[65vh] min-h-[400px] relative shrink-0">
                  <ScryingOrb mode="viewer" image="panorama.jpg" />
                </div>

                <div className="p-6 md:p-8 text-center border-t-2 border-gold/20 bg-gradient-to-b from-black/60 to-black/90 flex flex-col justify-center shrink-0">
                  <h3 className="text-2xl md:text-3xl font-display text-gold-gradient drop-shadow-md">
                    Pushkin State Museum of Fine Arts
                  </h3>
                  <p className="text-gold/60 font-display tracking-widest text-sm uppercase mt-2">
                    (Moscow, Russia)
                  </p>
                  <p className="text-white/40 font-body text-xs mt-4 max-w-lg mx-auto">
                    Where the Papyrus Hermitage 1115 (The Shipwrecked Sailor) is digitally preserved and showcased for global heritage study.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
