import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Map } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';

interface MummyMazeGameProps {
    onBack: () => void;
}

export function MummyMazeGame({ onBack }: MummyMazeGameProps) {
    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg"
                    >
                        <ArrowLeft size={20} /> Back to Games
                    </button>

                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">
                        Mummy Maze Runner
                    </h1>
                    <p className="text-xl text-muted-foreground font-body">
                        Navigate the tomb labyrinth while escaping the pursuing mummy
                    </p>
                </div>

                <EgyptianCard variant="tomb" padding="lg">
                    <div className="text-center py-12">
                        <div className="text-8xl mb-6">🧟</div>
                        <h2 className="text-4xl font-display text-gold-gradient mb-6">Coming Soon!</h2>
                        <p className="text-xl text-muted-foreground font-body mb-4">
                            The mummy is still waking up. Check back later to navigate the labyrinth!
                        </p>
                    </div>
                </EgyptianCard>
            </div>
        </div>
    );
}
