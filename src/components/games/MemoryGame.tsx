import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, Brain, History, Sparkles } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface MemoryGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const symbols = ['𓂀', '𓆣', '𓃭', '𓋹', '𓉔', '𓇳', '𓈖', '𓅓', '𓆓', '𓊪', '𓉽', '𓀭', '𓁹', '𓃻', '𓅊', '𓇚', '𓈗', '𓊿'];

const TRIALS = [
  { id: 1, name: 'Initiation', pairs: 4, grid: 'grid-cols-4', time: 30, description: 'Begin your journey into the sacred archives.' },
  { id: 2, name: 'Scribe\'s Test', pairs: 6, grid: 'grid-cols-4', time: 45, description: 'Focus your mind. The symbols grow in number.' },
  { id: 3, name: 'Priest\'s Wisdom', pairs: 8, grid: 'grid-cols-4', time: 60, description: 'Only those with clear vision may proceed.' },
  { id: 4, name: 'Vizier\'s Vision', pairs: 12, grid: 'grid-cols-6', time: 90, description: 'The complexity of the divine script increases.' },
  { id: 5, name: 'Pharaoh\'s Memory', pairs: 15, grid: 'grid-cols-6', time: 120, description: 'Prove you possess the memory of the eternal kings.' }
];

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [level, setLevel] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelup' | 'victory' | 'defeat'>('intro');
  const [totalScore, setTotalScore] = useState(0);

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const currentTrial = TRIALS[level - 1] || TRIALS[0];

  const initializeTrial = useCallback((trialIndex: number) => {
    const trial = TRIALS[trialIndex];
    setLevel(trialIndex + 1);

    // Select random symbols for this trial
    const selectedSymbols = [...symbols]
      .sort(() => Math.random() - 0.5)
      .slice(0, trial.pairs);

    const cardPairs = [...selectedSymbols, ...selectedSymbols];

    const shuffled = cardPairs
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeLeft(trial.time);
    setGameState('playing');

    if (trialIndex === 0) {
      setTotalScore(0);
      startAmbientMusic();
      playSound('gameStart');
    } else {
      playSound('levelUp');
    }
  }, [startAmbientMusic, playSound]);

  // Timer Interval: Stable interval that doesn't churn on every tick
  const isPlaying = gameState === 'playing';
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 5 && next > 0) playSound('tick');
        return Math.max(0, next);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, playSound]);

  // Game Over Condition: Handle defeat when time runs out
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      setGameState('defeat');
      stopAmbientMusic();
      playSound('defeat');
    }
  }, [timeLeft, gameState, playSound, stopAmbientMusic]);

  // Win condition check
  useEffect(() => {
    if (gameState === 'playing' && matches > 0 && matches === currentTrial.pairs) {
      const levelScore = (matches * 100) + (timeLeft * 10) - (moves * 5);
      const finalLevelScore = Math.max(100, levelScore);
      setTotalScore(prev => prev + finalLevelScore);

      if (level === TRIALS.length) {
        setGameState('victory');
        stopAmbientMusic();
        playSound('victory');
        addScore({
          playerName: 'Explorer',
          score: totalScore + finalLevelScore,
          game: 'memory',
          difficulty: 'hard',
          details: `Completed all 5 trials!`
        });
      } else {
        setGameState('levelup');
        playSound('victory');
      }
    }
  }, [matches, currentTrial.pairs, level, timeLeft, moves, gameState, totalScore, addScore, playSound, stopAmbientMusic]);

  const handleCardClick = (cardId: number) => {
    if (gameState !== 'playing' || flippedCards.length === 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound('cardFlip');

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          playSound('match');
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          playSound('mismatch');
          setCards(prev => prev.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full hieroglyph-pattern" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <EgyptianButton variant="nav" onClick={() => { stopAmbientMusic(); onBack(); }} className="-ml-4 mb-2">
              <ArrowLeft className="mr-2" size={18} /> Back to Games
            </EgyptianButton>
            <h1 className="text-4xl font-display text-gold-gradient">Trials of Wisdom</h1>
          </div>

          <div className="hidden md:flex gap-4">
            <div className="bg-black/40 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-lg text-center">
              <div className="text-xs uppercase text-muted-foreground flex items-center justify-center gap-1">
                <Brain size={12} className="text-primary" /> Trial
              </div>
              <div className="text-xl font-bold text-primary">{level || 1}/5</div>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
              <div className="text-xs uppercase text-muted-foreground flex items-center justify-center gap-1">
                <Trophy size={12} className="text-turquoise" /> Score
              </div>
              <div className="text-xl font-bold text-turquoise">{totalScore}</div>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden border-2 border-gold/30 min-h-[500px] flex flex-col">
          {/* Game Stats Bar */}
          <div className="bg-black/60 border-b border-gold/20 p-4 flex justify-between items-center">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Timer className={timeLeft < 10 ? "text-terracotta animate-pulse" : "text-primary"} />
                <span className={`text-2xl font-mono ${timeLeft < 10 ? "text-terracotta" : "text-foreground"}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <History className="text-scarab" />
                <span className="text-muted-foreground">Moves:</span>
                <span className="text-xl font-bold text-scarab">{moves}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase">Trial Name</div>
                <div className="text-lg font-display text-gold-light">{currentTrial.name}</div>
              </div>
            </div>
          </div>

          {/* Game Grid Area */}
          <div className="flex-1 p-6 flex items-center justify-center">
            {gameState === 'playing' && (
              <div className={`grid ${currentTrial.grid} gap-3 md:gap-4 w-full max-w-4xl mx-auto`}>
                <AnimatePresence>
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      initial={{ scale: 0, rotateY: 0 }}
                      animate={{ scale: 1, rotateY: card.isFlipped ? 180 : 0 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
                      onClick={() => handleCardClick(card.id)}
                      className="relative aspect-square cursor-pointer"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${card.isMatched
                          ? 'bg-scarab/50 opacity-50'
                          : 'bg-gradient-to-br from-lapis/80 to-lapis-deep'
                          } border-2 border-gold/30`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        {!card.isFlipped && !card.isMatched && (
                          <div className="text-4xl text-foreground/20 font-display">𓁹</div>
                        )}
                      </div>
                      <div
                        className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${card.isMatched
                          ? 'bg-scarab border-primary'
                          : 'bg-gradient-to-br from-gold-dark to-primary'
                          } border-2 border-gold-light/50`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: card.isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'
                        }}
                      >
                        <div className="text-4xl md:text-5xl lg:text-6xl select-none">
                          {card.symbol}
                        </div>
                        {card.isMatched && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl"
                          >
                            <Sparkles className="text-white opacity-40" size={40} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Overlays */}
            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Trials of Wisdom"
                  description="Ancient Egypt's secrets are hidden behind these sacred symbols. Match the pairs to prove your mental acuity and advance through the five divine trials."
                  actionLabel="Begin Trial"
                  onAction={() => initializeTrial(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelup' && (
                <GameOverlay
                  type="levelup"
                  title="Trial Passed!"
                  description={`Your memory is sharp as the eye of Horus. You have completed the ${currentTrial.name}.`}
                  stats={[
                    { label: 'Moves', value: moves },
                    { label: 'Time Bonus', value: `+${timeLeft * 10}` },
                    { label: 'Trial Score', value: totalScore }
                  ]}
                  actionLabel={`Start Trial ${level + 1}`}
                  onAction={() => initializeTrial(level)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Archivist of Ages"
                  description="The gods are impressed. You have mastered every sacred archive and preserved the wisdom of the Nile."
                  score={totalScore}
                  stars={5}
                  stats={[
                    { label: 'Total Trials', value: '5/5' },
                    { label: 'Rank', value: 'High Priest' }
                  ]}
                  actionLabel="Master Again"
                  onAction={() => {
                    setLevel(0);
                    setGameState('intro');
                  }}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Wisdom Lost"
                  description="The sands of time have covered the symbols. Your focus must be absolute to pass this trial."
                  score={totalScore}
                  stats={[
                    { label: 'Trial', value: currentTrial.name },
                    { label: 'Matches', value: `${matches}/${currentTrial.pairs}` }
                  ]}
                  actionLabel="Retry Trial"
                  onAction={() => {
                    initializeTrial(level - 1);
                  }}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="bg-obsidian/40 p-4 border-t border-gold/20 text-center text-xs text-muted-foreground uppercase tracking-widest">
            Match {currentTrial.pairs} pairs of sacred symbols to advance
          </div>
        </EgyptianCard>
      </div>
    </div>
  );
}
