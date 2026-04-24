import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LocationMatchPuzzle } from '../puzzles/LocationMatchPuzzle';
import { getPuzzleById, MapPuzzle, LocationMatchData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Map, Compass, Trophy, Star, Shield, Zap, Info, Clock } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface PyramidTrailGameProps {
    onBack: () => void;
}

const trailRegions = [
    {
        id: 'pyramid-locations-saqqara',
        name: 'Saqqara Necropolis',
        intro: "The path begins at Saqqara, where the first stone pyramid rose. Locate the early monuments that paved the way for the Pharaohs' glory.",
        victoryDesc: "You have mapped the foundations of the pyramid age.",
        difficulty: 'Initiate'
    },
    {
        id: 'pyramid-locations-dahshur',
        name: 'Dahshur Royal Road',
        intro: "Follow the Royal Road south to Dahshur. Here, Sneferu experimented with the angles of eternity to create the first true pyramids.",
        victoryDesc: "The engineering secrets of the Old Kingdom are yours.",
        difficulty: 'Adept'
    },
    {
        id: 'pyramid-locations-giza',
        name: 'Giza Plateau',
        intro: "The final destination: Giza. Place the most iconic monuments in human history upon the sacred plateau.",
        victoryDesc: "The entire landscape of eternity is now complete.",
        difficulty: 'Master'
    }
];

export const PyramidTrailGame: React.FC<PyramidTrailGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentRegion, setCurrentRegion] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    const region = trailRegions[currentRegion];
    const puzzle = useMemo(() => getPuzzleById(region.id) as MapPuzzle, [region.id]);
    const { addScore } = useHighScores();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (gameState === 'playing') {
            interval = setInterval(() => setTimeElapsed(prev => prev + 1), 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState]);

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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background relative overflow-hidden">
            {/* Themed background */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <EgyptianButton
                            variant="nav"
                            onClick={onBack}
                            className="-ml-4 mb-2"
                        >
                            <ArrowLeft size={20} className="mr-2" /> Back to Games
                        </EgyptianButton>
                        <h1 className="text-4xl font-display text-gold-gradient">The Pyramid Trail</h1>
                        <p className="text-muted-foreground font-body">Map the eternal monuments across the Nile Valley</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <Map size={12} className="text-primary" /> Region
                            </div>
                            <div className="text-xl font-bold text-primary">{currentRegion + 1}/3</div>
                        </div>
                        <div className="bg-obsidian/60 border border-gold/20 px-4 py-2 rounded-lg text-center min-w-[100px]">
                            <div className="text-[10px] uppercase text-muted-foreground flex items-center justify-center gap-1">
                                <Trophy size={12} className="text-turquoise" /> Score
                            </div>
                            <div className="text-xl font-bold text-turquoise">{totalScore}</div>
                        </div>
                    </div>
                </div>

                <EgyptianCard variant="tomb" padding="none" className="relative overflow-hidden shadow-2xl border-2 border-gold/30">
                    {/* Professional Game HUD */}
                    <div className="p-4 border-b border-gold/20 bg-black/60 flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/20 rounded-lg">
                                    <Compass className="text-primary" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest leading-none mb-1">Status</div>
                                    <div className="font-display text-gold text-sm uppercase">Expedition Active</div>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-gold/10 hidden sm:block" />

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-turquoise/20 rounded-lg">
                                    <Clock className="text-turquoise" size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest leading-none mb-1">Time Elapsed</div>
                                    <div className="font-mono text-turquoise text-lg leading-none">{formatTime(timeElapsed)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <div className="text-[10px] text-muted-foreground uppercase font-display tracking-widest mb-1">Current Region</div>
                                <div className="font-display text-gold-light text-lg leading-none">{region.name}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-48 h-2 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <motion.div
                                        className="h-full bg-primary shadow-gold-glow"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${((currentRegion + (gameState === 'playing' ? 0.5 : 1)) / trailRegions.length) * 100}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                <span className="text-[10px] text-gold/60 mt-1 uppercase font-display tracking-tighter">Exploration Progress</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm min-h-[500px] flex flex-col items-center justify-center">
                        {gameState === 'playing' ? (
                            <div className="w-full">
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
                        ) : (
                            <div className="text-center space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-12 border border-gold/20 rounded-2xl bg-black/40 max-w-2xl mx-auto"
                                >
                                    <Compass className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
                                    <h2 className="text-3xl font-display text-gold mb-4">{region.name}</h2>
                                    <p className="text-muted-foreground mb-8 text-lg font-body leading-relaxed">
                                        {region.intro}
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <EgyptianButton variant="hero" onClick={startGame}>
                                            Begin Region
                                        </EgyptianButton>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>

                    {/* Meta Info Footer */}
                    <div className="p-4 bg-black/60 border-t border-gold/20 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} className="text-primary" />
                            <span className="text-[10px] text-muted-foreground uppercase">Difficulty:</span>
                            <span className="text-xs font-display text-gold">{region.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star size={16} className="text-turquoise" />
                            <span className="text-[10px] text-muted-foreground uppercase">Reward:</span>
                            <span className="text-xs font-display text-turquoise">Explorer Badge</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-gold" />
                            <span className="text-[10px] text-muted-foreground uppercase">Multiplier:</span>
                            <span className="text-xs font-display text-gold">1.5x</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info size={16} className="text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground uppercase">Goal:</span>
                            <span className="text-xs font-display text-white">80% Accuracy</span>
                        </div>
                    </div>
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Compass size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Cartography</h4>
                            <p className="text-xs text-muted-foreground mt-1">Place the sacred monuments in their correct historical locations on the royal map.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><Map size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">The Royal Road</h4>
                            <p className="text-xs text-muted-foreground mt-1">Journey from the first Step Pyramid to the world-changing Giza plateau.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Trophy size={20} /></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Discovery Logs</h4>
                            <p className="text-xs text-muted-foreground mt-1">Solve the map with high precision to unlock the explorer's lost records.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {gameState === 'levelUp' && (
                    <GameOverlay
                        type="levelup"
                        title="Region Mapped!"
                        description={region.victoryDesc}
                        stats={[
                            { label: 'Region Score', value: currentScore },
                            { label: 'Time', value: formatTime(timeElapsed) }
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
                            { label: 'Total Time', value: formatTime(timeElapsed) },
                            { label: 'Rank', value: 'Master of Geography' }
                        ]}
                        actionLabel="Map Again"
                        onAction={() => {
                            setCurrentRegion(0);
                            setTotalScore(0);
                            setTimeElapsed(0);
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
