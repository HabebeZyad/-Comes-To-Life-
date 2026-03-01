import React from 'react';
import { FigureMatchPuzzle } from '../puzzles/FigureMatchPuzzle';
import { getPuzzleById, MapPuzzle } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Users } from 'lucide-react';

import { useHighScores } from '@/hooks/useHighScores';

interface GreatMindsGameProps {
    onBack: () => void;
}

export const GreatMindsGame: React.FC<GreatMindsGameProps> = ({ onBack }) => {
    const puzzle = getPuzzleById('architect-achievements') as MapPuzzle;
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        addScore({
            playerName: 'Sage',
            score: points,
            game: 'great-minds',
            details: 'Achievements matched'
        });
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <EgyptianButton
                        variant="nav"
                        onClick={onBack}
                        className="mb-4 -ml-4"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Games
                    </EgyptianButton>
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">The Great Minds</h1>
                    <p className="text-xl text-muted-foreground font-body">Match Old Kingdom figures to their achievements</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg">
                    <FigureMatchPuzzle
                        puzzle={{
                            ...puzzle,
                            data: puzzle.data as any
                        }}
                        onSolve={handleSolve}
                        onClose={onBack}
                        isEmbed={true}
                    />
                </EgyptianCard>
            </div>
        </div>
    );
};

export default GreatMindsGame;
