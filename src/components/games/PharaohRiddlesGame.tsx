import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, Crown, Star, Trophy, Timer } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { riddleLevels, RiddleLevel, Riddle } from '@/data/riddles';

interface PharaohRiddlesGameProps {
  onBack: () => void;
}

export function PharaohRiddlesGame({ onBack }: PharaohRiddlesGameProps) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number | null>(null);
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const { playSound, stopAmbientMusic, startAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentLevel = currentLevelIndex !== null ? riddleLevels[currentLevelIndex] : null;
  const riddle = currentLevel ? currentLevel.riddles[currentRiddleIndex] : null;

  const handleTimeUp = useCallback(() => {
    setGameOver(true);
    playSound('defeat');
    stopAmbientMusic();
    addScore({ playerName: 'Explorer', score, game: 'riddles', details: `Reached Level ${currentLevel?.level}` });
  }, [currentLevel, score, addScore, playSound, stopAmbientMusic]);

  useEffect(() => {
    if (currentLevel !== null && !gameOver && !gameWon && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentLevel !== null && !gameOver && !gameWon) {
      handleTimeUp();
    }
  }, [timeLeft, currentLevel, gameOver, gameWon, handleTimeUp]);

  const selectLevel = (levelIndex: number) => {
    setCurrentLevelIndex(levelIndex);
    setTimeLeft(riddleLevels[levelIndex].timeLimit);
    setCurrentRiddleIndex(0);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    playSound('gameStart');
    startAmbientMusic();
  };

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === riddle?.correctAnswer;

    if (correct) {
      playSound('correct');
      setScore(score + (currentLevel?.level ?? 1) * 10 + (timeLeft > 10 ? 5 : 0));
    } else {
      playSound('wrong');
    }
    setShowExplanation(true);
  };

  const nextRiddle = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    playSound('click');

    if (currentLevel && currentRiddleIndex < currentLevel.riddles.length - 1) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
    } else {
      levelComplete();
    }
  };

  const levelComplete = () => {
    if (currentLevelIndex === riddleLevels.length - 1) {
      setGameWon(true);
      stopAmbientMusic();
      playSound('victory');
      addScore({ playerName: 'Wise One', score, game: 'riddles', details: 'Mastered all riddle levels!' });
    } else {
      const nextIdx = currentLevelIndex! + 1;
      setCurrentLevelIndex(nextIdx);
      setTimeLeft(riddleLevels[nextIdx].timeLimit);
      setCurrentRiddleIndex(0);
      playSound('levelUp');
    }
  }

  const resetGame = () => {
    setCurrentLevelIndex(null);
    setGameOver(false);
    setGameWon(false);
    stopAmbientMusic();
  };

  if (currentLevelIndex === null) {
    return (
      <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <EgyptianButton
              variant="nav"
              onClick={onBack}
              className="mb-4 -ml-4"
            >
              <ArrowLeft size={20} /> Back to Games
            </EgyptianButton>
            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Pharaoh's Riddles</h1>
            <p className="text-xl text-muted-foreground font-body">Choose your difficulty to face the Sphinx</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {riddleLevels.map((level, index) => (
              <motion.div key={index} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <EgyptianButton onClick={() => selectLevel(index)} size="xl" variant="outline" className="w-full h-auto flex-col py-8">
                  <span className="text-2xl mb-1">Level {level.level}</span>
                  <span className="text-gold font-body mb-2">{level.title}</span>
                  <span className="text-sm opacity-60 font-body">{level.riddles.length} Riddles • {level.timeLimit}s</span>
                </EgyptianButton>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={resetGame} className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg">
            <ArrowLeft size={20} /> Back to Difficulties
          </button>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Pharaoh's Riddles</h1>
          <p className="text-xl text-muted-foreground font-body">Level {currentLevel?.level}: {currentLevel?.title}</p>
        </div>

        <EgyptianCard variant="gold" padding="lg" className="relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div className="flex items-center gap-2 bg-gold-dark/30 px-4 py-2 rounded-lg border border-gold/30">
              <Trophy className="text-primary" size={24} />
              <span className="text-2xl text-foreground font-body">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <Timer className={`${timeLeft < 10 ? 'text-terracotta animate-pulse' : 'text-primary'}`} size={24} />
              <span className="text-2xl text-foreground font-body">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2 bg-lapis/30 px-4 py-2 rounded-lg border border-lapis-light/30">
              <Brain className="text-turquoise" size={24} />
              <span className="text-xl text-foreground font-body">Riddle {currentRiddleIndex + 1}/{currentLevel?.riddles.length}</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!gameOver && !gameWon ? (
              <motion.div key={currentRiddleIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="text-center text-8xl mb-6">🧠</div>

                <div className="p-8 bg-obsidian/40 rounded-2xl border-2 border-gold/20">
                  <p className="text-2xl text-foreground font-body leading-relaxed text-center italic">"{riddle?.question}"</p>
                </div>

                {!showExplanation ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {riddle?.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleAnswer(index)}
                        className="p-6 bg-card hover:bg-muted rounded-xl text-lg text-foreground font-body border-2 border-gold/30 hover:border-gold/50 transition-all text-left flex items-center gap-4"
                      >
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-display border border-primary/30">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className={`p-6 rounded-xl border-2 ${selectedAnswer === riddle?.correctAnswer ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        {selectedAnswer === riddle?.correctAnswer ? (
                          <div className="flex items-center gap-2 text-emerald-400 font-display text-2xl">
                            <span>✨ Correct!</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-400 font-display text-2xl">
                            <span>❌ Incorrect</span>
                          </div>
                        )}
                      </div>
                      <p className="text-lg font-body text-foreground mb-4">{riddle?.explanation}</p>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest">Correct Answer: {riddle?.options[riddle.correctAnswer]}</p>
                    </div>
                    <EgyptianButton variant="hero" size="lg" className="w-full" onClick={nextRiddle}>
                      {currentRiddleIndex < currentLevel!.riddles.length - 1 ? 'Next Riddle' : 'Complete Level'}
                    </EgyptianButton>
                  </motion.div>
                )}
              </motion.div>
            ) : gameOver ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="text-8xl mb-6">🕯️</div>
                <h2 className="text-5xl font-display text-terracotta mb-4">Time's Up!</h2>
                <p className="text-xl text-muted-foreground font-body mb-8 text-center max-w-md mx-auto">
                  The Sphinx has closed the path. Your journey ends here with a score of {score}.
                </p>
                <div className="flex gap-4 justify-center">
                  <EgyptianButton variant="default" size="lg" onClick={() => selectLevel(currentLevelIndex!)}>Try Again</EgyptianButton>
                  <EgyptianButton variant="lapis" size="lg" onClick={resetGame}>Back to Menu</EgyptianButton>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="text-8xl mb-6">🏆</div>
                <h2 className="text-5xl font-display text-gold-gradient mb-4">Supreme Wisdom!</h2>
                <p className="text-xl text-muted-foreground font-body mb-8">
                  You have answered all riddles and proven yourself worthy of the Pharaohs' secrets.
                </p>
                <div className="bg-gold/10 p-6 rounded-2xl border border-gold/30 mb-8 inline-block px-12">
                  <p className="text-4xl font-display text-primary">{score}</p>
                  <p className="text-muted-foreground uppercase tracking-widest text-sm">Final Score</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <EgyptianButton variant="hero" size="lg" onClick={resetGame}>New Game</EgyptianButton>
                  <EgyptianButton variant="lapis" size="lg" onClick={onBack}>Back to Games</EgyptianButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </EgyptianCard>
      </div>
    </div>
  );
}
