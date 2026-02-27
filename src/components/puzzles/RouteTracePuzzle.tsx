import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route, Check, X, RotateCcw, Lightbulb, ArrowRight } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { RouteTraceData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: RouteTraceData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
}

export function RouteTracePuzzle({ puzzle, onSolve, onClose }: Props) {
  const [selectedWaypoints, setSelectedWaypoints] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleWaypointClick = (waypointId: string) => {
    if (revealed) return;

    setSelectedWaypoints(prev => {
      if (prev.includes(waypointId)) {
        // Remove waypoint and all after it
        const index = prev.indexOf(waypointId);
        return prev.slice(0, index);
      } else {
        // Add waypoint to the end
        return [...prev, waypointId];
      }
    });
  };

  const handleCheck = useCallback(() => {
    const isCorrect = selectedWaypoints.length === puzzle.data.correctRoute.length &&
      selectedWaypoints.every((waypoint, index) => waypoint === puzzle.data.correctRoute[index]);

    const accuracy = isCorrect ? 1 : (selectedWaypoints.filter(w => puzzle.data.correctRoute.includes(w)).length / puzzle.data.correctRoute.length);
    const earnedPoints = Math.round(puzzle.points * accuracy);
    setScore(earnedPoints);
    setRevealed(true);

    if (isCorrect) {
      setTimeout(() => onSolve(earnedPoints), 2000);
    }
  }, [selectedWaypoints, puzzle, onSolve]);

  const handleReset = () => {
    setSelectedWaypoints([]);
    setRevealed(false);
    setScore(0);
    setHintsUsed(0);
  };

  const handleHint = () => {
    if (hintsUsed < puzzle.data.correctRoute.length) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  const getWaypointById = (id: string) => puzzle.data.waypoints.find(w => w.id === id);
  const isSelected = (waypointId: string) => selectedWaypoints.includes(waypointId);
  const isCorrect = (waypointId: string) => revealed && puzzle.data.correctRoute.includes(waypointId);
  const isInCorrectOrder = (waypointId: string) => {
    if (!revealed) return false;
    const correctIndex = puzzle.data.correctRoute.indexOf(waypointId);
    const selectedIndex = selectedWaypoints.indexOf(waypointId);
    return correctIndex !== -1 && selectedIndex === correctIndex;
  };

  return (
    <EgyptianCard variant="tomb" className="max-w-4xl mx-auto">
      <EgyptianCardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
              <Route className="w-5 h-5" />
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

        {/* Instructions */}
        <div className="bg-primary/10 rounded-lg p-3 text-sm">
          <p className="text-foreground/80">
            <strong>Click waypoints</strong> in the correct order to trace the historical route.
            Click a waypoint again to remove it and all waypoints after it.
          </p>
        </div>

        {/* Map Area */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-sandstone via-sandstone-light to-terracotta/20 rounded-lg border-2 border-sandstone overflow-hidden">
          {/* Professional Egyptian Cartography */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
            <defs>
              {/* Ultra-Realistic Route Map Patterns */}
              <pattern id="routeDesertPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                <defs>
                  <radialGradient id="routeSandGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="hsl(38 35% 75%)" stopOpacity="0.9"/>
                    <stop offset="70%" stopColor="hsl(35 40% 65%)" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="hsl(32 45% 55%)" stopOpacity="0.6"/>
                  </radialGradient>
                </defs>
                <rect width="12" height="12" fill="url(#routeSandGradient)"/>
                <path d="M0,8 Q3,6 6,7 Q9,5 12,6 L12,12 L0,12 Z" fill="hsl(35 30% 60%)" opacity="0.4"/>
                <path d="M2,10 Q5,8 8,9 Q11,7 12,8 L12,12 L2,12 Z" fill="hsl(35 25% 55%)" opacity="0.3"/>
                <circle cx="3" cy="4" r="0.3" fill="hsl(38 40% 70%)" opacity="0.6"/>
                <circle cx="8" cy="5" r="0.25" fill="hsl(38 40% 70%)" opacity="0.5"/>
              </pattern>

              <linearGradient id="routeNileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(185 85% 35%)" stopOpacity="0.95"/>
                <stop offset="15%" stopColor="hsl(180 80% 40%)" stopOpacity="0.9"/>
                <stop offset="35%" stopColor="hsl(175 75% 45%)" stopOpacity="0.8"/>
                <stop offset="60%" stopColor="hsl(170 70% 42%)" stopOpacity="0.7"/>
                <stop offset="85%" stopColor="hsl(165 65% 38%)" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="hsl(160 60% 35%)" stopOpacity="0.5"/>
              </linearGradient>

              <pattern id="routeNilePattern" patternUnits="userSpaceOnUse" width="6" height="6">
                <rect width="6" height="6" fill="url(#routeNileGradient)"/>
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

              <pattern id="routeOasisPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                <circle cx="4" cy="4" r="3.5" fill="hsl(165 70% 35%)" opacity="0.8"/>
                <path d="M4,2 Q3.5,1.5 4,1 Q4.5,1.5 4,2" fill="hsl(25 60% 30%)" opacity="0.8"/>
                <rect x="3.8" y="2" width="0.4" height="2" fill="hsl(25 60% 30%)"/>
                <circle cx="4" cy="5.5" r="1" fill="hsl(185 80% 45%)" opacity="0.6"/>
              </pattern>

              <pattern id="routeFertilePattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect width="10" height="10" fill="hsl(85 45% 45%)" opacity="0.8"/>
                <rect x="1" y="1" width="3" height="3" fill="hsl(90 50% 50%)" opacity="0.4"/>
                <rect x="5" y="1" width="3" height="3" fill="hsl(95 45% 55%)" opacity="0.35"/>
                <rect x="1" y="5" width="3" height="3" fill="hsl(85 55% 45%)" opacity="0.45"/>
                <rect x="5" y="5" width="3" height="3" fill="hsl(80 50% 50%)" opacity="0.4"/>
              </pattern>

              <pattern id="routeMountainPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                <rect width="12" height="12" fill="hsl(25 45% 45%)" opacity="0.8"/>
                <polygon points="0,12 4,8 8,9 12,7 12,12" fill="hsl(25 40% 45%)" opacity="0.6"/>
                <polygon points="0,12 3,9 6,10 9,8 12,9 12,12" fill="hsl(25 35% 40%)" opacity="0.5"/>
              </pattern>
            </defs>

            {/* Ultra-Realistic Eastern Desert */}
            <rect x="70" y="0" width="30" height="100" fill="url(#routeDesertPattern)"/>
            <path d="M70,0 L100,15 L100,85 L80,100 L70,95 Z" fill="url(#routeDesertPattern)" opacity="0.95"/>
            {/* Enhanced Eastern Mountain Ranges */}
            <path d="M75,45 Q80,40 85,43 Q90,38 95,41 Q100,37 105,40 L105,65 Q100,63 95,67 Q90,63 85,65 Q80,61 75,63 Z" fill="url(#routeMountainPattern)" opacity="0.6"/>
            <path d="M78,20 Q85,15 92,18 Q99,13 105,16 L105,35 Q99,33 92,37 Q85,33 78,36 Z" fill="url(#routeMountainPattern)" opacity="0.4"/>

            {/* Ultra-Realistic Western Desert */}
            <rect x="0" y="0" width="30" height="100" fill="url(#routeDesertPattern)"/>
            <path d="M30,0 L0,10 L0,90 L25,100 L30,98 Z" fill="url(#routeDesertPattern)" opacity="0.85"/>
            {/* Western Desert Mountain Ranges */}
            <path d="M5,40 Q10,35 15,38 Q20,33 25,36 Q30,32 35,35 L35,55 Q30,53 25,57 Q20,53 15,55 Q10,51 5,53 Z" fill="url(#routeMountainPattern)" opacity="0.5"/>
            <path d="M2,70 Q8,65 14,68 Q20,63 26,66 L26,85 Q20,83 14,87 Q8,83 2,86 Z" fill="url(#routeMountainPattern)" opacity="0.35"/>

            {/* Hyper-Detailed Fertile Nile Valley */}
            <rect x="30" y="0" width="40" height="100" fill="url(#routeFertilePattern)"/>
            <rect x="35" y="0" width="30" height="100" fill="url(#routeFertilePattern)" opacity="0.9"/>
            <rect x="40" y="0" width="20" height="100" fill="url(#routeFertilePattern)" opacity="0.95"/>
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
              stroke="url(#routeNileGradient)"
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
            <path d="M50,25 Q54,20 60,15 Q64,12 68,10" fill="none" stroke="url(#routeNilePattern)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round"/>
            <path d="M50,25 Q46,20 40,15 Q36,12 32,10" fill="none" stroke="url(#routeNilePattern)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round"/>
            <path d="M50,20 Q47,15 44,10" fill="none" stroke="hsl(175 75% 45%)" strokeWidth="1.8" opacity="0.7" strokeLinecap="round"/>
            <path d="M50,20 Q53,15 56,10" fill="none" stroke="hsl(175 75% 45%)" strokeWidth="1.8" opacity="0.7" strokeLinecap="round"/>
            <path d="M50,15 Q50,10 50,5" fill="none" stroke="hsl(175 70% 40%)" strokeWidth="1.2" opacity="0.6" strokeLinecap="round"/>

            {/* Enhanced Nile Delta */}
            <path d="M50,20 L44,5 M50,20 L56,5 M50,20 L50,5" fill="none" stroke="hsl(175 80% 45%)" strokeWidth="2" opacity="0.9"/>
            <path d="M44,5 L47,2 M50,5 L50,2 M56,5 L53,2" fill="none" stroke="hsl(175 75% 42%)" strokeWidth="1.5" opacity="0.7"/>
            <path d="M46,8 L49,5 M51,8 L54,5" fill="none" stroke="hsl(175 70% 38%)" strokeWidth="1" opacity="0.5"/>

            {/* Ultra-Realistic Oases */}
            <circle cx="12" cy="35" r="3.5" fill="url(#routeOasisPattern)"/>
            <circle cx="18" cy="65" r="3" fill="url(#routeOasisPattern)"/>
            <circle cx="85" cy="45" r="2.5" fill="url(#routeOasisPattern)"/>
            <circle cx="82" cy="75" r="2" fill="url(#routeOasisPattern)"/>
            {/* Additional Oases */}
            <circle cx="8" cy="15" r="2" fill="url(#routeOasisPattern)" opacity="0.8"/>
            <circle cx="22" cy="90" r="2.5" fill="url(#routeOasisPattern)" opacity="0.7"/>
            <circle cx="88" cy="25" r="1.8" fill="url(#routeOasisPattern)" opacity="0.6"/>

            {/* Dynamic Mediterranean Sea */}
            <rect x="0" y="0" width="100" height="10" fill="hsl(210 80% 25%)" opacity="0.9"/>
            <path d="M0,10 Q25,7 50,10 T100,7 L100,0 L0,0 Z" fill="hsl(210 75% 30%)" opacity="0.95"/>
            <path d="M0,8 Q15,6 30,8 Q45,5 60,8 Q75,6 90,8 Q100,6 100,7" fill="none" stroke="hsl(210 85% 40%)" strokeWidth="0.8" opacity="0.5"/>
            {/* Animated Waves */}
            <path d="M0,8 Q10,6 20,8 Q30,6 40,8 Q50,6 60,8 Q70,6 80,8 Q90,6 100,8" stroke="hsl(210 90% 45%)" strokeWidth="0.5" fill="none" opacity="0.4">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -5,0; 0,0"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>

            {/* Enhanced Red Sea */}
            <rect x="70" y="0" width="5" height="20" fill="hsl(200 70% 28%)" opacity="0.9"/>
            <path d="M70,20 Q72,15 75,10 Q77,7 80,5" fill="none" stroke="hsl(200 75% 32%)" strokeWidth="3" opacity="0.9"/>
            <path d="M72,18 Q74,13 77,8" fill="none" stroke="hsl(200 70% 35%)" strokeWidth="1.8" opacity="0.7"/>
            <path d="M74,16 Q76,11 79,6" fill="none" stroke="hsl(200 65% 38%)" strokeWidth="1.2" opacity="0.5"/>

            {/* Ultra-Realistic Mountain Ranges */}
            <path d="M75,45 Q80,40 85,43 Q90,38 95,41 Q100,37 105,40 L105,65 Q100,63 95,67 Q90,63 85,65 Q80,61 75,63 Z" fill="url(#routeMountainPattern)" opacity="0.7"/>
            <path d="M5,40 Q10,35 15,38 Q20,33 25,36 Q30,32 35,35 L35,55 Q30,53 25,57 Q20,53 15,55 Q10,51 5,53 Z" fill="url(#routeMountainPattern)" opacity="0.6"/>
            <path d="M95,55 Q100,50 105,53" fill="hsl(25 55% 35%)" opacity="0.4"/>
            <path d="M15,45 Q20,40 25,43" fill="hsl(25 50% 40%)" opacity="0.35"/>

            {/* Enhanced Ancient Roads */}
            <path d="M50,40 Q57,45 65,50" fill="none" stroke="hsl(25 60% 35%)" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2"/>
            <path d="M50,50 Q43,55 35,60" fill="none" stroke="hsl(25 55% 40%)" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2"/>
            <path d="M50,60 Q54,65 58,70" fill="none" stroke="hsl(25 50% 45%)" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2"/>
            <path d="M50,25 Q47,30 44,35" fill="none" stroke="hsl(25 45% 50%)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,1"/>
            <path d="M50,25 Q53,30 56,35" fill="none" stroke="hsl(25 45% 50%)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,1"/>
          </svg>

          {/* Route line */}
          {selectedWaypoints.length > 1 && (
            <motion.svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.path
                d={selectedWaypoints.map((waypointId, index) => {
                  const waypoint = getWaypointById(waypointId);
                  if (!waypoint) return '';
                  const prefix = index === 0 ? 'M' : 'L';
                  return `${prefix} ${waypoint.x} ${waypoint.y}`;
                }).join(' ')}
                stroke={revealed ? (selectedWaypoints.length === puzzle.data.correctRoute.length &&
                  selectedWaypoints.every((w, i) => w === puzzle.data.correctRoute[i])
                  ? "hsl(var(--scarab))" : "hsl(var(--terracotta))") : "hsl(var(--gold))"}
                strokeWidth="3"
                fill="none"
                strokeDasharray={revealed ? "none" : "5,5"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
            </motion.svg>
          )}

          {/* Correct route (shown when revealed) */}
          {revealed && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d={puzzle.data.correctRoute.map((waypointId, index) => {
                  const waypoint = getWaypointById(waypointId);
                  if (!waypoint) return '';
                  const prefix = index === 0 ? 'M' : 'L';
                  return `${prefix} ${waypoint.x} ${waypoint.y}`;
                }).join(' ')}
                stroke="hsl(var(--scarab))"
                strokeWidth="2"
                fill="none"
                opacity="0.8"
              />
            </svg>
          )}

          {/* Waypoints */}
          {puzzle.data.waypoints.map((waypoint, index) => {
            const isWaypointSelected = isSelected(waypoint.id);
            const isWaypointCorrect = isCorrect(waypoint.id);
            const isWaypointCorrectOrder = isInCorrectOrder(waypoint.id);
            const selectedIndex = selectedWaypoints.indexOf(waypoint.id);

            return (
              <motion.button
                key={waypoint.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${waypoint.x}%`, top: `${waypoint.y}%` }}
                onClick={() => handleWaypointClick(waypoint.id)}
                disabled={revealed}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full border-3 flex items-center justify-center text-xs font-display font-bold transition-all",
                  isWaypointCorrectOrder
                    ? "border-scarab bg-scarab/20 text-scarab"
                    : isWaypointSelected
                    ? "border-gold bg-gold/20 text-gold"
                    : isWaypointCorrect && revealed
                    ? "border-scarab bg-scarab/20 text-scarab"
                    : revealed && isWaypointSelected && !isWaypointCorrect
                    ? "border-terracotta bg-terracotta/20 text-terracotta"
                    : "border-border bg-card hover:border-gold text-foreground"
                )}>
                  {selectedIndex !== -1 ? (
                    selectedIndex + 1
                  ) : revealed ? (
                    isWaypointCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />
                  ) : (
                    waypoint.name.charAt(0)
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Waypoint List */}
        <div>
          <h4 className="font-display text-sm text-muted-foreground mb-3">Available Waypoints</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {puzzle.data.waypoints.map((waypoint) => {
              const isWaypointSelected = isSelected(waypoint.id);
              const selectedIndex = selectedWaypoints.indexOf(waypoint.id);

              return (
                <motion.button
                  key={waypoint.id}
                  onClick={() => handleWaypointClick(waypoint.id)}
                  className={cn(
                    "p-2 rounded-lg border text-left transition-all",
                    isWaypointSelected
                      ? "border-gold bg-gold/10"
                      : "border-border bg-card hover:border-gold/50"
                  )}
                  disabled={revealed}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-display",
                      isWaypointSelected ? "border-gold bg-gold text-gold-foreground" : "border-border"
                    )}>
                      {selectedIndex !== -1 ? selectedIndex + 1 : ''}
                    </div>
                    <div>
                      <div className="font-display text-sm font-semibold">{waypoint.name}</div>
                      {hintsUsed > selectedIndex && (
                        <div className="text-xs text-muted-foreground">Position: {selectedIndex + 1}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
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
                selectedWaypoints.length === puzzle.data.correctRoute.length &&
                selectedWaypoints.every((w, i) => w === puzzle.data.correctRoute[i])
                  ? 'bg-scarab/20 border border-scarab/30'
                  : 'bg-terracotta/20 border border-terracotta/30'
              }`}
            >
              {selectedWaypoints.length === puzzle.data.correctRoute.length &&
               selectedWaypoints.every((w, i) => w === puzzle.data.correctRoute[i]) ? (
                <div className="text-center">
                  <span className="text-3xl block mb-2">𓋹</span>
                  <span className="font-display text-scarab block">
                    Perfect navigation! You've traced the ancient route!
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Points earned: {score}/{puzzle.points}
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="font-display text-terracotta block mb-2">
                    The path needs correction...
                  </span>
                  <span className="text-sm text-muted-foreground block mb-2">
                    Correct route shown above. Try again!
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
                Hint ({hintsUsed}/{puzzle.data.correctRoute.length})
              </EgyptianButton>
              <EgyptianButton variant="outline" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </EgyptianButton>
              <EgyptianButton
                variant="hero"
                onClick={handleCheck}
                className="flex-1"
                disabled={selectedWaypoints.length < 2}
              >
                <Check className="w-4 h-4 mr-2" />
                Check Route
              </EgyptianButton>
            </>
          )}
        </div>
      </EgyptianCardContent>
    </EgyptianCard>
  );
}