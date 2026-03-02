import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FigureMatchPuzzle } from '../puzzles/FigureMatchPuzzle';
import { getPuzzleById, MapPuzzle, FigureMatchData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Users, ScrollText } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface GreatMindsGameProps {
    onBack: () => void;
}

const mindStages = [
    { id: 'architect-achievements', intro: "The records of the Old Kingdom have been scrambled. Reconnect the legendary figures—Pharaohs, Viziers, and Architects—with their eternal achievements.", victoryDesc: "The deeds of the early masters are preserved." },
    { id: 'middle-kingdom-figures', intro: "The Golden Age of the Middle Kingdom brought new giants of history. Match the reunifiers and conquerors to their monumental deeds.", victoryDesc: "The legacy of the Middle Kingdom builders is secure." }
];

export const GreatMindsGame: React.FC<GreatMindsGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentStage, setCurrentStage] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);

    const stage = mindStages[currentStage];
    const puzzle = getPuzzleById(stage.id) as MapPuzzle;
    const { addScore } = useHighScores();

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

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background relative overflow-hidden">
             {/* Themed background */}
             <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-8">
                    <EgyptianButton
                        variant="nav"
                        onClick={onBack}
                        className="mb-4 -ml-4"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Games
                    </EgyptianButton>
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">The Great Minds</h1>
                            <p className="text-xl text-muted-foreground font-body italic">"To know the builder is to understand the stone."</p>
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
                        <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase">Volume {currentStage + 1}/2</span>
                    </div>
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
                </EgyptianCard>
            </div>

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="The Scribe's Roll"
                  description={stage.intro}
                  actionLabel="Begin Entry"
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Records Restored!"
                  description={stage.victoryDesc}
                  stats={[
                    { label: 'Volume Score', value: currentScore },
                    { label: 'Total Score', value: totalScore }
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
                    { label: 'Rank', value: 'Grand Vizier of Knowledge' }
                  ]}
                  actionLabel="Scribe Again"
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

export default GreatMindsGame;
