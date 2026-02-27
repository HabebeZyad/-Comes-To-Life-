import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Check, X, RotateCcw, BookOpen } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { SequencePuzzleData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: SequencePuzzleData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function SequencePuzzle({ puzzle, onSolve, onClose }: Props) {
  const [items, setItems] = useState(() =>
    [...puzzle.data.panels].sort(() => Math.random() - 0.5)
  );
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleCheck = useCallback(() => {
    const userOrder = items.map(item => item.id);
    const correct = userOrder.every((id, idx) => id === puzzle.data.correctOrder[idx]);
    setIsCorrect(correct);
    setRevealed(true);

    if (correct) {
      const hintPenalty = hintsUsed * 25;
      const earnedPoints = Math.max(puzzle.points - hintPenalty, 25);
      setTimeout(() => onSolve(earnedPoints), 2000);
    }
  }, [items, puzzle, hintsUsed, onSolve]);

  const handleReset = () => {
    setItems([...puzzle.data.panels].sort(() => Math.random() - 0.5));
    setRevealed(false);
    setIsCorrect(false);
    setHintsUsed(0);
  };

  const handleShowHint = () => {
    if (hintsUsed < puzzle.data.correctOrder.length) {
      setHintsUsed(prev => prev + 1);
    }
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
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
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
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-primary/10 rounded-lg p-3 text-sm">
          <p className="text-foreground/80">
            <strong>Drag and drop</strong> the panels to arrange them in the correct chronological sequence.
          </p>
        </div>

        {/* Reorderable Panels */}
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-2"
        >
          {items.map((panel, index) => (
            <Reorder.Item
              key={panel.id}
              value={panel}
              className={`cursor-grab active:cursor-grabbing ${revealed ? 'pointer-events-none' : ''}`}
            >
              <motion.div
                className={`p-4 rounded-lg border-2 transition-colors ${
                  revealed
                    ? puzzle.data.correctOrder[index] === panel.id
                      ? 'border-scarab bg-scarab/10'
                      : 'border-terracotta bg-terracotta/10'
                    : 'border-border bg-card hover:border-gold/50'
                }`}
                whileHover={!revealed ? { scale: 1.01 } : {}}
                layout
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display text-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-body text-sm">{panel.caption}</p>
                    {/* Show hint for this position */}
                    {revealed && hintsUsed > index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-muted-foreground mt-1"
                      >
                        Correct position: {puzzle.data.correctOrder.indexOf(panel.id) + 1}
                      </motion.div>
                    )}
                  </div>
                  {revealed && (
                    <span>
                      {puzzle.data.correctOrder[index] === panel.id
                        ? <Check className="w-5 h-5 text-scarab" />
                        : <X className="w-5 h-5 text-terracotta" />
                      }
                    </span>
                  )}
                </div>
              </motion.div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

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
                  <span className="text-3xl block mb-2">𓏏</span>
                  <span className="font-display text-scarab block">
                    Perfect sequence! You have mastered the chronology!
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Hints used: {hintsUsed} | Points earned: {Math.max(puzzle.points - hintsUsed * 25, 25)}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-display text-terracotta block mb-2">
                    The sequence is still confused...
                  </span>
                  <span className="text-sm text-muted-foreground block mb-2">
                    Try again or use hints to see the correct positions.
                  </span>
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
            <>
              <EgyptianButton variant="outline" onClick={handleShowHint}>
                Hint ({hintsUsed}/{puzzle.data.correctOrder.length})
              </EgyptianButton>
              <EgyptianButton variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </EgyptianButton>
              <EgyptianButton
                variant="hero"
                onClick={handleCheck}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                Check Sequence
              </EgyptianButton>
            </>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}