import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Map, BookOpen, ChevronDown, Play, Sparkles, Gamepad2, ScrollText, Brain, Check } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { Footer } from '@/components/ui/Footer';
import heroImage from '@/assets/hero-tomb.jpg';

const features = [
  {
    icon: Sparkles,
    title: 'Storytelling',
    subtitle: 'Episode 3: The Scribe Who Lied',
    description: 'Experience branching narratives where your moral choices shape history itself. Discover secrets, confront lies, and determine the fate of ancient Egypt.',
    path: '/storytelling',
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: ScrollText,
    title: 'Literature & Stories',
    subtitle: 'Bring History to Life',
    description: 'Explore historical tales from the Old Kingdom to the Second Intermediate Period with realistic illustrations and interactive storytelling.',
    path: '/stories',
    iconColor: 'text-gold',
    bgColor: 'bg-gold/10',
  },
  {
    icon: Gamepad2,
    title: 'Interactive Ancient Games',
    subtitle: 'Challenge Your Mind',
    description: 'Test your wisdom with puzzles, mazes, and strategy games inspired by ancient Egyptian history, mythology, and daily life.',
    path: '/games',
    iconColor: 'text-cyan-500',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: BookOpen,
    title: 'Hieroglyph Explorer',
    subtitle: 'Dictionary & Quiz',
    description: 'Browse the complete Gardiner Sign List, search by name or meaning, and test your knowledge with the interactive quiz game.',
    path: '/hieroglyphs',
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
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
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Ancient Egyptian tomb"
            className="w-full h-full object-cover opacity-60"
            loading="eager" // Hero image should load fast
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>

        {/* Hero Content */}
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
            <span className="text-gold-gradient">COMES TO LIFE</span>
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="font-body text-lg text-muted-foreground mb-10"
          >
            Digital Humanities • Interactive Storytelling • Cultural Heritage
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/storytelling">
              <EgyptianButton variant="hero" size="xl" shimmer>
                <Play className="w-5 h-5" />
                Begin Your Journey
              </EgyptianButton>
            </Link>
            <Link to="/hieroglyphs">
              <EgyptianButton variant="outline" size="xl">
                <BookOpen className="w-5 h-5" />
                Hieroglyph Explorer
              </EgyptianButton>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
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
            <span className="text-sm font-display tracking-widest mb-2">EXPLORE</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center mb-24"
          >
            <div className="text-gold font-bold tracking-[0.4em] text-[10px] uppercase mb-4">Core Experiences</div>
            <h2 className="font-display text-4xl md:text-6xl text-foreground mb-8 tracking-[0.2em] leading-tight">
              DISCOVER THE <span className="text-gold-gradient">ANCIENT WORLD</span>
            </h2>
            <p className="font-body text-muted-foreground max-w-3xl mx-auto leading-relaxed text-xl opacity-80">
              Four interconnected modes that bring ancient Egypt to life through interactive storytelling, immersive experiences, and cultural discovery.
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mt-8 text-gold/50 text-3xl font-display"
            >
              ⌄
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group relative h-full flex flex-col p-10 rounded-2xl bg-card/60 backdrop-blur-md border border-border/50 hover:border-gold/40 transition-all duration-700 overflow-hidden cursor-pointer"
              >
                <Link to={feature.path} className="absolute inset-0 z-10" />

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/40 transition-all duration-500 rounded-tl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/40 transition-all duration-500 rounded-br-xl" />

                <div className={`mb-8 self-start inline-flex p-5 rounded-2xl ${feature.bgColor} transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] relative z-20 pointer-events-none`}>
                  <feature.icon className={`w-10 h-10 ${feature.iconColor} group-hover:animate-pulse`} />
                </div>

                <h3 className="font-display text-3xl text-foreground mb-3 uppercase tracking-wider group-hover:text-gold transition-colors duration-500 relative z-20 pointer-events-none">
                  {feature.title}
                </h3>
                <div className={`text-[11px] font-bold ${feature.iconColor} mb-8 uppercase tracking-[0.3em] opacity-70 group-hover:opacity-100 transition-opacity relative z-20 pointer-events-none`}>
                  {feature.subtitle}
                </div>

                <p className="font-body text-muted-foreground leading-relaxed text-lg group-hover:text-foreground transition-colors duration-500 relative z-20 pointer-events-none flex-grow">
                  {feature.description}
                </p>

                {/* Shine Sweep Animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-gold to-transparent group-hover:w-full transition-all duration-700 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Episode 3 Teaser */}
      <section className="relative py-24 px-6 bg-lapis-deep/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="flex-1 space-y-10">
              <div className="flex items-center gap-4">
                <div className="h-px w-12 bg-gold"></div>
                <div className="text-gold font-bold tracking-[0.5em] text-[10px] uppercase">New Chapter Unveiled</div>
              </div>

              <h2 className="font-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight">
                EPISODE 3:<br />
                <span className="text-gold-gradient">THE SCRIBE WHO LIED</span>
              </h2>

              <p className="font-body text-muted-foreground leading-relaxed text-xl max-w-2xl opacity-80">
                In the sacred House of Life, where all knowledge is preserved, young scribe
                Kiya discovers that her mentor has been falsifying royal records for decades.
                The truth about the Battle of Kadesh—and the fate of Egypt—lies in her hands.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 transition-colors">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-body text-muted-foreground group-hover:text-foreground transition-colors text-lg">10 Illustrated Panels</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 transition-colors">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-body text-muted-foreground group-hover:text-foreground transition-colors text-lg">Branching Moral Choices</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 transition-colors">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-body text-muted-foreground group-hover:text-foreground transition-colors text-lg">Cinematic Visual Lore</span>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex items-center gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:bg-gold/20 transition-colors">
                    <Check className="w-4 h-4 text-gold" />
                  </div>
                  <span className="font-body text-muted-foreground group-hover:text-foreground transition-colors text-lg">Multiple Secret Endings</span>
                </motion.div>
              </div>

              <Link to="/storytelling">
                <EgyptianButton variant="hero" size="xl" className="mt-6 h-14 px-12 text-lg uppercase tracking-[0.2em] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(189,144,36,0.9)] group">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5" />
                    <span>READ EPISODE 3</span>
                  </div>
                </EgyptianButton>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full perspective-[2000px] z-10"
            >
              <motion.div
                animate={{ y: [-15, 15, -15] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative group w-full"
              >
                {/* Animated Brackets */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-gold z-20 pointer-events-none group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-700" />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold z-20 pointer-events-none group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-gold/20 z-20" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-gold/20 z-20" />

                {/* 3D Image Container */}
                <div className="relative rounded-xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-white/20 group-hover:border-gold transition-all duration-1000 transform group-hover:rotate-x-[15deg] group-hover:-rotate-y-[15deg] group-hover:scale-[1.1] group-hover:-translate-y-6 preserve-3d group-hover:shadow-[40px_40px_100px_rgba(212,175,55,0.3),-40px_-40px_100px_rgba(0,0,0,0.7)] group-hover:z-50">
                  <div className="aspect-[4/5] md:aspect-video w-full relative overflow-hidden transform-gpu">
                    <img
                      alt="Episode 3 Preview"
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-[1.15]"
                      src={heroImage}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-1000" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_black_100%)] opacity-20 group-hover:opacity-10 transition-opacity duration-1000" />
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-end p-12 text-center transform translate-z-[80px]">
                    <p className="font-display text-2xl md:text-3xl text-gold-gradient italic tracking-[0.05em] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-8 group-hover:translate-y-0 relative z-30">
                      "Some truths are buried deeper than Pharaohs"
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
