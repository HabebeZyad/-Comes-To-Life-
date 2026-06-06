import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Copy, Check, Sparkles, Languages, Info, BookOpen, HelpCircle } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import {
  translateEnglishToHiero,
  translateHieroToEnglish,
  TRANSLATOR_SIGN_COUNT,
  UNILITERALS,
} from '@/data/hieroglyphTranslator';

type Direction = 'en-to-hiero' | 'hiero-to-en';

const SUGGESTIONS = [
  { text: "Lord of the Two Lands", label: "Title" },
  { text: "Life, Prosperity, and Health", label: "Blessing" },
  { text: "Son of Ra", label: "Royal" },
  { text: "True of voice", label: "Epithet" },
  { text: "Given life forever", label: "Formula" },
  { text: "Beautiful sun", label: "Phrase" },
  { text: "Osiris", label: "God" },
  { text: "Scribe", label: "Word" },
  { text: "Love", label: "Word" }
];

export function HieroglyphTranslator() {
  const [direction, setDirection] = useState<Direction>('en-to-hiero');
  const [input, setInput] = useState('Lord of the Two Lands');
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
              Phonetic transliteration and semantic dictionary translation.
              Egyptian wrote consonants only — vowels are approximated.
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

      {/* Suggestions List */}
      <div className="flex flex-col gap-2 p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 text-xs font-display text-gold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-glow-pulse" />
          <span>Quick Translation Suggestions (Semantic Lookups)</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => {
                if (direction === 'hiero-to-en') {
                  setDirection('en-to-hiero');
                }
                setInput(s.text);
              }}
              className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/5 hover:border-gold/40 text-xs text-muted-foreground hover:text-gold transition-all flex items-center gap-1.5"
            >
              <span>{s.text}</span>
              <span className="text-[9px] px-1 py-0.2 rounded-full bg-gold/10 text-gold border border-gold/20">{s.label}</span>
            </button>
          ))}
        </div>
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
                  className="space-y-4"
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
                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <h4 className="font-display text-xs text-gold uppercase tracking-wider">Translation Breakdown</h4>
                        {result.data.perWord.map((w, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-black/20 border border-white/5 flex flex-col gap-1 text-sm relative overflow-hidden"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-display text-foreground font-bold">
                                {w.word}
                              </span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                                w.type === 'semantic-phrase'
                                  ? 'bg-turquoise/10 border-turquoise/30 text-turquoise'
                                  : w.type === 'semantic-word'
                                  ? 'bg-gold/10 border-gold/30 text-gold'
                                  : 'bg-muted/10 border-white/10 text-muted-foreground'
                              }`}>
                                {w.type === 'semantic-phrase' ? 'Formula' : w.type === 'semantic-word' ? 'Word' : 'Phonetic Spelling'}
                              </span>
                            </div>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="text-3xl text-gold font-display">{w.glyphs}</span>
                              <span className="text-xs text-turquoise">[{w.translit}]</span>
                              {w.pronunciation && w.pronunciation.toLowerCase() !== w.word.toLowerCase() && (
                                <span className="text-xs text-muted-foreground italic">({w.pronunciation})</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {w.meaning}
                            </p>
                            {w.notes && (
                              <p className="text-[11px] text-amber-500/80 border-t border-white/5 pt-1.5 mt-1 flex items-start gap-1">
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                <span>{w.notes}</span>
                              </p>
                            )}
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
                      
                      <div className="pt-4 border-t border-border/50 space-y-3">
                        <h4 className="font-display text-xs text-gold uppercase tracking-wider">Sign & Word Analysis</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {result.data.parts
                            .filter((p) => p.glyph.trim())
                            .map((p, i) => (
                              <div
                                key={i}
                                className={`p-3 rounded-xl border flex flex-col justify-between ${
                                  p.type === 'semantic-phrase'
                                    ? 'border-turquoise/40 bg-turquoise/5'
                                    : p.type === 'semantic-word'
                                    ? 'border-gold/40 bg-gold/5'
                                    : p.known
                                    ? 'border-border bg-card'
                                    : 'border-destructive/30 bg-destructive/5'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-3xl text-gold font-display">{p.glyph}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                                      p.type === 'semantic-phrase'
                                        ? 'bg-turquoise/20 text-turquoise'
                                        : p.type === 'semantic-word'
                                        ? 'bg-gold/20 text-gold'
                                        : 'bg-muted/30 text-muted-foreground'
                                    }`}>
                                      {p.type === 'semantic-phrase' ? 'Formula' : p.type === 'semantic-word' ? 'Word' : p.gardiner || 'Sign'}
                                    </span>
                                  </div>
                                  <div className="text-xs font-display text-turquoise">[{p.translit}]</div>
                                  <div className="text-xs text-foreground mt-1.5 leading-snug">{p.meaning}</div>
                                </div>
                                {p.notes && (
                                  <div className="text-[10px] text-muted-foreground border-t border-white/5 pt-1.5 mt-2 italic leading-relaxed">
                                    {p.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
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

      {/* Reference / Alphabet */}
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

      {/* Trustworthy References section */}
      <EgyptianCard className="border-gold/20">
        <EgyptianCardContent className="p-5 space-y-4">
          <h4 className="font-display text-sm text-gold tracking-widest uppercase flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold" />
            Trustworthy Academic Sources & Methodology
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlike simple online converters that only substitute English characters for hieroglyphs (phonetic spelling), this translator implements both <strong>phonetic transliteration</strong> and a <strong>semantic dictionary lookup</strong>. Semantic translations are sourced directly from peer-reviewed academic materials:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-xs pt-2">
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-gold">Raymond Faulkner</span>
              <p className="text-muted-foreground text-[11px]">
                <em>A Concise Dictionary of Middle Egyptian</em>. The standard reference dictionary utilized by professional Egyptologists worldwide.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-gold">Collier & Manley</span>
              <p className="text-muted-foreground text-[11px]">
                <em>How to Read Egyptian Hieroglyphs</em>. Published by the British Museum, it is the premier authority on reading administrative and funerary stelae.
              </p>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-gold">James P. Allen</span>
              <p className="text-muted-foreground text-[11px]">
                <em>Middle Egyptian: An Introduction</em>. The standard academic textbook on the grammar, syntax, and literature of Middle Kingdom Egyptian.
              </p>
            </div>
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

