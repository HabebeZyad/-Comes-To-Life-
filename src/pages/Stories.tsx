import React, { useState, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, MapPin, Sparkles, ChevronRight, Play, Filter, Brain, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { egyptianStories, type Story } from '@/data/egyptianStories';
import { egyptianPeriods } from '@/data/egyptianPeriods';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { HieroglyphScanner } from '@/components/ai/HieroglyphScanner';
import { SceneGenerator } from '@/components/ai/SceneGenerator';
import { cn, getAssetUrl } from '@/lib/utils';
import { TiltCard } from '@/components/ui/TiltCard';

// Lazy load heavy 3D components
// Performance: Defers loading of ~1MB Three.js bundle until ScryingOrb is rendered
const ScryingOrb = lazy(() => import('@/components/storytelling/ScryingOrb').then(m => ({ default: m.ScryingOrb })));

type FilterType = 'all' | 'historical' | 'literary' | 'mythological';
type PeriodFilter = 'all' | string;

export default function Stories() {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const [panoStory, setPanoStory] = useState<string | null>(null);

  const filteredStories = useMemo(() => {
    return egyptianStories.filter(story => {
      if (story.id === 'kamose-intercepted') return false;
      if (story.id === 'shipwrecked-sailor') return false;
      if (story.id === 'tomb-golden-scarab') return false;
      if (story.id === 'heretic-pharaoh') return false;
      if (story.id === 'sinuhe-tale') return false;
      if (typeFilter !== 'all' && story.type !== typeFilter) return false;
      if (periodFilter !== 'all' && story.periodId !== periodFilter) return false;
      return true;
    });
  }, [typeFilter, periodFilter]);

  const getPeriodIcon = (periodId: string) => {
    return egyptianPeriods.find(p => p.id === periodId)?.icon || '𓂀';
  };

  const getPeriodColor = (periodId: string) => {
    return egyptianPeriods.find(p => p.id === periodId)?.color || 'from-gold to-gold-dark';
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-20">

      {/* Header */}
      <header className="relative px-6 py-12 border-b border-border">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-5xl mb-4 inline-block animate-glow-pulse">𓏟</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
              Stories & Literature
            </h1>
            <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
              Realistic historical visualizations of ancient Egyptian tales.
              From the wisdom of Imhotep to the exile of Sinuhe, experience history brought to life.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Filters & AI Toggle */}
      <div className="sticky top-16 z-30 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Type Filters */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {(['all', 'historical', 'literary', 'mythological'] as FilterType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-display text-sm capitalize whitespace-nowrap transition-all",
                    typeFilter === type
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Period Filter */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <select
                aria-label="Filter by period"
                title="Filter by period"
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-muted border border-border font-display text-sm"
              >
                <option value="all">All Periods</option>
                {egyptianPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.icon} {period.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAIFeatures(!showAIFeatures)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg font-display text-sm transition-all",
                  showAIFeatures
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Brain className="w-4 h-4" />
                AI Features
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">


        {/* AI Features Section */}
        <AnimatePresence>
          {showAIFeatures && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <h2 className="font-display text-2xl font-bold text-gold-gradient mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI-Powered Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <HieroglyphScanner />
                <SceneGenerator />
              </div>

              {/* AI Technical Notes */}
              <TiltCard className="mt-6 p-6 border-dashed" tilt={false}>
                <div className="relative z-10">
                  <h4 className="font-display font-bold text-lg mb-4 flex items-center gap-3 text-gold-light">
                    <Brain className="w-5 h-5 text-primary" />
                    AI Implementation Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-8 text-sm">
                    <div className="space-y-3">
                      <h5 className="font-display font-bold text-xs uppercase tracking-widest text-primary/80">Machine Learning Components</h5>
                      <ul className="space-y-2 text-muted-foreground font-body">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>Vision AI</strong> for neural hieroglyph recognition</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>Timeline Analysis</strong> for predictive history</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>Scene Generation</strong> for immersive visual synthesis</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h5 className="font-display font-bold text-xs uppercase tracking-widest text-primary/80">Powered By</h5>
                      <ul className="space-y-2 text-muted-foreground font-body">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>Lovable AI Gateway</strong> for secure orchestration</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>Google Gemini</strong> LLM for historical generation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span><strong>1800+ Hieroglyphs</strong> in the neural database</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Story */}
        {filteredStories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <FeaturedStoryCard story={filteredStories[0]} onOpenPano={() => setPanoStory(filteredStories[0].id)} />
          </motion.div>
        )}

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.slice(1).map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <StoryCard story={story} onOpenPano={() => setPanoStory(story.id)} />
            </motion.div>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">𓂀</span>
            <h3 className="font-display text-xl text-muted-foreground">
              No stories found for these filters
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your filters or explore all stories
            </p>
          </div>
        )}

        {/* Coming Soon Section */}
        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="font-display text-2xl font-bold text-gold-gradient mb-6 text-center">
            Coming Soon: More Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'The Intercepted Letter', period: 'Second Intermediate', type: 'historical' },
              { title: 'The Hyksos Invasion', period: 'Second Intermediate', type: 'historical' },
              { title: 'Khufu\'s Secret', period: 'Old Kingdom', type: 'historical' },
              { title: 'The Two Kingdoms War', period: 'First Intermediate', type: 'historical' },
            ].map((upcoming, i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-between"
              >
                <div>
                  <h4 className="font-display font-semibold">{upcoming.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {upcoming.period} • {upcoming.type}
                  </p>
                </div>
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Panorama Modal */}
      <AnimatePresence>
        {(panoStory === 'westcar-papyrus' || panoStory === 'eloquent-peasant') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-7xl my-auto bg-[#0a0805] border-2 border-gold/30 rounded-[2rem] shadow-[0_0_50px_rgba(218,165,32,0.15)] relative flex flex-col overflow-hidden"
            >
              <button
                onClick={() => setPanoStory(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-gold/20 text-gold rounded-full border border-gold/30 transition-colors"
                aria-label="Close viewer"
              >
                <X className="w-6 h-6" />
              </button>

              <Suspense fallback={
                <div className="w-full h-[65vh] min-h-[400px] flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
                </div>
              }>
                {panoStory === 'westcar-papyrus' ? (
                  <>
                    <div className="w-full h-[65vh] min-h-[400px] relative shrink-0">
                      <ScryingOrb mode="viewer" image="panorama_westcar.jpg" />
                    </div>

                    <div className="p-6 md:p-8 text-center border-t-2 border-gold/20 bg-gradient-to-b from-black/60 to-black/90 flex flex-col justify-center shrink-0">
                      <h3 className="text-2xl md:text-3xl font-display text-gold-gradient drop-shadow-md">
                        Egyptian Museum and Papyrus Collection
                      </h3>
                      <p className="text-gold/60 font-display tracking-widest text-sm uppercase mt-2">
                        (Berlin, Germany)
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col lg:flex-row w-full h-[85vh] min-h-[600px]">
                    {/* Panel 1: Berlin */}
                    <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-gold/30 relative">
                      <div className="flex-1 relative shrink-0 min-h-[250px] lg:min-h-[400px]">
                        <ScryingOrb mode="viewer" image="panorama_westcar.jpg" />
                      </div>
                      <div className="p-4 md:p-6 text-center bg-gradient-to-b from-black/60 to-black/90 shrink-0 h-[140px] flex flex-col justify-center border-t-2 border-gold/20">
                        <h3 className="text-xl md:text-2xl font-display text-gold-gradient drop-shadow-md">
                          Egyptian Museum, Berlin
                        </h3>
                        <p className="text-gold/80 font-body text-sm mt-3 border-t border-gold/10 pt-2 inline-block mx-auto">
                          Holds important papyri like P. Berlin 10499
                        </p>
                      </div>
                    </div>

                    {/* Panel 2: British Museum */}
                    <div className="flex-1 flex flex-col relative">
                      <div className="flex-1 relative shrink-0 min-h-[250px] lg:min-h-[400px]">
                        <ScryingOrb mode="viewer" image="panorama_british.jpg" />
                      </div>
                      <div className="p-4 md:p-6 text-center bg-gradient-to-b from-black/60 to-black/90 shrink-0 h-[140px] flex flex-col justify-center border-t-2 border-gold/20">
                        <h3 className="text-xl md:text-2xl font-display text-gold-gradient drop-shadow-md">
                          British Museum
                        </h3>
                        <p className="text-gold/80 font-body text-sm mt-3 border-t border-gold/10 pt-2 inline-block mx-auto mt-auto">
                          Holds several fragments of the Ramesseum papyri
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FeaturedStoryCard({ story, onOpenPano }: { story: Story, onOpenPano?: () => void }) {
  const navigate = useNavigate();
  const periodIcon = egyptianPeriods.find(p => p.id === story.periodId)?.icon || '𓂀';
  const periodColor = egyptianPeriods.find(p => p.id === story.periodId)?.color || 'from-gold to-gold-dark';

  return (
    <div 
      className="cursor-pointer group block" 
      onClick={() => navigate(`/stories/${story.id}`)}
    >
      <TiltCard containerClassName="w-full" className="p-0 overflow-hidden" tilt={false}>
        <div className={`h-1.5 bg-gradient-to-r ${periodColor} relative z-20`} />
        <div className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Story Info */}
          <div className="flex-1 relative [transform:translateZ(50px)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl text-gold-light drop-shadow-glow">{periodIcon}</span>
              <span className="text-xs font-display text-primary uppercase tracking-[0.2em] font-bold">
                {story.period} • {story.type}
              </span>
            </div>

            {(story.id === 'westcar-papyrus' || story.id === 'eloquent-peasant') && (
              <div
                className="absolute top-0 right-0 z-40 group/orb-trigger cursor-pointer flex items-center"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenPano?.(); }}
              >
                <div className="absolute right-full mr-4 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                  {story.id === 'westcar-papyrus' ? 'See where The Papyrus is kept in Now' : 'See where The Papyri are kept Now'}
                </div>
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gold/60 shadow-[0_0_20px_rgba(218,165,32,0.4)] transition-all duration-300 hover:border-gold hover:shadow-[0_0_30px_rgba(218,165,32,0.6)] bg-black/80">
                  <Suspense fallback={<div className="w-full h-full bg-black/40 animate-pulse" />}>
                    <ScryingOrb mode="globe" />
                  </Suspense>
                </div>
              </div>
            )}

            <h2 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2 tracking-tight">
              {story.title}
            </h2>
            <p className="text-lg text-gold-light/60 font-display mb-4 tracking-wide italic">
              {story.subtitle}
            </p>
            <p className="font-body text-lg leading-relaxed text-foreground/80 mb-6 max-w-3xl">
              {story.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm font-display uppercase tracking-widest text-muted-foreground/70">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {story.estimatedReadTime} min read
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {story.panels.length} panels
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {story.relatedLocations.length} locations
              </div>
            </div>

            {/* Themes */}
            <div className="flex flex-wrap gap-2 mb-8">
              {story.themes.map((theme, i) => (
                <span key={i} className="px-3 py-1 bg-gold/5 border border-gold/10 rounded-full text-xs font-display uppercase tracking-widest text-gold-light/60">
                  {theme}
                </span>
              ))}
            </div>

            <Link to={`/stories/${story.id}`} className="relative z-40 inline-block" onClick={(e) => e.stopPropagation()}>
              <EgyptianButton variant="hero" size="lg" shimmer className="px-10 group">
                <Play className="w-5 h-5 transition-transform group-hover:scale-125" />
                Begin Story
              </EgyptianButton>
            </Link>
          </div>

          {/* Characters Preview */}
          <div className="lg:w-72 flex flex-col [transform:translateZ(30px)]">
            <h4 className="font-display text-[10px] font-bold mb-4 text-primary uppercase tracking-[0.3em]">
              Primary Characters
            </h4>
            {story.id === 'eloquent-peasant' ? (
              <div className="flex-1 rounded-lg overflow-hidden border border-gold/20 relative group">
                <img 
                  src={getAssetUrl('/The Eloquent Peasant/characters.jpg')} 
                  alt="Characters of The Eloquent Peasant" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="space-y-3">
                {story.characters.slice(0, 3).map((char) => (
                  <div key={char.id} className="flex items-start gap-3 p-3 rounded-lg bg-gold/5 border border-gold/10 hover:border-gold/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl border border-primary/20">
                      𓀀
                    </div>
                    <div>
                      <h5 className="font-display font-bold text-sm text-gold-light">{char.name}</h5>
                      <p className="text-[10px] text-muted-foreground font-display tracking-wider uppercase mt-0.5">{char.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -right-20 -bottom-20 opacity-[0.03] grayscale transition-all duration-700 group-hover:opacity-[0.08] pointer-events-none">
        <Sparkles className="h-96 w-96" />
      </div>
    </TiltCard>
    </div>
  );
}

function StoryCard({ story, onOpenPano }: { story: Story, onOpenPano?: () => void }) {
  const navigate = useNavigate();
  const periodIcon = egyptianPeriods.find(p => p.id === story.periodId)?.icon || '𓂀';
  const periodColor = egyptianPeriods.find(p => p.id === story.periodId)?.color || 'from-gold to-gold-dark';

  return (
    <div 
      className="h-full cursor-pointer group block"
      onClick={() => navigate(`/stories/${story.id}`)}
    >
      <TiltCard className="p-0 overflow-hidden flex flex-col" tilt={false}>
        <div className={`h-1.5 bg-gradient-to-r ${periodColor} relative z-20`} />
        <div className="p-6 flex flex-col h-full relative z-10 [transform:translateZ(40px)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xl text-gold-light group-hover:animate-glow-pulse">{periodIcon}</span>
              <span className="text-[10px] font-display text-muted-foreground uppercase tracking-[0.2em]">
                {story.period}
              </span>
            </div>

            {(story.id === 'westcar-papyrus' || story.id === 'eloquent-peasant') && (
              <div
                className="relative z-40 group/orb-trigger cursor-pointer flex items-center"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenPano?.(); }}
              >
                <div className="absolute right-full mr-4 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                  See where The Papyrus is kept in Now
                </div>
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/40 shadow-inner bg-black/60 transition-all group-hover:border-gold group-hover:shadow-gold-glow">
                  <Suspense fallback={<div className="w-full h-full bg-black/40 animate-pulse" />}>
                    <ScryingOrb mode="globe" />
                  </Suspense>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 flex-grow">
            <h3 className="font-display text-2xl font-bold leading-tight group-hover:text-gold-light transition-colors tracking-tight">
              {story.title}
            </h3>
            <p className="text-xs font-display text-primary/70 uppercase tracking-widest italic">
              {story.subtitle}
            </p>
            <p className="font-body text-base text-muted-foreground line-clamp-3 group-hover:text-foreground/90 transition-colors">
              {story.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[10px] font-display text-muted-foreground/80">
                <Clock className="w-3 h-3 text-primary/60" />
                {story.estimatedReadTime} min
              </span>
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-display uppercase tracking-widest",
                story.type === 'historical' && "bg-primary/10 text-primary border border-primary/20",
                story.type === 'literary' && "bg-lapis/10 text-lapis-light border border-lapis/20",
                story.type === 'mythological' && "bg-turquoise/10 text-turquoise border border-turquoise/20"
              )}>
                {story.type}
              </span>
            </div>
            <div className="flex items-center gap-2 text-primary group-hover:translate-x-2 transition-transform">
              <span className="font-display text-[10px] uppercase tracking-widest font-bold">Discover</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Faint Background Icon */}
        <div className="absolute -bottom-6 -right-6 opacity-[0.02] grayscale transition-all duration-700 group-hover:opacity-[0.05] group-hover:scale-110 pointer-events-none">
          {periodIcon !== '𓂀' && <span className="text-[12rem]">{periodIcon}</span>}
          {periodIcon === '𓂀' && <BookOpen className="h-48 w-48" />}
        </div>
      </TiltCard>
    </div>
  );
}
