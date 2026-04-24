import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Scan, X, BookOpen, Copy, Check, Loader2 } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getByGardinerCode, searchHieroglyphs } from '@/data/hieroglyphDatabase';

interface RecognitionResult {
  symbols?: {
    symbol: string;
    gardinerCode?: string;
    name: string;
    meaning: string;
    phonetic?: string;
    confidence: string;
  }[];
  translation?: string;
  historicalContext?: string;
  period?: string;
  analysis?: string;
}

export function HieroglyphScanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('hieroglyph-recognition', {
        body: { imageBase64: imagePreview }
      });

      if (error) throw error;

      if (data.error) {
        if (data.error.includes('Rate limit')) {
          toast({
            title: "Rate Limited",
            description: "Please wait a moment and try again.",
            variant: "destructive",
          });
        } else if (data.error.includes('credits')) {
          toast({
            title: "Credits Exhausted",
            description: "AI credits need to be topped up.",
            variant: "destructive",
          });
        } else {
          throw new Error(data.error);
        }
        return;
      }

      if (data.symbols && Array.isArray(data.symbols)) {
        data.symbols = data.symbols.map((s: any) => {
          let dictEntry = s.gardinerCode ? getByGardinerCode(s.gardinerCode) : null;
          if (!dictEntry && s.symbol) {
            const matches = searchHieroglyphs(s.symbol);
            if (matches.length > 0) dictEntry = matches[0];
          }

          if (dictEntry) {
            return {
              ...s,
              symbol: dictEntry.symbol || s.symbol,
              gardinerCode: dictEntry.gardinerCode || s.gardinerCode,
              name: dictEntry.name,
              meaning: dictEntry.meaning,
              phonetic: dictEntry.phonetic || s.phonetic,
            };
          }
          return s;
        });
      }

      setResult(data);
      toast({
        title: "Analysis Complete! 𓂋",
        description: `Found ${data.symbols?.length || 0} hieroglyphs`,
      });
    } catch (error) {
      console.error('Hieroglyph recognition error:', error);
      const msg = error instanceof Error ? error.message : "Could not analyze the image.";
      const isNetwork = msg.includes("fetch") || msg.includes("network") || msg.includes("Failed to fetch");
      let description = "Could not analyze the image. Please try again.";
      if (isNetwork) description = "Check your connection and that Supabase is configured (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY).";
      else if (msg.length <= 80) description = msg;
      toast({ title: "Analysis Failed", description, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    const text = [
      `Hieroglyph Analysis`,
      `══════════════════`,
      '',
      result.symbols?.length ? result.symbols.map(s => `${s.symbol} ${s.gardinerCode || ''}: ${s.name} - ${s.meaning}`).join('\n') : result.analysis ?? '',
      '',
      result.translation && `Translation: ${result.translation}`,
      result.historicalContext && `Context: ${result.historicalContext}`,
      result.period && `Period: ${result.period}`,
    ].filter(Boolean).join('\n');

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceClass = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return 'bg-scarab/20 text-scarab';
      case 'medium':
        return 'bg-gold/20 text-gold';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <EgyptianCard variant="interactive" className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-turquoise/20 flex items-center justify-center">
            <Scan className="w-5 h-5 text-turquoise" />
          </div>
          <div className="text-left">
            <h3 className="font-display font-semibold text-foreground">
              AI Hieroglyph Scanner
            </h3>
            <p className="text-sm text-muted-foreground">
              Upload an image to analyze hieroglyphs
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 0 : 45 }}
          transition={{ duration: 0.3 }}
        >
          <X className="w-5 h-5 text-muted-foreground" />
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
              {/* Upload Area */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                aria-label="Upload image"
                title="Upload image"
              />

              {!imagePreview ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[16/9] rounded-lg border-2 border-dashed border-border hover:border-turquoise/50 transition-colors flex flex-col items-center justify-center gap-3 bg-muted/20"
                >
                  <div className="w-16 h-16 rounded-full bg-turquoise/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-turquoise" />
                  </div>
                  <div className="text-center">
                    <p className="font-display text-foreground">Upload Hieroglyph Image</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Image Preview */}
                  <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="Uploaded hieroglyphs"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-2 right-2 p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Analyze Button */}
                  {!result && (
                    <EgyptianButton
                      variant="turquoise"
                      className="w-full"
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Scan className="w-4 h-4" />
                          Analyze Hieroglyphs
                        </>
                      )}
                    </EgyptianButton>
                  )}
                </div>
              )}

              {/* Results */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Raw analysis (when no structured symbols) */}
                    {result.analysis && (!result.symbols || result.symbols.length === 0) && (
                      <div className="p-4 rounded-lg bg-turquoise/10 border border-turquoise/30">
                        <h4 className="font-display text-sm font-semibold text-turquoise mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Analysis
                        </h4>
                        <p className="font-body text-foreground whitespace-pre-wrap">{result.analysis}</p>
                      </div>
                    )}
                    {/* Symbols */}
                    {result.symbols && result.symbols.length > 0 && (
                      <div className="p-4 rounded-lg bg-turquoise/10 border border-turquoise/30">
                        <h4 className="font-display text-sm font-semibold text-turquoise mb-3 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Identified Symbols ({result.symbols.length})
                        </h4>
                        <div className="space-y-3">
                          {result.symbols.map((symbol, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-3 p-3 rounded-lg bg-background/50"
                            >
                              <span className="text-3xl">{symbol.symbol}</span>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-display font-semibold text-foreground">
                                    {symbol.name}
                                  </span>
                                  {symbol.gardinerCode && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                                      {symbol.gardinerCode}
                                    </span>
                                  )}
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${getConfidenceClass(symbol.confidence)}`}>
                                    {symbol.confidence}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{symbol.meaning}</p>
                                {symbol.phonetic && (
                                  <p className="text-xs text-turquoise mt-1">
                                    Phonetic: {symbol.phonetic}
                                  </p>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Translation */}
                    {result.translation && (
                      <div className="p-4 rounded-lg bg-gold/10 border border-gold/30">
                        <h4 className="font-display text-sm font-semibold text-gold mb-2">
                          Translation
                        </h4>
                        <p className="font-body text-foreground">{result.translation}</p>
                      </div>
                    )}

                    {/* Historical Context */}
                    {result.historicalContext && (
                      <div className="p-4 rounded-lg bg-muted/50">
                        <h4 className="font-display text-sm font-semibold text-muted-foreground mb-2">
                          Historical Context
                        </h4>
                        <p className="text-sm text-muted-foreground">{result.historicalContext}</p>
                        {result.period && (
                          <p className="text-xs text-primary mt-2">Period: {result.period}</p>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      <EgyptianButton variant="outline" className="flex-1" onClick={handleReset}>
                        Upload New
                      </EgyptianButton>
                      <EgyptianButton variant="hero" className="flex-1" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied!' : 'Copy Results'}
                      </EgyptianButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </EgyptianCardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </EgyptianCard>
  );
}
