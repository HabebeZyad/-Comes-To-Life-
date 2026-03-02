import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Check, X, RotateCcw, Lightbulb } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import type { LocationMatchData } from '@/data/mapPuzzles';
import { cn } from '@/lib/utils';

interface Props {
  puzzle: {
    id: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    points: number;
    data: LocationMatchData;
  };
  onSolve: (points: number) => void;
  onClose: () => void;
  isEmbed?: boolean;
}

export function LocationMatchPuzzle({ puzzle, onSolve, onClose, isEmbed }: Props) {
  const [placedLocations, setPlacedLocations] = useState<Record<string, { x: number; y: number }>>({});
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedLocation || revealed) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPlacedLocations(prev => ({
      ...prev,
      [selectedLocation]: { x, y }
    }));
    setSelectedLocation(null);
  };

  const handleLocationSelect = (locationId: string) => {
    if (revealed) return;
    setSelectedLocation(locationId === selectedLocation ? null : locationId);
  };

  const handleCheck = useCallback(() => {
    let correctCount = 0;
    const tolerance = 8; // percentage tolerance for placement

    puzzle.data.correctPositions.forEach(correctPos => {
      const placedPos = placedLocations[correctPos.locationId];
      if (placedPos) {
        const distance = Math.sqrt(
          Math.pow(correctPos.x - placedPos.x, 2) +
          Math.pow(correctPos.y - placedPos.y, 2)
        );
        if (distance <= tolerance) {
          correctCount++;
        }
      }
    });

    const accuracy = correctCount / puzzle.data.correctPositions.length;
    const earnedPoints = Math.round(puzzle.points * accuracy);
    setScore(earnedPoints);
    setRevealed(true);

    if (accuracy >= 0.8) {
      setTimeout(() => onSolve(earnedPoints), 2000);
    }
  }, [placedLocations, puzzle, onSolve]);

  const handleReset = () => {
    setPlacedLocations({});
    setSelectedLocation(null);
    setRevealed(false);
    setScore(0);
    setHintsUsed(0);
  };

  const handleHint = () => {
    if (hintsUsed < puzzle.data.locations.length) {
      setHintsUsed(prev => prev + 1);
    }
  };

  const getCorrectPosition = (locationId: string) => {
    return puzzle.data.correctPositions.find(pos => pos.locationId === locationId);
  };

  const difficultyColors = {
    easy: 'text-scarab',
    medium: 'text-gold',
    hard: 'text-terracotta'
  };

  const allPlaced = Object.keys(placedLocations).length === puzzle.data.locations.length;

  const content = (
    <div className="space-y-6">
      {/* Header - Only if not embedded */}
      {!isEmbed && (
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-gold-gradient flex items-center gap-2">
              <MapPin className="w-5 h-5" />
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
          <button onClick={onClose} className="p-1 hover:bg-muted rounded" aria-label="Close puzzle">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-primary/10 rounded-lg p-3 text-sm">
        <p className="text-foreground/80">
          <strong>Click a location</strong>, then click on the map where you think it should be placed.
          Position all locations correctly to complete the puzzle.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Location List */}
        <div>
          <h4 className="font-display text-sm text-muted-foreground mb-3">Locations to Place</h4>
          <div className="space-y-2">
            {puzzle.data.locations.map((location) => {
              const isPlaced = placedLocations[location.id];
              const isSelected = selectedLocation === location.id;
              const isCorrect = revealed && getCorrectPosition(location.id);
              const isIncorrect = revealed && isPlaced && !isCorrect;

              return (
                <motion.button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.id)}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left transition-all",
                    isCorrect
                      ? "border-scarab bg-scarab/10"
                      : isIncorrect
                        ? "border-terracotta bg-terracotta/10"
                        : isSelected
                          ? "border-primary bg-primary/10"
                          : isPlaced
                            ? "border-gold bg-gold/10"
                            : "border-border bg-card hover:border-gold/50"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={revealed}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    )}>
                      {isPlaced && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className="font-display font-semibold text-sm">{location.name}</div>
                      {hintsUsed > 0 && !isPlaced && (
                        <div className="text-xs text-muted-foreground">{location.hint}</div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Map Area */}
        <div className="md:col-span-2">
          <h4 className="font-display text-sm text-muted-foreground mb-3">Ancient Egypt Map</h4>
          <div
            className="relative aspect-[4/3] bg-gradient-to-br from-sandstone via-sandstone-light to-terracotta/20 rounded-lg border-2 border-sandstone cursor-crosshair overflow-hidden"
            onClick={handleMapClick}
          >
            {/* Ultra-Realistic Egyptian Cartography for Puzzles */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Hyper-Realistic Desert Terrain with Geological Detail */}
                <pattern id="puzzleDesertPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                  <defs>
                    <radialGradient id="puzzleSandGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(38 35% 75%)" stopOpacity="0.9" />
                      <stop offset="70%" stopColor="hsl(35 40% 65%)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(32 45% 55%)" stopOpacity="0.6" />
                    </radialGradient>
                    <filter id="puzzleSandTexture">
                      <feTurbulence baseFrequency="0.8" numOctaves="3" type="fractalNoise" />
                      <feColorMatrix type="saturate" values="0.3" />
                      <feComposite in2="SourceGraphic" operator="in" />
                    </filter>
                  </defs>
                  <rect width="12" height="12" fill="url(#puzzleSandGradient)" />
                  {/* Realistic Sand Dunes */}
                  <path d="M0,8 Q3,6 6,7 Q9,5 12,6 L12,12 L0,12 Z" fill="hsl(35 30% 60%)" opacity="0.4" />
                  <path d="M2,10 Q5,8 8,9 Q11,7 12,8 L12,12 L2,12 Z" fill="hsl(35 25% 55%)" opacity="0.3" />
                  <path d="M1,11 Q4,9 7,10 Q10,8 12,9 L12,12 L1,12 Z" fill="hsl(35 20% 50%)" opacity="0.25" />
                  {/* Sand Particles */}
                  <circle cx="2" cy="3" r="0.3" fill="hsl(38 40% 70%)" opacity="0.6" />
                  <circle cx="7" cy="4" r="0.25" fill="hsl(38 40% 70%)" opacity="0.5" />
                  <circle cx="9" cy="2" r="0.2" fill="hsl(38 40% 70%)" opacity="0.4" />
                  <circle cx="4" cy="8" r="0.35" fill="hsl(38 40% 70%)" opacity="0.7" />
                  <circle cx="11" cy="7" r="0.28" fill="hsl(38 40% 70%)" opacity="0.55" />
                </pattern>

                <pattern id="puzzleEasternDesert" patternUnits="userSpaceOnUse" width="15" height="15">
                  <defs>
                    <radialGradient id="puzzleEasternSandGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(25 45% 55%)" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="hsl(30 50% 50%)" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="hsl(35 40% 45%)" stopOpacity="0.65" />
                    </radialGradient>
                  </defs>
                  <rect width="15" height="15" fill="url(#puzzleEasternSandGradient)" />
                  {/* Eastern Desert Geological Features */}
                  <path d="M0,10 Q5,8 10,9 Q15,7 15,8 L15,15 L0,15 Z" fill="hsl(25 35% 45%)" opacity="0.5" />
                  <path d="M2,12 Q7,10 12,11 Q15,9 15,10 L15,15 L2,15 Z" fill="hsl(25 30% 40%)" opacity="0.4" />
                  <path d="M1,13 Q6,11 11,12 Q15,10 15,11 L15,15 L1,15 Z" fill="hsl(25 25% 35%)" opacity="0.3" />
                </pattern>

                <pattern id="puzzleWesternDesert" patternUnits="userSpaceOnUse" width="14" height="14">
                  <defs>
                    <radialGradient id="puzzleWesternSandGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(42 30% 75%)" stopOpacity="0.8" />
                      <stop offset="70%" stopColor="hsl(40 35% 70%)" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="hsl(38 40% 65%)" stopOpacity="0.6" />
                    </radialGradient>
                  </defs>
                  <rect width="14" height="14" fill="url(#puzzleWesternSandGradient)" />
                  {/* Western Desert Features */}
                  <path d="M0,9 Q4,7 8,8 Q12,6 14,7 L14,14 L0,14 Z" fill="hsl(40 25% 65%)" opacity="0.45" />
                  <path d="M1,11 Q5,9 9,10 Q13,8 14,9 L14,14 L1,14 Z" fill="hsl(40 20% 60%)" opacity="0.35" />
                </pattern>

                {/* Ultra-Realistic Nile River System with Flow Animation */}
                <linearGradient id="puzzleNileGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(185 85% 35%)" stopOpacity="0.95" />
                  <stop offset="15%" stopColor="hsl(180 80% 40%)" stopOpacity="0.9" />
                  <stop offset="35%" stopColor="hsl(175 75% 45%)" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="hsl(170 70% 42%)" stopOpacity="0.7" />
                  <stop offset="85%" stopColor="hsl(165 65% 38%)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(160 60% 35%)" stopOpacity="0.5" />
                </linearGradient>

                <pattern id="puzzleNileWater" patternUnits="userSpaceOnUse" width="6" height="6">
                  <rect width="6" height="6" fill="url(#puzzleNileGradient)" />
                  {/* Animated Water Flow */}
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

                {/* Enhanced Oasis System with Realistic Vegetation */}
                <radialGradient id="puzzleOasisGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(165 70% 35%)" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="hsl(160 75% 40%)" stopOpacity="0.7" />
                  <stop offset="70%" stopColor="hsl(155 60% 45%)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(150 50% 40%)" stopOpacity="0.3" />
                </radialGradient>

                <pattern id="puzzleOasisPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                  <circle cx="4" cy="4" r="3.5" fill="url(#puzzleOasisGradient)" />
                  {/* Palm Trees */}
                  <path d="M4,2 Q3.5,1.5 4,1 Q4.5,1.5 4,2" fill="hsl(25 60% 30%)" opacity="0.8" />
                  <rect x="3.8" y="2" width="0.4" height="2" fill="hsl(25 60% 30%)" />
                  <path d="M3,1.5 Q4,0.5 5,1.5" fill="hsl(120 40% 25%)" opacity="0.7" />
                  <path d="M3.5,1 Q4,0.2 4.5,1" fill="hsl(120 40% 25%)" opacity="0.6" />
                </pattern>

                {/* Hyper-Detailed Fertile Valley with Agricultural Patterns */}
                <pattern id="puzzleFertilePattern" patternUnits="userSpaceOnUse" width="10" height="10">
                  <defs>
                    <linearGradient id="puzzleSoilGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(85 45% 45%)" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="hsl(80 50% 40%)" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="hsl(75 40% 35%)" stopOpacity="0.6" />
                    </linearGradient>
                  </defs>
                  <rect width="10" height="10" fill="url(#puzzleSoilGradient)" />
                  {/* Agricultural Fields */}
                  <rect x="1" y="1" width="3" height="3" fill="hsl(90 50% 50%)" opacity="0.4" />
                  <rect x="5" y="1" width="3" height="3" fill="hsl(95 45% 55%)" opacity="0.35" />
                  <rect x="1" y="5" width="3" height="3" fill="hsl(85 55% 45%)" opacity="0.45" />
                  <rect x="5" y="5" width="3" height="3" fill="hsl(80 50% 50%)" opacity="0.4" />
                  {/* Field Borders */}
                  <path d="M1,1 L4,1 L4,4 L1,4 Z" stroke="hsl(60 40% 30%)" strokeWidth="0.2" fill="none" />
                  <path d="M5,1 L8,1 L8,4 L5,4 Z" stroke="hsl(60 40% 30%)" strokeWidth="0.2" fill="none" />
                  <path d="M1,5 L4,5 L4,8 L1,8 Z" stroke="hsl(60 40% 30%)" strokeWidth="0.2" fill="none" />
                  <path d="M5,5 L8,5 L8,8 L5,8 Z" stroke="hsl(60 40% 30%)" strokeWidth="0.2" fill="none" />
                </pattern>

                {/* Dynamic Mediterranean Sea with Wave Animation */}
                <pattern id="puzzleMediterraneanPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                  <defs>
                    <radialGradient id="puzzleSeaGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(210 80% 25%)" stopOpacity="0.9" />
                      <stop offset="50%" stopColor="hsl(210 70% 30%)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(210 60% 35%)" stopOpacity="0.7" />
                    </radialGradient>
                  </defs>
                  <rect width="8" height="8" fill="url(#puzzleSeaGradient)" />
                  {/* Animated Waves */}
                  <path d="M0,3 Q2,2 4,3 Q6,2 8,3 Q6,4 4,3 Q2,4 0,3" fill="hsl(210 85% 35%)" opacity="0.5">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -1,0; 0,0"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path d="M0,5 Q1.5,4.5 3,5 Q4.5,4.5 6,5 Q7.5,4.5 8,5 Q7.5,5.5 6,5 Q4.5,5.5 3,5 Q1.5,5.5 0,5" fill="hsl(210 90% 40%)" opacity="0.4">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 1,0; 0,0"
                      dur="3s"
                      repeatCount="indefinite"
                    />
                  </path>
                </pattern>

                {/* Enhanced Red Sea with Gulf Details */}
                <pattern id="puzzleRedSeaPattern" patternUnits="userSpaceOnUse" width="6" height="6">
                  <defs>
                    <radialGradient id="puzzleRedSeaGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(200 70% 28%)" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="hsl(200 65% 32%)" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="hsl(200 60% 35%)" stopOpacity="0.65" />
                    </radialGradient>
                  </defs>
                  <rect width="6" height="6" fill="url(#puzzleRedSeaGradient)" />
                  {/* Gulf Waves */}
                  <path d="M0,2 Q1.5,1.5 3,2 Q4.5,1.5 6,2 Q4.5,2.5 3,2 Q1.5,2.5 0,2" fill="hsl(200 75% 35%)" opacity="0.5">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; -0.5,0; 0,0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </path>
                  <path d="M0,4 Q2,3.5 4,4 Q6,3.5 6,4 L6,5 Q6,4.5 4,5 Q2,4.5 0,5 Z" fill="hsl(200 80% 40%)" opacity="0.4">
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0.5,0; 0,0"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                </pattern>

                {/* Ultra-Realistic Mountain Ranges with Geological Layers */}
                <pattern id="puzzleMountainPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                  <defs>
                    <linearGradient id="puzzleMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(25 50% 50%)" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="hsl(25 45% 45%)" stopOpacity="0.7" />
                      <stop offset="80%" stopColor="hsl(25 40% 40%)" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="hsl(25 35% 35%)" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <rect width="12" height="12" fill="url(#puzzleMountainGradient)" />
                  {/* Stratified Rock Layers */}
                  <polygon points="0,12 4,8 8,9 12,7 12,12" fill="hsl(25 40% 45%)" opacity="0.6" />
                  <polygon points="0,12 3,9 6,10 9,8 12,9 12,12" fill="hsl(25 35% 40%)" opacity="0.5" />
                  <polygon points="0,12 2,10 4,11 6,9 8,10 10,8 12,9 12,12" fill="hsl(25 30% 35%)" opacity="0.4" />
                </pattern>

                {/* Enhanced Filters for Realism */}
                <filter id="puzzleCartographicGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="puzzleElevationShadow">
                  <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" floodOpacity="0.4" />
                </filter>

                <filter id="puzzleWaterReflection">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0" />
                </filter>
              </defs>

              {/* Ultra-Realistic Eastern Desert */}
              <rect x="70" y="0" width="30" height="100" fill="url(#puzzleEasternDesert)" />
              <path d="M70,0 L100,15 L100,85 L80,100 L70,95 Z" fill="url(#puzzleEasternDesert)" opacity="0.95" />
              {/* Enhanced Eastern Mountain Ranges */}
              <path d="M75,45 Q80,40 85,43 Q90,38 95,41 Q100,37 105,40 L105,65 Q100,63 95,67 Q90,63 85,65 Q80,61 75,63 Z" fill="url(#puzzleMountainPattern)" opacity="0.6" filter="url(#puzzleElevationShadow)" />
              <path d="M78,20 Q85,15 92,18 Q99,13 105,16 L105,35 Q99,33 92,37 Q85,33 78,36 Z" fill="url(#puzzleMountainPattern)" opacity="0.4" />

              {/* Ultra-Realistic Western Desert */}
              <rect x="0" y="0" width="30" height="100" fill="url(#puzzleWesternDesert)" />
              <path d="M30,0 L0,10 L0,90 L25,100 L30,98 Z" fill="url(#puzzleWesternDesert)" opacity="0.85" />
              {/* Western Desert Mountain Ranges */}
              <path d="M5,40 Q10,35 15,38 Q20,33 25,36 Q30,32 35,35 L35,55 Q30,53 25,57 Q20,53 15,55 Q10,51 5,53 Z" fill="url(#puzzleMountainPattern)" opacity="0.5" filter="url(#puzzleElevationShadow)" />
              <path d="M2,70 Q8,65 14,68 Q20,63 26,66 L26,85 Q20,83 14,87 Q8,83 2,86 Z" fill="url(#puzzleMountainPattern)" opacity="0.35" />

              {/* Hyper-Detailed Fertile Nile Valley */}
              <rect x="30" y="0" width="40" height="100" fill="url(#puzzleFertilePattern)" />
              <rect x="35" y="0" width="30" height="100" fill="url(#puzzleFertilePattern)" opacity="0.9" />
              <rect x="40" y="0" width="20" height="100" fill="url(#puzzleFertilePattern)" opacity="0.95" />
              {/* Additional Agricultural Detail */}
              <rect x="32" y="10" width="4" height="4" fill="hsl(90 45% 50%)" opacity="0.6" />
              <rect x="40" y="20" width="3" height="3" fill="hsl(85 50% 45%)" opacity="0.5" />
              <rect x="36" y="40" width="5" height="5" fill="hsl(95 40% 55%)" opacity="0.4" />
              <rect x="42" y="60" width="4" height="4" fill="hsl(80 45% 50%)" opacity="0.55" />
              <rect x="37" y="80" width="3" height="3" fill="hsl(90 50% 45%)" opacity="0.45" />
              <rect x="44" y="95" width="4" height="4" fill="hsl(85 40% 50%)" opacity="0.5" />

              {/* Ultra-Realistic Nile River with Flow Animation */}
              <path
                d="M50,5 Q51,15 50,25 Q49,35 50,45 Q51,55 50,65 Q49,75 50,85 Q51,95 50,100"
                fill="none"
                stroke="url(#puzzleNileGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#puzzleWaterReflection)"
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
                <animate attributeName="stroke-dasharray" values="0,20;20,0" dur="2s" repeatCount="indefinite" />
              </path>

              {/* Enhanced Nile Tributaries and Canals */}
              <path d="M50,25 Q54,20 60,15 Q64,12 68,10" fill="none" stroke="url(#puzzleNileWater)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
              <path d="M50,25 Q46,20 40,15 Q36,12 32,10" fill="none" stroke="url(#puzzleNileWater)" strokeWidth="2.5" opacity="0.9" strokeLinecap="round" />
              <path d="M50,20 Q47,15 44,10" fill="none" stroke="hsl(175 75% 45%)" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />
              <path d="M50,20 Q53,15 56,10" fill="none" stroke="hsl(175 75% 45%)" strokeWidth="1.8" opacity="0.7" strokeLinecap="round" />
              <path d="M50,15 Q50,10 50,5" fill="none" stroke="hsl(175 70% 40%)" strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
              {/* Additional Canal Systems */}
              <path d="M50,35 Q55,32 60,30" fill="none" stroke="hsl(175 70% 42%)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              <path d="M50,50 Q45,47 40,45" fill="none" stroke="hsl(175 70% 42%)" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
              <path d="M50,65 Q52,62 55,60" fill="none" stroke="hsl(175 70% 42%)" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />

              {/* Enhanced Nile Delta */}
              <path d="M50,20 L44,5 M50,20 L56,5 M50,20 L50,5" fill="none" stroke="hsl(175 80% 45%)" strokeWidth="2" opacity="0.9" />
              <path d="M44,5 L47,2 M50,5 L50,2 M56,5 L53,2" fill="none" stroke="hsl(175 75% 42%)" strokeWidth="1.5" opacity="0.7" />
              <path d="M46,8 L49,5 M51,8 L54,5" fill="none" stroke="hsl(175 70% 38%)" strokeWidth="1" opacity="0.5" />
              {/* Delta Islands */}
              <polygon points="45,7 47,5 49,7 47,9" fill="url(#puzzleFertilePattern)" opacity="0.8" />
              <polygon points="51,9 53,7 55,9 53,11" fill="url(#puzzleFertilePattern)" opacity="0.7" />

              {/* Ultra-Realistic Oases */}
              <circle cx="12" cy="35" r="3.5" fill="url(#puzzleOasisPattern)" filter="url(#puzzleCartographicGlow)" />
              <circle cx="18" cy="65" r="3" fill="url(#puzzleOasisPattern)" filter="url(#puzzleCartographicGlow)" />
              <circle cx="85" cy="45" r="2.5" fill="url(#puzzleOasisPattern)" filter="url(#puzzleCartographicGlow)" />
              <circle cx="82" cy="75" r="2" fill="url(#puzzleOasisPattern)" filter="url(#puzzleCartographicGlow)" />
              {/* Additional Smaller Oases */}
              <circle cx="8" cy="15" r="2" fill="url(#puzzleOasisPattern)" opacity="0.8" />
              <circle cx="22" cy="90" r="2.5" fill="url(#puzzleOasisPattern)" opacity="0.7" />
              <circle cx="88" cy="25" r="1.8" fill="url(#puzzleOasisPattern)" opacity="0.6" />
              <circle cx="6" cy="55" r="1.5" fill="url(#puzzleOasisPattern)" opacity="0.8" />
              <circle cx="87" cy="88" r="2" fill="url(#puzzleOasisPattern)" opacity="0.7" />
              {/* Southern Temple Complex near Elephantine */}
              <rect x="45" y="82" width="4" height="3" fill="none" stroke="hsl(var(--gold))" strokeWidth="0.2" opacity="0.3" />
              <rect x="46" y="83" width="2" height="1" fill="hsl(var(--terracotta))" opacity="0.2" />

              {/* Dynamic Mediterranean Sea */}
              <rect x="0" y="0" width="100" height="10" fill="url(#puzzleMediterraneanPattern)" />
              <path d="M0,10 Q25,7 50,10 T100,7 L100,0 L0,0 Z" fill="url(#puzzleMediterraneanPattern)" opacity="0.95" />
              <path d="M0,8 Q15,6 30,8 Q45,5 60,8 Q75,6 90,8 Q100,6 100,7" fill="none" stroke="hsl(210 85% 40%)" strokeWidth="0.8" opacity="0.5" />

              {/* Enhanced Red Sea (Gulf of Suez) */}
              <rect x="70" y="0" width="5" height="20" fill="url(#puzzleRedSeaPattern)" />
              <path d="M70,20 Q72,15 75,10 Q77,7 80,5" fill="none" stroke="hsl(200 75% 32%)" strokeWidth="3" opacity="0.9" />
              <path d="M72,18 Q74,13 77,8" fill="none" stroke="hsl(200 70% 35%)" strokeWidth="1.8" opacity="0.7" />
              <path d="M74,16 Q76,11 79,6" fill="none" stroke="hsl(200 65% 38%)" strokeWidth="1.2" opacity="0.5" />

              {/* Ultra-Realistic Mountain Ranges */}
              <path d="M75,45 Q80,40 85,43 Q90,38 95,41 Q100,37 105,40 L105,65 Q100,63 95,67 Q90,63 85,65 Q80,61 75,63 Z" fill="url(#puzzleMountainPattern)" opacity="0.7" filter="url(#puzzleElevationShadow)" />
              <path d="M5,40 Q10,35 15,38 Q20,33 25,36 Q30,32 35,35 L35,55 Q30,53 25,57 Q20,53 15,55 Q10,51 5,53 Z" fill="url(#puzzleMountainPattern)" opacity="0.6" filter="url(#puzzleElevationShadow)" />
              <path d="M95,55 Q100,50 105,53" fill="hsl(25 55% 35%)" opacity="0.4" />
              <path d="M15,45 Q20,40 25,43" fill="hsl(25 50% 40%)" opacity="0.35" />

              {/* Enhanced Ancient Roads */}
              <path d="M50,40 Q57,45 65,50" fill="none" stroke="hsl(25 60% 35%)" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2" />
              <path d="M50,50 Q43,55 35,60" fill="none" stroke="hsl(25 55% 40%)" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2" />
              <path d="M50,60 Q54,65 58,70" fill="none" stroke="hsl(25 50% 45%)" strokeWidth="1.2" opacity="0.5" strokeDasharray="3,2" />
              <path d="M50,25 Q47,30 44,35" fill="none" stroke="hsl(25 45% 50%)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,1" />
              <path d="M50,25 Q53,30 56,35" fill="none" stroke="hsl(25 45% 50%)" strokeWidth="0.8" opacity="0.4" strokeDasharray="2,1" />
            </svg>

            {/* Placed location markers */}
            {Object.entries(placedLocations).map(([locationId, pos]) => {
              const location = puzzle.data.locations.find(l => l.id === locationId);
              const correctPos = getCorrectPosition(locationId);
              const isCorrect = revealed && correctPos &&
                Math.sqrt(Math.pow(correctPos.x - pos.x, 2) + Math.pow(correctPos.y - pos.y, 2)) <= 8;

              return (
                <motion.div
                  key={locationId}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-display",
                    revealed
                      ? isCorrect
                        ? "border-scarab bg-scarab/20 text-scarab"
                        : "border-terracotta bg-terracotta/20 text-terracotta"
                      : "border-gold bg-gold/20 text-gold"
                  )}>
                    {revealed ? (
                      isCorrect ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />
                    ) : (
                      location?.name.charAt(0)
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Correct position indicators (shown when revealed) */}
            {revealed && puzzle.data.correctPositions.map((correctPos) => {
              const location = puzzle.data.locations.find(l => l.id === correctPos.locationId);
              return (
                <motion.div
                  key={`correct-${correctPos.locationId}`}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${correctPos.x}%`, top: `${correctPos.y}%` }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-scarab bg-scarab/30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-scarab"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Discovery Logs */}
      <AnimatePresence>
        {revealed && score >= puzzle.points * 0.8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="bg-primary/20 border border-primary/30 rounded-xl p-4">
              <h4 className="font-display text-primary flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4" /> Explorer's Discovery Log
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {puzzle.data.locations.map(loc => (
                  <div key={loc.id} className="bg-black/20 p-3 rounded-lg border border-white/5">
                    <div className="font-display text-sm text-gold-light mb-1">{loc.name}</div>
                    <div className="text-xs text-muted-foreground font-body leading-tight italic">
                      {loc.discoveryLog || "Details preserved in the Hall of Records."}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-lg bg-scarab/20 border border-scarab/30`}>
              <div className="text-center">
                <span className="text-3xl block mb-2">𓏠</span>
                <span className="font-display text-scarab block">
                  Cartographer's wisdom! You've mapped the region perfectly!
                </span>
                <span className="text-sm text-muted-foreground">
                  Points earned: {score}/{puzzle.points}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {revealed && score < puzzle.points * 0.8 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-terracotta/20 border border-terracotta/30"
          >
            <div className="text-center">
              <span className="font-display text-terracotta block mb-2">
                The map needs refinement...
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
              Hint ({hintsUsed}/{puzzle.data.locations.length})
            </EgyptianButton>
            <EgyptianButton variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
            </EgyptianButton>
            <EgyptianButton
              variant="hero"
              onClick={handleCheck}
              className="flex-1"
              disabled={!allPlaced}
            >
              <Check className="w-4 h-4 mr-2" />
              Check Locations
            </EgyptianButton>
          </>
        )}
      </div>
    </div>
  );

  if (isEmbed) {
    return content;
  }

  return (
    <EgyptianCard variant="tomb" className="max-w-4xl mx-auto">
      <EgyptianCardContent className="p-6">
        {content}
      </EgyptianCardContent>
    </EgyptianCard>
  );
}