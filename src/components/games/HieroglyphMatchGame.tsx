import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, Timer, Star, Check, X, RotateCcw, Brain, Languages } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';
import { hieroglyphDatabase, HieroglyphEntry } from '@/data/hieroglyphDatabase';
import { cn } from '@/lib/utils';

interface HieroglyphMatchGameProps {
  onBack: () => void;
}

interface MatchPair {
  id: string;
  symbol: string;
  meaning: string;
}

const WAVES = [
  { name: "Initiate's Insight", pairs: 4, time: 40, difficulty: 'Easy' },
  { name: "Scribe's Selection", pairs: 6, time: 60, difficulty: 'Medium' },
  { name: "Priest's Perception", pairs: 8, time: 80, difficulty: 'Hard' },
  { name: "Vizier's Vision", pairs: 10, time: 100, difficulty: 'Expert' },
];

export function HieroglyphMatchGame({ onBack }: HieroglyphMatchGameProps) {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
  const [currentWaveIdx, setCurrentWaveIdx] = useState(0);
  const [symbols, setSymbols] = useState<HieroglyphEntry[]>([]);
  const [meanings, setMeanings] = useState<HieroglyphEntry[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedMeaning, setSelectedMeaning] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [feedback, setFeedback] = useState<{ id: string; type: 'correct' | 'wrong' } | null>(null);

  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();

  const wave = WAVES[currentWaveIdx];

  const initWave = useCallback((waveIdx: number) => {
    const currentWave = WAVES[waveIdx];
    // Pick random entries from database
    const shuffled = [...hieroglyphDatabase].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, currentWave.pairs);
    
    setSymbols([...selected].sort(() => Math.random() - 0.5));
    setMeanings([...selected].sort(() => Math.random() - 0.5));
    setMatches(new Set());
    setSelectedSymbol(null);
    setSelectedMeaning(null);
    setTimeLeft(currentWave.time);
    setGameState('playing');
    playSound('gameStart');
    startAmbientMusic();
  }, [playSound, startAmbientMusic]);

  // Optimized Timer: Separate interval from state-dependent logic to prevent 'interval churn'
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Handle side effects of time changes
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft > 0 && timeLeft <= 5) {
      playSound('tick');
    }

    if (timeLeft === 0) {
      setGameState('defeat');
      playSound('defeat');
      stopAmbientMusic();
    }
  }, [timeLeft, gameState, playSound, stopAmbientMusic]);

  const handleSymbolClick = (id: string) => {
    if (matches.has(id)) return;
    setSelectedSymbol(id);
    playSound('click');
    if (selectedMeaning) {
      checkMatch(id, selectedMeaning);
    }
  };

  const handleMeaningClick = (id: string) => {
    if (matches.has(id)) return;
    setSelectedMeaning(id);
    playSound('click');
    if (selectedSymbol) {
      checkMatch(selectedSymbol, id);
    }
  };

  const checkMatch = (symbolId: string, meaningId: string) => {
    if (symbolId === meaningId) {
      // Correct
      const newMatches = new Set(matches);
      newMatches.add(symbolId);
      setMatches(newMatches);
      setFeedback({ id: symbolId, type: 'correct' });
      setScore(s => s + 150);
      playSound('correct');
      
      if (newMatches.size === wave.pairs) {
        handleWaveComplete();
      }
    } else {
      // Wrong
      setFeedback({ id: symbolId, type: 'wrong' });
      playSound('wrong');
      setScore(s => Math.max(0, s - 50));
    }

    setTimeout(() => {
      setSelectedSymbol(null);
      setSelectedMeaning(null);
      setFeedback(null);
    }, 600);
  };

  const handleWaveComplete = () => {
    const timeBonus = timeLeft * 15;
    const waveScore = score + timeBonus;
    setTotalScore(prev => prev + waveScore);
    playSound('victory');

    if (currentWaveIdx < WAVES.length - 1) {
      setGameState('levelUp');
    } else {
      setGameState('victory');
      addScore({
        playerName: 'Master Scribe',
        score: totalScore + waveScore,
        game: 'hieroglyph-match',
        details: 'Achieved complete symbolic harmony'
      });
    }
  };

  const handleNextWave = () => {
    const nextIdx = currentWaveIdx + 1;
    setCurrentWaveIdx(nextIdx);
    setScore(0);
    initWave(nextIdx);
  };

  const resetGame = () => {
    setTotalScore(0);
    setScore(0);
    setCurrentWaveIdx(0);
    initWave(0);
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto">
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
              <Languages className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">WAVE {currentWaveIdx + 1}/4</span>
            </div>
            <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
              <Trophy className="text-primary w-4 h-4" />
              <span className="text-sm font-display text-gold">SCORE: {totalScore + score}</span>
            </div>
          </div>
        </div>

        <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20">
          {/* Header HUD */}
          <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Brain className="text-primary" size={20} />
                <span className="font-display text-gold uppercase text-xs tracking-widest">{wave.name}</span>
              </div>
              <div className="w-48 h-2 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden">
                <motion.div 
                  className="h-full bg-primary shadow-gold-glow"
                  initial={{ width: 0 }}
                  animate={{ width: `${(matches.size / wave.pairs) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className={`flex items-center gap-2 px-4 py-1 rounded-full border ${timeLeft < 10 ? 'bg-terracotta/20 border-terracotta animate-pulse' : 'bg-obsidian/40 border-gold/20'}`}>
                <Timer size={18} className={timeLeft < 10 ? 'text-terracotta' : 'text-primary'} />
                <span className={`font-display text-xl ${timeLeft < 10 ? 'text-terracotta' : 'text-gold'}`}>{timeLeft}s</span>
              </div>
            </div>
          </div>

          <div className="relative p-8 bg-obsidian flex flex-col items-center justify-center min-h-[600px]">
            {gameState === 'playing' && (
              <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">
                {/* Symbols Column */}
                <div className="space-y-4">
                  <h3 className="text-center font-display text-primary uppercase tracking-widest text-sm mb-6">Sacred Glyphs</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {symbols.map((entry) => (
                      <motion.button
                        key={entry.gardinerCode}
                        onClick={() => handleSymbolClick(entry.gardinerCode)}
                        disabled={matches.has(entry.gardinerCode)}
                        className={cn(
                          "aspect-square flex items-center justify-center text-5xl rounded-xl border-2 transition-all duration-300 relative overflow-hidden",
                          matches.has(entry.gardinerCode)
                            ? "bg-scarab/10 border-scarab/50 text-scarab/40"
                            : selectedSymbol === entry.gardinerCode
                              ? "bg-primary/20 border-primary shadow-gold-glow text-primary scale-105"
                              : "bg-obsidian/60 border-gold/20 text-gold-light hover:border-gold/50"
                        )}
                        whileHover={!matches.has(entry.gardinerCode) ? { scale: 1.05 } : {}}
                      >
                        {entry.symbol}
                        {matches.has(entry.gardinerCode) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check className="text-scarab w-8 h-8" />
                          </div>
                        )}
                        {feedback?.id === entry.gardinerCode && feedback.type === 'wrong' && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-terracotta/40 flex items-center justify-center"
                          >
                            <X className="text-white w-8 h-8" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Meanings Column */}
                <div className="space-y-4">
                  <h3 className="text-center font-display text-primary uppercase tracking-widest text-sm mb-6">Divine Meanings</h3>
                  <div className="flex flex-col gap-3">
                    {meanings.map((entry) => (
                      <motion.button
                        key={entry.gardinerCode}
                        onClick={() => handleMeaningClick(entry.gardinerCode)}
                        disabled={matches.has(entry.gardinerCode)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-left font-body text-sm transition-all duration-300 relative overflow-hidden",
                          matches.has(entry.gardinerCode)
                            ? "bg-scarab/10 border-scarab/50 text-scarab/40"
                            : selectedMeaning === entry.gardinerCode
                              ? "bg-primary/20 border-primary shadow-gold-glow text-primary translate-x-2"
                              : "bg-obsidian/60 border-gold/20 text-foreground/80 hover:border-gold/50"
                        )}
                        whileHover={!matches.has(entry.gardinerCode) ? { x: 5 } : {}}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold">{entry.meaning}</span>
                          {matches.has(entry.gardinerCode) && <Check className="text-scarab w-4 h-4" />}
                        </div>
                        {feedback?.id === entry.gardinerCode && feedback.type === 'wrong' && (
                          <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-terracotta/20"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="Hieroglyph Match"
                  description="Master the language of the gods. Connect the sacred hieroglyphs with their true meanings to unlock ancient wisdom. Only those with a sharp eye and a deep understanding of the symbolic world can achieve total harmony."
                  onAction={() => initWave(0)}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Wave Complete!"
                  description={`Your understanding of the sacred script grows deeper. ${wave.name} mastered.`}
                  stats={[
                    { label: 'Wave Score', value: score },
                    { label: 'Time Bonus', value: `+${timeLeft * 15}` },
                    { label: 'Total Score', value: totalScore }
                  ]}
                  actionLabel="Next Wave"
                  onAction={handleNextWave}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Archivist of Thoth"
                  description="You have achieved perfect symbolic harmony. Every glyph and meaning is as clear to you as the midday sun over the Giza plateau."
                  score={totalScore}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: totalScore },
                    { label: 'Waves Mastered', value: '4/4' },
                    { label: 'Rank', value: 'High Priest of Scribes' }
                  ]}
                  actionLabel="Study Again"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'defeat' && (
                <GameOverlay
                  type="defeat"
                  title="Lost in Translation"
                  description="The symbols remain a mystery. Take more time to study the Gardiner list and return when your mind is clear."
                  score={totalScore}
                  stats={[
                    { label: 'Wave', value: wave.name },
                    { label: 'Score', value: totalScore }
                  ]}
                  actionLabel="Retry Wave"
                  onAction={resetGame}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-black/60 border-t border-gold/20 flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <Star size={16} className="text-primary" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Select Symbol</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border border-primary flex items-center justify-center text-[10px] text-primary">→</div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Match Meaning</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={16} className="text-turquoise" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Clear Selection</span>
            </div>
          </div>
        </EgyptianCard>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Languages size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm uppercase tracking-widest">Linguistics</h4>
              <p className="text-xs text-muted-foreground mt-1">Hieroglyphs often represent concepts, sounds, or objects simultaneously.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Brain size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm uppercase tracking-widest">Memory</h4>
              <p className="text-xs text-muted-foreground mt-1">Focus on the shapes and details to distinguish between similar glyphs.</p>
            </div>
          </div>
          <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
            <div className="p-2 bg-gold/20 rounded-lg text-gold"><Trophy size={20}/></div>
            <div>
              <h4 className="text-gold font-display text-sm uppercase tracking-widest">Precision</h4>
              <p className="text-xs text-muted-foreground mt-1">Wrong matches penalize your score. Take a breath and choose wisely.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
