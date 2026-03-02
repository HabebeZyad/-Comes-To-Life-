import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LocationMatchPuzzle } from '../puzzles/LocationMatchPuzzle';
import { getPuzzleById, MapPuzzle, LocationMatchData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Map, Compass, Trophy, Star } from 'lucide-react';
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
    const puzzle = useMemo(() => getPuzzleById(region.id) as MapPuzzle, [region.id]);
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

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <EgyptianButton
                        variant="nav"
                        onClick={onBack}
                        className="-ml-4"
                    >
                        <ArrowLeft size={20} className="mr-2" /> Back to Games
                    </EgyptianButton>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
                            <Map className="text-primary w-4 h-4" />
                            <span className="text-sm font-display text-gold uppercase tracking-widest">REGION {currentRegion + 1}/3</span>
                        </div>
                        <div className="px-4 py-2 bg-obsidian/60 border border-gold/30 rounded-full flex items-center gap-2">
                            <Trophy className="text-primary w-4 h-4" />
                            <span className="text-sm font-display text-gold uppercase tracking-widest">SCORE: {totalScore}</span>
                        </div>
                    </div>
                </div>

                <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/20">
                    {/* Header HUD */}
                    <div className="p-4 border-b border-gold/10 bg-gold/5 flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <Compass className="text-primary" size={20} />
                                <span className="font-display text-gold">Exploration</span>
                                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <div
                                        className="h-full bg-primary shadow-gold-glow transition-all duration-500"
                                        style={{ width: `${((currentRegion) / trailRegions.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="text-turquoise" size={20} />
                                <span className="font-display text-gold text-lg">Region {currentRegion + 1}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <h2 className="text-xl font-display text-gold-gradient leading-none">{puzzle.title}</h2>
                            <p className="text-xs text-muted-foreground font-body mt-1 italic">The Pyramid Trail Expedition</p>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm">
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
                    </div>
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Compass size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Cartography</h4>
                            <p className="text-xs text-muted-foreground mt-1">Place the sacred monuments in their correct historical locations on the royal map.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Map size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">The Royal Road</h4>
                            <p className="text-xs text-muted-foreground mt-1">Journey from the first Step Pyramid to the world-changing Giza plateau.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Trophy size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Discovery Logs</h4>
                            <p className="text-xs text-muted-foreground mt-1">Solve the map with high precision to unlock the explorer's lost records.</p>
                        </div>
                    </div>
                </div>
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
