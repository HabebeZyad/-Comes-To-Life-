import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, Crown, Star, Trophy, Timer, HelpCircle, Sparkles } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';
import { riddleLevels, RiddleLevel, Riddle } from '@/data/riddles';

interface PharaohRiddlesGameProps {
  onBack: () => void;
}

export function PharaohRiddlesGame({ onBack }: PharaohRiddlesGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [currentRiddleIdx, setCurrentRiddleIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const { playSound, stopAmbientMusic, startAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentLevel = useMemo(() => riddleLevels[currentLevelIdx], [currentLevelIdx]);
  const riddle = useMemo(() => currentLevel?.riddles[currentRiddleIdx], [currentLevel, currentRiddleIdx]);

  const initLevel = useCallback((levelIdx: number) => {
    setCurrentLevelIdx(levelIdx);
    setCurrentRiddleIdx(0);
    setTimeLeft(riddleLevels[levelIdx].timeLimit);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Optimized timer to eliminate interval churn and separate side effects
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Separate effect for side effects based on timeLeft to avoid recreating the interval
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft === 0) {
      setGameState('defeat');
      playSound('defeat');
      stopAmbientMusic();
    } else if (timeLeft <= 5) {
      playSound('tick');
    }
  }, [timeLeft, gameState, playSound, stopAmbientMusic]);

  const handleAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null || gameState !== 'playing') return;
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === riddle?.correctAnswer;

    if (correct) {
      playSound('correct');
      const timeBonus = Math.floor(timeLeft / 2);
      setScore(s => s + 150 + (currentLevelIdx * 50) + timeBonus);
    } else {
      playSound('wrong');
    }
    setShowExplanation(true);
  };

  const nextRiddle = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    playSound('click');

    if (currentRiddleIdx < currentLevel.riddles.length - 1) {
      setCurrentRiddleIdx(prev => prev + 1);
    } else {
      if (currentLevelIdx < riddleLevels.length - 1) {
        setGameState('levelUp');
        playSound('victory');
      } else {
        setGameState('victory');
        playSound('victory');
        addScore({
          playerName: 'Wise One',
          score: score + 500,
          game: 'riddles',
          details: 'Mastered all 4 Divine Riddle Trials'
        });
      }
    }
  };

  const handleNextLevel = () => {
    const nextIdx = currentLevelIdx + 1;
    setCurrentLevelIdx(nextIdx);
    initLevel(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevelIdx(0);
    initLevel(0);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <EgyptianButton
            variant="nav"
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="-ml-4"
          >
            <ArrowLeft size={20} className="mr-2" /> Back to Games
          </EgyptianButton>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Brain className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">TRIAL {currentLevelIdx + 1}/4</span>
            </div>
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Trophy className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">SCORE: {score}</span>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20">
          {/* Header HUD */}
          <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Crown className="text-primary" size={20} />
                <span className="font-display text-gold">Progress</span>
                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                  <div
                    className="h-full bg-primary shadow-gold-glow transition-all duration-500"
                    style={{ width: `${(currentRiddleIdx / currentLevel.riddles.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className={timeLeft < 10 ? "text-terracotta animate-pulse" : "text-primary"} size={20} />
                <span className={`font-display text-lg ${timeLeft < 10 ? "text-terracotta" : "text-gold"}`}>{timeLeft}s</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-xl font-display text-gold-gradient leading-none">{currentLevel.title}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">Difficulty: {currentLevelIdx < 2 ? 'Initiate' : 'High Priest'}</p>
            </div>
          </div>

          <div className="relative p-12 bg-obsidian flex flex-col items-center justify-center min-h-[500px]">
            {gameState === 'playing' && riddle && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentLevelIdx}-${currentRiddleIdx}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full max-w-3xl"
                >
                  <div className="text-center mb-10">
                    <HelpCircle className="w-16 h-16 text-primary mx-auto mb-6 opacity-50" />
                    <EgyptianCard variant="lapis" padding="xl" className="border-gold/30 bg-gold/5 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
                      <p className="text-2xl md:text-3xl text-foreground font-body leading-relaxed italic">
                        "{riddle.question}"
                      </p>
                    </EgyptianCard>
                  </div>

                  {!showExplanation ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {riddle.options.map((option, idx) => (
                        <EgyptianButton
                          key={idx}
                          variant="default"
                          size="xl"
                          onClick={() => handleAnswer(idx)}
                          className="h-auto py-6 px-8 text-left flex justify-start items-center gap-6 group hover:border-primary transition-all"
                        >
                          <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-primary group-hover:text-obsidian transition-colors font-display text-lg">
                            {String.fromCharCode(65 + idx)}
                          </div>
                          <span className="text-lg font-body">{option}</span>
                        </EgyptianButton>
                      ))}
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                      <div className={`p-8 rounded-2xl border-2 backdrop-blur-md ${selectedAnswer === riddle.correctAnswer ? 'bg-primary/10 border-primary shadow-gold-glow' : 'bg-terracotta/10 border-terracotta'}`}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-full ${selectedAnswer === riddle.correctAnswer ? 'bg-primary/20' : 'bg-terracotta/20'}`}>
                            {selectedAnswer === riddle.correctAnswer ? <Sparkles className="text-primary" /> : <Star className="text-terracotta" />}
                          </div>
                          <h3 className={`text-2xl font-display ${selectedAnswer === riddle.correctAnswer ? 'text-primary' : 'text-terracotta'}`}>
                            {selectedAnswer === riddle.correctAnswer ? 'Divine Insight!' : 'The Sphinx Frowns...'}
                          </h3>
                        </div>
                        <p className="text-lg font-body text-foreground leading-relaxed mb-6">
                          {riddle.explanation}
                        </p>
                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                          <span className="text-sm text-muted-foreground uppercase tracking-widest">Correct Path: {riddle.options[riddle.correctAnswer]}</span>
                          <EgyptianButton variant="hero" onClick={nextRiddle} className="px-10">
                            Continue →
                          </EgyptianButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Pharaoh's Riddles"
                  description="Face the legendary Sphinx and answer her cryptic questions. Only those with the wisdom of Thoth may pass through the golden gates of the Pharaoh's court."
                  onAction={() => initLevel(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Trial Passed!"
                  description={`Your wisdom shines through the darkness. You have mastered the ${currentLevel.title}.`}
                  stats={[
                    { label: 'Score', value: score },
                    { label: 'Trial Progress', value: `${currentLevelIdx + 1}/4` }
                  ]}
                  actionLabel="Next Trial"
                  onAction={handleNextLevel}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Scribe of the Divine"
                  description="The Sphinx bows before your intellect. You have solved all her riddles and gained the eternal wisdom of the ancients."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Rank', value: 'High Priest of Thoth' },
                    { label: 'Wisdom Score', value: score }
                  ]}
                  actionLabel="Meditate Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="The Sphinx's Silence"
                  description="Your wisdom was insufficient this time. The secrets of the ancients remain veiled in shadow."
                  score={score}
                  stats={[
                    { label: 'Current Trial', value: currentLevel.title },
                    { label: 'Score', value: score }
                  ]}
                  actionLabel="Retry Trial"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Brain size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Divine Wisdom</h4>
              <p className="text-xs text-muted-foreground mt-1">Each correct answer grants you access to deeper mysteries and higher scores.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Timer size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Temporal Trial</h4>
              <p className="text-xs text-muted-foreground mt-1">Answering quickly provides a time bonus. If the sand runs out, the trial is failed.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><Sparkles size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Mastery</h4>
              <p className="text-xs text-muted-foreground mt-1">Completing all 4 trials with high precision marks you as a Living God of Wisdom.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
