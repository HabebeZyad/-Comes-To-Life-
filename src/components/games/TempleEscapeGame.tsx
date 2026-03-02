import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw, Shield, Zap, Skull, Compass } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface TempleEscapeGameProps {
  onBack: () => void;
}

interface Trap {
  id: number;
  type: 'spikes' | 'boulder' | 'arrows' | 'pit' | 'magic';
  emoji: string;
  options: { text: string; safe: boolean }[];
  description: string;
}

const allTraps: Trap[] = [
  { id: 1, type: 'spikes', emoji: '🗡️', description: 'A floor of retractable spikes blocks your path!', options: [{ text: 'Jump across carefully', safe: true }, { text: 'Run through quickly', safe: false }, { text: 'Find a pressure plate to disable them', safe: true }, { text: 'Try to crawl under', safe: false }] },
  { id: 2, type: 'boulder', emoji: '🪨', description: 'A massive boulder rolls toward you!', options: [{ text: 'Dive into a side alcove', safe: true }, { text: 'Try to outrun it', safe: false }, { text: 'Press against the wall', safe: true }, { text: 'Jump over it', safe: false }] },
  { id: 3, type: 'arrows', emoji: '🏹', description: 'Arrow slits line both walls ahead!', options: [{ text: 'Crawl on the ground', safe: true }, { text: 'Sprint through the middle', safe: false }, { text: 'Use your shield to block', safe: true }, { text: 'Walk slowly through', safe: false }] },
  { id: 4, type: 'pit', emoji: '🕳️', description: 'A hidden pit trap opens beneath you!', options: [{ text: 'Grab the edge and pull up', safe: true }, { text: 'Fall and hope for the best', safe: false }, { text: 'Swing across on a vine', safe: true }, { text: 'Jump straight down', safe: false }] },
  { id: 5, type: 'magic', emoji: '⚡', description: 'Electrified hieroglyphs guard the passage!', options: [{ text: 'Touch only the inactive ones', safe: true }, { text: 'Rush through the energy', safe: false }, { text: 'Wait for the pattern to cycle', safe: true }, { text: 'Smash through the wall', safe: false }] },
  { id: 6, type: 'magic', emoji: '🔥', description: 'Flaming oil pours from the ceiling!', options: [{ text: 'Roll under the waterfall gap', safe: true }, { text: 'Cover yourself and run', safe: false }, { text: 'Find the shutoff lever', safe: true }, { text: 'Walk through the flames', safe: false }] },
  { id: 7, type: 'magic', emoji: '🐍', description: 'Sacred cobras slither across the floor!', options: [{ text: 'Play the charmer flute on the wall', safe: true }, { text: 'Step on them quickly', safe: false }, { text: 'Walk on the raised stones', safe: true }, { text: 'Try to kick them aside', safe: false }] },
  { id: 8, type: 'magic', emoji: '💀', description: 'A cursed mist fills the corridor!', options: [{ text: 'Hold your breath and dash', safe: true }, { text: 'Breathe normally through it', safe: false }, { text: 'Use your cloak as a mask', safe: true }, { text: 'Walk slowly through the mist', safe: false }] },
  { id: 9, type: 'magic', emoji: '🧩', description: 'A riddle lock blocks the door: "What has keys but no locks?"', options: [{ text: 'A piano (correct answer)', safe: true }, { text: 'A treasure chest', safe: false }, { text: 'A keyboard', safe: true }, { text: 'A prison', safe: false }] },
  { id: 10, type: 'magic', emoji: '⏳', description: 'Sand fills the room rapidly from above!', options: [{ text: 'Climb the statue to the exit', safe: true }, { text: 'Dig through the sand', safe: false }, { text: 'Break the hourglass mechanism', safe: true }, { text: 'Swim through the sand', safe: false }] },
];

interface Level {
  name: string;
  trapCount: number;
  timeLimit: number;
}

const levels: Level[] = [
  { name: "The Outer Walls", trapCount: 3, timeLimit: 12 },
  { name: "Temple Courtyard", trapCount: 4, timeLimit: 10 },
  { name: "Inner Sanctum", trapCount: 4, timeLimit: 8 },
  { name: "The Tomb of Kings", trapCount: 5, timeLimit: 7 },
  { name: "The Divine Escape", trapCount: 6, timeLimit: 5 },
];

export function TempleEscapeGame({ onBack }: TempleEscapeGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentTrapIndex, setCurrentTrapIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [shuffledTraps, setShuffledTraps] = useState<Trap[]>([]);
  const [streak, setStreak] = useState(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const level = useMemo(() => levels[currentLevel], [currentLevel]);

  const initLevel = useCallback((levelIdx: number) => {
    const l = levels[levelIdx];
    const shuffled = [...allTraps].sort(() => Math.random() - 0.5).slice(0, l.trapCount);
    setShuffledTraps(shuffled);
    setCurrentTrapIndex(0);
    setLives(3);
    setTimeLeft(l.timeLimit);
    setSelectedOption(null);
    setShowResult(false);
    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  useEffect(() => {
    if (gameState === 'playing' && !showResult && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(t => t - 1);
        if (timeLeft <= 3) playSound('tick');
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing' && !showResult) {
      handleChoice(-1); // Time out penalty
    }
  }, [timeLeft, gameState, showResult, playSound]);

  const handleChoice = (index: number) => {
    if (showResult || gameState !== 'playing') return;
    setSelectedOption(index);
    setShowResult(true); const trap = shuffledTraps[currentTrapIndex];
    const isSafe = index !== -1 && trap.options[index].safe;

    if (isSafe) {
      playSound('correct');
      const timeBonus = timeLeft * 10;
      setScore(s => s + 100 + timeBonus + streak * 20);
      setStreak(s => s + 1);
    } else {
      playSound('wrong');
      setLives(l => l - 1);
      setStreak(0); if (lives <= 1) {
        setTimeout(() => {
          setGameState('defeat');
          stopAmbientMusic();
          playSound('defeat');
        }, 1200);
        return;
      }
    }

    setTimeout(() => {
      if (currentTrapIndex >= shuffledTraps.length - 1) {
        if (currentLevel < levels.length - 1) {
          setGameState('levelUp');
          playSound('victory');
        } else {
          setGameState('victory');
          playSound('victory');
          addScore({
            playerName: 'Explorer',
            score: score + lives * 500,
            game: 'temple-escape',
            details: `Escaped the Temple with ${lives} lives!`
          });
        }
      } else {
        setCurrentTrapIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowResult(false);
        setTimeLeft(level.timeLimit);
      }
    }, 1500);
  };

  const handleNextLevel = () => {
    const nextIdx = currentLevel + 1;
    setCurrentLevel(nextIdx);
    initLevel(nextIdx);
  };

  const resetGame = () => {
    setScore(0);
    setCurrentLevel(0);
    setStreak(0);
    initLevel(0);
  };

  const trap = shuffledTraps[currentTrapIndex];

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
              <Compass className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">CHAMBER {currentLevel + 1}/5</span>
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
                <Skull className="text-terracotta" size={20} />
                <div className="flex gap-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: i < lives ? 1 : 0.8, opacity: i < lives ? 1 : 0.3 }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center border ${i < lives ? 'bg-terracotta border-terracotta/50 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-muted border-white/10'}`}
                    >
                      <span className="text-[10px]">❤️</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-turquoise" size={20} />
                <span className="font-display text-gold text-lg">STREAK: {streak}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <h2 className="text-xl font-display text-gold-gradient leading-none">{level.name}</h2>
              <p className="text-xs text-muted-foreground font-body mt-1">Escape the traps before time runs out!</p>
            </div>
          </div>

          <div className="relative p-12 bg-obsidian flex flex-col items-center justify-center min-h-[550px]">
            {gameState === 'playing' && trap && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentLevel}-${currentTrapIndex}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="w-full max-w-3xl"
                >
                  <div className="text-center mb-8">
                    <span className="text-gold/40 font-display text-xs uppercase tracking-[0.3em]">Hazard Detected</span>
                    <div className="text-9xl my-6 drop-shadow-[0_0_30px_rgba(255,191,0,0.3)] animate-bounce-slow">
                      {trap.emoji}
                    </div>
                    <EgyptianCard variant="lapis" padding="lg" className="border-gold/30 bg-gold/5">
                      <p className="text-2xl md:text-3xl text-foreground font-body leading-relaxed">
                        {trap.description}
                      </p>
                    </EgyptianCard>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trap.options.map((option, idx) => (
                      <EgyptianButton
                        key={idx}
                        variant={showResult ? (option.safe ? "turquoise" : idx === selectedOption ? "danger" : "outline") : "default"}
                        size="xl"
                        onClick={() => handleChoice(idx)}
                        disabled={showResult}
                        className={`h-auto py-6 px-8 text-left flex justify-between items-center group ${showResult && option.safe ? "ring-2 ring-turquoise shadow-turquoise-glow" : ""}`}
                      >
                        <span className="text-lg font-body">{option.text}</span>
                        {!showResult && (
                          <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center group-hover:bg-gold group-hover:text-obsidian transition-colors font-display text-sm">
                            {String.fromCharCode(65 + idx)}
                          </div>
                        )}
                        {showResult && option.safe && <Zap className="text-white animate-pulse" />}
                      </EgyptianButton>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-center">
                    <div className={`flex items-center gap-3 px-8 py-3 rounded-full border-2 transition-all duration-300 ${timeLeft < 4 ? 'bg-terracotta border-terracotta text-white shadow-terracotta-glow scale-110' : 'bg-obsidian/80 border-gold/30 text-gold'}`}>
                      <Timer className={timeLeft < 4 ? 'animate-spin-slow' : ''} />
                      <span className="text-3xl font-display">{timeLeft}s</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Temple Escape"
                  description="The temple is collapsing! You must navigate a gauntlet of ancient traps, using your wits and reflexes to reach the exit before you're entombed forever."
                  onAction={() => initLevel(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Chamber Cleared!"
                  description={`You have survived ${level.name}. The next chamber awaits.`}
                  stats={[
                    { label: 'Current Score', value: score },
                    { label: 'Lives Left', value: lives }
                  ]}
                  actionLabel="Next Chamber"
                  onAction={handleNextLevel}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Master of the Temple"
                  description="You have reached the sunlit world once more. The temple's traps could not hold one as swift and wise as you."
                  score={score}
                  stars={Math.min(5, lives + (streak > 10 ? 2 : streak > 5 ? 1 : 0))}
                  stats={[
                    { label: 'Lives Preserved', value: lives },
                    { label: 'Highest Streak', value: streak }
                  ]}
                  actionLabel="Escape Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Entombed Forever"
                  description="The temple's shadows have claimed you. Your journey ends in the darkness of the ancient stones."
                  score={score}
                  stats={[
                    { label: 'Chamber Reached', value: level.name },
                    { label: 'Final Score', value: score }
                  ]}
                  actionLabel="Retry Escape"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Shield size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Divine Protection</h4>
              <p className="text-xs text-muted-foreground mt-1">You have 3 lives. Choosing an incorrect path or running out of time costs one heart.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Timer size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Echoes of Time</h4>
              <p className="text-xs text-muted-foreground mt-1">Faster reactions provide significant score bonuses. The time limit shrinks as you go deeper.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><Zap size={20} /></div>
            <div>
              <h4 className="text-gold font-display text-sm">Trial Mastery</h4>
              <p className="text-xs text-muted-foreground mt-1">Escaping with all hearts intact awards a massive divine bonus to your final score.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
