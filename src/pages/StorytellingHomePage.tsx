
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { MemoryPalace } from '@/components/storytelling/MemoryPalace';
import { CelestialSimulation } from '@/components/effects/CelestialSimulation';
import { ScryingOrb } from '@/components/storytelling/ScryingOrb';

export default function StorytellingHomePage() {
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
      tagline: "A Tale of Survival and the Serpent King",
      description: "A miraculous tale of a sailor whose ship is destroyed by a colossal wave. Washed ashore on a mystical island, he encounters a giant, golden serpent—the Lord of Punt.",
      image: getAssetUrl("/shipwrecked-sailor.jpeg"),
      path: "/stories/shipwrecked-sailor",
      color: "gold"
    },
    {
      id: "capture-of-joppa",
      title: "The Tale Of Capture Of Joppa",
      tagline: "The First Trojan Horse",
      description: "A brilliant military strategy involving cunning soldiers hidden inside large baskets, leading to the surrender of the rebel city of Joppa.",
      image: getAssetUrl("/images/stories/joppa_baskets.png"),
      path: "#",
      color: "sandstone"
    },
    {
      id: "tale-of-sinuhe",
      title: "The Tale of Sinuhe",
      tagline: "Exile and Redemption",
      description: "The classic Egyptian masterpiece of an official who flees into exile in the Levant, rises to power among the Bedouin, but longs for his homeland.",
      image: getAssetUrl("/images/stories/sinuhe_exile.png"),
      path: "/stories/tale-of-sinuhe",
      color: "terracotta"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0805] text-foreground pt-16 relative overflow-hidden">
      {/* Immersive Environmental Layer */}
      <CelestialSimulation timeOfDay="night" />
      <DustParticles count={30} />
      <HieroglyphBackground density="low" />

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-4 rounded-full bg-gold/5 border border-gold/10 mb-6">
            <BookOpen className="w-12 h-12 text-gold animate-glow-pulse" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gold-gradient mb-4 tracking-tighter">
            Animated Legends of Egypt
          </h1>
          <p className="font-body text-xl text-gold/60 max-w-2xl mx-auto italic">
            Experience the myths and history of Ancient Egypt brought to life through breathtaking animated storytelling.
          </p>
        </motion.header>

        {/* Spatial Navigation */}
        <section className="relative">
          <div className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />
          <MemoryPalace chambers={storytellingEpisodes} />
        </section>

        {/* Authoritative Data Source Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 pt-12 border-t border-gold/10 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-8 text-gold/40 font-display text-xs tracking-[0.3em] uppercase">
              <span>Oral Tradition Preserved</span>
              <span>Celestial Alignment Active</span>
              <span>Timeless Narrative</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              The authoritative data source for animated and graphic visual adaptations of Egypt's sacred literature.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
