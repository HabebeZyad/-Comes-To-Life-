import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronDown, Loader2, TrendingUp, AlertCircle, BookOpen, Copy, Check } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { egyptianPeriods } from '@/data/egyptianPeriods';

interface TimelineAnalysis {
  period: string;
  analysis: {
    overview: string;
    keyEvents?: {
      date: string;
      event: string;
      significance: string;
      connections?: string[];
      confidence: string;
    }[];
    patterns?: string[];
    predictions?: {
      prediction: string;
      basedOn: string;
      probability: string;
      alternativeViews?: string;
    }[];
    uncertainties?: string[];
  };
  sources?: string[];
}

interface Props {
  selectedPeriodId?: string;
  selectedEvent?: string;
}

export function TimelineAnalyzer({ selectedPeriodId, selectedEvent }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [period, setPeriod] = useState(selectedPeriodId || '');
  const [customQuestion, setCustomQuestion] = useState('');
  const [result, setResult] = useState<TimelineAnalysis | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!period) {
      toast({
        title: "Select a Period",
        description: "Please choose a historical period to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const selectedPeriod = egyptianPeriods.find(p => p.id === period);
      
      const { data, error } = await supabase.functions.invoke('timeline-predictions', {
        body: { 
          period: selectedPeriod?.name || period,
          event: selectedEvent,
          question: customQuestion || undefined
        }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast({
            title: "Rate Limited",
            description: "Please wait a moment and try again.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setResult(data);
      toast({
        title: "Analysis Complete! 𓂋",
        description: "Historical timeline analysis generated",
      });
    } catch (error) {
      console.error('Timeline analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the timeline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    const text = JSON.stringify(result, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setCustomQuestion('');
  };

  return (
    <EgyptianCard variant="interactive" className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-lapis/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-lapis" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">
              AI Timeline Analyzer
            </h3>
            <p className="text-sm text-muted-foreground">
              Analyze historical patterns and connections
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
              {!result ? (
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
                    >
                      <option value="">Select a period...</option>
                      {egyptianPeriods.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.yearRange})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Custom Question */}
                  <div>
                    <label className="block font-display text-sm text-foreground mb-2">
                      Specific Question (optional)
                    </label>
                    <textarea
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="Ask about specific events, figures, or patterns..."
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Analyze Button */}
                  <EgyptianButton
                    variant="hero"
                    className="w-full"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !period}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing Timeline...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        Analyze Historical Patterns
                      </>
                    )}
                  </EgyptianButton>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Overview */}
                  {result.analysis?.overview && (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                      <h4 className="font-display text-sm font-semibold text-primary mb-2">
                        Period Overview
                      </h4>
                      <p className="font-body text-foreground">{result.analysis.overview}</p>
                    </div>
                  )}

                  {/* Key Events */}
                  {result.analysis?.keyEvents && result.analysis.keyEvents.length > 0 && (
                    <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
                      <h4 className="font-display text-sm font-semibold text-gold mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Key Events
                      </h4>
                      <div className="space-y-3">
                        {result.analysis.keyEvents.map((event, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-3 rounded-lg bg-background/50"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-display font-semibold text-foreground">
                                {event.event}
                              </span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {event.date}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                event.confidence === 'high' ? 'bg-scarab/20 text-scarab' :
                                event.confidence === 'medium' ? 'bg-gold/20 text-gold' :
                                'bg-muted text-muted-foreground'
                              }`}>
                                {event.confidence}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.significance}</p>
                            {event.connections && event.connections.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {event.connections.map((c, i) => (
                                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-turquoise/20 text-turquoise">
                                    → {c}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Patterns */}
                  {result.analysis?.patterns && result.analysis.patterns.length > 0 && (
                    <div className="p-4 rounded-lg bg-turquoise/10 border border-turquoise/30">
                      <h4 className="font-display text-sm font-semibold text-turquoise mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Historical Patterns
                      </h4>
                      <ul className="space-y-2">
                        {result.analysis.patterns.map((pattern, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-turquoise">𓂋</span>
                            {pattern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Predictions / Interpretations */}
                  {result.analysis?.predictions && result.analysis.predictions.length > 0 && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-display text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Historical Interpretations
                      </h4>
                      <div className="space-y-3">
                        {result.analysis.predictions.map((pred, index) => (
                          <div key={index} className="text-sm">
                            <p className="text-foreground mb-1">{pred.prediction}</p>
                            <p className="text-muted-foreground text-xs">
                              Based on: {pred.basedOn}
                            </p>
                            {pred.alternativeViews && (
                              <p className="text-muted-foreground text-xs mt-1 italic">
                                Alternative view: {pred.alternativeViews}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Uncertainties */}
                  {result.analysis?.uncertainties && result.analysis.uncertainties.length > 0 && (
                    <div className="p-3 rounded-lg bg-terracotta/10 border border-terracotta/30">
                      <h4 className="font-display text-xs font-semibold text-terracotta mb-2 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        Areas of Scholarly Debate
                      </h4>
                      <ul className="space-y-1">
                        {result.analysis.uncertainties.map((u, i) => (
                          <li key={i} className="text-xs text-muted-foreground">• {u}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <EgyptianButton variant="outline" className="flex-1" onClick={handleReset}>
                      New Analysis
                    </EgyptianButton>
                    <EgyptianButton variant="hero" className="flex-1" onClick={handleCopy}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Results'}
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
