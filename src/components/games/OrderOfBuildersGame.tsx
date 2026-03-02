import React, { useState } from 'react';
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

export const OrderOfBuildersGame: React.FC<OrderOfBuildersGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
    const [score, setScore] = useState(0);
    const puzzle = getPuzzleById('old-kingdom-timeline') as MapPuzzle;
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setScore(points);
        addScore({
            playerName: 'Chronologer',
            score: points,
            game: 'order-builders',
            details: 'Chronology mastered'
        });
        setGameState('victory');
    };

    const startGame = () => {
        setGameState('playing');
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
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">Order of the Builders</h1>
                    <p className="text-xl text-muted-foreground font-body italic">"Time flows like the Nile; only the wise can trace its source."</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg" className="border-gold/30">
                    <TimelineOrderPuzzle
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
                  title="The Chronology Trial"
                  description="Restore the fragmented timeline of the Old Kingdom. Arrange the sacred events from the earliest foundations to the height of the pyramid age."
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Chronology Mastered"
                  description="The flow of time has been restored. You have correctly ordered the monumental events of the Old Kingdom."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Rank', value: 'Master Scribe' }
                  ]}
                  actionLabel="Order Again"
                  onAction={() => window.location.reload()}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
        </div>
    );
};

export default OrderOfBuildersGame;
