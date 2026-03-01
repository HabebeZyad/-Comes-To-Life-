import React from 'react';
import { TimelineOrderPuzzle } from '../puzzles/TimelineOrderPuzzle';
import { getPuzzleById, MapPuzzle } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Clock } from 'lucide-react';

interface OrderOfBuildersGameProps {
    onBack: () => void;
}

export const OrderOfBuildersGame: React.FC<OrderOfBuildersGameProps> = ({ onBack }) => {
    const puzzle = getPuzzleById('old-kingdom-timeline') as MapPuzzle;

    if (!puzzle) return <div>Puzzle not found</div>;

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-left">
                    <EgyptianButton
                        variant="nav"
                        onClick={onBack}
                        className="mb-4 -ml-4"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Games
                    </EgyptianButton>
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Order of the Builders</h1>
                    <p className="text-xl text-muted-foreground font-body">Arrange Old Kingdom events in chronological order</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg">
                    <TimelineOrderPuzzle
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

export default OrderOfBuildersGame;
