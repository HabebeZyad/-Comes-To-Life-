import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Clock, Check, X, RotateCcw, Lightbulb } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { TimelineOrderData } from '@/data/mapPuzzles';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    timeLimit?: number;
    data: TimelineOrderData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function TimelineOrderPuzzle({ puzzle, onSolve, onClose }: Props) {
  const [items, setItems] = useState(() =>
    [...puzzle.data.events].sort(() => Math.random() - 0.5)
  );
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(puzzle.timeLimit || 0);
  const [timerActive, setTimerActive] = useState(!!puzzle.timeLimit);

  const handleCheck = useCallback(() => {
    const userOrder = items.map(item => item.id);
    const correct = userOrder.every((id, idx) => id === puzzle.data.correctOrder[idx]);
    setIsCorrect(correct);
    setRevealed(true);
    setTimerActive(false);

    if (correct) {
      const hintPenalty = hintsUsed * 25;
      const timeBonusMultiplier = puzzle.timeLimit && timeLeft > 0
        ? 1 + (timeLeft / puzzle.timeLimit) * 0.5
        : 1;
      const finalPoints = Math.round((puzzle.points - hintPenalty) * timeBonusMultiplier);
      setTimeout(() => onSolve(Math.max(finalPoints, 10)), 2000);
    }
  }, [items, puzzle, hintsUsed, timeLeft, onSolve]);

  React.useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleCheck();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, handleCheck]);

  const handleReset = () => {
    setItems([...puzzle.data.events].sort(() => Math.random() - 0.5));
    setRevealed(false);
    setIsCorrect(false);
    setShowHint(null);
    if (puzzle.timeLimit) {
      setTimeLeft(puzzle.timeLimit);
      setTimerActive(true);
    }
  };

  const handleHint = (eventId: string) => {
    const event = puzzle.data.events.find(e => e.id === eventId);
    if (event) {
      setShowHint(event.hint);
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
            <h3 className="font-display text-xl font-bold text-gold-gradient">{puzzle.title}</h3>
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
          {puzzle.timeLimit && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${timeLeft < 30 ? 'bg-terracotta/20 text-terracotta' : 'bg-muted'
              }`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-primary/10 rounded-lg p-3 text-sm">
          <p className="text-foreground/80">
            <strong>Drag and drop</strong> the events to arrange them in chronological order, from earliest to latest.
          </p>
        </div>

        {/* Reorderable Timeline */}
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-2"
        >
          {items.map((event, index) => (
            <Reorder.Item
              key={event.id}
              value={event}
              className={`cursor-grab active:cursor-grabbing ${revealed ? 'pointer-events-none' : ''}`}
            >
              <motion.div
                className={`p-4 rounded-lg border-2 transition-colors ${revealed
                  ? puzzle.data.correctOrder[index] === event.id
                    ? 'border-scarab bg-scarab/10'
                    : 'border-terracotta bg-terracotta/10'
                  : 'border-border bg-card hover:border-gold/50'
                  }`}
                whileHover={!revealed ? { scale: 1.01 } : {}}
                layout
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-display text-sm">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-body">{event.title}</span>
                  {!revealed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHint(event.id);
                      }}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                      title="Get hint (-25 pts)"
                    >
                      <Lightbulb className="w-4 h-4" />
                    </button>
                  )}
                  {revealed && (
                    <span>
                      {puzzle.data.correctOrder[index] === event.id
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

        {/* Hint Display */}
        <AnimatePresence>
          {showHint && !revealed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-gold/10 border border-gold/30 rounded-lg p-3 text-sm"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <p className="text-foreground/80">{showHint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${isCorrect ? 'bg-scarab/20 border border-scarab/30' : 'bg-terracotta/20 border border-terracotta/30'
                }`}
            >
              {isCorrect ? (
                <div className="text-center">
                  <span className="text-3xl block mb-2">𓋹</span>
                  <span className="font-display text-scarab block">
                    Excellent! You've mastered the timeline of history!
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Hints used: {hintsUsed} | Points earned: {Math.max(puzzle.points - hintsUsed * 25, 10)}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-display text-terracotta block mb-2">
                    The timeline is still confused...
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
              <EgyptianButton variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </EgyptianButton>
              <EgyptianButton variant="hero" onClick={handleCheck} className="flex-1">
                <Check className="w-4 h-4 mr-2" />
                Check Order
              </EgyptianButton>
            </>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}