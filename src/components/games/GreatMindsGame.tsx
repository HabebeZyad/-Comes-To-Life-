import React, { useState } from 'react';
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

export const GreatMindsGame: React.FC<GreatMindsGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
    const [score, setScore] = useState(0);
    const puzzle = getPuzzleById('architect-achievements') as MapPuzzle;
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setScore(points);
        addScore({
            playerName: 'Sage',
            score: points,
            game: 'great-minds',
            details: 'Achievements matched'
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
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">The Great Minds</h1>
                    <p className="text-xl text-muted-foreground font-body italic">"To know the builder is to understand the stone."</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg" className="border-gold/30">
                    <FigureMatchPuzzle
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
                  description="The records of the Old Kingdom have been scrambled. Reconnect the legendary figures—Pharaohs, Viziers, and Architects—with their eternal achievements."
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Records Restored"
                  description="The great deeds of the past have been correctly attributed. The Hall of Records is complete."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Rank', value: 'High Sage' }
                  ]}
                  actionLabel="Scribe Again"
                  onAction={() => window.location.reload()}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
        </div>
    );
};

export default GreatMindsGame;
