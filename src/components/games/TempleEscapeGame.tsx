import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, RotateCcw } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';

interface TempleEscapeGameProps {
  onBack: () => void;
}

interface Trap {
  id: number;
  type: 'spikes' | 'boulder' | 'arrows' | 'pit';
  emoji: string;
  options: { text: string; safe: boolean }[];
  description: string;
}

const traps: Trap[] = [
  { id: 1, type: 'spikes', emoji: '🗡️', description: 'A floor of retractable spikes blocks your path!', options: [{ text: 'Jump across carefully', safe: true }, { text: 'Run through quickly', safe: false }, { text: 'Find a pressure plate to disable them', safe: true }, { text: 'Try to crawl under', safe: false }] },
  { id: 2, type: 'boulder', emoji: '🪨', description: 'A massive boulder rolls toward you!', options: [{ text: 'Dive into a side alcove', safe: true }, { text: 'Try to outrun it', safe: false }, { text: 'Press against the wall', safe: true }, { text: 'Jump over it', safe: false }] },
  { id: 3, type: 'arrows', emoji: '🏹', description: 'Arrow slits line both walls ahead!', options: [{ text: 'Crawl on the ground', safe: true }, { text: 'Sprint through the middle', safe: false }, { text: 'Use your shield to block', safe: true }, { text: 'Walk slowly through', safe: false }] },
  { id: 4, type: 'pit', emoji: '🕳️', description: 'A hidden pit trap opens beneath you!', options: [{ text: 'Grab the edge and pull up', safe: true }, { text: 'Fall and hope for the best', safe: false }, { text: 'Swing across on a vine', safe: true }, { text: 'Jump straight down', safe: false }] },
  { id: 5, type: 'spikes', emoji: '⚡', description: 'Electrified hieroglyphs guard the passage!', options: [{ text: 'Touch only the inactive ones', safe: true }, { text: 'Rush through the energy', safe: false }, { text: 'Wait for the pattern to cycle', safe: true }, { text: 'Smash through the wall', safe: false }] },
  { id: 6, type: 'boulder', emoji: '🔥', description: 'Flaming oil pours from the ceiling!', options: [{ text: 'Roll under the waterfall gap', safe: true }, { text: 'Cover yourself and run', safe: false }, { text: 'Find the shutoff lever', safe: true }, { text: 'Walk through the flames', safe: false }] },
  { id: 7, type: 'arrows', emoji: '🐍', description: 'Sacred cobras slither across the floor!', options: [{ text: 'Play the charmer flute on the wall', safe: true }, { text: 'Step on them quickly', safe: false }, { text: 'Walk on the raised stones', safe: true }, { text: 'Try to kick them aside', safe: false }] },
  { id: 8, type: 'pit', emoji: '💀', description: 'A cursed mist fills the corridor!', options: [{ text: 'Hold your breath and dash', safe: true }, { text: 'Breathe normally through it', safe: false }, { text: 'Use your cloak as a mask', safe: true }, { text: 'Walk slowly through the mist', safe: false }] },
  { id: 9, type: 'spikes', emoji: '🧩', description: 'A riddle lock blocks the door: "What has keys but no locks?"', options: [{ text: 'A piano (correct answer)', safe: true }, { text: 'A treasure chest', safe: false }, { text: 'A keyboard', safe: true }, { text: 'A prison', safe: false }] },
  { id: 10, type: 'boulder', emoji: '⏳', description: 'Sand fills the room rapidly from above!', options: [{ text: 'Climb the statue to the exit', safe: true }, { text: 'Dig through the sand', safe: false }, { text: 'Break the hourglass mechanism', safe: true }, { text: 'Swim through the sand', safe: false }] },
  { id: 11, type: 'arrows', emoji: '🎯', description: 'Poison darts fire from the walls in a rhythmic pattern!', options: [{ text: 'Time your dash between shots', safe: true }, { text: 'Use a mirror to deflect them', safe: false }, { text: 'Slide under the darts', safe: true }, { text: 'Block with your bare hands', safe: false }] },
  { id: 12, type: 'pit', emoji: '🦴', description: 'The floor tiles are crumbling into a bottomless abyss!', options: [{ text: 'Step only on the tiles with the Ankh symbol', safe: true }, { text: 'Run as fast as you can', safe: false }, { text: 'Use a rope to swing across', safe: true }, { text: 'Jump onto the middle tile', safe: false }] },
  { id: 13, type: 'spikes', emoji: '🦁', description: 'The Sekhmet statue’s eyes glow red, and fire breathes from its mouth!', options: [{ text: 'Hide behind the stone pillars', safe: true }, { text: 'Try to extinguish the fire', safe: false }, { text: 'Crawl through the low-level vents', safe: true }, { text: 'Stand your ground', safe: false }] },
  { id: 14, type: 'boulder', emoji: '🕸️', description: 'Giant spiders drop from the ceiling, weaving sticky webs!', options: [{ text: 'Use a torch to clear the path', safe: true }, { text: 'Slash through with your blade', safe: false }, { text: 'Dash through the gaps', safe: true }, { text: 'Try to talk to them', safe: false }] },
  { id: 15, type: 'pit', emoji: '🌀', description: 'A powerful vortex is pulling everything toward a dark hole!', options: [{ text: 'Lash yourself to a heavy altar', safe: true }, { text: 'Run away from the center', safe: false }, { text: 'Use the wind to glide across', safe: true }, { text: 'Jump into the center', safe: false }] },
];

export function TempleEscapeGame({ onBack }: TempleEscapeGameProps) {
  const [currentTrap, setCurrentTrap] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [escaped, setEscaped] = useState(false);
  const [shuffledTraps, setShuffledTraps] = useState<Trap[]>([]);
  const [streak, setStreak] = useState(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const startGame = useCallback(() => {
    const shuffled = [...traps].sort(() => Math.random() - 0.5).slice(0, 7);
    setShuffledTraps(shuffled);
    setCurrentTrap(0);
    setScore(0);
    setLives(3);
    setTimeLeft(10);
    setSelectedOption(null);
    setShowResult(false);
    setGameOver(false);
    setEscaped(false);
    setStreak(0);
    setIsPlaying(true);
    playSound('gameStart');
    startAmbientMusic();
  }, []);

  useEffect(() => {
    if (isPlaying && !showResult && !gameOver && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
      if (timeLeft <= 3) playSound('tick');
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isPlaying && !showResult) {
      // Time ran out - lose a life
      setLives(l => l - 1);
      setShowResult(true);
      setSelectedOption(-1);
      playSound('wrong');
      if (lives <= 1) {
        setTimeout(() => {
          setGameOver(true);
          setIsPlaying(false);
          stopAmbientMusic();
          playSound('defeat');
          addScore({ playerName: 'Explorer', score, game: 'temple-escape', details: `Reached trap ${currentTrap + 1}` });
        }, 1500);
      }
    }
  }, [timeLeft, isPlaying, showResult, gameOver]);

  const handleChoice = (index: number) => {
    if (showResult || !isPlaying) return;
    setSelectedOption(index);
    setShowResult(true);
    const trap = shuffledTraps[currentTrap];
    const isSafe = trap.options[index].safe;

    if (isSafe) {
      const timeBonus = timeLeft * 5;
      const streakBonus = streak * 10;
      setScore(s => s + 100 + timeBonus + streakBonus);
      setStreak(s => s + 1);
      playSound('correct');
    } else {
      setLives(l => l - 1);
      setStreak(0);
      playSound('wrong');
      if (lives <= 1) {
        setTimeout(() => {
          setGameOver(true);
          setIsPlaying(false);
          stopAmbientMusic();
          playSound('defeat');
          addScore({ playerName: 'Explorer', score, game: 'temple-escape', details: `Reached trap ${currentTrap + 1}` });
        }, 1500);
        return;
      }
    }
  };

  const nextTrap = () => {
    if (currentTrap >= shuffledTraps.length - 1) {
      setEscaped(true);
      setIsPlaying(false);
      const finalScore = score + lives * 200;
      setScore(finalScore);
      stopAmbientMusic();
      playSound('victory');
      addScore({ playerName: 'Explorer', score: finalScore, game: 'temple-escape', details: `Escaped! ${lives} lives left` });
      return;
    }
    setCurrentTrap(c => c + 1);
    setSelectedOption(null);
    setShowResult(false);
    setTimeLeft(10);
    playSound('click');
  };

  const trap = shuffledTraps[currentTrap];

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button onClick={() => { stopAmbientMusic(); onBack(); }} className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg">
            <ArrowLeft size={20} /> Back to Games
          </button>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Temple Escape</h1>
          <p className="text-xl text-muted-foreground font-body">Navigate deadly traps to escape the ancient temple!</p>
        </div>

        <EgyptianCard variant="tomb" padding="lg" className="relative">
          {/* Stats */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2 bg-lapis/50 px-4 py-2 rounded-lg border border-lapis-light/30">
              <Trophy className="text-primary" size={24} />
              <span className="text-xl text-foreground font-body">{score}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
              <Star className="text-turquoise" size={24} />
              <span className="text-xl text-foreground font-body">Streak: {streak}🔥</span>
            </div>
            {isPlaying && (
              <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg border border-border">
                <Timer className={`${timeLeft <= 3 ? 'text-terracotta animate-pulse' : 'text-scarab'}`} size={24} />
                <span className="text-xl text-foreground font-body">{timeLeft}s</span>
              </div>
            )}
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${i < lives ? 'bg-terracotta' : 'bg-muted'} flex items-center justify-center border border-border`}>❤️</div>
              ))}
            </div>
          </div>

          {!isPlaying && !gameOver && !escaped ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">🏛️</div>
              <h2 className="text-4xl font-display text-gold-gradient mb-6">Escape the Temple!</h2>
              <p className="text-xl text-muted-foreground font-body mb-4 max-w-2xl mx-auto">
                Navigate through 7 deadly traps. Choose wisely and quickly — time is running out!
              </p>
              <p className="text-lg text-muted-foreground/80 font-body mb-8">Fast choices earn bonus points. Build streaks for even more!</p>
              <EgyptianButton variant="hero" size="xl" shimmer onClick={startGame}>
                Enter the Temple
              </EgyptianButton>
            </div>
          ) : isPlaying && trap ? (
            <motion.div key={currentTrap} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="text-center mb-2">
                <span className="text-muted-foreground font-body">Trap {currentTrap + 1} of {shuffledTraps.length}</span>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-gold-dark to-primary h-2 rounded-full transition-all" style={{ width: `${((currentTrap + 1) / shuffledTraps.length) * 100}%` }} />
                </div>
              </div>

              <div className="text-center text-8xl mb-4">{trap.emoji}</div>

              <EgyptianCard variant="lapis" padding="lg">
                <p className="text-2xl text-foreground font-body leading-relaxed text-center">{trap.description}</p>
              </EgyptianCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trap.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={!showResult ? { scale: 1.03 } : {}}
                    whileTap={!showResult ? { scale: 0.97 } : {}}
                    onClick={() => handleChoice(index)}
                    disabled={showResult}
                    className={`p-5 rounded-xl text-lg font-body border-2 transition-all text-left ${
                      showResult
                        ? option.safe
                          ? 'bg-scarab/50 border-turquoise/50 text-foreground'
                          : index === selectedOption
                            ? 'bg-terracotta/50 border-terracotta/50 text-foreground'
                            : 'bg-card/50 border-border text-muted-foreground'
                        : 'bg-card hover:bg-muted border-gold/30 hover:border-gold/50 text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-display text-sm">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option.text}</span>
                      {showResult && option.safe && <span className="ml-auto">✅</span>}
                      {showResult && !option.safe && index === selectedOption && <span className="ml-auto">❌</span>}
                    </div>
                  </motion.button>
                ))}
              </div>

              {showResult && !gameOver && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <EgyptianButton variant="hero" size="lg" shimmer onClick={nextTrap} className="w-full">
                    {currentTrap >= shuffledTraps.length - 1 ? 'Escape!' : 'Next Trap →'}
                  </EgyptianButton>
                </motion.div>
              )}
            </motion.div>
          ) : null}

          {escaped && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <div className="text-9xl mb-6">🎉</div>
              <h2 className="text-5xl font-display text-gold-gradient mb-4">You Escaped!</h2>
              <div className="space-y-2 mb-8">
                <p className="text-2xl text-foreground font-body">Final Score: {score}</p>
                <p className="text-xl text-muted-foreground font-body">Lives Remaining: {lives} (+{lives * 200} bonus)</p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={i < Math.min(5, lives + 1) ? 'text-primary fill-primary' : 'text-muted'} size={32} />
                  ))}
                </div>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={startGame}><RotateCcw size={20} /> Play Again</EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}

          {gameOver && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 absolute inset-0 bg-obsidian/95 rounded-lg flex flex-col items-center justify-center">
              <div className="text-9xl mb-6">💀</div>
              <h2 className="text-5xl font-display text-terracotta mb-4">Trapped Forever!</h2>
              <p className="text-2xl text-foreground font-body mb-2">Final Score: {score}</p>
              <p className="text-xl text-muted-foreground font-body mb-8">You survived {currentTrap} traps</p>
              <div className="flex gap-4 flex-wrap justify-center">
                <EgyptianButton variant="default" size="lg" onClick={startGame}><RotateCcw size={20} /> Try Again</EgyptianButton>
                <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
              </div>
            </motion.div>
          )}
        </EgyptianCard>
      </div>
    </div>
  );
}
