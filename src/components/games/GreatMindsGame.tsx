import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { FigureMatchPuzzle } from '../puzzles/FigureMatchPuzzle';
import { getPuzzleById, MapPuzzle, FigureMatchData } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { ArrowLeft, Users, ScrollText, Trophy, Star, BookOpen } from 'lucide-react';
import { GameOverlay } from './GameOverlay';
import { useHighScores } from '@/hooks/useHighScores';

interface GreatMindsGameProps {
    onBack: () => void;
}

const mindStages = [
    { id: 'architect-achievements', intro: "The records of the Old Kingdom have been scrambled. Reconnect the legendary figures—Pharaohs, Viziers, and Architects—with their eternal achievements.", victoryDesc: "The deeds of the early masters are preserved." },
    { id: 'middle-kingdom-figures', intro: "The Golden Age of the Middle Kingdom brought new giants of history. Match the reunifiers and conquerors to their monumental deeds.", victoryDesc: "The legacy of the Middle Kingdom builders is secure." }
];

export const GreatMindsGame: React.FC<GreatMindsGameProps> = ({ onBack }) => {
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'levelUp' | 'victory'>('intro');
    const [currentStage, setCurrentStage] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [currentScore, setCurrentScore] = useState(0);

    const stage = mindStages[currentStage];
    const puzzle = useMemo(() => getPuzzleById(stage.id) as MapPuzzle, [stage.id]);
    const { addScore } = useHighScores();

    if (!puzzle) return <div>Puzzle not found</div>;

    const handleSolve = (points: number) => {
        setCurrentScore(points);
        const newTotal = totalScore + points;
        setTotalScore(newTotal);

        if (currentStage < mindStages.length - 1) {
            setGameState('levelUp');
        } else {
            addScore({
                playerName: 'Sage',
                score: newTotal,
                game: 'great-minds',
                details: 'Hall of Records Mastered'
            });
            setGameState('victory');
        }
    };

    const startGame = () => {
        setGameState('playing');
    };

    const nextStage = () => {
        setCurrentStage(prev => prev + 1);
        setGameState('intro');
    };

    return (
        <div className="min-h-screen pt-20 pb-12 px-4 bg-background relative overflow-hidden">
             {/* Themed background */}
             <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper.png')]" />
                <Users className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px]" />
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
                            <ScrollText className="text-primary w-4 h-4" />
                            <span className="text-sm font-display text-gold uppercase tracking-widest">VOLUME {currentStage + 1}/2</span>
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
                                <BookOpen className="text-primary" size={20} />
                                <span className="font-display text-gold">Hall of Records</span>
                                <div className="w-32 h-3 bg-obsidian/60 rounded-full border border-gold/20 overflow-hidden relative">
                                    <div
                                        className="h-full bg-primary shadow-gold-glow transition-all duration-500"
                                        style={{ width: `${((currentStage) / mindStages.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="text-turquoise" size={20} />
                                <span className="font-display text-gold text-lg">Investigating Volume {currentStage + 1}</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <h2 className="text-xl font-display text-gold-gradient leading-none">{puzzle.title}</h2>
                            <p className="text-xs text-muted-foreground font-body mt-1 italic">Great Minds Investigation</p>
                        </div>
                    </div>

                    <div className="p-8 bg-obsidian/40 backdrop-blur-sm">
                        <FigureMatchPuzzle
                            key={stage.id}
                            puzzle={{
                                ...puzzle,
                                data: puzzle.data as FigureMatchData
                            }}
                            onSolve={handleSolve}
                            onClose={onBack}
                            isEmbed={true}
                        />
                    </div>
                </EgyptianCard>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 font-body">
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary"><Users size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Sacred Identities</h4>
                            <p className="text-xs text-muted-foreground mt-1">Match the great architects, pharaohs, and sages to their eternal deeds.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-turquoise/20 rounded-lg text-turquoise"><ScrollText size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Ancient Scrolls</h4>
                            <p className="text-xs text-muted-foreground mt-1">Reconstruct the scrambled records of the Old and Middle Kingdoms.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-obsidian/40 border border-gold/10 rounded-xl flex items-start gap-3">
                        <div className="p-2 bg-gold/20 rounded-lg text-gold"><Trophy size={20}/></div>
                        <div>
                            <h4 className="text-gold font-display text-sm uppercase tracking-widest">Sage Rank</h4>
                            <p className="text-xs text-muted-foreground mt-1">Achieve 80% accuracy in your identifications to be granted the title of High Sage.</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
              {gameState === 'intro' && (
                <GameOverlay
                  type="intro"
                  title="The Scribe's Roll"
                  description={stage.intro}
                  actionLabel="Begin Entry"
                  onAction={startGame}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'levelUp' && (
                <GameOverlay
                  type="levelup"
                  title="Records Restored!"
                  description={stage.victoryDesc}
                  stats={[
                    { label: 'Volume Score', value: currentScore },
                    { label: 'Total Score', value: totalScore }
                  ]}
                  actionLabel="Next Volume"
                  onAction={nextStage}
                  onSecondaryAction={onBack}
                />
              )}

              {gameState === 'victory' && (
                <GameOverlay
                  type="victory"
                  title="High Sage of History"
                  description="The deeds of the great minds are no longer forgotten. The Hall of Records stands complete in your honor."
                  score={totalScore}
                  stars={5}
                  stats={[
                    { label: 'Final Score', value: totalScore },
                    { label: 'Rank', value: 'Grand Vizier of Knowledge' }
                  ]}
                  actionLabel="Scribe Again"
                  onAction={() => {
                    setCurrentStage(0);
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

export default GreatMindsGame;
