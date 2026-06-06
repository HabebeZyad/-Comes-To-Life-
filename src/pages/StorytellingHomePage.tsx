import { BookOpen, Play, Clock, BookOpen as BookIcon, MapPin, Sparkles, ChevronRight } from 'lucide-react';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { CelestialSimulation } from '@/components/effects/CelestialSimulation';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { TiltCard } from '@/components/ui/TiltCard';
import { ScryingOrb } from '@/components/storytelling/ScryingOrb';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
export default function StorytellingHomePage() {
  const navigate = useNavigate();
  const [activePano, setActivePano] = useState<{ image: string, title: string, location: string, description: string } | null>(null);
  const [activeIntro, setActiveIntro] = useState<{ id: string, introImage: string, path: string } | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

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
      image: getAssetUrl("/Capture of Joppa.jpeg"),
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
                          onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation(); 
                            setActivePano({
                              image: "panorama.jpg",
                              title: "Pushkin State Museum of Fine Arts",
                              location: "(Moscow, Russia)",
                              description: "Where the Papyrus Hermitage 1115 (The Shipwrecked Sailor) is digitally preserved and showcased for global heritage study."
                            }); 
                          }}
                        >
                          <div className="absolute right-full mr-4 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                            See where The Papyrus is kept in Now
                          </div>
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/60 shadow-[0_0_20px_rgba(218,165,32,0.4)] bg-black/80">
                            <ScryingOrb mode="globe" />
                          </div>
                        </div>
                      )}

                      {/* Dual Scrying Orbs for Capture of Joppa */}
                      {story.id === 'capture-of-joppa' && (
                        <div className="absolute top-4 right-4 z-40 flex flex-col gap-4">
                          <div
                            className="group/orb-trigger cursor-pointer relative"
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation(); 
                              setActivePano({
                                image: "panorama_british.jpg",
                                title: "The British Museum",
                                location: "(London, UK)",
                                description: "Where the Great Harris Papyrus (Papyrus Harris 500) is preserved today, an essential artifact of ancient Egyptian literature."
                              }); 
                            }}
                          >
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                              See where The Papyrus is kept Now
                            </div>
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/60 shadow-[0_0_20px_rgba(218,165,32,0.4)] bg-black/80">
                              <ScryingOrb mode="globe" />
                            </div>
                          </div>

                          <div
                            className="group/orb-trigger cursor-pointer relative"
                            onClick={(e) => { 
                              e.preventDefault(); 
                              e.stopPropagation(); 
                              setActivePano({
                                image: "medinet_habu_360.jpg",
                                title: "Medinet Habu Temple Complex",
                                location: "(Luxor, Egypt)",
                                description: "The mortuary temple of Ramesses III, near where the Harris Papyrus was originally discovered."
                              }); 
                            }}
                          >
                            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                              See where it was discovered
                            </div>
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/60 shadow-[0_0_20px_rgba(218,165,32,0.4)] bg-black/80">
                              <ScryingOrb mode="globe" />
                            </div>
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

                      {story.id === 'capture-of-joppa' || story.id === 'shipwrecked-sailor' ? (
                        <div onClick={() => setActiveIntro({
                          id: story.id,
                          introImage: story.id === 'capture-of-joppa' ? "/Harris Papyrus.jpg" : "/LP-Shipwrecked-Sailor-Papyrus-PS.jpg",
                          path: story.path
                        })}>
                          <EgyptianButton variant="hero" size="lg" shimmer className="px-12 group h-14 cursor-pointer">
                            <Play className="w-5 h-5 transition-transform group-hover:scale-125" />
                            Begin Journey
                          </EgyptianButton>
                        </div>
                      ) : (
                        <Link to={story.path}>
                          <EgyptianButton variant="hero" size="lg" shimmer className="px-12 group h-14">
                            <Play className="w-5 h-5 transition-transform group-hover:scale-125" />
                            Begin Journey
                          </EgyptianButton>
                        </Link>
                      )}
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

      {/* Intro Modal */}
      <AnimatePresence>
        {activeIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black cursor-pointer overflow-hidden perspective-[2000px] flex items-center justify-center"
            onClick={() => { 
              const path = activeIntro.path;
              const introId = activeIntro.id;
              setActiveIntro(null); 
              new Audio(getAssetUrl('/sounds/paper-transition.mp3')).play().catch(() => {});
              
              if (introId === 'capture-of-joppa' || introId === 'shipwrecked-sailor') {
                setActiveVideo(introId);
              } else if (path && path !== '#') {
                navigate(path);
              }
            }}
          >
            <DustParticles count={20} />
            {/* Floating Image */}
            <motion.div
              className="relative group w-[85vw] max-w-5xl rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.2)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [-15, 15, -15], rotateY: [-5, 5, -5], rotateX: [2, -2, 2] }}
              transition={{ opacity: { duration: 2 }, scale: { duration: 2 }, default: { repeat: Infinity, duration: 6, ease: "easeInOut" } }}
            >
              <img src={getAssetUrl(activeIntro.introImage)} alt="Story Intro" className="w-full h-auto max-h-[80vh] object-cover rounded-2xl transition-all duration-700 group-hover:brightness-50 group-hover:blur-[2px]" />

              {/* Hover Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none p-6">
                <h2 className="font-display text-5xl md:text-7xl font-bold text-gold-gradient drop-shadow-[0_5px_15px_rgba(0,0,0,1)] mb-4 text-center">
                  Make it Comes To Life
                </h2>
                <p className="font-display text-2xl text-gold animate-[pulse_3s_ease-in-out_Infinity] tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
                  Press to See
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Video Modal for Joppa and Shipwrecked Sailor */}
      <AnimatePresence>
        {activeVideo && (activeVideo === 'capture-of-joppa' || activeVideo === 'shipwrecked-sailor') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0c0806]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden"
          >
            {/* Ancient Sandstorm / Ember effect */}
            <DustParticles count={50} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black pointer-events-none opacity-80" />
            
            {/* Ambient Fire/Torchlight Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[80%] bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />

            {/* Cinematic Title on a Museum Plaque */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative z-30 mb-8 flex flex-col items-center"
            >
              <div className="px-10 py-4 border-y border-gold/30 bg-black/60 backdrop-blur-xl flex flex-col items-center gap-3 shadow-[0_15px_30px_rgba(0,0,0,0.5)]">
                <span className="text-gold font-display text-xs tracking-[0.5em] uppercase opacity-80">Historical Archive</span>
                <h2 className="font-display text-3xl md:text-5xl text-gold-gradient tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                  {activeVideo === 'capture-of-joppa' ? 'The Capture Of Joppa' : 'The Shipwrecked Sailor'}
                </h2>
              </div>
            </motion.div>

            {/* The Stepped Temple Architectural Frame */}
            <motion.div 
              className="relative w-full max-w-5xl z-20"
              initial={{ opacity: 0, scale: 0.9, rotateX: 15 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
            >
              {/* Outer Courtyard Step */}
              <div className="p-2 md:p-4 bg-[#1a110a]/80 border border-gold/20 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] backdrop-blur-md">
                {/* Middle Sanctuary Step */}
                <div className="p-2 md:p-3 bg-[#0a0604]/90 border border-gold/30 rounded-lg">
                  {/* Inner Sanctum & Video */}
                  <div className="relative border-2 border-gold/50 rounded-md overflow-hidden bg-black shadow-[inset_0_0_50px_rgba(212,175,55,0.05)]">
                    <video
                      src={getAssetUrl(activeVideo === 'capture-of-joppa' ? '/Capture of Joppa video.MP4' : '/The Shipwreck sailor video.mp4')}
                      autoPlay
                      controls
                      playsInline
                      className="w-full h-full aspect-video object-contain bg-black relative z-10"
                    />
                    
                    {/* Floating Corner Runes */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold/60 z-20 pointer-events-none transition-all duration-700" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-gold/60 z-20 pointer-events-none transition-all duration-700" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-gold/60 z-20 pointer-events-none transition-all duration-700" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold/60 z-20 pointer-events-none transition-all duration-700" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Elegant Minimalist Return */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="relative z-30 mt-10"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="group flex flex-col items-center gap-3 text-gold/60 hover:text-gold transition-colors duration-500"
              >
                <span className="font-display text-sm md:text-base tracking-[0.4em] uppercase">Close Vision</span>
                {/* Animated Underline */}
                <div className="w-16 h-[1px] bg-gold/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gold -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
                </div>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panorama Modal */}
      <AnimatePresence>
        {activePano && (
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
                  onClick={() => setActivePano(null)}
                  className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-gold/20 text-gold rounded-full border border-gold/30 transition-colors"
                  aria-label="Close viewer"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="w-full h-[65vh] min-h-[400px] relative shrink-0">
                  <ScryingOrb mode="viewer" image={activePano.image} />
                </div>

                <div className="p-6 md:p-8 text-center border-t-2 border-gold/20 bg-gradient-to-b from-black/60 to-black/90 flex flex-col justify-center shrink-0">
                  <h3 className="text-2xl md:text-3xl font-display text-gold-gradient drop-shadow-md">
                    {activePano.title}
                  </h3>
                  <p className="text-gold/60 font-display tracking-widest text-sm uppercase mt-2">
                    {activePano.location}
                  </p>
                  <p className="text-white/40 font-body text-xs mt-4 max-w-lg mx-auto">
                    {activePano.description}
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
