import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FigureMatchPuzzle } from '../puzzles/FigureMatchPuzzle';
import { getPuzzleById, MapPuzzle, FigureMatchData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Users, ScrollText, Trophy, Star, BookOpen, Shield, Zap, Info, Search } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface GreatMindsGameProps {
    onBack: () => void;
}

const mindStages = [
    {
        id: 'architect-achievements',
        name: 'Masters of the Old Kingdom',
        intro: "The records of the Old Kingdom have been scrambled. Reconnect the legendary figures—Pharaohs, Viziers, and Architects—with their eternal achievements.",
        victoryDesc: "The deeds of the early masters are preserved.",
        difficulty: 'Scholar'
    },
    {
        id: 'middle-kingdom-figures',
        name: 'Giants of the Golden Age',
        intro: "The Golden Age of the Middle Kingdom brought new giants of history. Match the reunifiers and conquerors to their monumental deeds.",
        victoryDesc: "The legacy of the Middle Kingdom builders is secure.",
        difficulty: 'High Sage'
    }
];

export const GreatMindsGame: React.FC<GreatMindsGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentStage, setCurrentStage] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const stage = mindStages[currentStage];
    const puzzle = useMemo(() => getPuzzleById(stage.id) as MapPuzzle, [stage.id]);
    const { addScore } = useHighScores();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState === 'playing') {
            interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState]);

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setCurrentScore(points);
        const newTotal = totalScore + points;
        setTotalScore(newTotal);

        if (currentStage < mindStages.length - 1) {
            setGameState('levelUp');
        } else {
            addScore({
                playerName: 'Sage',
                score: newTotal,
                game: 'great-minds',
                details: 'Hall of Records Mastered'
            });
            setGameState('victory');
        }
    };

    const startGame = () => {
        setGameState('playing');
    };

    const nextStage = () => {
        setCurrentStage(prev => prev + 1);
        setGameState('intro');
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background relative overflow-hidden">
            {/* Themed background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <EgyptianButton
                            variant="nav"
                            onClick={onBack}
                            className="-ml-4 mb-2"
                        >
                            <ArrowLeft size={20} className="mr-2" /> Back to Games
                        </EgyptianButton>
                        <h1 className="text-4xl font-display text-gold-gradient">Hall of Records</h1>
                        <p className="text-muted-foreground font-body">Identify the great minds who built the eternal civilization</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <ScrollText size={12} className="text-primary" /> Volume
                            </div>
                            <div className="text-xl font-bold text-primary">{currentStage + 1}/2</div>
                        </div>
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <Trophy size={12} className="text-turquoise" /> Score
                            </div>
                            <div className="text-xl font-bold text-turquoise">{totalScore}</div>
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
                                    <div className="font-display text-gold text-sm uppercase">Investigating Records</div>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-gold/10 hidden sm:block" />

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-turquoise/20 rounded-lg">
                                    <Star className="text-turquoise" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest leading-none mb-1">Time Elapsed</div>
                                    <div className="font-mono text-turquoise text-lg leading-none">{formatTime(timeElapsed)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest mb-1">Current Volume</div>
                                <div className="font-display text-gold-light text-lg leading-none">{stage.name}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-2 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <motion.div
                                        className="h-full bg-primary shadow-gold-glow"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStage + (gameState === 'playing' ? 0.5 : 1)) / mindStages.length) * 100}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <span className="text-[10px] text-gold/60 mt-1 uppercase font-display tracking-tighter">Investigation Progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center">
                        {gameState === 'playing' ? (
                            <div className="w-full">
                                <FigureMatchPuzzle
                                    key={stage.id}
                                    puzzle={{
                                        ...puzzle,
                                        data: puzzle.data as FigureMatchData
                                    }}
                                    onSolve={handleSolve}
                                    onClose={onBack}
                                    isEmbed={true}
                                />
                            </div>
                        ) : (
                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-12 border border-gold/20 rounded-2xl bg-black/40 max-w-2xl mx-auto"
                                >
                                    <ScrollText className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                                    <h2 className="text-3xl font-display text-gold mb-4">{stage.name}</h2>
                                    <p className="text-muted-foreground mb-8 text-lg font-body leading-relaxed">
                                        {stage.intro}
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <EgyptianButton variant="hero" onClick={startGame}>
                                            Begin Volume
                                        </EgyptianButton>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Meta Info Footer */}
                    <div className="p-4 bg-black/60 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-primary" />
                            <span className="text-[10px] text-muted-foreground uppercase">Rank Required:</span>
                            <span className="text-xs font-display text-gold">{stage.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-turquoise" />
                            <span className="text-[10px] text-muted-foreground uppercase">Record Type:</span>
                            <span className="text-xs font-display text-turquoise">Sacred Identities</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-gold" />
                            <span className="text-[10px] text-muted-foreground uppercase">Focus:</span>
                            <span className="text-xs font-display text-gold">High Precision</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={16} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase">Goal:</span>
                            <span className="text-xs font-display text-white">85% Accuracy</span>
                        </div>
                    </div>
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Users size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Sacred Identities</h4>
                            <p className="text-xs text-muted-foreground mt-1">Match the great architects, pharaohs, and sages to their eternal deeds.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><ScrollText size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Ancient Scrolls</h4>
                            <p className="text-xs text-muted-foreground mt-1">Reconstruct the scrambled records of the Old and Middle Kingdoms.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Trophy size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Sage Rank</h4>
                            <p className="text-xs text-muted-foreground mt-1">Achieve high accuracy to be granted the title of Grand Vizier of Knowledge.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {gameState === 'levelUp' && (
                    <GameOverlay
                        type="levelup"
                        title="Records Restored!"
                        description={stage.victoryDesc}
                        stats={[
                            { label: 'Volume Score', value: currentScore },
                            { label: 'Time', value: formatTime(timeElapsed) }
                        ]}
                        actionLabel="Next Volume"
                        onAction={nextStage}
                        onSecondaryAction={onBack}
                    />
                )}

                {gameState === 'victory' && (
                    <GameOverlay
                        type="victory"
                        title="High Sage of History"
                        description="The deeds of the great minds are no longer forgotten. The Hall of Records stands complete in your honor."
                        score={totalScore}
                        stars={5}
                        stats={[
                            { label: 'Final Score', value: totalScore },
                            { label: 'Total Time', value: formatTime(timeElapsed) },
                            { label: 'Rank', value: 'Grand Vizier of Knowledge' }
                        ]}
                        actionLabel="Scribe Again"
                        onAction={() => {
                            setCurrentStage(0);
                            setTotalScore(0);
                            setTimeElapsed(0);
                            setGameState('intro');
                        }}
                        onSecondaryAction={onBack}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default GreatMindsGame;
