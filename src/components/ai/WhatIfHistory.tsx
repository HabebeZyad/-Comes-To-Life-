import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, ChevronDown, Loader2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { egyptianPeriods } from '@/data/egyptianPeriods';

interface WhatIfResult {
  scenario: string;
  alternateHistory: string[];
  consequences: {
    immediate: string;
    longTerm: string;
  };
  historicalComparison: string;
  plausibility: string;
}

const whatIfScenarios = [
  { id: 'pyramid', label: 'What if the Great Pyramid was never built?' },
  { id: 'nile', label: 'What if the Nile changed course?' },
  { id: 'hyksos', label: 'What if the Hyksos never invaded?' },
  { id: 'akhenaten', label: 'What if Akhenaten\'s religious reforms succeeded?' },
  { id: 'cleopatra', label: 'What if Cleopatra defeated Rome?' },
  { id: 'custom', label: 'Create your own scenario...' },
];

export function WhatIfHistory() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState('');
  const [customScenario, setCustomScenario] = useState('');
  const [period, setPeriod] = useState('');
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    const scenarioText = selectedScenario === 'custom' 
      ? customScenario 
      : whatIfScenarios.find(s => s.id === selectedScenario)?.label;

    if (!scenarioText) {
      toast({
        title: "Select a Scenario",
        description: "Please choose or write a what-if scenario",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const selectedPeriod = egyptianPeriods.find(p => p.id === period);
      
      const { data, error } = await supabase.functions.invoke('ai-story-generator', {
        body: { 
          period: selectedPeriod?.name || 'Ancient Egypt',
          theme: 'Alternative History',
          characters: scenarioText,
          style: 'Historical analysis with what-if speculation'
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

      // Transform the story response into a what-if format
      const whatIfResult: WhatIfResult = {
        scenario: scenarioText,
        alternateHistory: data.content || [data.title || 'Alternative history scenario'],
        consequences: {
          immediate: data.historicalNotes?.[0] || 'Immediate political and social upheaval would occur.',
          longTerm: data.historicalNotes?.[1] || 'The course of Egyptian civilization would be fundamentally altered.',
        },
        historicalComparison: data.synopsis || 'This scenario explores a pivotal moment in Egyptian history.',
        plausibility: 'Speculative but grounded in historical context',
      };

      setResult(whatIfResult);
      toast({
        title: "Scenario Generated! 𓂋",
        description: "Your alternative history awaits",
      });
    } catch (error) {
      console.error('What-if generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the scenario. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    const text = [
      `What If: ${result.scenario}`,
      `═══════════════════════════`,
      '',
      ...result.alternateHistory,
      '',
      `Immediate Consequences: ${result.consequences.immediate}`,
      `Long-term Effects: ${result.consequences.longTerm}`,
      '',
      `Historical Comparison: ${result.historicalComparison}`,
      `Plausibility: ${result.plausibility}`,
    ].join('\n');
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedScenario('');
    setCustomScenario('');
  };

  return (
    <EgyptianCard variant="interactive" className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-terracotta/20 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-terracotta" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">
              What-If History Generator
            </h3>
            <p className="text-sm text-muted-foreground">
              Explore alternative Egyptian timelines
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
                      Historical Period (optional)
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Any period...</option>
                      {egyptianPeriods.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.yearRange})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Scenario Selection */}
                  <div>
                    <label className="block font-display text-sm text-foreground mb-2">
                      What-If Scenario *
                    </label>
                    <div className="space-y-2">
                      {whatIfScenarios.map((scenario) => (
                        <button
                          key={scenario.id}
                          onClick={() => setSelectedScenario(scenario.id)}
                          className={`w-full p-3 rounded-lg text-left transition-all border ${
                            selectedScenario === scenario.id
                              ? 'border-terracotta bg-terracotta/10'
                              : 'border-border hover:border-terracotta/50'
                          }`}
                        >
                          <span className="text-sm">{scenario.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Scenario Input */}
                  {selectedScenario === 'custom' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <textarea
                        value={customScenario}
                        onChange={(e) => setCustomScenario(e.target.value)}
                        placeholder="What if... (describe your alternative history scenario)"
                        className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                      />
                    </motion.div>
                  )}

                  {/* Generate Button */}
                  <EgyptianButton
                    variant="hero"
                    className="w-full"
                    onClick={handleGenerate}
                    disabled={isGenerating || (!selectedScenario || (selectedScenario === 'custom' && !customScenario))}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Rewriting History...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Alternative History
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
                  {/* Scenario Header */}
                  <div className="p-4 rounded-lg bg-terracotta/10 border border-terracotta/30">
                    <h4 className="font-display text-sm font-semibold text-terracotta mb-2 flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Alternative Timeline
                    </h4>
                    <p className="font-body text-foreground italic">"{result.scenario}"</p>
                  </div>

                  {/* Alternate History */}
                  <div className="space-y-3">
                    {result.alternateHistory.map((paragraph, index) => (
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

                  {/* Consequences */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-gold/10 border border-gold/30">
                      <h5 className="font-display text-xs font-semibold text-gold mb-1">
                        Immediate Effects
                      </h5>
                      <p className="text-sm text-muted-foreground">{result.consequences.immediate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-lapis/10 border border-lapis/30">
                      <h5 className="font-display text-xs font-semibold text-lapis mb-1">
                        Long-term Impact
                      </h5>
                      <p className="text-sm text-muted-foreground">{result.consequences.longTerm}</p>
                    </div>
                  </div>

                  {/* Historical Comparison */}
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground italic">{result.historicalComparison}</p>
                    <p className="text-xs text-primary mt-2">Plausibility: {result.plausibility}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <EgyptianButton variant="outline" className="flex-1" onClick={handleReset}>
                      <RefreshCw className="w-4 h-4" />
                      New Scenario
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
