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
  isEmbed?: boolean;
}

export function TimelineOrderPuzzle({ puzzle, onSolve, onClose, isEmbed }: Props) {
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

  const content = (
    <div className="space-y-6">
      {/* Header - Only if not embedded */}
      {!isEmbed && (
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
      )}

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
        className="space-y-3"
      >
        {items.map((event, index) => (
          <Reorder.Item
            key={event.id}
            value={event}
            className={`cursor-grab active:cursor-grabbing ${revealed ? 'pointer-events-none' : ''}`}
          >
            <motion.div
              className={`relative overflow-hidden p-5 rounded-xl border-2 transition-all duration-300 ${revealed
                ? puzzle.data.correctOrder[index] === event.id
                  ? 'border-scarab bg-scarab/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                  : 'border-terracotta bg-terracotta/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : 'border-gold/20 bg-obsidian/60 hover:border-gold/50 shadow-lg'
                }`}
              whileHover={!revealed ? { scale: 1.02, x: 5 } : {}}
              layout
            >
              {/* Background texture */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/papyros.png')]" />

              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display text-lg shrink-0 border transition-colors ${
                  revealed && puzzle.data.correctOrder[index] === event.id ? 'bg-scarab/20 border-scarab text-scarab' : 'bg-black/40 border-gold/20 text-gold-light'
                }`}>
                  {index + 1}
                </div>

                <div className="flex-1">
                  <span className="font-display text-lg text-foreground block leading-tight">{event.title}</span>
                  {revealed && puzzle.data.correctOrder[index] !== event.id && (
                    <span className="text-[10px] text-terracotta uppercase font-bold mt-1 block">Misaligned Inscription</span>
                  )}
                </div>

                {!revealed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHint(event.id);
                    }}
                    className="p-2 rounded-full hover:bg-primary/20 text-gold/40 hover:text-primary transition-all group"
                    title="Get hint (-25 pts)"
                  >
                    <Lightbulb className="w-5 h-5 group-hover:drop-shadow-gold-glow" />
                  </button>
                )}

                {revealed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      puzzle.data.correctOrder[index] === event.id ? 'bg-scarab/20' : 'bg-terracotta/20'
                    }`}
                  >
                    {puzzle.data.correctOrder[index] === event.id
                      ? <Check className="w-5 h-5 text-scarab" />
                      : <X className="w-5 h-5 text-terracotta" />
                    }
                  </motion.div>
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
    </div>
  );

  if (isEmbed) {
    return content;
  }

  return (
    <EgyptianCard variant="tomb" className="max-w-2xl mx-auto">
      <EgyptianCardContent className="p-6">
        {content}
      </EgyptianCardContent>
    </EgyptianCard>
  );
}