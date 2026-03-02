import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TimelineOrderPuzzle } from '../puzzles/TimelineOrderPuzzle';
import { getPuzzleById, MapPuzzle, TimelineOrderData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Clock, History } from 'lucide-react';
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
    const puzzle = getPuzzleById(stage.id) as MapPuzzle;
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

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-8 text-left">
                    <EgyptianButton
                        variant="nav"
                        onClick={onBack}
                        className="mb-4 -ml-4"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Games
                    </EgyptianButton>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">Chronicles of the Nile</h1>
                            <p className="text-xl text-muted-foreground font-body italic">"Time flows like the Nile; only the wise can trace its source."</p>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-display text-gold uppercase tracking-widest block">Score</span>
                            <span className="text-3xl font-display text-primary">{totalScore}</span>
                        </div>
                    </div>
                </div>

                <EgyptianCard variant="tomb" padding="lg" className="border-gold/30">
                    <div className="mb-6 flex items-center justify-between border-b border-gold/10 pb-4">
                        <h2 className="text-2xl font-display text-primary">{puzzle.title}</h2>
                        <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase">Era {currentStage + 1}/3</span>
                    </div>
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
                </EgyptianCard>
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
