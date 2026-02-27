import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, MapPin, Sparkles, ChevronRight, Play, Filter, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { egyptianStories, type Story } from '@/data/egyptianStories';
import { egyptianPeriods } from '@/data/egyptianPeriods';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent, EgyptianCardHeader, EgyptianCardTitle, EgyptianCardDescription } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { AIStoryGenerator } from '@/components/ai/AIStoryGenerator';
import { WhatIfHistory } from '@/components/ai/WhatIfHistory';
import { HieroglyphScanner } from '@/components/ai/HieroglyphScanner';
import { SceneGenerator } from '@/components/ai/SceneGenerator';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'historical' | 'literary' | 'mythological';
type PeriodFilter = 'all' | string;

export default function Stories() {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all');
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  const filteredStories = useMemo(() => {
    return egyptianStories.filter(story => {
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
    <div className="min-h-screen bg-background pt-20">
      <DustParticles count={15} />
      <HieroglyphBackground density="low" animated />

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
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
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

              <div className="grid md:grid-cols-2 gap-4">
                <WhatIfHistory />
                <HieroglyphScanner />
                <AIStoryGenerator />
                <SceneGenerator />
              </div>

              {/* AI Technical Notes */}
              <EgyptianCard className="mt-4 border-dashed">
                <EgyptianCardContent className="p-4">
                  <h4 className="font-display font-semibold mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    AI Implementation Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h5 className="font-semibold text-primary mb-1">Machine Learning Components</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Vision AI</strong> for hieroglyph recognition from images</li>
                        <li>• <strong>Gemini LLM</strong> for story generation</li>
                        <li>• <strong>Timeline Analysis</strong> for historical patterns</li>
                        <li>• <strong>What-If Engine</strong> for alternative history</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-semibold text-primary mb-1">Powered By</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>• <strong>Lovable AI Gateway</strong> for seamless AI access</li>
                        <li>• <strong>Google Gemini</strong> models for generation</li>
                        <li>• <strong>Edge Functions</strong> for secure processing</li>
                        <li>• <strong>1800+ Hieroglyphs</strong> in the database</li>
                      </ul>
                    </div>
                  </div>
                </EgyptianCardContent>
              </EgyptianCard>
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
            <FeaturedStoryCard story={filteredStories[0]} />
          </motion.div>
        )}

        {/* Stories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.slice(1).map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StoryCard story={story} />
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
              { title: 'The Shipwrecked Sailor', period: 'Middle Kingdom', type: 'literary' },
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
    </div>
  );
}

function FeaturedStoryCard({ story }: { story: Story }) {
  const periodIcon = egyptianPeriods.find(p => p.id === story.periodId)?.icon || '𓂀';
  const periodColor = egyptianPeriods.find(p => p.id === story.periodId)?.color || 'from-gold to-gold-dark';

  return (
    <EgyptianCard variant="gold" className="overflow-hidden group" glowOnHover>
      <div className={`h-2 bg-gradient-to-r ${periodColor}`} />
      <EgyptianCardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Story Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{periodIcon}</span>
              <span className="text-xs font-display text-primary uppercase tracking-wider">
                {story.period} • {story.type}
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-2">
              {story.title}
            </h2>
            <p className="text-lg text-muted-foreground font-display mb-4">
              {story.subtitle}
            </p>
            <p className="font-body text-foreground/80 mb-4">
              {story.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {story.estimatedReadTime} min read
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {story.panels.length} panels
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {story.relatedLocations.length} locations
              </div>
            </div>

            {/* Themes */}
            <div className="flex flex-wrap gap-2 mb-6">
              {story.themes.map((theme, i) => (
                <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm">
                  {theme}
                </span>
              ))}
            </div>

            <Link to={`/stories/${story.id}`}>
              <EgyptianButton variant="hero" size="lg" shimmer>
                <Play className="w-5 h-5" />
                Begin Story
              </EgyptianButton>
            </Link>
          </div>

          {/* Characters Preview */}
          <div className="lg:w-72">
            <h4 className="font-display text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
              Characters
            </h4>
            <div className="space-y-3">
              {story.characters.slice(0, 3).map((char) => (
                <div key={char.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                    𓀀
                  </div>
                  <div>
                    <h5 className="font-display font-semibold text-sm">{char.name}</h5>
                    <p className="text-xs text-muted-foreground">{char.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}

function StoryCard({ story }: { story: Story }) {
  const periodIcon = egyptianPeriods.find(p => p.id === story.periodId)?.icon || '𓂀';
  const periodColor = egyptianPeriods.find(p => p.id === story.periodId)?.color || 'from-gold to-gold-dark';

  return (
    <Link to={`/stories/${story.id}`}>
      <EgyptianCard variant="interactive" className="h-full group" glowOnHover>
        <div className={`h-1 bg-gradient-to-r ${periodColor}`} />
        <EgyptianCardHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{periodIcon}</span>
            <span className="text-xs font-display text-muted-foreground uppercase tracking-wider">
              {story.period}
            </span>
          </div>
          <EgyptianCardTitle className="group-hover:text-primary transition-colors">
            {story.title}
          </EgyptianCardTitle>
          <EgyptianCardDescription className="text-sm">
            {story.subtitle}
          </EgyptianCardDescription>
        </EgyptianCardHeader>
        <EgyptianCardContent>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {story.description}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {story.estimatedReadTime} min
              </span>
              <span className={cn(
                "px-2 py-0.5 rounded-full capitalize",
                story.type === 'historical' && "bg-primary/20 text-primary",
                story.type === 'literary' && "bg-lapis/20 text-lapis",
                story.type === 'mythological' && "bg-turquoise/20 text-turquoise"
              )}>
                {story.type}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </EgyptianCardContent>
      </EgyptianCard>
    </Link>
  );
}
