import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronDown, Play, Sparkles, Gamepad2, ScrollText, Brain, ChevronRight, ArrowRight, Layers } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { Footer } from '@/components/ui/Footer';
import { TiltCard } from '@/components/ui/TiltCard';
import { FeaturedShowcase } from '@/components/home/FeaturedShowcase';
import heroImage from '@/assets/hero-tomb.jpg';

const features = [
  {
    icon: Sparkles,
    title: 'Storytelling',
    subtitle: 'Branching Moral Lore',
    description: 'Experience branching narratives where your moral choices shape history itself. Discover secrets, confront lies, and determine the fate of ancient Egypt.',
    path: '/storytelling',
    category: 'Narrative',
    color: 'from-amber-500 to-amber-700',
    surface: 'from-amber-500/20 to-amber-700/10',
    accent: 'text-amber-500',
  },
  {
    icon: ScrollText,
    title: 'Literature & Stories',
    subtitle: 'Curated Ancient Tales',
    description: 'Explore historical tales from the Old Kingdom to the Second Intermediate Period. Featuring the Westcar Papyrus and Sinuhe with realistic illustrations.',
    path: '/stories',
    category: 'Historical',
    color: 'from-gold to-gold-dark',
    surface: 'from-gold/20 to-gold-dark/10',
    accent: 'text-gold',
  },
  {
    icon: Gamepad2,
    title: 'Interactive Games',
    subtitle: 'Strategy and Puzzle Trials',
    description: 'Test your wisdom with board games and puzzles inspired by the ancients. Navigate the Duat in Senet or solve the mysteries of the Coiled Serpent.',
    path: '/games',
    category: 'Strategy',
    color: 'from-cyan-500 to-cyan-700',
    surface: 'from-cyan-500/20 to-cyan-700/10',
    accent: 'text-cyan-500',
  },
  {
    icon: BookOpen,
    title: 'Hieroglyph Explorer',
    subtitle: 'Dictionary and Quiz',
    description: 'Browse the complete Gardiner Sign List, search by name or meaning, and test your knowledge with the interactive quiz game.',
    path: '/hieroglyphs',
    category: 'Linguistic',
    color: 'from-emerald-500 to-emerald-700',
    surface: 'from-emerald-500/20 to-emerald-700/10',
    accent: 'text-emerald-500',
  },
];

export default function Index() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DustParticles count={25} />
      <HieroglyphBackground density="low" animated />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Ancient Egyptian tomb"
            className="w-full h-full object-cover opacity-60"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="text-6xl md:text-8xl animate-glow-pulse inline-block mb-6">𓂀</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-wider mb-6"
          >
            <span className="text-gold-gradient uppercase">Comes To Life</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="font-body text-xl md:text-2xl text-foreground/80 mb-4 max-w-3xl mx-auto"
          >
            An interactive journey through ancient Egypt where history breathes,
            stories branch, and mysteries await your discovery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-row flex-nowrap gap-3 md:gap-4 justify-center items-center"
          >
            <Link to="/storytelling" className="flex-1 sm:flex-none">
              <EgyptianButton variant="hero" size="lg" shimmer className="w-full sm:w-auto px-4 md:px-10 uppercase tracking-widest text-sm font-bold">
                <Play className="w-4 h-4 md:w-5 md:h-5" />
                <span className="whitespace-nowrap">Begin Journey</span>
              </EgyptianButton>
            </Link>
            <Link to="/games" className="flex-1 sm:flex-none">
              <EgyptianButton variant="outline" size="lg" className="w-full sm:w-auto px-4 md:px-10 uppercase tracking-widest text-sm font-bold">
                <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="whitespace-nowrap">Explore Games</span>
              </EgyptianButton>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 0 : 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-muted-foreground"
          >
            <span className="text-sm font-display tracking-widest mb-2 text-gold/60 uppercase">Explore</span>
            <ChevronDown className="w-6 h-6 text-gold/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid (Restored to User Snippet Style) */}
      <section className="relative px-6 py-24">
        <div className="content-shell">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-14 max-w-3xl"
          >
            <div className="section-kicker mb-5">
              <Layers className="h-4 w-4" />
              Core experiences
            </div>
            <h2 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
              Learn through story, play, and discovery.
            </h2>
            <p className="mt-5 font-body text-xl leading-relaxed text-muted-foreground">
              The project works best when each section feels like a chamber in the same temple: focused, immersive, and easy to navigate.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
                className="h-full"
              >
                <TiltCard className="p-0 overflow-hidden flex flex-col group" tilt={true}>
                  <Link to={feature.path} className="absolute inset-0 z-30" />

                  <div className={`h-1.5 bg-gradient-to-r ${feature.color} relative z-20`} />

                  <div className="p-7 flex flex-col h-full relative z-10 [transform:translateZ(40px)]">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`inline-flex rounded-lg border border-white/10 bg-gradient-to-br ${feature.surface} p-3.5`}>
                        <feature.icon className={`h-7 w-7 ${feature.accent} transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6`} />
                      </div>
                      <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.3em]">
                        {feature.category}
                      </span>
                    </div>

                    <div className="space-y-3 flex-grow">
                      <div className={`text-xs font-semibold uppercase tracking-widest ${feature.accent} opacity-80`}>
                        {feature.subtitle}
                      </div>
                      <h3 className="font-display text-3xl text-foreground transition-colors group-hover:text-gold-light uppercase tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="font-body text-lg leading-relaxed text-muted-foreground/80 group-hover:text-foreground/90 transition-colors line-clamp-3">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-5 border-t border-gold/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-primary opacity-80 transition-all group-hover:translate-x-2 group-hover:opacity-100">
                        <span className="font-display text-[10px] uppercase tracking-[0.2em] font-bold">Open chamber</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Faint Background Icon */}
                  <div className="absolute -bottom-6 -right-6 opacity-[0.02] grayscale transition-all duration-1000 group-hover:opacity-[0.08] group-hover:scale-110 group-hover:rotate-12 pointer-events-none">
                    <feature.icon className="h-48 w-48" />
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legacy Showcase Section */}
      <FeaturedShowcase />

      {/* Built for Learning Section (Landscape Restoration) */}
      <section className="px-6 py-20">
        <div className="content-shell">
          <TiltCard
            className="p-8 border-lapis/30 bg-[#050814]/60 backdrop-blur-sm hover:border-gold/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group relative overflow-hidden transition-all duration-700"
            containerClassName="w-full"
            glowColor="rgba(212,175,55,0.12)"
            tilt={true}
          >
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center relative z-20">
              <div>
                <div className="section-kicker mb-4 bg-lapis/20 border-lapis/40 text-gold-light shadow-[0_0_15px_rgba(30,58,138,0.3)]">
                  <Brain className="h-4 w-4 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12 text-gold" />
                  Built for learning
                </div>
                <h2 className="font-display text-3xl text-gold-gradient drop-shadow-md md:text-4xl">
                  A sharper experience without losing the ancient soul.
                </h2>
                <p className="mt-4 max-w-3xl font-body text-lg leading-relaxed text-foreground/80 group-hover:text-gold-light/90 transition-colors duration-500">
                  Stories, games, and tools now share a stronger interface language: elegant surfaces, clearer hierarchy, and more confident movement.
                </p>
              </div>
              <Link to="/hieroglyphs">
                <EgyptianButton variant="hero" size="lg" className="group/btn shadow-[0_0_25px_rgba(30,58,138,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)]">
                  Study Symbols
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover/btn:translate-x-2" />
                </EgyptianButton>
              </Link>
            </div>

            {/* Decorative Royal Accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-lapis/10 blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 blur-[100px] pointer-events-none group-hover:bg-lapis/10 transition-colors duration-1000" />
          </TiltCard>
        </div>
      </section>

      <Footer />
    </div>
  );
}
