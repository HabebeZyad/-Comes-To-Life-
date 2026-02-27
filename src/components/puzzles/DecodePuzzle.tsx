import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, Check, X, Eye, EyeOff, Lightbulb } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { DecodePuzzleData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: DecodePuzzleData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function DecodePuzzle({ puzzle, onSolve, onClose }: Props) {
  const [userAnswer, setUserAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [revealedSymbols, setRevealedSymbols] = useState<Set<string>>(new Set());
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleRevealSymbol = (symbol: string) => {
    if (revealedSymbols.has(symbol)) return;
    setRevealedSymbols(prev => new Set([...prev, symbol]));
    setHintsUsed(prev => prev + 1);
  };

  const handleCheck = () => {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const normalizedSolution = puzzle.data.solution.toLowerCase().trim();
    
    // Check for partial match (at least 70% of words match)
    const answerWords = normalizedAnswer.split(/\s+/);
    const solutionWords = normalizedSolution.split(/\s+/);
    
    let matchCount = 0;
    solutionWords.forEach(word => {
      if (answerWords.some(aw => aw.includes(word) || word.includes(aw))) {
        matchCount++;
      }
    });
    
    const matchRatio = matchCount / solutionWords.length;
    const correct = matchRatio >= 0.6;
    
    setIsCorrect(correct);
    setRevealed(true);

    if (correct) {
      const hintPenalty = hintsUsed * 20;
      const earnedPoints = Math.max(puzzle.points - hintPenalty, 20);
      setTimeout(() => onSolve(earnedPoints), 2000);
    }
  };

  const handleReset = () => {
    setUserAnswer('');
    setRevealed(false);
    setIsCorrect(false);
    setRevealedSymbols(new Set());
    setHintsUsed(0);
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  return (
    <EgyptianCard variant="tomb" className="max-w-2xl mx-auto">
      <EgyptianCardContent className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
            <ScrollText className="w-5 h-5" />
            {puzzle.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{puzzle.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-display uppercase ${difficultyColors[puzzle.difficulty]}`}>
              {puzzle.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">
              {puzzle.points} pts
            </span>
          </div>
        </div>

        {/* Encoded Message */}
        <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-lg p-6 border border-gold/30">
          <h4 className="font-display text-sm text-gold mb-3">The Secret Message:</h4>
          <p className="text-4xl tracking-widest text-center leading-relaxed">
            {puzzle.data.encodedMessage}
          </p>
        </div>

        {/* Hieroglyph Legend Toggle */}
        <div>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showLegend ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showLegend ? 'Hide' : 'Show'} Hieroglyph Key
          </button>

          <AnimatePresence>
            {showLegend && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {puzzle.data.hieroglyphs.map((glyph) => (
                    <div
                      key={glyph.symbol}
                      className={cn(
                        "p-2 rounded-lg border flex items-center gap-2 text-sm",
                        revealedSymbols.has(glyph.symbol)
                          ? "border-gold bg-gold/10"
                          : "border-border bg-card"
                      )}
                    >
                      <span className="text-2xl">{glyph.symbol}</span>
                      {revealedSymbols.has(glyph.symbol) ? (
                        <span className="text-gold font-semibold">{glyph.meaning}</span>
                      ) : (
                        <button
                          onClick={() => handleRevealSymbol(glyph.symbol)}
                          className="text-muted-foreground hover:text-primary flex items-center gap-1"
                          title="Reveal meaning (-20 pts)"
                        >
                          <Lightbulb className="w-3 h-3" />
                          <span className="text-xs">Reveal</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Answer Input */}
        <div>
          <label className="font-display text-sm text-muted-foreground block mb-2">
            Your Translation:
          </label>
          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your translation here..."
            className="w-full p-3 rounded-lg border-2 border-border bg-card focus:border-gold outline-none resize-none font-body"
            rows={3}
            disabled={revealed}
          />
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                isCorrect ? 'bg-scarab/20 border border-scarab/30' : 'bg-terracotta/20 border border-terracotta/30'
              }`}
            >
              {isCorrect ? (
                <div className="text-center">
                  <span className="text-3xl block mb-2">𓂧</span>
                  <span className="font-display text-scarab block">
                    The ancient message is revealed!
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Hints used: {hintsUsed} | Points earned: {Math.max(puzzle.points - hintsUsed * 20, 20)}
                  </span>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <span className="font-display text-terracotta block">
                    The message remains unclear...
                  </span>
                  <div className="text-sm text-muted-foreground">
                    <strong>Correct translation:</strong>
                    <p className="italic mt-1">"{puzzle.data.solution}"</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="font-body text-sm text-foreground/70 underline hover:text-foreground"
                  >
                    Try again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <EgyptianButton variant="outline" onClick={onClose} className="flex-1">
            Close
          </EgyptianButton>
          {!revealed && (
            <EgyptianButton 
              variant="hero" 
              onClick={handleCheck} 
              className="flex-1"
              disabled={!userAnswer.trim()}
            >
              <Check className="w-4 h-4 mr-2" />
              Check Translation
            </EgyptianButton>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}