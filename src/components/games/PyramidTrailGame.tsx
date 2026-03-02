import React, { useState } from 'react';
import { LocationMatchPuzzle } from '../puzzles/LocationMatchPuzzle';
import { getPuzzleById, MapPuzzle, LocationMatchData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Map, Compass } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface PyramidTrailGameProps {
    onBack: () => void;
}

export const PyramidTrailGame: React.FC<PyramidTrailGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
    const [score, setScore] = useState(0);
    const puzzle = getPuzzleById('pyramid-locations') as MapPuzzle;
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setScore(points);
        addScore({
            playerName: 'Explorer',
            score: points,
            game: 'pyramid-trail',
            details: 'Pyramids accurately placed'
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
                <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
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
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">The Pyramid Trail</h1>
                    <p className="text-xl text-muted-foreground font-body italic">"Map the landscape of eternity. Know where the kings rest."</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg" className="border-gold/30">
                    <LocationMatchPuzzle
                        puzzle={{
                            ...puzzle,
                            data: puzzle.data as LocationMatchData
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
                  title="The Cartographer's Trial"
                  description="The sacred geography of the Old Kingdom must be preserved. Locate the Great Pyramids and place them correctly upon the map of the Nile."
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Geography Restored"
                  description="The map of the Nile is complete once more. Your knowledge of the sacred landscape is impeccable."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Rank', value: 'High Cartographer' }
                  ]}
                  actionLabel="Map Again"
                  onAction={() => window.location.reload()}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
        </div>
    );
};

export default PyramidTrailGame;
