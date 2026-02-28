import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Trophy, Timer, Star } from 'lucide-react';
import { pharaohs, Pharaoh } from '@/data/pharaohs';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';
import { useToast } from '@/hooks/use-toast';

interface GuessThePharaohGameProps {
    onBack: () => void;
}

export default function GuessThePharaohGame({ onBack }: GuessThePharaohGameProps) {
    const [level, setLevel] = useState(1);
    const [currentPharaoh, setCurrentPharaoh] = useState<Pharaoh | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isGameActive, setIsGameActive] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const { toast } = useToast();
    const { playSound, stopAmbientMusic, startAmbientMusic } = useGameAudio();
    const { addScore } = useHighScores();

    const endGame = useCallback(() => {
        setIsGameActive(false);
        setGameOver(true);
        stopAmbientMusic();
        addScore({ playerName: 'Historian', score, game: 'guess-the-pharaoh', details: `Reached level ${level}` });
    }, [level, score, addScore, stopAmbientMusic]);

    const nextLevel = useCallback((currentLevel: number) => {
        const pharaoh = pharaohs[Math.floor(Math.random() * pharaohs.length)];
        setCurrentPharaoh(pharaoh);

        const correctOption = pharaoh.name;
        const incorrectOptions: string[] = [];

        const numOptions = Math.min(2 + currentLevel, 6);

        while (incorrectOptions.length < numOptions - 1) {
            const randomPharaoh = pharaohs[Math.floor(Math.random() * pharaohs.length)];
            if (randomPharaoh.name !== correctOption && !incorrectOptions.includes(randomPharaoh.name)) {
                incorrectOptions.push(randomPharaoh.name);
            }
        }

        const allOptions = [correctOption, ...incorrectOptions].sort(() => Math.random() - 0.5);
        setOptions(allOptions);
    }, []);

    const startGame = () => {
        setLevel(1);
        setScore(0);
        setTimeLeft(60);
        setIsGameActive(true);
        setGameOver(false);
        nextLevel(1);
        startAmbientMusic();
    };

    useEffect(() => {
        if (isGameActive && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (isGameActive && timeLeft === 0) {
            endGame();
        }
    }, [timeLeft, isGameActive, endGame]);


    const handleGuess = (guess: string) => {
        if (guess === currentPharaoh?.name) {
            const points = level * 10;
            setScore(score + points);
            setLevel(level + 1);
            setTimeLeft(timeLeft + 5);
            toast({ title: 'Correct!', description: `+${points} points! On to the next level!` });
            playSound('correct');
            nextLevel(level + 1);
        } else {
            toast({ title: 'Incorrect', description: 'Try again!', variant: 'destructive' });
            setTimeLeft(Math.max(0, timeLeft - 10));
            playSound('wrong');
        }
    };

    const handleReturn = () => {
        stopAmbientMusic();
        onBack();
    }

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <EgyptianButton
                        variant="nav"
                        onClick={handleReturn}
                        className="mb-4 -ml-4"
                    >
                        <ArrowLeft size={20} /> Back to Games
                    </EgyptianButton>
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Guess the Pharaoh</h1>
                </div>

                <EgyptianCard variant="gold" padding="lg">
                    {!isGameActive ? (
                        <div className="text-center">
                            <p className="text-xl text-muted-foreground font-body mb-8">Ready to test your knowledge of Egyptian rulers?</p>
                            <EgyptianButton onClick={startGame} size="xl" variant="hero" shimmer>Start Game</EgyptianButton>
                        </div>
                    ) : gameOver ? (
                        <div className="text-center">
                            <h2 className="text-3xl font-display text-terracotta mb-4">Game Over!</h2>
                            <p className="text-2xl text-foreground font-body mb-2">You reached level {level}</p>
                            <p className="text-3xl text-primary font-bold mb-6">Final Score: {score}</p>
                            <div className="flex gap-4 justify-center">
                                <EgyptianButton onClick={startGame} size="lg">Play Again</EgyptianButton>
                                <EgyptianButton onClick={handleReturn} size="lg" variant="outline">Back to Games</EgyptianButton>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2 text-xl"><Crown /> Level {level}</div>
                                <div className="flex items-center gap-2 text-xl"><Trophy /> Score: {score}</div>
                                <div className="flex items-center gap-2 text-xl"><Timer /> Time: {timeLeft}s</div>
                            </div>
                            <motion.div
                                key={currentPharaoh?.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-lg md:text-xl mb-6 text-center italic">{currentPharaoh?.clue}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {options.map((option) => (
                                        <EgyptianButton
                                            key={option}
                                            onClick={() => handleGuess(option)}
                                            className="w-full h-16 text-lg"
                                            variant="outline"
                                        >
                                            {option}
                                        </EgyptianButton>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </EgyptianCard>
            </div>
        </div>
    );
}
