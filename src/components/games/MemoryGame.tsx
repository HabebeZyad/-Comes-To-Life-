import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';

interface MemoryGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const symbols = ['𓂀', '𓆣', '𓃭', '𓋹', '𓉔', '𓇳', '𓈖', '𓅓', '𓆓', '𓊪', '𓉽', '𓀭'];

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    if (isPlaying && timeLeft > 0 && !gameWon) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying) {
      setIsPlaying(false);
    }
  }, [timeLeft, isPlaying, gameWon]);

  useEffect(() => {
    if (matches > 0 && matches === cards.length / 2) {
      setGameWon(true);
      setIsPlaying(false);
    }
  }, [matches, cards.length]);

  const initializeGame = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    const pairCount = level === 'easy' ? 6 : level === 'medium' ? 8 : 12;
    const selectedSymbols = symbols.slice(0, pairCount);
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
    setMoves(0);
    setMatches(0);
    setTimeLeft(level === 'easy' ? 90 : level === 'medium' ? 120 : 180);
    setIsPlaying(true);
    setGameWon(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!isPlaying || flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        setTimeout(() => {
          setCards(cards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          ));
          setMatches(matches + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(cards.map(c =>
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const gridCols = difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-6';

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>
          
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Sacred Symbols Memory</h1>
          <p className="text-xl text-muted-foreground font-body">Match the divine symbols of ancient Egypt</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg">
          {!isPlaying && !gameWon ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">𓋹</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Choose Your Challenge</h2>
              <p className="text-xl text-muted-foreground font-body mb-8">
                Test your memory by matching pairs of sacred Egyptian symbols
              </p>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton
                    variant="turquoise"
                    size="xl"
                    onClick={() => initializeGame('easy')}
                    className="w-full h-auto flex-col py-8"
                  >
                    <div className="text-4xl mb-2">😊</div>
                    <span className="text-xl">Easy</span>
                    <span className="text-sm opacity-80">6 pairs • 90 seconds</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton
                    variant="default"
                    size="xl"
                    onClick={() => initializeGame('medium')}
                    className="w-full h-auto flex-col py-8"
                  >
                    <div className="text-4xl mb-2">🤔</div>
                    <span className="text-xl">Medium</span>
                    <span className="text-sm opacity-80">8 pairs • 120 seconds</span>
                  </EgyptianButton>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <EgyptianButton
                    variant="danger"
                    size="xl"
                    onClick={() => initializeGame('hard')}
                    className="w-full h-auto flex-col py-8"
                  >
                    <div className="text-4xl mb-2">😤</div>
                    <span className="text-xl">Hard</span>
                    <span className="text-sm opacity-80">12 pairs • 180 seconds</span>
                  </EgyptianButton>
                </motion.div>
              </div>
            </div>
          ) : (
            <>
              {/* Stats Bar */}
              <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
                  <Trophy className="text-primary" size={24} />
                  <span className="text-xl text-foreground font-body">Matches: {matches}/{cards.length / 2}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
                  <Star className="text-turquoise" size={24} />
                  <span className="text-xl text-foreground font-body">Moves: {moves}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
                  <Timer className={`${timeLeft < 30 ? 'text-terracotta animate-pulse' : 'text-scarab'}`} size={24} />
                  <span className="text-xl text-foreground font-body">{timeLeft}s</span>
                </div>
              </div>

              {/* Cards Grid */}
              <div className={`grid ${gridCols} gap-3 md:gap-4 mb-6`}>
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
                      {/* Card Back */}
                      <div
                        className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${
                          card.isMatched 
                            ? 'bg-scarab/50 opacity-50'
                            : 'bg-gradient-to-br from-lapis to-lapis-deep'
                        } border-2 border-gold/30`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                        }}
                      >
                        {!card.isFlipped && !card.isMatched && (
                          <div className="text-4xl text-foreground/30">𓁹</div>
                        )}
                      </div>
                      {/* Card Front */}
                      <div
                        className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${
                          card.isMatched
                            ? 'bg-scarab'
                            : 'bg-gradient-to-br from-gold-dark to-primary'
                        } border-2 border-gold-light/50`}
                        style={{
                          backfaceVisibility: 'hidden',
                          transform: card.isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)'
                        }}
                      >
                        <div className="text-5xl md:text-6xl">
                          {card.symbol}
                        </div>
                        {card.isMatched && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-4xl">✓</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Game Over - Time's Up */}
              {!isPlaying && timeLeft === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6"
                >
                  <p className="text-3xl text-terracotta font-display mb-6">⏰ Time's Up!</p>
                  <p className="text-xl text-muted-foreground font-body mb-4">You matched {matches} out of {cards.length / 2} pairs</p>
                  <div className="flex gap-4 justify-center">
                    <EgyptianButton variant="default" size="lg" onClick={() => initializeGame(difficulty)}>
                      Try Again
                    </EgyptianButton>
                    <EgyptianButton variant="lapis" size="lg" onClick={onBack}>
                      Back to Games
                    </EgyptianButton>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Victory */}
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 absolute inset-0 bg-scarab/95 rounded-lg flex flex-col items-center justify-center"
            >
              <div className="text-9xl mb-6">🎉</div>
              <h2 className="text-5xl font-display text-gold-gradient mb-4">Perfect Memory!</h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">All pairs matched!</p>
                <p className="text-xl text-muted-foreground font-body">Moves: {moves}</p>
                <p className="text-xl text-muted-foreground font-body">Time remaining: {timeLeft}s</p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={i < (moves < 20 ? 5 : moves < 30 ? 4 : 3) ? 'text-primary fill-primary' : 'text-muted'}
                      size={32}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={() => setGameWon(false)}>
                  New Game
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
