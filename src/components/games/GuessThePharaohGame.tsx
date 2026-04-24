import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Crown, Trophy, Timer, Star, Search, Shield, HelpCircle, Zap, Info, Clock } from 'lucide-react';
import { pharaohs, Pharaoh } from '@/data/pharaohs';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { GameOverlay } from './GameOverlay';

interface GuessThePharaohGameProps {
    onBack: () => void;
}

interface Wave {
  name: string;
  description: string;
  count: number;
  timeLimit: number;
  difficulty: 'Novice' | 'Scholar' | 'High Priest';
}

const waves: Wave[] = [
  { name: "The Valley of Kings", description: "Identify the most famous rulers of the Old and New Kingdoms.", count: 3, timeLimit: 45, difficulty: 'Novice' },
  { name: "Dynastic Legends", description: "Rulers of the Middle Kingdom and great builder kings.", count: 4, timeLimit: 60, difficulty: 'Scholar' },
  { name: "Forgotten Sovereigns", description: "Lesser-known but powerful pharaohs of the early dynasties.", count: 4, timeLimit: 60, difficulty: 'Scholar' },
  { name: "Queens of the Nile", description: "The powerful female pharaohs and royal consorts.", count: 5, timeLimit: 75, difficulty: 'High Priest' },
  { name: "The Divine Lineage", description: "A final test of all Egyptian royalty throughout the ages.", count: 6, timeLimit: 60, difficulty: 'High Priest' },
];

export default function GuessThePharaohGame({ onBack }: GuessThePharaohGameProps) {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory' | 'defeat'>('intro');
    const [currentWave, setCurrentWave] = useState(0);
    const [currentIdxInWave, setCurrentIdxInWave] = useState(0);
    const [currentPharaoh, setCurrentPharaoh] = useState<Pharaoh | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [streak, setStreak] = useState(0);

    const { playSound, stopAmbientMusic, startAmbientMusic } = useGameAudio();
    const { addScore } = useHighScores();

    const wave = useMemo(() => waves[currentWave], [currentWave]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState === 'playing') {
            interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState]);

    const generateQuestion = useCallback((waveIdx: number) => {
        const pharaoh = pharaohs[Math.floor(Math.random() * pharaohs.length)];
        setCurrentPharaoh(pharaoh);

        const correctOption = pharaoh.name;
        const incorrectOptions: string[] = [];
        const numOptions = Math.min(3 + waveIdx, 6);

        while (incorrectOptions.length < numOptions - 1) {
            const randomPharaoh = pharaohs[Math.floor(Math.random() * pharaohs.length)];
            if (randomPharaoh.name !== correctOption && !incorrectOptions.includes(randomPharaoh.name)) {
                incorrectOptions.push(randomPharaoh.name);
            }
        }

        const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
    }, []);

    const initWave = useCallback((waveIdx: number) => {
        setCurrentWave(waveIdx);
        setCurrentIdxInWave(0);
        setTimeLeft(waves[waveIdx].timeLimit);
        setGameState('playing');
        setFeedback(null);
        generateQuestion(waveIdx);
        playSound('gameStart');
        startAmbientMusic();
    }, [generateQuestion, playSound, startAmbientMusic]);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(t => t - 1);
                if (timeLeft <= 10) playSound('tick');
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'playing' && timeLeft === 0) {
            setGameState('defeat');
            playSound('defeat');
            stopAmbientMusic();
        }
    }, [timeLeft, gameState, playSound, stopAmbientMusic]);

    const handleGuess = (guess: string) => {
        if (feedback !== null || gameState !== 'playing') return;

        const isCorrect = guess === currentPharaoh?.name;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            playSound('correct');
            const timeBonus = Math.floor(timeLeft / 2);
            setScore(s => s + 100 + streak * 25 + timeBonus);
            setStreak(s => s + 1);
        } else {
            playSound('wrong');
            setStreak(0);
            setTimeLeft(prev => Math.max(0, prev - 10));
        }

        setTimeout(() => {
            setFeedback(null);
            if (isCorrect) {
                if (currentIdxInWave >= wave.count - 1) {
                    if (currentWave < waves.length - 1) {
                        setGameState('levelUp');
                        playSound('victory');
                    } else {
                        setGameState('victory');
                        playSound('victory');
                        addScore({ 
                            playerName: 'Historian', 
                            score: score + 500, 
                            game: 'guess-the-pharaoh', 
                            details: 'Grand Chronicler of the Divine Rulers' 
                        });
                    }
                } else {
                    setCurrentIdxInWave(prev => prev + 1);
                    generateQuestion(currentWave);
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
        setTimeElapsed(0);
        initWave(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background overflow-hidden relative">
            {/* Themed background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <Crown className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <EgyptianButton
                            variant="nav"
                            onClick={() => { stopAmbientMusic(); onBack(); }}
                            className="-ml-4 mb-2"
                        >
                            <ArrowLeft size={20} className="mr-2" /> Back to Games
                        </EgyptianButton>
                        <h1 className="text-4xl font-display text-gold-gradient">Guess the Pharaoh</h1>
                        <p className="text-muted-foreground font-body">Identify the divine rulers of the Nile</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <Crown size={12} className="text-primary" /> Wave
                            </div>
                            <div className="text-xl font-bold text-primary">{currentWave + 1}/5</div>
                        </div>
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <Trophy size={12} className="text-turquoise" /> Score
                            </div>
                            <div className="text-xl font-bold text-turquoise">{score}</div>
                        </div>
                    </div>
                </div>

                <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/30">
                    {/* Professional Game HUD */}
                    <div className="p-4 border-b border-gold/20 bg-black/60 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Search className="text-primary" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest leading-none mb-1">Status</div>
                                    <div className="font-display text-gold text-sm uppercase">Researching Lineage</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-turquoise" size={20} />
                                <span className="font-display text-gold text-lg">Streak: {streak}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <h2 className="text-xl font-display text-gold-gradient leading-none">{wave.name}</h2>
                            <p className="text-xs text-muted-foreground font-body mt-1">Difficulty: {wave.difficulty}</p>
                        </div>
                    </div>

                    <div className="relative p-12 bg-obsidian/40 backdrop-blur-sm flex flex-col items-center justify-center min-h-[500px]">
                        {gameState === 'playing' && currentPharaoh && (
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={`${currentWave}-${currentIdxInWave}`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="w-full max-w-3xl"
                                >
                                    <div className="text-center mb-10">
                                        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-6 opacity-40" />
                                        <EgyptianCard variant="gold" padding="xl" className="border-gold/30 bg-gold/5 relative overflow-hidden">
                                            <div className="absolute inset-0 opacity-10 hieroglyph-pattern pointer-events-none" />
                                            <p className="text-2xl md:text-3xl text-foreground font-body leading-relaxed italic relative z-10">
                                                "{currentPharaoh.clue}"
                                            </p>
                                        </EgyptianCard>
                                        <p className="mt-4 text-xs text-muted-foreground uppercase tracking-widest">Identify the Pharaoh described above</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {options.map((option, idx) => (
                                            <EgyptianButton
                                                key={idx}
                                                variant={feedback === 'correct' && option === currentPharaoh.name ? "turquoise" : feedback === 'wrong' && option !== currentPharaoh.name ? "outline" : "default"}
                                                size="xl"
                                                onClick={() => handleGuess(option)}
                                                disabled={feedback !== null}
                                                className={`h-auto py-6 text-xl font-display uppercase tracking-widest flex justify-center items-center gap-4 transition-all duration-300 ${feedback === 'wrong' && option === currentPharaoh.name ? "ring-2 ring-primary animate-pulse" : ""}`}
                                            >
                                                {option}
                                            </EgyptianButton>
                                        ))}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        <AnimatePresence>
                          {gameState === 'intro' && (
                            <GameOverlay
                              type="intro"
                              title="Guess the Pharaoh"
                              description="Test your historical intuition. Read the cryptic clues describing the legendary rulers of the Nile and correctly identify which pharaoh they refer to."
                              onAction={() => initWave(0)}
                              onSecondaryAction={onBack}
                            />
                          )}

                          {gameState === 'levelUp' && (
                            <GameOverlay
                              type="levelup"
                              title="Wave Completed!"
                              description={`Your knowledge of the ${wave.name} is impeccable.`}
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
                              title="Grand Historian"
                              description="The entire lineage of the Pharaohs is clear to you. You have identified every ruler throughout the ages."
                              score={score}
                              stars={5}
                              stats={[
                                { label: 'Final Score', value: score },
                                { label: 'Total Time', value: formatTime(timeElapsed) },
                                { label: 'Highest Streak', value: streak }
                              ]}
                              actionLabel="Identify Again"
                              onAction={resetGame}
                              onSecondaryAction={onBack}
                            />
                          )}

                          {gameState === 'defeat' && (
                            <GameOverlay
                              type="defeat"
                              title="History Forgotten"
                              description="The names of the great rulers have faded into the sands of time. Your studies must continue."
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

                    {/* Meta Info Footer */}
                    <div className="p-4 bg-black/60 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-primary" />
                            <span className="text-[10px] text-muted-foreground uppercase">Difficulty:</span>
                            <span className="text-xs font-display text-gold">{wave.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-turquoise" />
                            <span className="text-[10px] text-muted-foreground uppercase">Reward:</span>
                            <span className="text-xs font-display text-turquoise">Historian Badge</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-gold" />
                            <span className="text-[10px] text-muted-foreground uppercase">Accuracy:</span>
                            <span className="text-xs font-display text-gold">High</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={16} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase">Goal:</span>
                            <span className="text-xs font-display text-white">Clear All Waves</span>
                        </div>
                    </div>
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Shield size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm">Royal Knowledge</h4>
                            <p className="text-xs text-muted-foreground mt-1">Correctly identifying pharaohs grants you points and time bonuses.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Timer size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm">Sands of Time</h4>
                            <p className="text-xs text-muted-foreground mt-1">Each incorrect guess penalizes your remaining time by 10 seconds.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Star size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm">Dynastic Streak</h4>
                            <p className="text-xs text-muted-foreground mt-1">Consecutive correct answers build your streak, multiplying your score gains.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
