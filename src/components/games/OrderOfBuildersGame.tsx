import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TimelineOrderPuzzle } from '../puzzles/TimelineOrderPuzzle';
import { getPuzzleById, MapPuzzle, TimelineOrderData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Clock, History, Trophy, Star, BookOpen, Shield, Zap, Info } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface OrderOfBuildersGameProps {
    onBack: () => void;
}

const chronicleStages = [
    {
        id: 'old-kingdom-timeline',
        name: 'Era of the Sun Kings',
        intro: "The foundations of eternity. Arrange the events of the Old Kingdom, from the first step pyramid to the final collapse.",
        victoryTitle: "Old Kingdom Chronicler",
        victoryDesc: "You have mastered the first great era of Egyptian history.",
        difficulty: 'Adept'
    },
    {
        id: 'middle-kingdom-timeline',
        name: 'Age of Reunification',
        intro: "A golden age reborn. Order the monumental achievements of the Middle Kingdom, when the land was reunified and the arts flourished.",
        victoryTitle: "Middle Kingdom Sage",
        victoryDesc: "The second great peak of the Nile is clear to you.",
        difficulty: 'Scholar'
    },
    {
        id: 'liberation-timeline-game',
        name: 'Empire of the Nile',
        intro: "The final struggle for freedom. Arrange the events of the war against the Hyksos, leading to the birth of the Great Empire.",
        victoryTitle: "Chronologist of the Nile",
        victoryDesc: "You have pieced together the entire broken timeline of history.",
        difficulty: 'Grand Scribe'
    }
];

export const OrderOfBuildersGame: React.FC<OrderOfBuildersGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentStage, setCurrentStage] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const stage = chronicleStages[currentStage];
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

        if (currentStage < chronicleStages.length - 1) {
            setGameState('levelUp');
        } else {
            addScore({
                playerName: 'Chronologer',
                score: newTotal,
                game: 'order-builders',
                details: 'Chronology of the Nile Mastered'
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
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background relative overflow-hidden">
            {/* Themed background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <History className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
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
                        <h1 className="text-4xl font-display text-gold-gradient">Chronicles of the Nile</h1>
                        <p className="text-muted-foreground font-body">Reconstruct the sacred timeline of history</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <Clock size={12} className="text-primary" /> Era
                            </div>
                            <div className="text-xl font-bold text-primary">{currentStage + 1}/3</div>
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
                                    <BookOpen className="text-primary" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest leading-none mb-1">Status</div>
                                    <div className="font-display text-gold text-sm uppercase">Scribe Active</div>
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
                                <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest mb-1">Current Chronicle</div>
                                <div className="font-display text-gold-light text-lg leading-none">{stage.name}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-2 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <motion.div
                                        className="h-full bg-primary shadow-gold-glow"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentStage + (gameState === 'playing' ? 0.5 : 1)) / chronicleStages.length) * 100}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <span className="text-[10px] text-gold/60 mt-1 uppercase font-display tracking-tighter">Chronicle Progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center">
                        {gameState === 'playing' ? (
                            <div className="w-full">
                                <TimelineOrderPuzzle
                                    key={stage.id}
                                    puzzle={{
                                        ...puzzle,
                                        data: puzzle.data as TimelineOrderData
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
                                    <History className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                                    <h2 className="text-3xl font-display text-gold mb-4">{stage.name}</h2>
                                    <p className="text-muted-foreground mb-8 text-lg font-body leading-relaxed">
                                        {stage.intro}
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <EgyptianButton variant="hero" onClick={startGame}>
                                            Begin Entry
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
                            <span className="text-[10px] text-muted-foreground uppercase">Difficulty:</span>
                            <span className="text-xs font-display text-gold">{stage.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} className="text-turquoise" />
                            <span className="text-[10px] text-muted-foreground uppercase">Reward:</span>
                            <span className="text-xs font-display text-turquoise">Scribe's Seals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-gold" />
                            <span className="text-[10px] text-muted-foreground uppercase">XP Bonus:</span>
                            <span className="text-xs font-display text-gold">2.0x</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={16} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase">Goal:</span>
                            <span className="text-xs font-display text-white">Full Accuracy</span>
                        </div>
                    </div>
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Clock size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Chronology</h4>
                            <p className="text-xs text-muted-foreground mt-1">Reconstruct the sequence of divine reigns and monumental builds.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><History size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Ancient Eras</h4>
                            <p className="text-xs text-muted-foreground mt-1">Journey from the Old Kingdom foundations to the glorious Empire age.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Star size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Precision</h4>
                            <p className="text-xs text-muted-foreground mt-1">Order the events without error to receive the Scribe's highest commendation.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {gameState === 'levelUp' && (
                    <GameOverlay
                        type="levelup"
                        title="Era Restored!"
                        description={stage.victoryDesc}
                        stats={[
                            { label: 'Era Score', value: currentScore },
                            { label: 'Total Score', value: totalScore }
                        ]}
                        actionLabel="Next Era"
                        onAction={nextStage}
                        onSecondaryAction={onBack}
                    />
                )}

                {gameState === 'victory' && (
                    <GameOverlay
                        type="victory"
                        title="Lord of the Timeline"
                        description="Every era has been restored. You are truly the Grand Chronicler of Egyptian History."
                        score={totalScore}
                        stars={5}
                        stats={[
                            { label: 'Final Score', value: totalScore },
                            { label: 'Rank', value: 'Living God of Wisdom' }
                        ]}
                        actionLabel="Rebuild History"
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

export default OrderOfBuildersGame;
