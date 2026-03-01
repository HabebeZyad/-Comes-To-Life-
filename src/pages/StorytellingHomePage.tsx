
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Play, Hourglass } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import episode3Cover from '@/assets/hero-tomb.jpg';
import episode4Cover from '@/assets/hero-tomb.jpg'; // Placeholder
import episode5Cover from '@/assets/hero-tomb.jpg'; // Placeholder

const episodes = [
  {
    id: 3,
    title: 'The Scribe Who Lied',
    tagline: 'Truth is a weapon. Choose your words wisely.',
    description: 'In the great library of Alexandria, a young scribe uncovers a conspiracy that could shatter the foundations of the Ptolemaic dynasty. Your choices will determine whether history is written by the victors or by those who dare to speak the truth.',
    coverImage: episode3Cover,
    path: '/storytelling/episode-3',
    status: 'Available Now',
  },
  {
    id: 4,
    title: 'The Tomb of the Golden Scarab',
    tagline: 'Some secrets are best left buried.',
    description: 'A famed explorer vanishes in the Valley of the Kings, leaving behind only a cryptic map. Follow in their footsteps to uncover a tomb said to be protected by a powerful curse, where a legendary treasure awaits.',
    coverImage: episode4Cover,
    path: '/storytelling/episode-4',
    status: 'Coming Soon',
  },
  {
    id: 5,
    title: 'The Heretic Pharaoh',
    tagline: 'One god. One vision. One rebellion.',
    description: 'Akhenaten’s revolution has thrown Egypt into chaos. As a loyal guard, you are caught between the old gods and the new. Will you enforce the pharaoh’s will or join the growing resistance that seeks to restore the ancient ways?',
    coverImage: episode5Cover,
    path: '/storytelling/episode-5',
    status: 'Coming Soon',
  },
];

const latestEpisode = episodes.find(e => e.status === 'Available Now');
const upcomingEpisodes = episodes.filter(e => e.status !== 'Available Now');

export default function StorytellingHomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <DustParticles count={25} />
      <HieroglyphBackground density="low" />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <BookOpen className="w-16 h-16 text-gold mx-auto mb-4 animate-glow-pulse" />
          <h1 className="font-display text-6xl md:text-7xl font-bold text-gold-gradient mb-3">
            The King's Papyrus
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            An anthology of interactive stories where your choices forge the destiny of Ancient Egypt.
          </p>
        </motion.header>

        {/* Featured Episode */}
        {latestEpisode && (
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center"
            >
              <div className="lg:col-span-3 relative rounded-2xl overflow-hidden border-2 border-gold/30 shadow-deep">
                <img src={latestEpisode.coverImage} alt={latestEpisode.title} className="w-full h-auto max-h-[60vh] object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="px-4 py-2 text-sm font-display rounded-full bg-turquoise text-black mb-3 inline-block">{latestEpisode.status}</span>
                  <h2 className="font-display text-4xl lg:text-5xl font-bold text-white shadow-black [text-shadow:0_2px_10px_var(--tw-shadow-color)]">{latestEpisode.title}</h2>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="font-display text-2xl text-turquoise tracking-wider mb-2">Latest Episode</h3>
                <p className="font-body text-xl text-foreground/80 mb-4 italic">“{latestEpisode.tagline}”</p>
                <p className="text-muted-foreground mb-6 h-28 overflow-auto">{latestEpisode.description}</p>
                <Link to={latestEpisode.path}>
                  <EgyptianButton variant="hero" size="xl" shimmer className="w-full">
                    <Play className="w-6 h-6" />
                    Begin the Story
                  </EgyptianButton>
                </Link>
              </div>
            </motion.div>
          </section>
        )}

        {/* Upcoming Episodes */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-display text-4xl text-center text-gold-gradient mb-12">
            More from the Archives
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {upcomingEpisodes.map((episode, index) => (
              <motion.div
                key={episode.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.2 }}
              >
                <EgyptianCard variant="papyrus" className="h-full group bg-card/50 backdrop-blur-sm">
                  <EgyptianCardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img src={episode.coverImage} alt={episode.title} className="w-full h-56 object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                    </div>
                  </EgyptianCardHeader>
                  <EgyptianCardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-display text-2xl font-bold text-primary mb-1 pr-4">{episode.title}</h3>
                      <span className="flex-shrink-0 mt-1 px-3 py-1 text-xs font-display rounded-full bg-terracotta text-white flex items-center gap-1.5">
                        <Hourglass size={12} />
                        {episode.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground italic h-12">“{episode.tagline}”</p>
                    <EgyptianButton variant="papyrus" size="lg" className="w-full mt-4" disabled>
                      Not Yet Available
                    </EgyptianButton>
                  </EgyptianCardContent>
                </EgyptianCard>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
