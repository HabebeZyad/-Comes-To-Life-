import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Check, History, Star } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { ChoicePuzzleData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: ChoicePuzzleData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function ChoicePuzzle({ puzzle, onSolve, onClose }: Props) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const handleChoice = (choiceId: string) => {
    if (revealed) return;
    setSelectedChoice(choiceId);
  };

  const handleConfirm = () => {
    if (!selectedChoice) return;
    
    const choice = puzzle.data.choices.find(c => c.id === selectedChoice);
    if (choice) {
      setEarnedPoints(choice.points);
      setRevealed(true);
      
      // All choices are valid - it's about the journey, not correctness
      setTimeout(() => onSolve(choice.points), 3000);
    }
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setRevealed(false);
    setEarnedPoints(0);
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  const selectedChoiceData = puzzle.data.choices.find(c => c.id === selectedChoice);
  const historicalChoice = puzzle.data.choices.find(c => c.id === puzzle.data.historicalChoice);

  return (
    <EgyptianCard variant="tomb" className="max-w-2xl mx-auto">
      <EgyptianCardContent className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            {puzzle.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{puzzle.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs font-display uppercase ${difficultyColors[puzzle.difficulty]}`}>
              {puzzle.difficulty}
            </span>
            <span className="text-xs text-muted-foreground">
              Up to {puzzle.points} pts
            </span>
          </div>
        </div>

        {/* Scenario */}
        <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-lg p-5 border border-gold/30">
          <p className="font-body text-lg text-foreground italic leading-relaxed">
            {puzzle.data.scenario}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-3">
          <h4 className="font-display text-sm text-muted-foreground">What will you do?</h4>
          {puzzle.data.choices.map((choice) => {
            const isSelected = selectedChoice === choice.id;
            const isHistorical = revealed && choice.id === puzzle.data.historicalChoice;
            
            return (
              <motion.button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  revealed && isSelected
                    ? "border-gold bg-gold/10"
                    : isHistorical
                    ? "border-turquoise/50 bg-turquoise/5"
                    : isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-gold/50"
                )}
                whileHover={!revealed ? { scale: 1.01 } : {}}
                whileTap={!revealed ? { scale: 0.99 } : {}}
                disabled={revealed}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                  )}>
                    {isSelected && <Check className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-body font-medium">{choice.text}</p>
                    {revealed && isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-border/50"
                      >
                        <p className="text-sm text-muted-foreground italic">
                          {choice.consequence}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Star className="w-4 h-4 text-gold" />
                          <span className="text-sm text-gold font-display">+{choice.points} points</span>
                        </div>
                      </motion.div>
                    )}
                    {revealed && isHistorical && !isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 mt-2"
                      >
                        <History className="w-4 h-4 text-turquoise" />
                        <span className="text-xs text-turquoise font-display">Historical choice</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Revealed Info */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Result */}
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
                <span className="text-3xl block mb-2">𓏏</span>
                <span className="font-display text-primary block">
                  Your choice shapes your destiny!
                </span>
                <span className="text-sm text-muted-foreground">
                  You earned {earnedPoints} points
                </span>
              </div>

              {/* Historical Context */}
              {historicalChoice && selectedChoice !== puzzle.data.historicalChoice && (
                <div className="p-4 rounded-lg bg-turquoise/10 border border-turquoise/30">
                  <div className="flex items-start gap-2">
                    <History className="w-5 h-5 text-turquoise flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-display text-sm text-turquoise block mb-1">
                        Historical Note:
                      </span>
                      <p className="text-sm text-muted-foreground">
                        In history, {historicalChoice.text.toLowerCase()} was the path taken. 
                        But history remembers both roads considered!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <EgyptianButton variant="outline" onClick={onClose} className="flex-1">
            {revealed ? 'Continue' : 'Close'}
          </EgyptianButton>
          {!revealed && (
            <EgyptianButton 
              variant="hero" 
              onClick={handleConfirm} 
              className="flex-1"
              disabled={!selectedChoice}
            >
              <Check className="w-4 h-4 mr-2" />
              Confirm Choice
            </EgyptianButton>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}