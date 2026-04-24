import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Book, Sparkles, Info, X, Search, Grid, List, ChevronDown, Trophy } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphQuiz } from '@/components/quiz/HieroglyphQuiz';
import {
  hieroglyphDatabase,
  HieroglyphEntry,
  searchHieroglyphs,
  getAllCategories,
  totalHieroglyphs
} from '@/data/hieroglyphDatabase';

type ViewMode = 'dictionary' | 'quiz';

export default function HieroglyphicsPage() {
  const [selectedGlyph, setSelectedGlyph] = useState<HieroglyphEntry | null>(null);
  const [showHieroglyphDetail, setShowHieroglyphDetail] = useState(false);
  const [showLore, setShowLore] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('dictionary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [gridView, setGridView] = useState(true);

  useEffect(() => {
    if (viewMode === 'quiz') {
      setSelectedGlyph(null);
      setShowHieroglyphDetail(false);
    }
  }, [viewMode, setSelectedGlyph, setShowHieroglyphDetail]);

  const categories = useMemo(() => ['all', ...getAllCategories()], []);

  const filteredHieroglyphs = useMemo(() => {
    let results = hieroglyphDatabase;

    if (searchQuery) {
      results = searchHieroglyphs(searchQuery);
    }

    if (selectedCategory !== 'all') {
      results = results.filter(h => h.category === selectedCategory);
    }

    return results;
  }, [searchQuery, selectedCategory]);


  return (
    <div className="min-h-screen bg-background pt-24 pb-28 md:pb-12">
      <DustParticles count={15} />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-5xl mb-4 inline-block animate-glow-pulse">𓏤</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-gold-gradient mb-4">
            Hieroglyph Dictionary & Quiz
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            Explore the mysteries of ancient Egypt through a comprehensive hieroglyph dictionary and a challenging quiz game.
          </p>
          <p className="text-turquoise font-display text-lg">
            Database: {totalHieroglyphs} hieroglyphs from the Gardiner Sign List
          </p>
        </motion.div>

        {/* View Mode Toggle */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <EgyptianButton
            variant={viewMode === 'dictionary' ? 'hero' : 'outline'}
            onClick={() => setViewMode('dictionary')}
          >
            <Book className="w-4 h-4" />
            Dictionary
          </EgyptianButton>
          <EgyptianButton
            variant={viewMode === 'quiz' ? 'hero' : 'outline'}
            onClick={() => { setViewMode('quiz'); setSelectedGlyph(null); setShowHieroglyphDetail(false); }}
          >
            <Trophy className="w-4 h-4" />
            Quiz Game
          </EgyptianButton>
        </div>

        {viewMode === 'dictionary' && (
          /* Dictionary Mode */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Search and Filter */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, meaning, pronunciation, or Gardiner code..."
                    className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="appearance-none px-4 py-3 pr-10 bg-card border border-border rounded-xl font-display text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
                      aria-label="Select Category"
                    >
                      <option value="all">All Categories</option>
                      {categories.slice(1).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <EgyptianButton
                    variant={gridView ? 'hero' : 'outline'}
                    size="icon"
                    onClick={() => setGridView(true)}
                  >
                    <Grid className="w-5 h-5" />
                  </EgyptianButton>
                  <EgyptianButton
                    variant={!gridView ? 'hero' : 'outline'}
                    size="icon"
                    onClick={() => setGridView(false)}
                  >
                    <List className="w-5 h-5" />
                  </EgyptianButton>
                </div>
              </div>
              <p className="text-muted-foreground font-body">
                Showing {filteredHieroglyphs.length} of {totalHieroglyphs} hieroglyphs
              </p>
            </div>

            {/* Results */}
            {gridView ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {filteredHieroglyphs.map((glyph) => (
                  <motion.button
                    key={glyph.gardinerCode}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => { setSelectedGlyph(glyph); setShowHieroglyphDetail(true); }}
                    className="aspect-square rounded-xl bg-card border border-border hover:border-gold/50 hover:shadow-gold-glow transition-all flex flex-col items-center justify-center p-2 group"
                    title={`${glyph.gardinerCode}: ${glyph.name}`}
                  >
                    <span className="text-2xl sm:text-3xl">{glyph.symbol}</span>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 group-hover:text-gold transition-colors truncate w-full text-center">
                      {glyph.gardinerCode}
                    </span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredHieroglyphs.map((glyph) => (
                  <motion.button
                    key={glyph.gardinerCode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => { setSelectedGlyph(glyph); setShowHieroglyphDetail(true); }}
                    className="w-full p-4 rounded-xl bg-card border border-border hover:border-gold/50 hover:shadow-gold-glow transition-all flex items-center gap-4 text-left group"
                  >
                    <span className="text-4xl w-16 flex-shrink-0 text-center">{glyph.symbol}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display text-gold text-sm">{glyph.gardinerCode}</span>
                        <span className="font-display text-foreground">{glyph.name}</span>
                        {glyph.phonetic && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-turquoise/20 text-turquoise">
                            {glyph.pronunciation}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm truncate">{glyph.meaning}</p>
                    </div>
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded bg-muted/50 hidden sm:block">
                      {glyph.category.split(' - ')[0]}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {filteredHieroglyphs.length === 0 && (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 inline-block opacity-50">𓀀</span>
                <p className="font-display text-xl text-muted-foreground">No hieroglyphs found</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
              </div>
            )}

          </motion.div>
        )}

        {viewMode === 'quiz' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <HieroglyphQuiz />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedGlyph && showHieroglyphDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <HieroglyphDetail
              glyph={selectedGlyph}
              showLore={showLore}
              setShowLore={setShowLore}
              onClose={() => { setSelectedGlyph(null); setShowHieroglyphDetail(false); }}
              isModal
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Separate component for hieroglyph detail display
function HieroglyphDetail({
  glyph,
  showLore,
  setShowLore,
  onClose,
  isModal = false
}: {
  glyph: HieroglyphEntry;
  showLore: boolean;
  setShowLore: (v: boolean) => void;
  onClose: () => void;
  isModal?: boolean;
}) {
  const [isPronouncing, setIsPronouncing] = useState(false);

  const handlePronounce = () => {
    if ('speechSynthesis' in window) {
      // Safari/Chrome Windows bug: sometimes cancel breaks the speech queue if done synchronously
      window.speechSynthesis.cancel();

      let text = glyph.phonetic || glyph.pronunciation;
      if (!text) return;

      // Egyptological vocalization normally inserts an 'e' between adjacent consonants
      const isConsonant = (c: string) => /[bcdfghjklmnpqrstvwxyzḥḫẖšṯḏ]/.test(c.toLowerCase());

      let withVowels = '';
      for (let i = 0; i < text.length; i++) {
        withVowels += text[i];
        if (i < text.length - 1 && isConsonant(text[i]) && isConsonant(text[i + 1])) {
          withVowels += 'e';
        }
      }

      // Approximate the transliteration signs to English phonetic equivalents for the TTS engine
      const spokenText = withVowels.toLowerCase()
        .replace(/ꜣ/g, 'ah')
        .replace(/ˁ/g, 'ah')
        .replace(/ḥ/g, 'h')
        .replace(/ḫ/g, 'k')  // 'kh' often confuses English TTS into a weird sound
        .replace(/ẖ/g, 'hy')
        .replace(/š/g, 'sh')
        .replace(/ṯ/g, 'ch')
        .replace(/ḏ/g, 'j')
        .replace(/w/g, 'oo')
        .replace(/y/g, 'ee');

      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(spokenText);
        // Do NOT force lang='en-GB' as it will silently fail if not installed on Windows
        // Let the system use default voice which is much safer
        utterance.rate = 0.85;
        utterance.pitch = 0.9;

        utterance.onstart = () => setIsPronouncing(true);
        utterance.onend = () => {
          setIsPronouncing(false);
          // @ts-ignore
          delete window._speechUtterance;
        };
        utterance.onerror = (e) => {
          console.error("Speech synthesis error", e);
          setIsPronouncing(false);
        };

        // Complete hack to prevent garbage collection bugs in Safari/Chrome
        // @ts-ignore
        window._speechUtterance = utterance;

        window.speechSynthesis.speak(utterance);
      }, 50);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: isModal ? 0.9 : 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: isModal ? 0.9 : 1 }}
      className={isModal ? "w-full max-w-2xl max-h-[90vh] overflow-y-auto" : "mb-8"}
    >
      <EgyptianCard variant="gold" className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {/* Symbol Display */}
          <motion.div
            className="text-8xl md:text-9xl text-gold animate-glow-pulse flex-shrink-0"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            {glyph.symbol}
          </motion.div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
              <span className="text-turquoise font-display text-sm tracking-widest px-2 py-0.5 rounded bg-turquoise/10">
                {glyph.gardinerCode}
              </span>
              <span className="text-muted-foreground font-display text-sm tracking-widest">
                {glyph.category}
              </span>
            </div>
            <h2 className="font-display text-3xl text-gold-gradient mt-1 mb-2">{glyph.name}</h2>
            <p className="font-body text-xl text-foreground mb-2">{glyph.meaning}</p>
            <p className="font-display text-muted-foreground mb-2">
              Pronunciation: <span className="text-turquoise">"{glyph.pronunciation}"</span>
              {glyph.phonetic && (
                <span className="ml-2 text-gold">[{glyph.phonetic}]</span>
              )}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
              {glyph.ideogram && (
                <span className="text-xs px-2 py-1 rounded-full bg-gold/20 text-gold border border-gold/30">
                  Ideogram
                </span>
              )}
              {glyph.determinative && (
                <span className="text-xs px-2 py-1 rounded-full bg-turquoise/20 text-turquoise border border-turquoise/30">
                  Determinative
                </span>
              )}
              {glyph.phonetic && (
                <span className="text-xs px-2 py-1 rounded-full bg-lapis/20 text-lapis border border-lapis/30">
                  Phonetic: {glyph.phonetic}
                </span>
              )}
            </div>

            {/* Common Usage */}
            {glyph.commonUsage && glyph.commonUsage.length > 0 && (
              <div className="mb-4">
                <span className="text-sm font-display text-muted-foreground">Common Usage: </span>
                <span className="text-sm text-foreground">
                  {glyph.commonUsage.join(', ')}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <EgyptianButton
                variant={showLore ? 'turquoise' : 'outline'}
                size="sm"
                onClick={() => setShowLore(!showLore)}
              >
                <Book className="w-4 h-4" />
                {showLore ? 'Hide Lore' : 'Show Lore'}
              </EgyptianButton>
              <EgyptianButton
                variant="ghost"
                size="sm"
                onClick={handlePronounce}
                className={isPronouncing ? "text-gold animate-pulse" : ""}
              >
                <Volume2 className={`w-4 h-4 ${isPronouncing ? "text-gold" : ""}`} />
                {isPronouncing ? 'Speaking...' : 'Pronounce'}
              </EgyptianButton>
              <EgyptianButton variant="ghost" size="sm" onClick={onClose}>
                <Sparkles className="w-4 h-4" />
                {isModal ? 'Close' : 'Select Another'}
              </EgyptianButton>
            </div>

            <AnimatePresence>
              {showLore && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-gold/30"
                >
                  <h4 className="font-display text-lg text-gold mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Ancient Lore
                  </h4>
                  <p className="font-body text-foreground/80 leading-relaxed">
                    {glyph.lore}
                  </p>

                  {glyph.historicalPeriod && (
                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="text-gold">Historical Period:</span> {glyph.historicalPeriod}
                    </p>
                  )}

                  {glyph.relatedSymbols && glyph.relatedSymbols.length > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <span className="text-gold">Related Signs:</span> {glyph.relatedSymbols.join(', ')}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </EgyptianCard>
    </motion.div>
  );
}
