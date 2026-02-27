import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, Map, BookOpen, ChevronDown, Play, Sparkles, Globe, ScrollText, Brain } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import heroImage from '@/assets/hero-tomb.jpg';

const features = [
  {
    icon: Book,
    title: 'Interactive Manga',
    subtitle: 'Episode 3: The Scribe Who Lied',
    description: 'Experience branching narratives where your moral choices shape history itself. Discover secrets, confront lies, and determine the fate of ancient Egypt.',
    path: '/manga',
    color: 'from-gold to-gold-dark',
  },
  {
    icon: ScrollText,
    title: 'Literature & Stories',
    subtitle: 'Bring History to Life',
    description: 'Explore historical tales from the Old Kingdom to the Second Intermediate Period with realistic illustrations and interactive storytelling.',
    path: '/stories',
    color: 'from-papyrus to-sandstone',
  },
  {
    icon: Globe,
    title: 'Interactive Period Maps',
    subtitle: 'Four Eras of Egypt',
    description: 'Navigate through Old Kingdom, First Intermediate, Middle Kingdom, and Second Intermediate periods with interactive maps, timelines, and key historical figures.',
    path: '/maps',
    color: 'from-turquoise to-lapis',
  },
  {
    icon: BookOpen,
    title: 'Hieroglyph Explorer',
    subtitle: 'Dictionary & Quiz',
    description: 'Browse the complete Gardiner Sign List, search by name or meaning, and test your knowledge with the interactive quiz game.',
    path: '/hieroglyphs',
    color: 'from-turquoise to-scarab',
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
            <Link to="/manga">
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
              Discover the Experience
            </h2>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Four interconnected modes that bring ancient Egypt to life through 
              interactive storytelling, and immersive technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link to={feature.path}>
                  <EgyptianCard variant="interactive" className="h-full group" glowOnHover>
                    <EgyptianCardHeader>
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-7 h-7 text-primary-foreground" />
                      </div>
                      <EgyptianCardTitle className="text-2xl">{feature.title}</EgyptianCardTitle>
                      <span className="text-turquoise font-display text-sm tracking-wide">{feature.subtitle}</span>
                    </EgyptianCardHeader>
                    <EgyptianCardContent>
                      <EgyptianCardDescription className="text-lg">
                        {feature.description}
                      </EgyptianCardDescription>
                    </EgyptianCardContent>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-5 h-5 text-gold animate-glow-pulse" />
                    </div>
                  </EgyptianCard>
                </Link>
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
            <div>
              <span className="font-display text-turquoise text-sm tracking-widest">NOW AVAILABLE</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mt-2 mb-6">
                Episode 3: The Scribe Who Lied
              </h2>
              <p className="font-body text-xl text-foreground/80 mb-6">
                In the sacred House of Life, where all knowledge is preserved, young scribe 
                Kiya discovers that her mentor has been falsifying royal records for decades. 
                The truth about the Battle of Kadesh—and the fate of Egypt—lies in her hands.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-foreground/70">
                  <span className="text-gold">𓃀</span>
                  <span className="font-body">10 illustrated manga panels with cinematic visuals</span>
                </li>
                <li className="flex items-center gap-3 text-foreground/70">
                  <span className="text-gold">𓃀</span>
                  <span className="font-body">Branching moral choices that affect gameplay</span>
                </li>
                <li className="flex items-center gap-3 text-foreground/70">
                  <span className="text-gold">𓃀</span>
                  <span className="font-body">New characters and deep lore connections</span>
                </li>
                <li className="flex items-center gap-3 text-foreground/70">
                  <span className="text-gold">𓃀</span>
                  <span className="font-body">Multiple endings based on your choices</span>
                </li>
              </ul>
              <Link to="/manga">
                <EgyptianButton variant="hero" size="lg">
                  <Book className="w-5 h-5" />
                  Read Episode 3
                </EgyptianButton>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-deep border-2 border-gold/30">
                <img
                  src={heroImage}
                  alt="Episode 3 Preview"
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="font-display text-3xl text-gold-gradient">
                    "Some truths are buried deeper than pharaohs"
                  </span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-turquoise/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <span className="text-4xl mb-4 inline-block">𓂀</span>
          <h3 className="font-display text-2xl text-gold-gradient mb-2">Comes to Life</h3>
          <p className="font-body text-muted-foreground mb-6">
            An innovative fusion of digital humanities, interactive storytelling, 
            game design, and cultural heritage preservation.
          </p>
          <p className="text-sm text-muted-foreground/60">
            Designed for academic presentation, museum exhibition, and graduation showcases.
          </p>
        </div>
      </footer>
    </div>
  );
}
