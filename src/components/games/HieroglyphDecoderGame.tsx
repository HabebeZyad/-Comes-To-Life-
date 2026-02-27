import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, Lightbulb, SkipForward } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';

interface HieroglyphDecoderGameProps {
  onBack: () => void;
}

interface HieroglyphPuzzle {
  symbols: string[];
  meaning: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const puzzles: HieroglyphPuzzle[] = [
  { symbols: ['𓇳', '𓂋', '𓏲'], meaning: 'RA', hint: 'The sun god', difficulty: 'easy' },
  { symbols: ['𓅓', '𓏲', '𓏏'], meaning: 'MA', hint: 'Mother goddess Isis', difficulty: 'easy' },
  { symbols: ['𓎟', '𓏤'], meaning: 'NEB', hint: 'Lord or master', difficulty: 'easy' },
  { symbols: ['𓋹', '𓈖', '𓐍'], meaning: 'ANKH', hint: 'Symbol of life', difficulty: 'easy' },
  { symbols: ['𓊪', '𓏏', '𓎛'], meaning: 'PTAH', hint: 'Creator god of Memphis', difficulty: 'medium' },
  { symbols: ['𓅃', '𓊵', '𓏏'], meaning: 'HORUS', hint: 'Falcon-headed sky god', difficulty: 'medium' },
  { symbols: ['𓇋', '𓋴', '𓇋', '𓋴'], meaning: 'ISIS', hint: 'Goddess of magic', difficulty: 'medium' },
  { symbols: ['𓀭', '𓊨', '𓂋'], meaning: 'OSIRIS', hint: 'God of the afterlife', difficulty: 'medium' },
  { symbols: ['𓈖', '𓆑', '𓂋', '𓏏'], meaning: 'NEFERTITI', hint: 'Beautiful queen', difficulty: 'hard' },
  { symbols: ['𓏏', '𓅱', '𓏏', '𓋹'], meaning: 'TUT', hint: 'Young pharaoh', difficulty: 'hard' },
  { symbols: ['𓆣', '𓊪', '𓂋', '𓇋'], meaning: 'KHEPRI', hint: 'Scarab beetle god', difficulty: 'hard' },
  { symbols: ['𓊃', '𓎼', '𓏏'], meaning: 'SEKHMET', hint: 'Lioness goddess of war', difficulty: 'hard' },
];

export function HieroglyphDecoderGame({ onBack }: HieroglyphDecoderGameProps) {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [shuffledPuzzles, setShuffledPuzzles] = useState<HieroglyphPuzzle[]>([]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameOver, setGameOver] = useState(false);

  const maxPuzzles = 10;
  const maxHints = 3;
  const maxSkips = 2;

  // Shuffle puzzles based on difficulty
  const initializeGame = useCallback((level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    
    let filteredPuzzles = puzzles;
    if (level === 'easy') {
      filteredPuzzles = puzzles.filter(p => p.difficulty === 'easy' || p.difficulty === 'medium');
    } else if (level === 'hard') {
      filteredPuzzles = puzzles.filter(p => p.difficulty === 'medium' || p.difficulty === 'hard');
    }
    
    const shuffled = [...filteredPuzzles].sort(() => Math.random() - 0.5).slice(0, maxPuzzles);
    setShuffledPuzzles(shuffled);
    setCurrentPuzzleIndex(0);
    setUserInput('');
    setScore(0);
    setStreak(0);
    setTimeLeft(level === 'easy' ? 180 : level === 'medium' ? 120 : 90);
    setShowHint(false);
    setFeedback(null);
    setHintsUsed(0);
    setSkipsUsed(0);
    setIsPlaying(true);
    setGameOver(false);
  }, []);

  // Timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setGameOver(true);
      setIsPlaying(false);
    }
  }, [timeLeft, isPlaying, gameOver]);

  const currentPuzzle = shuffledPuzzles[currentPuzzleIndex];

  const checkAnswer = () => {
    if (!currentPuzzle) return;
    
    const isCorrect = userInput.toUpperCase().trim() === currentPuzzle.meaning;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      const basePoints = currentPuzzle.difficulty === 'easy' ? 50 : currentPuzzle.difficulty === 'medium' ? 100 : 150;
      const streakBonus = streak * 10;
      const hintPenalty = showHint ? 25 : 0;
      const points = Math.max(10, basePoints + streakBonus - hintPenalty);
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      setUserInput('');
      
      if (currentPuzzleIndex >= shuffledPuzzles.length - 1) {
        setGameOver(true);
        setIsPlaying(false);
      } else {
        setCurrentPuzzleIndex(prev => prev + 1);
      }
    }, 1500);
  };

  const useHint = () => {
    if (hintsUsed < maxHints) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
    }
  };

  const skipPuzzle = () => {
    if (skipsUsed < maxSkips) {
      setSkipsUsed(prev => prev + 1);
      setStreak(0);
      setShowHint(false);
      setUserInput('');
      
      if (currentPuzzleIndex >= shuffledPuzzles.length - 1) {
        setGameOver(true);
        setIsPlaying(false);
      } else {
        setCurrentPuzzleIndex(prev => prev + 1);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userInput.trim()) {
      checkAnswer();
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>
          
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Hieroglyph Decoder</h1>
          <p className="text-xl text-muted-foreground font-body">Decipher the ancient symbols and unlock their secrets</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg">
          {/* Stats Bar */}
          {isPlaying && (
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
                <Trophy className="text-primary" size={24} />
                <span className="text-xl text-foreground font-body">{score}</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
                <Star className="text-turquoise" size={24} />
                <span className="text-xl text-foreground font-body">Streak: {streak}🔥</span>
              </div>
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
                <Timer className={`${timeLeft < 30 ? 'text-terracotta animate-pulse' : 'text-scarab'}`} size={24} />
                <span className="text-xl text-foreground font-body">{timeLeft}s</span>
              </div>
            </div>
          )}

          {!isPlaying && !gameOver ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">𓂀</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Decode the Ancients</h2>
              <p className="text-xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
                Look at the hieroglyphs and type what they represent. 
                Use hints wisely and build your streak for bonus points!
              </p>
              <p className="text-lg text-muted-foreground/80 font-body mb-8">
                {maxHints} hints • {maxSkips} skips • {maxPuzzles} puzzles
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton
                    variant="turquoise"
                    size="xl"
                    onClick={() => initializeGame('easy')}
                    className="w-full h-auto flex-col py-8"
                  >
                    <div className="text-4xl mb-2">📜</div>
                    <span className="text-xl">Scribe</span>
                    <span className="text-sm opacity-80">Easy symbols • 180s</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton
                    variant="default"
                    size="xl"
                    onClick={() => initializeGame('medium')}
                    className="w-full h-auto flex-col py-8"
                  >
                    <div className="text-4xl mb-2">🏺</div>
                    <span className="text-xl">Priest</span>
                    <span className="text-sm opacity-80">Mixed symbols • 120s</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton
                    variant="danger"
                    size="xl"
                    onClick={() => initializeGame('hard')}
                    className="w-full h-auto flex-col py-8"
                  >
                    <div className="text-4xl mb-2">👑</div>
                    <span className="text-xl">Pharaoh</span>
                    <span className="text-sm opacity-80">Hard symbols • 90s</span>
                  </EgyptianButton>
                </motion.div>
              </div>
            </div>
          ) : isPlaying && currentPuzzle ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPuzzleIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                {/* Progress */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground font-body">
                    Puzzle {currentPuzzleIndex + 1} of {shuffledPuzzles.length}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-body ${
                    currentPuzzle.difficulty === 'easy' ? 'bg-scarab/30 text-scarab' :
                    currentPuzzle.difficulty === 'medium' ? 'bg-primary/30 text-primary' :
                    'bg-terracotta/30 text-terracotta'
                  }`}>
                    {currentPuzzle.difficulty.toUpperCase()}
                  </span>
                </div>

                {/* Hieroglyph Display */}
                <div className="bg-gradient-to-br from-lapis-deep/50 to-obsidian/50 rounded-2xl p-8 border-2 border-gold/30">
                  <div className="flex items-center justify-center gap-4 text-7xl md:text-8xl mb-4">
                    {currentPuzzle.symbols.map((symbol, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="drop-shadow-lg"
                      >
                        {symbol}
                      </motion.span>
                    ))}
                  </div>
                  
                  {/* Hint */}
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-turquoise font-body text-lg mt-4"
                    >
                      💡 Hint: {currentPuzzle.hint}
                    </motion.p>
                  )}
                </div>

                {/* Input Area */}
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your answer..."
                      disabled={feedback !== null}
                      className="w-full px-6 py-4 text-2xl font-display text-center bg-muted border-2 border-border rounded-xl focus:border-primary focus:outline-none transition-colors uppercase tracking-widest"
                      autoFocus
                    />
                    
                    {/* Feedback overlay */}
                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`absolute inset-0 flex items-center justify-center rounded-xl ${
                          feedback === 'correct' ? 'bg-scarab/90' : 'bg-terracotta/90'
                        }`}
                      >
                        <span className="text-3xl font-display text-foreground">
                          {feedback === 'correct' ? '✨ Correct!' : `❌ It was: ${currentPuzzle.meaning}`}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex gap-4 justify-center flex-wrap">
                    <EgyptianButton
                      variant="default"
                      size="lg"
                      onClick={checkAnswer}
                      disabled={!userInput.trim() || feedback !== null}
                    >
                      Submit Answer
                    </EgyptianButton>
                    
                    <EgyptianButton
                      variant="turquoise"
                      size="lg"
                      onClick={useHint}
                      disabled={showHint || hintsUsed >= maxHints || feedback !== null}
                    >
                      <Lightbulb size={20} />
                      Hint ({maxHints - hintsUsed})
                    </EgyptianButton>
                    
                    <EgyptianButton
                      variant="lapis"
                      size="lg"
                      onClick={skipPuzzle}
                      disabled={skipsUsed >= maxSkips || feedback !== null}
                    >
                      <SkipForward size={20} />
                      Skip ({maxSkips - skipsUsed})
                    </EgyptianButton>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}

          {/* Game Over */}
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-9xl mb-6">
                {score >= 500 ? '👑' : score >= 300 ? '🏺' : '📜'}
              </div>
              <h2 className="text-5xl font-display text-gold-gradient mb-4">
                {score >= 500 ? 'Master Decoder!' : score >= 300 ? 'Skilled Scribe!' : 'Keep Practicing!'}
              </h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Final Score: {score}</p>
                <p className="text-xl text-muted-foreground font-body">Best Streak: {streak}🔥</p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={i < Math.min(5, Math.floor(score / 100)) ? 'text-primary fill-primary' : 'text-muted'}
                      size={32}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={() => initializeGame(difficulty)}>
                  Play Again
                </EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={onBack}>
                  Back to Games
                </EgyptianButton>
              </div>
            </motion.div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
