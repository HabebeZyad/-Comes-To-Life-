import React from 'react';
import { LocationMatchPuzzle } from '../puzzles/LocationMatchPuzzle';
import { getPuzzleById, MapPuzzle } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Map } from 'lucide-react';

interface PyramidTrailGameProps {
    onBack: () => void;
}

export const PyramidTrailGame: React.FC<PyramidTrailGameProps> = ({ onBack }) => {
    const puzzle = getPuzzleById('pyramid-locations') as MapPuzzle;

    if (!puzzle) return <div>Puzzle not found</div>;

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
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">The Pyramid Trail</h1>
                    <p className="text-xl text-muted-foreground font-body">Place the great pyramids on the map of Old Kingdom Egypt</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg">
                    <LocationMatchPuzzle
                        puzzle={{
                            ...puzzle,
                            data: puzzle.data as any
                        }}
                        onSolve={(points) => console.log(`Solved for ${points} points`)}
                        onClose={onBack}
                        isEmbed={true}
                    />
                </EgyptianCard>
            </div>
        </div>
    );
};

export default PyramidTrailGame;
