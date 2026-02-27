import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, X, RotateCcw, Lightbulb, Map } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { TerritoryClaimData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: TerritoryClaimData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function TerritoryClaimPuzzle({ puzzle, onSolve, onClose }: Props) {
  const [territoryAssignments, setTerritoryAssignments] = useState<Record<string, string>>({});
  const [selectedRuler, setSelectedRuler] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleTerritoryClick = (territoryId: string) => {
    if (revealed || !selectedRuler) return;

    setTerritoryAssignments(prev => ({
      ...prev,
      [territoryId]: selectedRuler
    }));
  };

  const handleRulerSelect = (rulerId: string) => {
    if (revealed) return;
    setSelectedRuler(rulerId === selectedRuler ? null : rulerId);
  };

  const handleCheck = useCallback(() => {
    let correctCount = 0;
    puzzle.data.territories.forEach(territory => {
      if (territoryAssignments[territory.id] === territory.correctRuler) {
        correctCount++;
      }
    });

    const accuracy = correctCount / puzzle.data.territories.length;
    const earnedPoints = Math.round(puzzle.points * accuracy);
    setScore(earnedPoints);
    setRevealed(true);

    if (accuracy >= 0.8) {
      setTimeout(() => onSolve(earnedPoints), 2000);
    }
  }, [territoryAssignments, puzzle, onSolve]);

  const handleReset = () => {
    setTerritoryAssignments({});
    setSelectedRuler(null);
    setRevealed(false);
    setScore(0);
    setHintsUsed(0);
  };

  const handleHint = () => {
    if (hintsUsed < puzzle.data.territories.length) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  const getRulerById = (id: string) => puzzle.data.rulers.find(r => r.id === id);
  const getTerritoryById = (id: string) => puzzle.data.territories.find(t => t.id === id);

  const isTerritoryCorrect = (territoryId: string) => {
    const territory = getTerritoryById(territoryId);
    return revealed && territory && territoryAssignments[territoryId] === territory.correctRuler;
  };

  const isTerritoryIncorrect = (territoryId: string) => {
    const territory = getTerritoryById(territoryId);
    return revealed && territory && territoryAssignments[territoryId] &&
           territoryAssignments[territoryId] !== territory.correctRuler;
  };

  const allAssigned = Object.keys(territoryAssignments).length === puzzle.data.territories.length;

  return (
    <EgyptianCard variant="tomb" className="max-w-4xl mx-auto">
      <EgyptianCardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
              <Crown className="w-5 h-5" />
              {puzzle.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{puzzle.description}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`text-xs font-display uppercase ${difficultyColors[puzzle.difficulty]}`}>
                {puzzle.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">
                {puzzle.points} pts
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenario */}
        <div className="bg-gradient-to-br from-gold/10 to-transparent rounded-lg p-4 border border-gold/30">
          <p className="font-body text-lg text-foreground italic">
            {puzzle.data.scenario}
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-primary/10 rounded-lg p-3 text-sm">
          <p className="text-foreground/80">
            <strong>Select a ruler</strong>, then click territories to assign them.
            Each territory must be claimed by its rightful ruler.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Rulers */}
          <div>
            <h4 className="font-display text-sm text-muted-foreground mb-3">Rulers</h4>
            <div className="space-y-2">
              {puzzle.data.rulers.map((ruler) => {
                const isSelected = selectedRuler === ruler.id;

                return (
                  <motion.button
                    key={ruler.id}
                    onClick={() => handleRulerSelect(ruler.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-gold/50"
                    )}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={revealed}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                        style={{ backgroundColor: ruler.color, borderColor: ruler.color }}
                      >
                        <Crown className="w-3 h-3 text-white" />
                      </div>
                      <div className="font-display font-semibold">{ruler.name}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Map Area */}
          <div className="md:col-span-2">
            <h4 className="font-display text-sm text-muted-foreground mb-3">Territories to Claim</h4>
            <div className="relative aspect-[4/3] bg-gradient-to-br from-sandstone via-sandstone-light to-terracotta/20 rounded-lg border-2 border-sandstone overflow-hidden">
              {/* Professional Egyptian Cartography */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
                <defs>
                  {/* Ultra-Realistic Territory Map Patterns */}
                  <pattern id="territoryDesertPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                    <defs>
                      <radialGradient id="territorySandGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(38 35% 75%)" stopOpacity="0.9"/>
                        <stop offset="70%" stopColor="hsl(35 40% 65%)" stopOpacity="0.8"/>
                        <stop offset="100%" stopColor="hsl(32 45% 55%)" stopOpacity="0.6"/>
                      </radialGradient>
                    </defs>
                    <rect width="12" height="12" fill="url(#territorySandGradient)"/>
                    <path d="M0,8 Q3,6 6,7 Q9,5 12,6 L12,12 L0,12 Z" fill="hsl(35 30% 60%)" opacity="0.4"/>
                    <path d="M2,10 Q5,8 8,9 Q11,7 12,8 L12,12 L2,12 Z" fill="hsl(35 25% 55%)" opacity="0.3"/>
                    <circle cx="3" cy="4" r="0.3" fill="hsl(38 40% 70%)" opacity="0.6"/>
                    <circle cx="8" cy="5" r="0.25" fill="hsl(38 40% 70%)" opacity="0.5"/>
                  </pattern>

                  <linearGradient id="territoryNileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="hsl(185 85% 35%)" stopOpacity="0.95"/>
                    <stop offset="15%" stopColor="hsl(180 80% 40%)" stopOpacity="0.9"/>
                    <stop offset="35%" stopColor="hsl(175 75% 45%)" stopOpacity="0.8"/>
                    <stop offset="60%" stopColor="hsl(170 70% 42%)" stopOpacity="0.7"/>
                    <stop offset="85%" stopColor="hsl(165 65% 38%)" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="hsl(160 60% 35%)" stopOpacity="0.5"/>
                  </linearGradient>

                  <pattern id="territoryNilePattern" patternUnits="userSpaceOnUse" width="6" height="6">
                    <rect width="6" height="6" fill="url(#territoryNileGradient)"/>
                    <path d="M0,2 Q2,1.5 4,2 Q6,1.5 6,2 L6,4 Q6,3.5 4,4 Q2,3.5 0,4 Z" fill="hsl(185 90% 50%)" opacity="0.4">
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; -2,0; 0,0"
                        dur="3s"
                        repeatCount="indefinite"
                      />
                    </path>
                    <path d="M0,4 Q1.5,3.5 3,4 Q4.5,3.5 6,4 L6,6 Q6,5.5 4.5,6 Q3,5.5 1.5,6 Q0,5.5 0,6 Z" fill="hsl(180 85% 55%)" opacity="0.3">
                      <animateTransform
                        attributeName="transform"
                        type="translate"
                        values="0,0; 2,0; 0,0"
                        dur="4s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </pattern>

                  <pattern id="territoryOasisPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                    <circle cx="4" cy="4" r="3.5" fill="hsl(165 70% 35%)" opacity="0.8"/>
                    <path d="M4,2 Q3.5,1.5 4,1 Q4.5,1.5 4,2" fill="hsl(25 60% 30%)" opacity="0.8"/>
                    <rect x="3.8" y="2" width="0.4" height="2" fill="hsl(25 60% 30%)"/>
                    <circle cx="4" cy="5.5" r="1" fill="hsl(185 80% 45%)" opacity="0.6"/>
                  </pattern>

                  <pattern id="territoryFertilePattern" patternUnits="userSpaceOnUse" width="10" height="10">
                    <rect width="10" height="10" fill="hsl(85 45% 45%)" opacity="0.8"/>
                    <rect x="1" y="1" width="3" height="3" fill="hsl(90 50% 50%)" opacity="0.4"/>
                    <rect x="5" y="1" width="3" height="3" fill="hsl(95 45% 55%)" opacity="0.35"/>
                    <rect x="1" y="5" width="3" height="3" fill="hsl(85 55% 45%)" opacity="0.45"/>
                    <rect x="5" y="5" width="3" height="3" fill="hsl(80 50% 50%)" opacity="0.4"/>
                  </pattern>

                  <pattern id="territoryMountainPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                    <rect width="12" height="12" fill="hsl(25 45% 45%)" opacity="0.8"/>
                    <polygon points="0,12 4,8 8,9 12,7 12,12" fill="hsl(25 40% 45%)" opacity="0.6"/>
                    <polygon points="0,12 3,9 6,10 9,8 12,9 12,12" fill="hsl(25 35% 40%)" opacity="0.5"/>
                  </pattern>
                </defs>

                {/* Ultra-Realistic Eastern Desert */}
                <rect x="70" y="0" width="30" height="100" fill="url(#territoryDesertPattern)"/>
                <path d="M70,0 L100,15 L100,85 L80,100 L70,95 Z" fill="url(#territoryDesertPattern)" opacity="0.95"/>
                {/* Enhanced Eastern Mountain Ranges */}
                <path d="M75,45 Q80,40 85,43 Q90,38 95,41 Q100,37 105,40 L105,65 Q100,63 95,67 Q90,63 85,65 Q80,61 75,63 Z" fill="url(#territoryMountainPattern)" opacity="0.6"/>
                <path d="M78,20 Q85,15 92,18 Q99,13 105,16 L105,35 Q99,33 92,37 Q85,33 78,36 Z" fill="url(#territoryMountainPattern)" opacity="0.4"/>

                {/* Ultra-Realistic Western Desert */}
                <rect x="0" y="0" width="30" height="100" fill="url(#territoryDesertPattern)"/>
                <path d="M30,0 L0,10 L0,90 L25,100 L30,98 Z" fill="url(#territoryDesertPattern)" opacity="0.85"/>
                {/* Western Desert Mountain Ranges */}
                <path d="M5,40 Q10,35 15,38 Q20,33 25,36 Q30,32 35,35 L35,55 Q30,53 25,57 Q20,53 15,55 Q10,51 5,53 Z" fill="url(#territoryMountainPattern)" opacity="0.5"/>
                <path d="M2,70 Q8,65 14,68 Q20,63 26,66 L26,85 Q20,83 14,87 Q8,83 2,86 Z" fill="url(#territoryMountainPattern)" opacity="0.35"/>

                {/* Hyper-Detailed Fertile Nile Valley */}
                <rect x="30" y="0" width="40" height="100" fill="url(#territoryFertilePattern)"/>
                <rect x="35" y="0" width="30" height="100" fill="url(#territoryFertilePattern)" opacity="0.9"/>
                <rect x="40" y="0" width="20" height="100" fill="url(#territoryFertilePattern)" opacity="0.95"/>
                {/* Additional Agricultural Detail */}
                <rect x="32" y="10" width="4" height="4" fill="hsl(90 45% 50%)" opacity="0.6"/>
                <rect x="40" y="20" width="3" height="3" fill="hsl(85 50% 45%)" opacity="0.5"/>
                <rect x="36" y="40" width="5" height="5" fill="hsl(95 40% 55%)" opacity="0.4"/>
                <rect x="42" y="60" width="4" height="4" fill="hsl(80 45% 50%)" opacity="0.55"/>
                <rect x="37" y="80" width="3" height="3" fill="hsl(90 50% 45%)" opacity="0.45"/>
                <rect x="44" y="95" width="4" height="4" fill="hsl(85 40% 50%)" opacity="0.5"/>

                {/* Ultra-Realistic Nile River with Flow Animation */}
                <path
                  d="M50,5 Q51,15 50,25 Q49,35 50,45 Q51,55 50,65 Q49,75 50,85 Q51,95 50,100"
                  fill="none"
                  stroke="url(#territoryNileGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Animated Nile Flow Effect */}
                <path
                  d="M50,5 Q51,15 50,25 Q49,35 50,45 Q51,55 50,65 Q49,75 50,85 Q51,95 50,100"
                  fill="none"
                  stroke="hsl(185 90% 55%)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.6"
                >
                  <animate attributeName="stroke-dasharray" values="0,20;20,0" dur="2s" repeatCount="indefinite"/>
                </path>

                {/* Enhanced Nile Tributaries */}
                <path d="M50,25 Q54,20 60,15 Q64,12 68,10" fill="none" stroke="url(#territoryNilePattern)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round"/>
                <path d="M50,25 Q46,20 40,15 Q36,12 32,10" fill="none" stroke="url(#territoryNilePattern)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round"/>
                <path d="M50,20 Q47,15 44,10" fill="none" stroke="hsl(175 75% 45%)" strokeWidth="1.8" opacity="0.7" strokeLinecap="round"/>
                <path d="M50,20 Q53,15 56,10" fill="none" stroke="hsl(175 75% 45%)" strokeWidth="1.8" opacity="0.7" strokeLinecap="round"/>
                <path d="M50,15 Q50,10 50,5" fill="none" stroke="hsl(175 70% 40%)" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>

                {/* Enhanced Nile Delta */}
                <path d="M50,20 L44,5 M50,20 L56,5 M50,20 L50,5" fill="none" stroke="hsl(175 80% 45%)" strokeWidth="2" opacity="0.9"/>
                <path d="M44,5 L47,2 M50,5 L50,2 M56,5 L53,2" fill="none" stroke="hsl(175 75% 42%)" strokeWidth="1.5" opacity="0.7"/>
                <path d="M46,8 L49,5 M51,8 L54,5" fill="none" stroke="hsl(175 70% 38%)" strokeWidth="1" opacity="0.5"/>

                {/* Ultra-Realistic Oases */}
                <circle cx="12" cy="35" r="3.5" fill="url(#territoryOasisPattern)"/>
                <circle cx="18" cy="65" r="3" fill="url(#territoryOasisPattern)"/>
                <circle cx="85" cy="45" r="2.5" fill="url(#territoryOasisPattern)"/>
                <circle cx="82" cy="75" r="2" fill="url(#territoryOasisPattern)"/>
                {/* Additional Oases */}
                <circle cx="8" cy="15" r="2" fill="url(#territoryOasisPattern)" opacity="0.8"/>
                <circle cx="22" cy="90" r="2.5" fill="url(#territoryOasisPattern)" opacity="0.7"/>
                <circle cx="88" cy="25" r="1.8" fill="url(#territoryOasisPattern)" opacity="0.6"/>

                {/* Dynamic Mediterranean Sea */}
                <rect x="0" y="0" width="100" height="10" fill="hsl(210 80% 25%)" opacity="0.9"/>
                <path d="M0,10 Q25,7 50,10 T100,7 L100,0 L0,0 Z" fill="hsl(210 75% 30%)" opacity="0.95"/>
                <path d="M0,8 Q15,6 30,8 Q45,5 60,8 Q75,6 90,8 Q100,6 100,7" fill="none" stroke="hsl(210 85% 40%)" strokeWidth="0.8" opacity="0.5"/>

                {/* Enhanced Red Sea */}
                <rect x="70" y="0" width="5" height="20" fill="hsl(200 70% 28%)" opacity="0.9"/>
                <path d="M70,20 Q72,15 75,10 Q77,7 80,5" fill="none" stroke="hsl(200 75% 32%)" strokeWidth="3" opacity="0.9"/>
                <path d="M72,18 Q74,13 77,8" fill="none" stroke="hsl(200 70% 35%)" strokeWidth="1.8" opacity="0.7"/>
                <path d="M74,16 Q76,11 79,6" fill="none" stroke="hsl(200 65% 38%)" strokeWidth="1.2" opacity="0.5"/>

                {/* Ultra-Realistic Mountain Ranges */}
                <path d="M75,45 Q80,40 85,43 Q90,38 95,41 Q100,37 105,40 L105,65 Q100,63 95,67 Q90,63 85,65 Q80,61 75,63 Z" fill="url(#territoryMountainPattern)" opacity="0.7"/>
                <path d="M5,40 Q10,35 15,38 Q20,33 25,36 Q30,32 35,35 L35,55 Q30,53 25,57 Q20,53 15,55 Q10,51 5,53 Z" fill="url(#territoryMountainPattern)" opacity="0.6"/>
                <path d="M95,55 Q100,50 105,53" fill="hsl(25 55% 35%)" opacity="0.4"/>
                <path d="M15,45 Q20,40 25,43" fill="hsl(25 50% 40%)" opacity="0.35"/>

                {/* Enhanced Administrative Borders */}
                <path d="M35,25 L65,25" fill="none" stroke="hsl(45 60% 50%)" strokeWidth="1" opacity="0.6"/>
                <path d="M35,40 L65,40" fill="none" stroke="hsl(45 60% 50%)" strokeWidth="1" opacity="0.6"/>
                <path d="M35,55 L65,55" fill="none" stroke="hsl(45 60% 50%)" strokeWidth="1" opacity="0.6"/>
                <path d="M35,70 L65,70" fill="none" stroke="hsl(45 60% 50%)" strokeWidth="1" opacity="0.6"/>
                <path d="M35,85 L65,85" fill="none" stroke="hsl(45 60% 50%)" strokeWidth="1" opacity="0.6"/>
              </svg>

              {/* Territories */}
              {puzzle.data.territories.map((territory) => {
                const assignedRuler = territoryAssignments[territory.id];
                const ruler = assignedRuler ? getRulerById(assignedRuler) : null;
                const isCorrect = isTerritoryCorrect(territory.id);
                const isIncorrect = isTerritoryIncorrect(territory.id);

                return (
                  <motion.button
                    key={territory.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${territory.x}%`, top: `${territory.y}%` }}
                    onClick={() => handleTerritoryClick(territory.id)}
                    disabled={revealed || !selectedRuler}
                    whileHover={selectedRuler ? { scale: 1.1 } : {}}
                    whileTap={selectedRuler ? { scale: 0.9 } : {}}
                  >
                    <div className={cn(
                      "px-3 py-2 rounded-lg border-2 text-center min-w-[80px] transition-all",
                      isCorrect
                        ? "border-scarab bg-scarab/20"
                        : isIncorrect
                        ? "border-terracotta bg-terracotta/20"
                        : assignedRuler
                        ? "border-gold bg-gold/10"
                        : selectedRuler
                        ? "border-primary bg-primary/10 cursor-pointer"
                        : "border-border bg-card/80 cursor-not-allowed"
                    )}>
                      <div className="font-display text-xs font-semibold">{territory.name}</div>
                      {assignedRuler && ruler && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: ruler.color }}
                          />
                          <span className="text-xs">{ruler.name.charAt(0)}</span>
                        </div>
                      )}
                      {revealed && (
                        <div className="mt-1">
                          {isCorrect ? (
                            <Check className="w-3 h-3 text-scarab mx-auto" />
                          ) : isIncorrect ? (
                            <X className="w-3 h-3 text-terracotta mx-auto" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Territory List */}
        <div>
          <h4 className="font-display text-sm text-muted-foreground mb-3">Territory Status</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {puzzle.data.territories.map((territory) => {
              const assignedRuler = territoryAssignments[territory.id];
              const ruler = assignedRuler ? getRulerById(assignedRuler) : null;
              const isCorrect = isTerritoryCorrect(territory.id);
              const isIncorrect = isTerritoryIncorrect(territory.id);

              return (
                <div
                  key={territory.id}
                  className={cn(
                    "p-2 rounded-lg border text-sm",
                    isCorrect
                      ? "border-scarab bg-scarab/10"
                      : isIncorrect
                      ? "border-terracotta bg-terracotta/10"
                      : assignedRuler
                      ? "border-gold bg-gold/5"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold">{territory.name}</span>
                    {assignedRuler && ruler && (
                      <div className="flex items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: ruler.color }}
                        />
                        <span className="text-xs">{ruler.name}</span>
                      </div>
                    )}
                  </div>
                  {hintsUsed > 0 && !assignedRuler && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Click to assign a ruler
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                score >= puzzle.points * 0.8
                  ? 'bg-scarab/20 border border-scarab/30'
                  : 'bg-terracotta/20 border border-terracotta/30'
              }`}
            >
              {score >= puzzle.points * 0.8 ? (
                <div className="text-center">
                  <span className="text-3xl block mb-2">𓋞</span>
                  <span className="font-display text-scarab block">
                    Master diplomat! You've claimed the territories wisely!
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Points earned: {score}/{puzzle.points}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-display text-terracotta block mb-2">
                    The territorial claims need revision...
                  </span>
                  <span className="text-sm text-muted-foreground block mb-2">
                    Score: {score}/{puzzle.points} (need 80% to pass)
                  </span>
                  <button
                    onClick={handleReset}
                    className="font-body text-sm text-foreground/70 underline hover:text-foreground"
                  >
                    Try again
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3">
          <EgyptianButton variant="outline" onClick={onClose} className="flex-1">
            Close
          </EgyptianButton>
          {!revealed && (
            <>
              <EgyptianButton variant="outline" onClick={handleHint}>
                Hint ({hintsUsed}/{puzzle.data.territories.length})
              </EgyptianButton>
              <EgyptianButton variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </EgyptianButton>
              <EgyptianButton
                variant="hero"
                onClick={handleCheck}
                className="flex-1"
                disabled={!allAssigned}
              >
                <Check className="w-4 h-4 mr-2" />
                Check Claims
              </EgyptianButton>
            </>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}