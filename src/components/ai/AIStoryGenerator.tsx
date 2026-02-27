import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, BookOpen, Users, Loader2, RefreshCw, ChevronDown, Copy, Check } from 'lucide-react';
import { egyptianPeriods } from '@/data/egyptianPeriods';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { useToast } from '@/hooks/use-toast';

interface GeneratedStory {
  title: string;
  period: string;
  synopsis?: string;
  content: string[];
  historicalNotes?: string[];
  characters?: { name: string; role: string }[];
}

const storyThemes = [
  { value: 'daily-life', label: 'Daily Life & Customs' },
  { value: 'royal-court', label: 'Royal Court Intrigue' },
  { value: 'military', label: 'Military Campaigns' },
  { value: 'religion', label: 'Religious Ceremonies' },
  { value: 'trade', label: 'Trade & Commerce' },
  { value: 'craftsmanship', label: 'Art & Craftsmanship' },
  { value: 'mystery', label: 'Mystery & Adventure' },
  { value: 'love', label: 'Love & Family' },
];

const storyStyles = [
  { value: 'narrative', label: 'Realistic Narrative' },
  { value: 'poetic', label: 'Poetic & Lyrical' },
  { value: 'dramatic', label: 'Dramatic & Intense' },
  { value: 'educational', label: 'Educational & Detailed' },
];

export function AIStoryGenerator() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Form state
  const [period, setPeriod] = useState('');
  const [theme, setTheme] = useState('');
  const [characters, setCharacters] = useState('');
  const [style, setStyle] = useState('narrative');

  const handleGenerate = async () => {
    if (!period) {
      toast({
        title: "Period Required",
        description: "Please select a historical period for your story.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedStory(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-story-generator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            period: egyptianPeriods.find(p => p.id === period)?.name || period,
            theme: storyThemes.find(t => t.value === theme)?.label || theme || 'Daily life and adventures',
            characters: characters || 'A young scribe and their mentor',
            style: storyStyles.find(s => s.value === style)?.label || 'Realistic historical narrative',
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        if (response.status === 402) {
          throw new Error('AI credits exhausted. Please add credits to continue.');
        }
        throw new Error(errorData.error || 'Failed to generate story');
      }

      const data = await response.json();
      setGeneratedStory(data);

      toast({
        title: "Story Generated! 📜",
        description: `"${data.title}" is ready to read.`,
      });
    } catch (error) {
      console.error('Story generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : 'Unable to generate story. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedStory) return;

    const text = [
      generatedStory.title,
      generatedStory.synopsis || '',
      '',
      ...generatedStory.content,
      '',
      ...(generatedStory.historicalNotes?.map(n => `📜 ${n}`) || [])
    ].join('\n\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setGeneratedStory(null);
    setPeriod('');
    setTheme('');
    setCharacters('');
    setStyle('narrative');
  };

  return (
    <EgyptianCard variant="interactive" className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">
              AI Story Generator
            </h3>
            <p className="text-sm text-muted-foreground">
              Create personalized Egyptian tales with AI
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <EgyptianCardContent className="p-4 pt-0 space-y-4">
              {!generatedStory ? (
                <>
                  {/* Period Selection */}
                  <div>
                    <label className="block font-display text-sm text-foreground mb-2">
                      Historical Period *
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Historical Period"
                      title="Historical Period"
                    >
                      <option value="">Select a period...</option>
                      {egyptianPeriods.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.icon} {p.name} ({p.yearRange})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Theme Selection */}
                  <div>
                    <label className="block font-display text-sm text-foreground mb-2">
                      Story Theme
                    </label>
                    <select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Story Theme"
                      title="Story Theme"
                    >
                      <option value="">Choose a theme (optional)...</option>
                      {storyThemes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Characters Input */}
                  <div>
                    <label className="block font-display text-sm text-foreground mb-2">
                      Main Characters
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., A young priestess and a temple scribe"
                      value={characters}
                      onChange={(e) => setCharacters(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Describe your main characters or leave blank for AI suggestions
                    </p>
                  </div>

                  {/* Style Selection */}
                  <div>
                    <label className="block font-display text-sm text-foreground mb-2">
                      Narrative Style
                    </label>
                    <select
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      aria-label="Narrative Style"
                      title="Narrative Style"
                    >
                      {storyStyles.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Generate Button */}
                  <EgyptianButton
                    variant="hero"
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={isGenerating || !period}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Weaving your tale...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Story
                      </>
                    )}
                  </EgyptianButton>

                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-sm text-muted-foreground"
                    >
                      <p className="animate-pulse">
                        ✨ Consulting the ancient scrolls... This may take a moment.
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Story Header */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <h4 className="font-display text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {generatedStory.title}
                    </h4>
                    {generatedStory.synopsis && (
                      <p className="font-body text-foreground italic">"{generatedStory.synopsis}"</p>
                    )}
                  </div>

                  {/* Period Badge */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded-full font-display">
                      {generatedStory.period}
                    </span>
                  </div>

                  {/* Characters */}
                  {generatedStory.characters && generatedStory.characters.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {generatedStory.characters.map((char, i) => (
                        <span
                          key={i}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {char.name} • {char.role}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Story Content */}
                  <div className="space-y-3">
                    {generatedStory.content.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="font-body text-foreground/90 leading-relaxed"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>

                  {/* Historical Notes */}
                  {generatedStory.historicalNotes && generatedStory.historicalNotes.length > 0 && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-gold/10 border border-gold/30">
                        <h5 className="font-display text-xs font-semibold text-gold mb-1">
                          Historical Context
                        </h5>
                        <p className="text-sm text-muted-foreground">{generatedStory.historicalNotes[0]}</p>
                      </div>
                      {generatedStory.historicalNotes[1] && (
                        <div className="p-3 rounded-lg bg-lapis/10 border border-lapis/30">
                          <h5 className="font-display text-xs font-semibold text-lapis mb-1">
                            Cultural Notes
                          </h5>
                          <p className="text-sm text-muted-foreground">{generatedStory.historicalNotes[1]}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <EgyptianButton variant="outline" className="flex-1" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4" />
                      New Story
                    </EgyptianButton>
                    <EgyptianButton variant="hero" className="flex-1" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </EgyptianButton>
                  </div>
                </motion.div>
              )}
            </EgyptianCardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </EgyptianCard>
  );
}
