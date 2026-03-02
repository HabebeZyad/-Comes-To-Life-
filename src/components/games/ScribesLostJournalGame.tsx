import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogicFragmentsPuzzle } from '../puzzles/LogicFragmentsPuzzle';
import { getPuzzleById, StoryPuzzle, LogicFragmentsData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, BookOpen, ScrollText, Trophy, Star, Clock, Shield, Zap, Info, Search } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface ScribesLostJournalGameProps {
    onBack: () => void;
}

export const ScribesLostJournalGame: React.FC<ScribesLostJournalGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
    const [score, setScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const puzzle = getPuzzleById('scribes-journal-1') as StoryPuzzle;
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
        setScore(points);
        addScore({
            playerName: 'Researcher',
            score: points,
            game: 'scribes-journal',
            details: 'Lost Journal Restored'
        });
        setGameState('victory');
    };

    const startGame = () => {
        setGameState('playing');
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
                <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
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
                        <h1 className="text-4xl font-display text-gold-gradient">The Scribe's Lost Journal</h1>
                        <p className="text-muted-foreground font-body italic">"Fragments of the past, reassembled by logic."</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <ScrollText size={12} className="text-primary" /> Record
                            </div>
                            <div className="text-xl font-bold text-primary">I/I</div>
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
                                    <div className="font-display text-gold text-sm uppercase">Fragment Deduction</div>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-gold/10 hidden sm:block" />

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-turquoise/20 rounded-lg">
                                    <Clock className="text-turquoise" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest leading-none mb-1">Time Elapsed</div>
                                    <div className="font-mono text-turquoise text-lg leading-none">{formatTime(timeElapsed)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest mb-1">Journal Origin</div>
                                <div className="font-display text-gold-light text-lg leading-none">Temple of Thoth</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-2 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <motion.div
                                        className="h-full bg-primary shadow-gold-glow"
                                        initial={{ width: 0 }}
                                        animate={{ width: gameState === 'playing' ? '50%' : gameState === 'victory' ? '100%' : '0%' }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <span className="text-[10px] text-gold/60 mt-1 uppercase font-display tracking-tighter">Restoration Progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm min-h-[500px]">
                        <LogicFragmentsPuzzle
                            puzzle={{
                                ...puzzle,
                                data: puzzle.data as LogicFragmentsData
                            }}
                            onSolve={handleSolve}
                            onClose={onBack}
                            isEmbed={true}
                        />
                    </div>

                    {/* Meta Info Footer */}
                    <div className="p-4 bg-black/60 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-primary" />
                            <span className="text-[10px] text-muted-foreground uppercase">Difficulty:</span>
                            <span className="text-xs font-display text-gold">Hard</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-turquoise" />
                            <span className="text-[10px] text-muted-foreground uppercase">Reward:</span>
                            <span className="text-xs font-display text-turquoise">Scribe's Legacy</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-gold" />
                            <span className="text-[10px] text-muted-foreground uppercase">Logic:</span>
                            <span className="text-xs font-display text-gold">Deductive</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={16} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase">Goal:</span>
                            <span className="text-xs font-display text-white">Full Sequence</span>
                        </div>
                    </div>
                </EgyptianCard>
            </div>

            <AnimatePresence>
                {gameState === 'intro' && (
                    <GameOverlay
                        type="intro"
                        title="The Scribe's Trial"
                        description="A sacred journal has been shattered by time. Use the discovered clues to piece together the logical sequence of events from this ancient expedition."
                        onAction={startGame}
                        onSecondaryAction={onBack}
                    />
                )}

                {gameState === 'victory' && (
                    <GameOverlay
                        type="victory"
                        title="Historian's Insight"
                        description="The journal is complete once more. Your logical deduction has preserved a vital piece of Egyptian history."
                        score={score}
                        stars={5}
                        stats={[
                            { label: 'Final Score', value: score },
                            { label: 'Time Taken', value: formatTime(timeElapsed) },
                            { label: 'Rank', value: 'Keeper of Records' }
                        ]}
                        actionLabel="Restore Again"
                        onAction={() => {
                            setScore(0);
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

export default ScribesLostJournalGame;
