import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, X, RotateCcw, ArrowRight } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { FigureMatchData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: FigureMatchData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function FigureMatchPuzzle({ puzzle, onSolve, onClose }: Props) {
  const [selectedFigure, setSelectedFigure] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const handleFigureClick = (figureId: string) => {
    if (revealed) return;
    setSelectedFigure(figureId === selectedFigure ? null : figureId);
  };

  const handleAchievementClick = (achievementId: string) => {
    if (revealed || !selectedFigure) return;
    
    // Check if this achievement is already matched
    const existingMatch = Object.entries(matches).find(([, aid]) => aid === achievementId);
    if (existingMatch) {
      // Remove existing match
      const newMatches = { ...matches };
      delete newMatches[existingMatch[0]];
      setMatches(newMatches);
    }
    
    // Create new match
    setMatches(prev => ({
      ...prev,
      [achievementId]: selectedFigure
    }));
    setSelectedFigure(null);
  };

  const handleCheck = () => {
    let correctCount = 0;
    puzzle.data.achievements.forEach(achievement => {
      if (matches[achievement.id] === achievement.figureId) {
        correctCount++;
      }
    });
    
    const accuracy = correctCount / puzzle.data.achievements.length;
    const earnedPoints = Math.round(puzzle.points * accuracy);
    setScore(earnedPoints);
    setRevealed(true);

    if (accuracy >= 0.8) {
      setTimeout(() => onSolve(earnedPoints), 2000);
    }
  };

  const handleReset = () => {
    setMatches({});
    setSelectedFigure(null);
    setRevealed(false);
    setScore(0);
  };

  const getMatchedFigure = (achievementId: string) => {
    const figureId = matches[achievementId];
    return puzzle.data.figures.find(f => f.id === figureId);
  };

  const isCorrectMatch = (achievementId: string) => {
    const achievement = puzzle.data.achievements.find(a => a.id === achievementId);
    return achievement && matches[achievementId] === achievement.figureId;
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  const allMatched = Object.keys(matches).length === puzzle.data.achievements.length;

  return (
    <EgyptianCard variant="tomb" className="max-w-3xl mx-auto">
      <EgyptianCardContent className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
            <Users className="w-5 h-5" />
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

        {/* Instructions */}
        <div className="bg-primary/10 rounded-lg p-3 text-sm">
          <p className="text-foreground/80">
            <strong>Click a figure</strong>, then click the achievement that belongs to them. Match all achievements to their correct historical figures.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Figures Column */}
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3">Historical Figures</h4>
            <div className="space-y-2">
              {puzzle.data.figures.map((figure) => (
                <motion.button
                  key={figure.id}
                  onClick={() => handleFigureClick(figure.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left transition-all",
                    selectedFigure === figure.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card hover:border-gold/50"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={revealed}
                >
                  <div className="font-display font-semibold">{figure.name}</div>
                  <div className="text-xs text-muted-foreground">{figure.title}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Achievements Column */}
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3">Achievements</h4>
            <div className="space-y-2">
              {puzzle.data.achievements.map((achievement) => {
                const matchedFigure = getMatchedFigure(achievement.id);
                const isCorrect = revealed && isCorrectMatch(achievement.id);
                const isIncorrect = revealed && matches[achievement.id] && !isCorrectMatch(achievement.id);
                
                return (
                  <motion.button
                    key={achievement.id}
                    onClick={() => handleAchievementClick(achievement.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 text-left transition-all",
                      isCorrect
                        ? "border-scarab bg-scarab/10"
                        : isIncorrect
                        ? "border-terracotta bg-terracotta/10"
                        : matchedFigure
                        ? "border-gold bg-gold/10"
                        : selectedFigure
                        ? "border-border bg-card hover:border-primary cursor-pointer"
                        : "border-border bg-card"
                    )}
                    whileHover={!revealed && selectedFigure ? { scale: 1.01 } : {}}
                    disabled={revealed || !selectedFigure}
                  >
                    <p className="text-sm font-body">{achievement.text}</p>
                    {matchedFigure && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <ArrowRight className="w-3 h-3" />
                        <span className={cn(
                          "font-display",
                          isCorrect ? "text-scarab" : isIncorrect ? "text-terracotta" : "text-gold"
                        )}>
                          {matchedFigure.name}
                        </span>
                        {revealed && (
                          isCorrect 
                            ? <Check className="w-4 h-4 text-scarab" />
                            : <X className="w-4 h-4 text-terracotta" />
                        )}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                score >= puzzle.points * 0.8 
                  ? 'bg-scarab/20 border border-scarab/30' 
                  : 'bg-terracotta/20 border border-terracotta/30'
              }`}
            >
              {score >= puzzle.points * 0.8 ? (
                <div className="text-center">
                  <span className="text-3xl block mb-2">𓅃</span>
                  <span className="font-display text-scarab block">
                    Excellent knowledge of the ancients!
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Points earned: {score}/{puzzle.points}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-display text-terracotta block mb-2">
                    Study the history scrolls and try again...
                  </span>
                  <span className="text-sm text-muted-foreground block mb-2">
                    Score: {score}/{puzzle.points} (need 80% to pass)
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
              <EgyptianButton 
                variant="hero" 
                onClick={handleCheck} 
                className="flex-1"
                disabled={!allMatched}
              >
                <Check className="w-4 h-4 mr-2" />
                Check Matches
              </EgyptianButton>
            </>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}