import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TimelineOrderPuzzle } from '../puzzles/TimelineOrderPuzzle';
import { getPuzzleById, MapPuzzle, TimelineOrderData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Clock, History, Trophy, Star, BookOpen } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface OrderOfBuildersGameProps {
    onBack: () => void;
}

const chronicleStages = [
    { id: 'old-kingdom-timeline', intro: "The foundations of eternity. Arrange the events of the Old Kingdom, from the first step pyramid to the final collapse.", victoryTitle: "Old Kingdom Chronicler", victoryDesc: "You have mastered the first great era of Egyptian history." },
    { id: 'middle-kingdom-timeline', intro: "A golden age reborn. Order the monumental achievements of the Middle Kingdom, when the land was reunified and the arts flourished.", victoryTitle: "Middle Kingdom Sage", victoryDesc: "The second great peak of the Nile is clear to you." },
    { id: 'liberation-timeline-game', intro: "The final struggle for freedom. Arrange the events of the war against the Hyksos, leading to the birth of the Great Empire.", victoryTitle: "Chronologist of the Nile", victoryDesc: "You have pieced together the entire broken timeline of history." }
];

export const OrderOfBuildersGame: React.FC<OrderOfBuildersGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentStage, setCurrentStage] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);

    const stage = chronicleStages[currentStage];
    const puzzle = useMemo(() => getPuzzleById(stage.id) as MapPuzzle, [stage.id]);
    const { addScore } = useHighScores();

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

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background relative overflow-hidden">
             {/* Themed background */}
             <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <History className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <EgyptianButton
                        variant="nav"
                        onClick={onBack}
                        className="-ml-4"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Games
                    </EgyptianButton>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
                            <Clock className="text-primary w-4 h-4" />
                            <span className="text-sm font-display text-gold uppercase tracking-widest">ERA {currentStage + 1}/3</span>
                        </div>
                        <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
                            <Trophy className="text-primary w-4 h-4" />
                            <span className="text-sm font-display text-gold uppercase tracking-widest">SCORE: {totalScore}</span>
                        </div>
                    </div>
                </div>

                <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20">
                    {/* Header HUD */}
                    <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <BookOpen className="text-primary" size={20} />
                                <span className="font-display text-gold">Historical Records</span>
                                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <div
                                        className="h-full bg-primary shadow-gold-glow transition-all duration-500"
                                        style={{ width: `${((currentStage) / chronicleStages.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-turquoise" size={20} />
                                <span className="font-display text-gold text-lg">Era {currentStage + 1}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <h2 className="text-xl font-display text-gold-gradient leading-none">{puzzle.title}</h2>
                            <p className="text-xs text-muted-foreground font-body mt-1 italic">Chronicles of the Nile</p>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm">
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
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Clock size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Chronology</h4>
                            <p className="text-xs text-muted-foreground mt-1">Reconstruct the sequence of divine reigns and monumental builds.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><History size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Ancient Eras</h4>
                            <p className="text-xs text-muted-foreground mt-1">Journey from the Old Kingdom foundations to the glorious Empire age.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Star size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Precision</h4>
                            <p className="text-xs text-muted-foreground mt-1">Order the events without error to receive the Scribe's highest commendation.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title={puzzle.title}
                  description={stage.intro}
                  actionLabel="Begin Era"
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

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
