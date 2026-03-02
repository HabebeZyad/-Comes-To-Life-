import React, { useState } from 'react';
import { LogicFragmentsPuzzle } from '../puzzles/LogicFragmentsPuzzle';
import { getPuzzleById, StoryPuzzle, LogicFragmentsData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, BookOpen, ScrollText } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';
import { AnimatePresence } from 'framer-motion';

interface ScribesLostJournalGameProps {
    onBack: () => void;
}

export const ScribesLostJournalGame: React.FC<ScribesLostJournalGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory'>('intro');
    const [score, setScore] = useState(0);
    const puzzle = getPuzzleById('scribes-journal-1') as StoryPuzzle;
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setScore(points);
        addScore({
            playerName: 'Researcher',
            score: points,
            game: 'scribes-journal',
            details: 'Lost Journal Restored'
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
                <BookOpen className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
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
                    <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">The Scribe's Lost Journal</h1>
                    <p className="text-xl text-muted-foreground font-body italic">"Fragments of the past, reassembled by logic."</p>
                </div>

                <EgyptianCard variant="tomb" padding="lg" className="border-gold/30">
                    <LogicFragmentsPuzzle
                        puzzle={{
                            ...puzzle,
                            data: puzzle.data as LogicFragmentsData
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
                  title="The Scribe's Trial"
                  description="A sacred journal has been shattered by time. Use the discovered clues to piece together the logical sequence of events from this ancient expedition."
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="Historian's Insight"
                  description="The journal is complete once more. Your logical deduction has preserved a vital piece of Egyptian history."
                  score={score}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: score },
                    { label: 'Rank', value: 'Keeper of Records' }
                  ]}
                  actionLabel="Restore Again"
                  onAction={() => window.location.reload()}
                  onSecondaryAction={onBack}
                />
              )}
            </AnimatePresence>
        </div>
    );
};

export default ScribesLostJournalGame;
