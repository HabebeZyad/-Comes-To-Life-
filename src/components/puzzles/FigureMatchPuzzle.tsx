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
  isEmbed?: boolean;
}

export function FigureMatchPuzzle({ puzzle, onSolve, onClose, isEmbed }: Props) {
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

  const content = (
    <div className="space-y-6">
      {/* Header - Only if not embedded */}
      {!isEmbed && (
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
      )}

      {/* Instructions */}
      <div className="bg-primary/10 rounded-lg p-3 text-sm">
        <p className="text-foreground/80">
          <strong>Click a figure</strong>, then click the achievement that belongs to them. Match all achievements to their correct historical figures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Figures Column */}
        <div>
          <h4 className="font-display text-xs text-primary uppercase tracking-[0.2em] mb-4">Master Builders & Sages</h4>
          <div className="space-y-3">
            {puzzle.data.figures.map((figure) => (
              <motion.button
                key={figure.id}
                onClick={() => handleFigureClick(figure.id)}
                className={cn(
                  "relative w-full p-4 rounded-xl border-2 text-left transition-all overflow-hidden",
                  selectedFigure === figure.id
                    ? "border-primary bg-primary/10 shadow-gold-glow"
                    : "border-gold/20 bg-obsidian/40 hover:border-gold/50 shadow-lg"
                )}
                whileHover={!revealed ? { scale: 1.02, x: 5 } : {}}
                whileTap={{ scale: 0.98 }}
                disabled={revealed}
              >
                {/* Background texture */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/sandpaper.png')]" />

                <div className="relative z-10 flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center border-2 shrink-0 transition-colors",
                    selectedFigure === figure.id ? "bg-primary border-white/20 text-white" : "bg-black/40 border-gold/20 text-gold-light"
                  )}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-display text-lg text-foreground">{figure.name}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{figure.title}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Achievements Column */}
        <div>
          <h4 className="font-display text-xs text-primary uppercase tracking-[0.2em] mb-4">Sacred Deeds & Records</h4>
          <div className="space-y-3">
            {puzzle.data.achievements.map((achievement) => {
              const matchedFigure = getMatchedFigure(achievement.id);
              const isCorrect = revealed && isCorrectMatch(achievement.id);
              const isIncorrect = revealed && matches[achievement.id] && !isCorrectMatch(achievement.id);

              return (
                <motion.button
                  key={achievement.id}
                  onClick={() => handleAchievementClick(achievement.id)}
                  className={cn(
                    "relative w-full p-5 rounded-xl border-2 text-left transition-all overflow-hidden min-h-[80px] flex flex-col justify-center",
                    isCorrect
                      ? "border-scarab bg-scarab/10 shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                      : isIncorrect
                        ? "border-terracotta bg-terracotta/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                        : matchedFigure
                          ? "border-gold bg-gold/10 shadow-lg"
                          : selectedFigure
                            ? "border-primary/40 bg-obsidian/60 hover:border-primary cursor-pointer"
                            : "border-gold/10 bg-obsidian/40"
                  )}
                  whileHover={!revealed && selectedFigure ? { scale: 1.02, x: -5 } : {}}
                  disabled={revealed || !selectedFigure}
                >
                  <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/papyros.png')]" />

                  <p className="relative z-10 text-sm font-body text-foreground leading-relaxed italic">
                    "{achievement.text}"
                  </p>

                  <AnimatePresence>
                    {matchedFigure && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="relative z-10 flex items-center gap-2 mt-3 pt-3 border-t border-white/5 text-xs"
                      >
                        <div className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-display uppercase tracking-widest border",
                          isCorrect ? "bg-scarab/20 border-scarab text-scarab" : isIncorrect ? "bg-terracotta/20 border-terracotta text-terracotta" : "bg-gold/20 border-gold text-gold"
                        )}>
                          {matchedFigure.name}
                        </div>
                        {revealed && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            {isCorrect
                              ? <Check className="w-4 h-4 text-scarab shadow-scarab-glow" />
                              : <X className="w-4 h-4 text-terracotta shadow-terracotta-glow" />
                            }
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
            className={`p-4 rounded-lg ${score >= puzzle.points * 0.8
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
    </div>
  );

  if (isEmbed) {
    return content;
  }

  return (
    <EgyptianCard variant="tomb" className="max-w-3xl mx-auto">
      <EgyptianCardContent className="p-6">
        {content}
      </EgyptianCardContent>
    </EgyptianCard>
  );
}