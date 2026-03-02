import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
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

const trailRegions = [
    { id: 'pyramid-locations-saqqara', intro: "The path begins at Saqqara, where the first stone pyramid rose. Locate the early monuments that paved the way for the Pharaohs' glory.", victoryDesc: "You have mapped the foundations of the pyramid age." },
    { id: 'pyramid-locations-dahshur', intro: "Follow the Royal Road south to Dahshur. Here, Sneferu experimented with the angles of eternity to create the first true pyramids.", victoryDesc: "The engineering secrets of the Old Kingdom are yours." },
    { id: 'pyramid-locations-giza', intro: "The final destination: Giza. Place the most iconic monuments in human history upon the sacred plateau.", victoryDesc: "The entire landscape of eternity is now complete." }
];

export const PyramidTrailGame: React.FC<PyramidTrailGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentRegion, setCurrentRegion] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);

    const region = trailRegions[currentRegion];
    const puzzle = getPuzzleById(region.id) as MapPuzzle;
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setCurrentScore(points);
        const newTotal = totalScore + points;
        setTotalScore(newTotal);

        if (currentRegion < trailRegions.length - 1) {
            setGameState('levelUp');
        } else {
            addScore({
                playerName: 'Explorer',
                score: newTotal,
                game: 'pyramid-trail',
                details: 'Pyramid Trail Mastered'
            });
            setGameState('victory');
        }
    };

    const startGame = () => {
        setGameState('playing');
    };

    const nextRegion = () => {
        setCurrentRegion(prev => prev + 1);
        setGameState('intro');
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
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-2">The Pyramid Trail</h1>
                            <p className="text-xl text-muted-foreground font-body italic">"Map the landscape of eternity. Know where the kings rest."</p>
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
                        <span className="px-3 py-1 bg-primary/10 rounded-full text-xs font-bold text-primary uppercase">Region {currentRegion + 1}/3</span>
                    </div>
                    <LocationMatchPuzzle
                        key={region.id}
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
                  title={puzzle.title}
                  description={region.intro}
                  actionLabel="Begin Region"
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Region Mapped!"
                  description={region.victoryDesc}
                  stats={[
                    { label: 'Region Score', value: currentScore },
                    { label: 'Total Score', value: totalScore }
                  ]}
                  actionLabel="Next Region"
                  onAction={nextRegion}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="High Cartographer"
                  description="Every sacred site and royal necropolis has been correctly identified. You are a master of the eternal landscape."
                  score={totalScore}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: totalScore },
                    { label: 'Rank', value: 'Master of Geography' }
                  ]}
                  actionLabel="Map Again"
                  onAction={() => {
                    setCurrentRegion(0);
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

export default PyramidTrailGame;
