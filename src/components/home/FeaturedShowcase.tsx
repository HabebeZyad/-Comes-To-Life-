import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Sparkles, ShieldCheck, Compass, ArrowRight, Zap } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import shipwreckImage from '@/assets/shipwrecked-sailor-masterpiece.png';

export function FeaturedShowcase() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lightning, setLightning] = useState(false);

  // Random lightning effect
  useEffect(() => {
    const triggerLightning = () => {
      setLightning(true);
      setTimeout(() => setLightning(false), 150);
      setTimeout(triggerLightning, Math.random() * 8000 + 4000);
    };
    const timer = setTimeout(triggerLightning, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Motion values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const mouseXSpring = useSpring(x, { damping: 25, stiffness: 150 });
  const mouseYSpring = useSpring(y, { damping: 25, stiffness: 150 });

  // Transform motion values to rotation
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative overflow-hidden border-y border-gold/10 bg-lapis-deep/40 px-6 py-24 md:py-32">
      <AnimatePresence>
        {lightning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none bg-white"
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 temple-grid opacity-35" />

      <div className="absolute -left-20 top-1/4 pointer-events-none opacity-[0.07] blur-[2px] select-none">
        <span className="font-display text-[25rem] text-gold drop-shadow-[0_0_50px_rgba(218,165,32,0.3)]">𓂀</span>
      </div>

      <div className="content-shell relative z-10 grid gap-12 lg:gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          <div className="section-kicker flex items-center gap-3">
            <span className="text-gold-light animate-glow-pulse">𓂀</span>
            Legacy Showcase
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gold-light font-display text-xs md:text-sm tracking-[0.2em] uppercase">
              <Zap className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
              Mythological Epic
            </div>
            <h2 className="font-display leading-[1.1] text-foreground tracking-wider flex flex-col items-start">
              <span className="text-2xl md:text-5xl lg:text-6xl whitespace-nowrap uppercase">The Shipwrecked</span>
              <span className="text-4xl md:text-7xl lg:text-8xl text-gold-gradient drop-shadow-gold-glow uppercase">Sailor</span>
            </h2>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-muted-foreground md:text-2xl italic">
              "A storm broke, and the waves were eight cubits high... then I heard a sound like thunder."
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
            {[
              { text: 'Cinematic 3D Encounters', icon: Play },
              { text: 'The Lord of Punt Secrets', icon: ShieldCheck },
              { text: 'Sacred Island Landscapes', icon: Sparkles },
              { text: 'Interactive Digital Heritage', icon: Compass },
            ].map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
                className="flex items-center gap-3 md:gap-4 group"
              >
                <span className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl border border-gold/40 bg-gold/5 group-hover:bg-gold/15 transition-all duration-300 shadow-gold-glow/10">
                  <item.icon className="h-5 w-5 md:h-6 md:w-6 text-gold-light" />
                </span>
                <span className="font-body text-base md:text-xl text-foreground/80 group-hover:text-foreground transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-row flex-nowrap gap-3 md:gap-4 pt-4 md:pt-6">
            <Link to="/stories/shipwrecked-sailor" className="flex-1 sm:flex-none">
              <EgyptianButton variant="hero" size="lg" shimmer className="group w-full px-2 md:px-12 uppercase tracking-widest text-sm">
                <Play className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-125" />
                Begin Journey
              </EgyptianButton>
            </Link>
            <Link to="/stories" className="flex-1 sm:flex-none">
              <EgyptianButton variant="outline" size="lg" className="w-full px-2 md:px-10 uppercase tracking-widest text-sm border-white/10">
                Archive
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-1" />
              </EgyptianButton>
            </Link>
          </div>
        </motion.div>

        <div
          className="perspective-2000 relative h-[450px] sm:h-[550px] md:h-[650px] w-full cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={cardRef}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative h-full w-full rounded-[1.5rem] md:rounded-[2rem] border border-gold/30 bg-black/60 p-3 md:p-5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            <div className="absolute -right-3 -top-3 md:-right-6 md:-top-6 z-50 flex h-14 w-14 md:h-20 md:w-20 items-center justify-center rounded-full border-2 border-gold bg-lapis-deep text-2xl md:text-4xl shadow-gold-glow animate-glow-pulse select-none">
              𓂀
            </div>

            <div className="relative h-full w-full overflow-hidden rounded-[1rem] md:rounded-[1.5rem] border border-white/15 shadow-inner group">
              <motion.img
                src={shipwreckImage}
                alt="Shipwrecked Sailor"
                className="h-full w-full object-cover opacity-80"
                style={{ transformStyle: "preserve-3d", translateZ: "10px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <motion.div
                className="absolute inset-0 flex flex-col justify-end p-5 md:p-12 pb-8 md:pb-16"
                style={{ translateZ: "50px" }}
              >
                <div className="mb-2 flex items-center gap-3 text-gold-light/60">
                  <div className="h-px w-8 md:w-12 bg-gold/30" />
                  <span className="font-display text-[10px] md:text-xs tracking-[0.3em] uppercase">Middle Kingdom Masterpiece</span>
                </div>

                <h2 className="font-display text-gold-gradient mb-2 md:mb-4 leading-[1.1] drop-shadow-2xl px-1 tracking-wider flex flex-col items-start uppercase">
                  <span className="text-xl md:text-3xl lg:text-4xl xl:text-5xl whitespace-nowrap">The Shipwrecked</span>
                  <span className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl">Sailor</span>
                </h2>
                <h3 className="font-display text-lg md:text-2xl lg:text-3xl text-gold-light/80 mb-4 md:mb-6 tracking-wide leading-tight">
                  Encounter on the Island of the Ka
                </h3>

                <p className="font-body text-base text-white/80 md:text-xl md:max-w-xl leading-relaxed">
                  A Middle Kingdom masterpiece on fate and the resilience of the soul.
                </p>

                <div className="mt-6 md:mt-10 flex flex-col gap-2">
                  <div className="flex items-center gap-3 text-gold-light group-hover:scale-105 transition-transform duration-500 origin-left">
                    <Sparkles className="h-5 w-5 animate-glow-pulse" />
                    <span className="font-display text-base md:text-lg font-bold tracking-[0.25em] uppercase text-gold-gradient">The Serpent's Lament</span>
                  </div>
                  <p className="text-xs md:text-sm text-gold/50 font-display uppercase tracking-[0.15em] pl-8 border-l border-gold/20 italic">
                    Ancient Egyptian voyage to "the King's mines"
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:block"
                style={{
                  background: useTransform(
                    [mouseXSpring, mouseYSpring],
                    ([mx, my]: any[]) => {
                      const px = (Number(mx) + 0.5) * 100;
                      const py = (Number(my) + 0.5) * 100;
                      return `radial-gradient(circle at ${px}% ${py}%, rgba(218, 165, 32, 0.3) 0%, transparent 50%)`;
                    }
                  ),
                }}
              />
            </div>
          </motion.div>

          {/* Floating Hieroglyphs Background Elements */}
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-8 md:-right-16 text-4xl md:text-6xl text-gold-light pointer-events-none select-none opacity-20"
          >
            𓇳
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 -left-8 md:-left-16 text-4xl md:text-6xl text-turquoise pointer-events-none select-none opacity-10"
          >
            𓆗
          </motion.div>
        </div>
      </div>
    </section>
  );
}
