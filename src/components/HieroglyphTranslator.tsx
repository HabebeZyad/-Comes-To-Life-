import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Copy, Check, Sparkles, Languages } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import {
  translateEnglishToHiero,
  translateHieroToEnglish,
  TRANSLATOR_SIGN_COUNT,
  UNILITERALS,
} from '@/data/hieroglyphTranslator';

type Direction = 'en-to-hiero' | 'hiero-to-en';

export function HieroglyphTranslator() {
  const [direction, setDirection] = useState<Direction>('en-to-hiero');
  const [input, setInput] = useState('Nefer Ra ankh');
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    if (direction === 'en-to-hiero') {
      return { kind: 'en', data: translateEnglishToHiero(input) } as const;
    }
    return { kind: 'hiero', data: translateHieroToEnglish(input) } as const;
  }, [input, direction]);

  const handleSwap = () => {
    setDirection((d) => (d === 'en-to-hiero' ? 'hiero-to-en' : 'en-to-hiero'));
    if (result?.kind === 'en') {
      setInput(result.data.hieroglyphs);
    } else if (result?.kind === 'hiero') {
      setInput(result.data.gloss || result.data.translit);
    }
  };

  const copyOutput = async () => {
    if (!result) return;
    const text =
      result.kind === 'en'
        ? result.data.hieroglyphs
        : `${result.data.translit}\n${result.data.gloss}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <EgyptianCard variant="gold" className="overflow-hidden">
        <EgyptianCardContent className="p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center flex-shrink-0">
            <Languages className="w-6 h-6 text-gold" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-display text-xl text-gold-gradient">
              Hieroglyph ↔ English Translator
            </h3>
            <p className="text-sm text-muted-foreground">
              Phonetic transliteration using the Gardiner sign list
              ({TRANSLATOR_SIGN_COUNT} signs, Manuel de Codage). Egyptian wrote
              consonants only — vowels are approximated.
            </p>
          </div>
        </EgyptianCardContent>
      </EgyptianCard>

      {/* Direction toggle */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <EgyptianButton
          variant={direction === 'en-to-hiero' ? 'hero' : 'outline'}
          size="sm"
          onClick={() => setDirection('en-to-hiero')}
        >
          English → 𓂀
        </EgyptianButton>
        <button
          onClick={handleSwap}
          className="p-2 rounded-full bg-card border border-border hover:border-gold/50 transition-colors"
          aria-label="Swap direction"
          title="Swap"
        >
          <ArrowLeftRight className="w-4 h-4 text-gold" />
        </button>
        <EgyptianButton
          variant={direction === 'hiero-to-en' ? 'hero' : 'outline'}
          size="sm"
          onClick={() => setDirection('hiero-to-en')}
        >
          𓂀 → English
        </EgyptianButton>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <EgyptianCard>
          <EgyptianCardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm text-muted-foreground tracking-widest uppercase">
                {direction === 'en-to-hiero' ? 'English text' : 'Hieroglyphs'}
              </span>
              <span className="text-xs text-muted-foreground">{input.length} chars</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              dir="ltr"
              placeholder={
                direction === 'en-to-hiero'
                  ? 'Type any English word, e.g. "Tutankhamun loves Ra"...'
                  : 'Paste hieroglyphs, e.g. 𓄤𓇳𓋹 ...'
              }
              className={`w-full bg-background border border-border rounded-xl p-3 font-body text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50 resize-y min-h-[150px] ${
                direction === 'hiero-to-en' ? 'text-3xl leading-snug' : 'text-base'
              }`}
            />
            {direction === 'hiero-to-en' && (
              <QuickInsert onInsert={(g) => setInput((v) => v + g)} />
            )}
          </EgyptianCardContent>
        </EgyptianCard>

        {/* Output */}
        <EgyptianCard variant="interactive">
          <EgyptianCardContent className="p-4 space-y-3 min-h-[260px]">
            <div className="flex items-center justify-between">
              <span className="font-display text-sm text-turquoise tracking-widest uppercase">
                {direction === 'en-to-hiero' ? 'Hieroglyphs' : 'English reading'}
              </span>
              <button
                onClick={copyOutput}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key={direction + input.length}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {result.kind === 'en' ? (
                    <>
                      <p className="text-4xl leading-relaxed text-gold break-words">
                        {result.data.hieroglyphs}
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        Transliteration:{' '}
                        <span className="text-turquoise">{result.data.translit}</span>
                      </p>
                      <div className="pt-2 border-t border-border/50 space-y-1">
                        {result.data.perWord.map((w, i) => (
                          <div
                            key={i}
                            className="flex items-baseline gap-2 text-sm flex-wrap"
                          >
                            <span className="font-display text-foreground w-24 shrink-0">
                              {w.word}
                            </span>
                            <span className="text-2xl text-gold">{w.glyphs}</span>
                            <span className="text-muted-foreground">[{w.translit}]</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="font-display text-lg text-foreground">
                        <span className="text-turquoise">Transliteration:</span>{' '}
                        {result.data.translit || '—'}
                      </p>
                      <p className="font-body text-foreground">
                        <span className="text-gold">Meaning: </span>
                        {result.data.gloss || (
                          <span className="text-muted-foreground italic">
                            No known glosses in mapping.
                          </span>
                        )}
                      </p>
                      <div className="pt-2 border-t border-border/50 grid grid-cols-2 sm:grid-cols-3 gap-2 animate-fadeIn">
                        {result.data.parts
                          .filter((p) => p.glyph.trim())
                          .map((p, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded-lg border text-center ${
                                p.known
                                  ? 'border-border bg-card'
                                  : 'border-destructive/40 bg-destructive/5'
                              }`}
                            >
                              <div className="text-3xl">{p.glyph}</div>
                              <div className="text-xs text-turquoise">{p.translit}</div>
                              {p.gardiner && (
                                <div className="text-[10px] text-muted-foreground">
                                  {p.gardiner}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Sparkles className="w-6 h-6 mb-2 text-gold/50" />
                  <p className="text-sm">Type something to translate</p>
                </div>
              )}
            </AnimatePresence>
          </EgyptianCardContent>
        </EgyptianCard>
      </div>

      {/* Reference */}
      <EgyptianCard>
        <EgyptianCardContent className="p-4">
          <h4 className="font-display text-sm text-gold mb-3 tracking-widest uppercase">
            Uniliteral alphabet (click to insert)
          </h4>
          <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
            {UNILITERALS.map((s) => (
              <button
                key={s.gardiner}
                onClick={() => {
                  if (direction === 'hiero-to-en') setInput((v) => v + s.glyph);
                  else setInput((v) => v + s.translit);
                }}
                title={`${s.gardiner} · ${s.translit} · ${s.meaning}`}
                className="aspect-square rounded-lg border border-border bg-card hover:border-gold/60 hover:shadow-gold-glow transition-all flex flex-col items-center justify-center"
              >
                <span className="text-2xl">{s.glyph}</span>
                <span className="text-[10px] text-turquoise">{s.translit}</span>
              </button>
            ))}
          </div>
        </EgyptianCardContent>
      </EgyptianCard>
    </div>
  );
}

function QuickInsert({ onInsert }: { onInsert: (g: string) => void }) {
  const quick = ['𓄤', '𓇳', '𓋹', '𓊽', '𓎟', '𓂀', '𓊵', '𓁹'];
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <span className="text-xs text-muted-foreground self-center">Quick signs:</span>
      {quick.map((g) => (
        <button
          key={g}
          onClick={() => onInsert(g)}
          className="px-2 py-1 rounded-md bg-card border border-border hover:border-gold/60 text-2xl"
        >
          {g}
        </button>
      ))}
    </div>
  );
}
