import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Check, X, RotateCcw, Lightbulb, Info, BookOpen } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { LogicFragmentsData } from '@/data/mapPuzzles';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: LogicFragmentsData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
  isEmbed?: boolean;
}

export function LogicFragmentsPuzzle({ puzzle, onSolve, onClose, isEmbed }: Props) {
  const [items, setItems] = useState(() =>
    [...puzzle.data.fragments].sort(() => Math.random() - 0.5)
  );
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showClues, setShowClues] = useState(true);

  const handleCheck = useCallback(() => {
    const userOrder = items.map(item => item.id);
    const correct = userOrder.every((id, idx) => id === puzzle.data.correctOrder[idx]);
    setIsCorrect(correct);
    setRevealed(true);

    if (correct) {
      setTimeout(() => onSolve(puzzle.points), 2000);
    }
  }, [items, puzzle, onSolve]);

  const handleReset = () => {
    setItems([...puzzle.data.fragments].sort(() => Math.random() - 0.5));
    setRevealed(false);
    setIsCorrect(false);
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  const content = (
    <div className="space-y-6">
      {!isEmbed && (
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
        </div>
      )}

      {/* Clues Section */}
      <div className="bg-lapis/10 border border-lapis/20 rounded-xl p-4">
        <button
          onClick={() => setShowClues(!showClues)}
          className="flex items-center gap-2 text-turquoise font-display text-sm mb-2"
        >
          <Info className="w-4 h-4" />
          {showClues ? "Hide Discovered Clues" : "Show Discovered Clues"}
        </button>
        <AnimatePresence>
          {showClues && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <ul className="space-y-2">
                {puzzle.data.clues.map((clue, idx) => (
                  <li key={idx} className="text-sm font-body text-foreground/80 italic pl-4 border-l-2 border-turquoise/30">
                    "{clue}"
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fragments Reorder Area */}
      <div className="space-y-3">
        <p className="text-xs font-display text-gold/60 uppercase tracking-widest text-center mb-4">
          Arrange the journal fragments into the correct sequence
        </p>
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="space-y-3"
        >
          {items.map((fragment, index) => (
            <Reorder.Item
              key={fragment.id}
              value={fragment}
              className={`cursor-grab active:cursor-grabbing ${revealed ? 'pointer-events-none' : ''}`}
            >
              <motion.div
                className={`p-4 rounded-xl border-2 transition-colors bg-obsidian/40 backdrop-blur-md ${revealed
                  ? puzzle.data.correctOrder[index] === fragment.id
                    ? 'border-scarab bg-scarab/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                    : 'border-terracotta bg-terracotta/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                  : 'border-gold/20 hover:border-gold/50'
                  }`}
                layout
              >
                <div className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center font-display text-sm text-gold-light border border-gold/10 shrink-0">
                    {index + 1}
                  </span>
                  <p className="flex-1 font-body text-foreground leading-relaxed italic">
                    "{fragment.text}"
                  </p>
                  {revealed && (
                    <span className="shrink-0 pt-1">
                      {puzzle.data.correctOrder[index] === fragment.id
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
      </div>

      {/* Result Display */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg text-center ${isCorrect ? 'bg-scarab/20 border border-scarab/30 text-scarab' : 'bg-terracotta/20 border border-terracotta/30 text-terracotta'
              }`}
          >
            <span className="font-display block text-lg mb-1">
              {isCorrect ? 'Logic Restored!' : 'The sequence is flawed...'}
            </span>
            <span className="text-sm opacity-80">
              {isCorrect ? 'The scribe\'s account is now coherent.' : 'Consult the clues and try once more.'}
            </span>
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
            <EgyptianButton variant="hero" onClick={handleCheck} className="flex-2">
              <Check className="w-4 h-4 mr-2" />
              Verify Sequence
            </EgyptianButton>
          </>
        )}
      </div>
    </div>
  );

  if (isEmbed) return content;

  return (
    <EgyptianCard variant="tomb" className="max-w-2xl mx-auto">
      <EgyptianCardContent className="p-6">
        {content}
      </EgyptianCardContent>
    </EgyptianCard>
  );
}
