import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { TimelineOrderPuzzle } from './TimelineOrderPuzzle';
import { FigureMatchPuzzle } from './FigureMatchPuzzle';
import { LocationMatchPuzzle } from './LocationMatchPuzzle';
import { RouteTracePuzzle } from './RouteTracePuzzle';
import { TerritoryClaimPuzzle } from './TerritoryClaimPuzzle';
import { DecodePuzzle } from './DecodePuzzle';
import { ChoicePuzzle } from './ChoicePuzzle';
import { SequencePuzzle } from './SequencePuzzle';
import type {
  MapPuzzle,
  StoryPuzzle,
  TimelineOrderData,
  FigureMatchData,
  LocationMatchData,
  RouteTraceData,
  TerritoryClaimData,
  DecodePuzzleData,
  ChoicePuzzleData,
  SequencePuzzleData,
  RiddlePuzzleData
} from '@/data/mapPuzzles';

type PuzzlePayload =
  | TimelineOrderData
  | FigureMatchData
  | LocationMatchData
  | RouteTraceData
  | TerritoryClaimData
  | DecodePuzzleData
  | ChoicePuzzleData
  | SequencePuzzleData
  | RiddlePuzzleData;

interface MapPuzzleModalProps {
  puzzle: MapPuzzle | null;
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function MapPuzzleModal({ puzzle, onSolve, onClose }: MapPuzzleModalProps) {
  if (!puzzle) return null;

  const renderPuzzle = () => {
    const { data } = puzzle;

    switch (data.type) {
      case 'timeline-order':
        return (
          <TimelineOrderPuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'figure-match':
        return (
          <FigureMatchPuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'location-match':
        return (
          <LocationMatchPuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'route-trace':
        return (
          <RouteTracePuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'territory-claim':
        return (
          <TerritoryClaimPuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      default:
        return (
          <div className="text-center p-8 text-muted-foreground">
            Puzzle type "{puzzle.type}" coming soon!
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {renderPuzzle()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface StoryPuzzleModalProps {
  puzzle: StoryPuzzle | null;
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function StoryPuzzleModal({ puzzle, onSolve, onClose }: StoryPuzzleModalProps) {
  if (!puzzle) return null;

  const renderPuzzle = () => {
    const { data } = puzzle;

    switch (data.type) {
      case 'decode':
        return (
          <DecodePuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'choice':
        return (
          <ChoicePuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'sequence':
        return (
          <SequencePuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      case 'riddle':
        // Reuse story riddle format
        return (
          <StoryRiddlePuzzle
            puzzle={{
              ...puzzle,
              data
            }}
            onSolve={onSolve}
            onClose={onClose}
          />
        );
      default:
        return (
          <div className="text-center p-8 text-muted-foreground">
            Puzzle type "{puzzle.type}" coming soon!
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {renderPuzzle()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Story-specific riddle puzzle component
function StoryRiddlePuzzle({
  puzzle,
  onSolve,
  onClose
}: {
  puzzle: {
    title: string;
    description: string;
    difficulty: string;
    points: number;
    data: RiddlePuzzleData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}) {
  const [userAnswer, setUserAnswer] = React.useState('');
  const [revealed, setRevealed] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [currentHint, setCurrentHint] = React.useState(0);
  const [hintsUsed, setHintsUsed] = React.useState(0);

  const handleCheck = () => {
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const isMatch = puzzle.data.acceptableAnswers.some(
      ans => normalizedAnswer.includes(ans.toLowerCase())
    );

    setIsCorrect(isMatch);
    setRevealed(true);

    if (isMatch) {
      const hintPenalty = hintsUsed * 25;
      setTimeout(() => onSolve(Math.max(puzzle.points - hintPenalty, 25)), 2000);
    }
  };

  const handleShowHint = () => {
    if (currentHint < puzzle.data.hints.length) {
      setCurrentHint(prev => prev + 1);
      setHintsUsed(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setUserAnswer('');
    setRevealed(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-display text-xl font-bold text-gold-gradient">{puzzle.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{puzzle.description}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded" aria-label="Close">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Riddle */}
      <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-lg p-5 border border-gold/30">
        <p className="font-body text-lg text-foreground italic text-center leading-relaxed">
          "{puzzle.data.riddle}"
        </p>
      </div>

      {/* Hints */}
      {currentHint > 0 && (
        <div className="space-y-2">
          {puzzle.data.hints.slice(0, currentHint).map((hint, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-primary/10 rounded-lg p-3 text-sm"
            >
              <span className="text-primary font-display">Hint {i + 1}:</span> {hint}
            </motion.div>
          ))}
        </div>
      )}

      {/* Answer Input */}
      <div>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="w-full p-3 rounded-lg border-2 border-border bg-background focus:border-gold outline-none font-body"
          disabled={revealed}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
      </div>

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
                <span className="text-3xl block mb-2">𓂋</span>
                <span className="font-display text-scarab block">
                  Wisdom illuminates your path!
                </span>
                <span className="text-sm text-muted-foreground">
                  Points earned: {Math.max(puzzle.points - hintsUsed * 25, 25)}
                </span>
              </div>
            ) : (
              <div className="text-center">
                <span className="font-display text-terracotta block mb-2">
                  The answer was: "{puzzle.data.answer}"
                </span>
                <button
                  onClick={handleReset}
                  className="text-sm underline hover:text-foreground"
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
        <button
          onClick={handleShowHint}
          disabled={currentHint >= puzzle.data.hints.length || revealed}
          className="px-4 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed text-sm font-display"
        >
          Hint ({puzzle.data.hints.length - currentHint} left)
        </button>
        <div className="flex-1" />
        {!revealed && (
          <button
            onClick={handleCheck}
            disabled={!userAnswer.trim()}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 font-display"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}