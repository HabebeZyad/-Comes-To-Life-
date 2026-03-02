import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, Lightbulb, SkipForward, BookOpen, ScrollText } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface HieroglyphDecoderGameProps {
  onBack: () => void;
}

interface HieroglyphPuzzle {
  symbols: string[];
  meaning: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Wave {
  name: string;
  description: string;
  puzzleCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const allPuzzles: HieroglyphPuzzle[] = [
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
  { symbols: ['𓇋', '𓈖', '𓊪', '𓅱'], meaning: 'ANUBIS', hint: 'God of mummification', difficulty: 'medium' },
  { symbols: ['𓂋', '𓈖', '𓊪', '𓏏'], meaning: 'RENPET', hint: 'The word for year', difficulty: 'hard' },
  { symbols: ['𓉐', '𓉻'], meaning: 'PHARAOH', hint: 'Great House', difficulty: 'hard' },
  { symbols: ['𓈗'], meaning: 'NILE', hint: 'The sacred water', difficulty: 'easy' },
  { symbols: ['𓋹', '𓏤'], meaning: 'LIFE', hint: 'Symbol of breath', difficulty: 'easy' },
  { symbols: ['𓊹'], meaning: 'GOD', hint: 'Divine being', difficulty: 'easy' },
  { symbols: ['𓅓', '𓂋'], meaning: 'PYRAMID', hint: 'Place of ascension', difficulty: 'medium' },
  { symbols: ['𓊃', '𓈙'], meaning: 'SCRIBE', hint: 'He who writes', difficulty: 'medium' },
  { symbols: ['𓋴', '𓃭'], meaning: 'SPHINX', hint: 'Guardian of the plateau', difficulty: 'medium' },
  { symbols: ['𓎛', '𓏏', '𓉐'], meaning: 'TEMPLE', hint: 'House of the god', difficulty: 'hard' },
];

const waves: Wave[] = [
  { name: "Scribe's Apprentice", description: "Learn the basic symbols of life and divinity.", puzzleCount: 3, timeLimit: 45, difficulty: 'easy' },
  { name: "Temple Scholar", description: "Decipher the names of the ancient gods.", puzzleCount: 4, timeLimit: 60, difficulty: 'medium' },
  { name: "Royal Archivist", description: "Complex cartouches of pharaohs and queens.", puzzleCount: 4, timeLimit: 60, difficulty: 'hard' },
  { name: "High Priest of Thoth", description: "The most sacred and hidden meanings.", puzzleCount: 5, timeLimit: 75, difficulty: 'hard' },
  { name: "The Divine Eye", description: "A rapid-fire trial of all ancient knowledge.", puzzleCount: 6, timeLimit: 60, difficulty: 'hard' },
];

export function HieroglyphDecoderGame({ onBack }: HieroglyphDecoderGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentWave, setCurrentWave] = useState(0);
  const [currentPuzzleInWave, setCurrentPuzzleInWave] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shuffledPuzzles, setShuffledPuzzles] = useState<HieroglyphPuzzle[]>([]);

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const wave = useMemo(() => waves[currentWave], [currentWave]);

  const initWave = useCallback((waveIdx: number) => {
    const w = waves[waveIdx];
    const filtered = allPuzzles.filter(p => {
      if (w.difficulty === 'easy') return p.difficulty === 'easy' || p.difficulty === 'medium';
      if (w.difficulty === 'medium') return true;
      return p.difficulty === 'medium' || p.difficulty === 'hard';
    });

    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, w.puzzleCount);
    setShuffledPuzzles(shuffled);
    setCurrentPuzzleInWave(0);
    setUserInput('');
    setGameState('playing');
    setTimeLeft(w.timeLimit);
    setShowHint(false);
    setFeedback(null);
    setHintsUsed(0);
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(t => t - 1);
        if (timeLeft <= 10) playSound('tick');
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('defeat');
      stopAmbientMusic();
      playSound('defeat');
    }
  }, [timeLeft, gameState, playSound, stopAmbientMusic]);

  const currentPuzzle = shuffledPuzzles[currentPuzzleInWave];

  const checkAnswer = () => {
    if (!currentPuzzle || feedback !== null) return;
    const isCorrect = userInput.toUpperCase().trim() === currentPuzzle.meaning;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      playSound('correct');
      const timeBonus = Math.floor(timeLeft / 2);
      const points = 100 + streak * 20 + timeBonus - (showHint ? 30 : 0);
      setScore(prev => prev + Math.max(20, points));
      setStreak(prev => prev + 1);
    } else {
      playSound('wrong');
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      setShowHint(false);
      setUserInput('');

      if (isCorrect) {
        if (currentPuzzleInWave >= shuffledPuzzles.length - 1) {
          if (currentWave < waves.length - 1) {
            setGameState('levelUp');
            playSound('victory');
          } else {
            setGameState('victory');
            playSound('victory');
            addScore({
              playerName: 'Explorer',
              score: score + 500,
              game: 'decoder',
              details: `Master Scribe of the Five Waves`
            });
          }
        } else {
          setCurrentPuzzleInWave(prev => prev + 1);
        }
      } else {
        // If wrong, we stay on the same puzzle for a moment then move on or penalize?
        // Let's just move on to keep flow, but no points.
        if (currentPuzzleInWave >= shuffledPuzzles.length - 1) {
          setGameState('levelUp'); // Still pass wave but with lower score
        } else {
          setCurrentPuzzleInWave(prev => prev + 1);
        }
      }
    }, 1200);
  };

  const handleNextWave = () => {
    const nextIdx = currentWave + 1;
    setCurrentWave(nextIdx);
    initWave(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentWave(0);
    setStreak(0);
    initWave(0);
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
              <ScrollText className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">TRIAL {currentWave + 1}/5</span>
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
                <BookOpen className="text-primary" size={20} />
                <span className="font-display text-gold">Progress</span>
                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-gold-glow transition-all duration-300"
                    style={{ width: `${((currentPuzzleInWave) / wave.puzzleCount) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-turquoise" size={20} />
                <span className="font-display text-gold text-lg">Streak: {streak}</span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <h2 className="text-xl font-display text-gold-gradient leading-none">{wave.name}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">Difficulty: {wave.difficulty.toUpperCase()}</p>
            </div>
          </div>

          <div className="relative p-12 bg-[url('https://www.transparenttextures.com/patterns/papyros.png')] bg-repeat min-h-[500px] flex flex-col items-center justify-center">
            {gameState === 'playing' && currentPuzzle && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentWave}-${currentPuzzleInWave}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full max-w-2xl"
                >
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center gap-6 p-8 bg-obsidian/80 rounded-3xl border-4 border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                      {currentPuzzle.symbols.map((symbol, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          className="text-8xl md:text-9xl drop-shadow-gold-glow cursor-default select-none"
                        >
                          {symbol}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                        placeholder="Type the meaning..."
                        autoFocus
                        disabled={feedback !== null}
                        className="w-full px-8 py-6 text-4xl font-display text-center bg-obsidian border-4 border-gold/30 rounded-2xl focus:border-primary focus:outline-none transition-all uppercase tracking-[0.2em] shadow-inner text-gold"
                      />
                      <AnimatePresence>
                        {feedback && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={`absolute inset-0 flex items-center justify-center rounded-2xl ${feedback === 'correct' ? 'bg-primary/90' : 'bg-terracotta/90'} backdrop-blur-sm z-10`}
                          >
                            <span className="text-3xl font-display text-white drop-shadow-lg">
                              {feedback === 'correct' ? 'DIVINE REVELATION!' : `INCORRECT: ${currentPuzzle.meaning}`}
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <EgyptianButton variant="hero" size="xl" onClick={checkAnswer} disabled={!userInput.trim() || feedback !== null} className="px-12">
                        Decipher
                      </EgyptianButton>
                      <EgyptianButton variant="turquoise" size="xl" onClick={() => { setShowHint(true); setHintsUsed(h => h + 1); playSound('hint'); }} disabled={showHint || feedback !== null}>
                        <Lightbulb className="mr-2" /> Hint
                      </EgyptianButton>
                    </div>

                    <AnimatePresence>
                      {showHint && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-center p-4 bg-turquoise/10 border border-turquoise/30 rounded-xl"
                        >
                          <p className="text-turquoise font-body italic text-lg">"The whispers of the ancients: {currentPuzzle.hint}"</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {gameState === 'playing' && (
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-3 px-6 py-2 rounded-full border-2 ${timeLeft < 10 ? 'bg-terracotta/20 border-terracotta animate-pulse' : 'bg-obsidian/60 border-gold/30'}`}>
                  <Timer className={timeLeft < 10 ? 'text-terracotta' : 'text-primary'} />
                  <span className={`text-2xl font-display ${timeLeft < 10 ? 'text-terracotta' : 'text-gold'}`}>{timeLeft}s</span>
                </div>
              </div>
            )}

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Hieroglyph Decoder"
                  description="Peer into the sacred script of Ancient Egypt. Correctly identify the meaning of the hieroglyphs to unlock the wisdom of the pharaohs."
                  onAction={() => initWave(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Wave Deciphered!"
                  description={`You have mastered the symbols of ${wave.name}.`}
                  stats={[
                    { label: 'Score', value: score },
                    { label: 'Streak', value: streak }
                  ]}
                  actionLabel="Next Wave"
                  onAction={handleNextWave}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Master Scribe"
                  description="Every sacred scroll and monument is now open to you. Your knowledge of the divine script is absolute."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Highest Streak', value: streak }
                  ]}
                  actionLabel="Decipher Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Script Remains Veiled"
                  description="The meaning of these symbols has eluded you. Thoth's secrets remain guarded by time."
                  score={score}
                  stats={[
                    { label: 'Wave Reached', value: wave.name },
                    { label: 'Score', value: score }
                  ]}
                  actionLabel="Retry Wave"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><ScrollText size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm">Sacred Script</h4>
              <p className="text-xs text-muted-foreground mt-1">Symbols represent gods, pharaohs, and elements of nature.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Lightbulb size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm">Divine Aid</h4>
              <p className="text-xs text-muted-foreground mt-1">Using hints reveals a clue but reduces the potential score for that puzzle.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><Trophy size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm">Streak Bonus</h4>
              <p className="text-xs text-muted-foreground mt-1">Consecutive correct decodings exponentially increase your score.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
