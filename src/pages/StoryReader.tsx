import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, MapPin, Trophy, Home, Volume2, VolumeX, Lightbulb, Puzzle } from 'lucide-react';
import { getStoryById, egyptianStories, type Story, type StoryPanel } from '@/data/egyptianStories';
import { getStoryPuzzlesByStory, type StoryPuzzle } from '@/data/mapPuzzles';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { StoryPuzzleModal } from '@/components/puzzles/PuzzleModals';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function StoryReader() {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [showHistoricalNote, setShowHistoricalNote] = useState(false);
  const [completedPanels, setCompletedPanels] = useState<Set<string>>(new Set());
  const [activePuzzle, setActivePuzzle] = useState<StoryPuzzle | null>(null);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  const [totalScore, setTotalScore] = useState(0);

  const story = storyId ? getStoryById(storyId) : undefined;
  const storyPuzzles = storyId ? getStoryPuzzlesByStory(storyId) : [];

  // Determine which puzzles should appear at which panel index
  const getPuzzleForPanel = (panelIndex: number): StoryPuzzle | null => {
    if (storyPuzzles.length === 0) return null;
    // Distribute puzzles throughout the story (e.g., after every 2-3 panels)
    const interval = Math.max(2, Math.floor(story?.panels.length || 1 / (storyPuzzles.length + 1)));
    const puzzleIndex = Math.floor((panelIndex + 1) / interval) - 1;
    if (puzzleIndex >= 0 && puzzleIndex < storyPuzzles.length && (panelIndex + 1) % interval === 0) {
      return storyPuzzles[puzzleIndex];
    }
    return null;
  };

  useEffect(() => {
    if (!story) {
      navigate('/stories');
    }
  }, [story, navigate]);

  const currentPanel = story?.panels[currentPanelIndex]; // Define currentPanel here for useCallback dependencies

  const goToNextPanel = useCallback(() => {
    if (story && currentPanelIndex < story.panels.length - 1) {
      setCompletedPanels(new Set([...completedPanels, currentPanel.id]));

      // Check if there's a puzzle after this panel
      const puzzle = getPuzzleForPanel(currentPanelIndex);
      if (puzzle && !completedPuzzles.has(puzzle.id)) {
        setActivePuzzle(puzzle);
      } else {
        setCurrentPanelIndex(currentPanelIndex + 1);
        setShowHistoricalNote(false);
      }
    }
  }, [currentPanelIndex, story, completedPanels, currentPanel, getPuzzleForPanel, completedPuzzles]);

  useEffect(() => {
    if (isAutoPlaying && story) {
      const timer = setTimeout(() => {
        if (currentPanelIndex < story.panels.length - 1) {
          goToNextPanel();
        } else {
          setIsAutoPlaying(false);
        }
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isAutoPlaying, currentPanelIndex, story, goToNextPanel]);

  if (!story) {
    return null;
  }

  const progress = ((currentPanelIndex + 1) / story.panels.length) * 100;

  const goToPreviousPanel = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1);
      setShowHistoricalNote(false);
    }
  };

  const handlePuzzleSolve = (points: number) => {
    if (activePuzzle) {
      setCompletedPuzzles(new Set([...completedPuzzles, activePuzzle.id]));
      setTotalScore(prev => prev + points);
      toast({
        title: "Puzzle Complete! 𓂋",
        description: `You earned ${points} points!`,
      });
    }
    setActivePuzzle(null);
    setCurrentPanelIndex(currentPanelIndex + 1);
    setShowHistoricalNote(false);
  };

  const handlePuzzleClose = () => {
    setActivePuzzle(null);
    // Allow skipping puzzle
    setCurrentPanelIndex(currentPanelIndex + 1);
    setShowHistoricalNote(false);
  };

  const goToPanel = (index: number) => {
    setCurrentPanelIndex(index);
    setShowHistoricalNote(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <DustParticles count={10} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/stories">
                <EgyptianButton variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                  Stories
                </EgyptianButton>
              </Link>
              <div className="hidden sm:block">
                <h1 className="font-display text-sm font-semibold text-foreground">
                  {story.title}
                </h1>
                <p className="text-xs text-muted-foreground">
                  Panel {currentPanelIndex + 1} of {story.panels.length}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 max-w-xs mx-4">
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  isAutoPlaying ? "bg-primary/20 text-primary" : "hover:bg-muted text-muted-foreground"
                )}
                title={isAutoPlaying ? "Stop auto-play" : "Auto-play"}
              >
                {isAutoPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <Link to="/">
                <button
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all"
                  title="Go to home"
                >
                  <Home className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 pb-24">
        <div className="max-w-5xl mx-auto px-4">
          {/* Panel Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPanel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {/* Immersive Story Scene */}
              <EgyptianCard variant="gold" className="overflow-hidden mb-6 relative">
                <div className="aspect-[16/9] bg-gradient-to-br from-lapis-deep via-sandstone to-terracotta relative overflow-hidden">
                  {/* Dynamic Background Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                      <defs>
                        <pattern id="storyBg" patternUnits="userSpaceOnUse" width="20" height="20">
                          <circle cx="10" cy="10" r="1" fill="hsl(var(--gold))" opacity="0.3" />
                          <circle cx="5" cy="15" r="0.5" fill="hsl(var(--turquoise))" opacity="0.2" />
                          <path d="M15,5 Q17,8 15,11" stroke="hsl(var(--gold))" strokeWidth="0.3" fill="none" opacity="0.4" />
                        </pattern>
                      </defs>
                      <rect width="100" height="100" fill="url(#storyBg)" />
                    </svg>
                  </div>

                  {/* Central Egyptian Motif */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="text-center relative z-10"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                    >
                      {/* Animated Hieroglyphs */}
                      <motion.span
                        className="text-8xl block mb-6 text-gold-gradient animate-pulse"
                        animate={{
                          textShadow: [
                            "0 0 20px hsl(var(--gold))",
                            "0 0 40px hsl(var(--gold))",
                            "0 0 20px hsl(var(--gold))"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {currentPanelIndex === 0 ? '𓅃' :
                          currentPanelIndex === story.panels.length - 1 ? '𓂀' :
                            '𓏏'}
                      </motion.span>

                      {/* Story Scene Title */}
                      <motion.h2
                        className="font-display text-2xl md:text-3xl font-bold text-gold-gradient mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Scene {currentPanelIndex + 1}: {story.title}
                      </motion.h2>

                      {/* Atmospheric Description */}
                      <motion.div
                        className="max-w-2xl mx-auto px-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <p className="text-sm text-muted-foreground italic leading-relaxed mb-4">
                          {currentPanel.imagePrompt.split('.')[0]}...
                        </p>

                        {/* Interactive Elements */}
                        <div className="flex justify-center gap-4 mt-6">
                          <motion.div
                            className="flex items-center gap-2 text-xs text-gold"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="w-2 h-2 bg-gold rounded-full animate-pulse"></span>
                            Ancient Egypt • {story.period}
                          </motion.div>
                          <motion.div
                            className="flex items-center gap-2 text-xs text-turquoise"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="w-2 h-2 bg-turquoise rounded-full animate-pulse"></span>
                            Interactive Story
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Animated Border Elements */}
                  <motion.div
                    className="absolute top-4 left-4 w-16 h-16 border-2 border-gold/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-1 left-1 w-3 h-3 bg-gold rounded-full"></div>
                  </motion.div>

                  <motion.div
                    className="absolute bottom-4 right-4 w-12 h-12 border border-turquoise/30 rounded"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute bottom-1 right-1 w-2 h-2 bg-turquoise rounded-full"></div>
                  </motion.div>

                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent" />
                </div>
              </EgyptianCard>

              {/* Immersive Narration */}
              <EgyptianCard variant="lapis" className="mb-4 relative overflow-hidden">
                {/* Decorative Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-turquoise to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

                <EgyptianCardContent className="p-8 relative">
                  {/* Story Scroll Icon */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      📜
                    </motion.span>
                  </div>

                  {/* Narration Text */}
                  <motion.p
                    className="font-body text-lg md:text-xl text-foreground/90 leading-relaxed relative z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    {currentPanel.narration}
                  </motion.p>

                  {/* Subtle Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <pattern id="narrationBg" patternUnits="userSpaceOnUse" width="10" height="10">
                        <circle cx="5" cy="5" r="0.3" fill="currentColor" />
                      </pattern>
                      <rect width="100" height="100" fill="url(#narrationBg)" />
                    </svg>
                  </div>
                </EgyptianCardContent>
              </EgyptianCard>

              {/* Dramatic Dialogue */}
              {currentPanel.dialogue && currentPanel.dialogue.length > 0 && (
                <div className="space-y-4 mb-6">
                  {currentPanel.dialogue.map((d, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -30, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        delay: 0.5 + i * 0.3,
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                    >
                      <EgyptianCard variant="gold" className="relative overflow-hidden group">
                        {/* Speech Bubble Tail */}
                        <div className="absolute -left-2 top-6 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-card border-b-8 border-b-transparent"></div>

                        {/* Animated Border */}
                        <motion.div
                          className="absolute inset-0 rounded-lg"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 hsl(var(--gold) / 0.3)",
                              "0 0 0 2px hsl(var(--gold) / 0.2)",
                              "0 0 0 0 hsl(var(--gold) / 0.3)"
                            ]
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />

                        <EgyptianCardContent className="p-5 relative z-10">
                          <div className="flex items-start gap-4">
                            {/* Character Avatar */}
                            <motion.div
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-gold to-turquoise flex items-center justify-center text-xl shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <motion.span
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                𓀀
                              </motion.span>
                            </motion.div>

                            {/* Dialogue Content */}
                            <div className="flex-1">
                              <motion.span
                                className="font-display text-base font-bold text-primary block mb-2 flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 + i * 0.3 }}
                              >
                                <span className="w-2 h-2 bg-primary rounded-full"></span>
                                {d.speaker}
                              </motion.span>

                              <motion.div
                                className="relative"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.3 }}
                              >
                                <p className="font-body text-foreground/90 text-base leading-relaxed pl-4 border-l-2 border-primary/30 italic">
                                  "{d.text}"
                                </p>

                                {/* Subtle Quote Decoration */}
                                <div className="absolute -top-1 -left-1 text-gold text-lg opacity-60">"</div>
                                <div className="absolute -bottom-1 -right-1 text-gold text-lg opacity-60 scale-x-[-1]">"</div>
                              </motion.div>
                            </div>
                          </div>

                          {/* Voice Wave Animation */}
                          <motion.div
                            className="absolute bottom-2 right-2 flex gap-1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ delay: 1.5 + i * 0.3, duration: 1.5, repeat: Infinity }}
                          >
                            {[1, 2, 3].map((wave) => (
                              <motion.div
                                key={wave}
                                className="w-1 bg-primary/40 rounded-full"
                                animate={{ height: [4, 12, 4] }}
                                transition={{
                                  duration: 0.8,
                                  delay: wave * 0.1,
                                  repeat: Infinity
                                }}
                              />
                            ))}
                          </motion.div>
                        </EgyptianCardContent>
                      </EgyptianCard>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Scholarly Historical Note */}
              {currentPanel.historicalNote && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <EgyptianCard variant="papyrus" className="overflow-hidden">
                    {/* Decorative Papyrus Scroll */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-scarab to-transparent"></div>

                    <button
                      onClick={() => setShowHistoricalNote(!showHistoricalNote)}
                      className="w-full text-left group"
                    >
                      <EgyptianCardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-3 text-scarab font-display text-base font-semibold">
                            <motion.div
                              animate={{ rotate: showHistoricalNote ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-xl">📜</span>
                            </motion.div>
                            Scholarly Insight
                            <span className="text-xs bg-scarab/20 text-scarab px-2 py-0.5 rounded-full">
                              Historical Context
                            </span>
                          </span>
                          <motion.div
                            animate={{ rotate: showHistoricalNote ? 90 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronRight className="w-5 h-5 text-scarab" />
                          </motion.div>
                        </div>
                      </EgyptianCardContent>
                    </button>

                    <AnimatePresence>
                      {showHistoricalNote && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4">
                            <div className="bg-gradient-to-r from-scarab/10 to-transparent p-4 rounded-lg border-l-4 border-scarab">
                              <motion.p
                                className="text-sm text-foreground/90 leading-relaxed"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                              >
                                {currentPanel.historicalNote}
                              </motion.p>

                              {/* Academic Citation Style */}
                              <motion.div
                                className="mt-3 pt-3 border-t border-scarab/20"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                              >
                                <p className="text-xs text-scarab/70 italic flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-scarab rounded-full"></span>
                                  Based on archaeological and textual evidence
                                </p>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </EgyptianCard>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Enchanted Panel Navigation */}
          <div className="flex justify-center gap-3 mb-8">
            {story.panels.map((panel, index) => (
              <motion.button
                key={panel.id}
                onClick={() => goToPanel(index)}
                className={cn(
                  "relative transition-all duration-300",
                  index === currentPanelIndex && "scale-125"
                )}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Main Dot */}
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 transition-all duration-300",
                  index === currentPanelIndex
                    ? "bg-primary border-primary shadow-lg shadow-primary/50"
                    : completedPanels.has(panel.id)
                      ? "bg-primary/60 border-primary/80 hover:bg-primary/80"
                      : "bg-muted border-muted-foreground/30 hover:border-muted-foreground/50"
                )} />

                {/* Magical Glow Effect */}
                {index === currentPanelIndex && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 0, 0.6]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Completion Sparkle */}
                {completedPanels.has(panel.id) && (
                  <motion.div
                    className="absolute -top-1 -right-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    <span className="text-xs text-primary">✨</span>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Score Display */}
          {totalScore > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed top-20 right-4 z-40"
            >
              <div className="bg-primary/10 border border-primary/30 rounded-lg px-4 py-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span className="font-display text-sm font-semibold text-primary">{totalScore} pts</span>
              </div>
            </motion.div>
          )}

          {/* Related Puzzles */}
          {storyPuzzles.length > 0 && currentPanelIndex === story.panels.length - 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h3 className="font-display text-xl font-semibold text-gold-gradient mb-4 text-center">
                Story Puzzles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {storyPuzzles.map((puzzle) => {
                  const isCompleted = completedPuzzles.has(puzzle.id);
                  return (
                    <EgyptianCard
                      key={puzzle.id}
                      variant={isCompleted ? "default" : "interactive"}
                      className={cn(
                        "cursor-pointer transition-all",
                        isCompleted && "opacity-60"
                      )}
                      onClick={() => !isCompleted && setActivePuzzle(puzzle)}
                    >
                      <EgyptianCardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Puzzle className="w-4 h-4 text-primary" />
                            <h4 className="font-display font-semibold">{puzzle.title}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-scarab/20 text-scarab">
                                ✓ Done
                              </span>
                            )}
                            <span className={cn(
                              "text-xs px-2 py-0.5 rounded-full",
                              puzzle.difficulty === 'easy' && "bg-scarab/20 text-scarab",
                              puzzle.difficulty === 'medium' && "bg-gold/20 text-gold",
                              puzzle.difficulty === 'hard' && "bg-terracotta/20 text-terracotta"
                            )}>
                              {puzzle.difficulty}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{puzzle.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-primary">
                            <Trophy className="w-3 h-3" />
                            {puzzle.points} points
                          </div>
                          {!isCompleted && (
                            <span className="text-xs text-muted-foreground">Click to play</span>
                          )}
                        </div>
                      </EgyptianCardContent>
                    </EgyptianCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Triumphant Story Completion */}
          {currentPanelIndex === story.panels.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              className="relative"
            >
              {/* Celebration Background Effects */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <motion.div
                  className="absolute top-10 left-10 w-2 h-2 bg-gold rounded-full"
                  animate={{
                    y: [-20, -40, -20],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="absolute top-20 right-20 w-1.5 h-1.5 bg-turquoise rounded-full"
                  animate={{
                    y: [-15, -35, -15],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute bottom-15 left-15 w-2.5 h-2.5 bg-primary rounded-full"
                  animate={{
                    y: [0, -25, 0],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                />
              </div>

              <EgyptianCard variant="gold" className="p-8 relative overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <motion.svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  >
                    <defs>
                      <pattern id="completionBg" patternUnits="userSpaceOnUse" width="10" height="10">
                        <circle cx="5" cy="5" r="1" fill="currentColor" opacity="0.5" />
                        <path d="M2,2 L8,8 M8,2 L2,8" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                      </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#completionBg)" />
                  </motion.svg>
                </div>

                {/* Central Triumphant Display */}
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <motion.span
                      className="text-7xl block mb-6 text-gold-gradient"
                      animate={{
                        textShadow: [
                          "0 0 20px hsl(var(--gold))",
                          "0 0 40px hsl(var(--gold))",
                          "0 0 60px hsl(var(--gold))",
                          "0 0 20px hsl(var(--gold))"
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      𓂀
                    </motion.span>
                  </motion.div>

                  <motion.h3
                    className="font-display text-3xl md:text-4xl font-bold text-gold-gradient mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    Journey Complete
                  </motion.h3>

                  <motion.p
                    className="text-lg text-muted-foreground mb-6 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    You have brought "{story.title}" back to life through the corridors of time
                  </motion.p>

                  {/* Achievement Display */}
                  {totalScore > 0 && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.1 }}
                    >
                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/20 to-gold/20 rounded-full px-6 py-3 border border-primary/30">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Trophy className="w-6 h-6 text-primary" />
                        </motion.div>
                        <span className="font-display text-xl font-bold text-primary">
                          {totalScore} Ancient Points
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Progress Note */}
                  {completedPuzzles.size < storyPuzzles.length && storyPuzzles.length > 0 && (
                    <motion.div
                      className="mb-6 p-3 bg-scarab/10 rounded-lg border border-scarab/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.3 }}
                    >
                      <p className="text-sm text-scarab flex items-center justify-center gap-2">
                        <span className="text-lg">🧩</span>
                        {storyPuzzles.length - completedPuzzles.size} wisdom challenge{storyPuzzles.length - completedPuzzles.size > 1 ? 's' : ''} await above
                      </p>
                    </motion.div>
                  )}

                  {/* Journey Continues */}
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5 }}
                  >
                    <Link to="/stories">
                      <EgyptianButton variant="outline" className="group">
                        <BookOpen className="w-4 h-4 group-hover:animate-bounce" />
                        Discover More Tales
                      </EgyptianButton>
                    </Link>
                    <Link to={`/maps?period=${story.periodId}`}>
                      <EgyptianButton variant="hero" className="group">
                        <MapPin className="w-4 h-4 group-hover:animate-pulse" />
                        Journey to the Map
                      </EgyptianButton>
                    </Link>
                  </motion.div>

                  {/* Inspirational Quote */}
                  <motion.div
                    className="mt-6 pt-6 border-t border-gold/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.7 }}
                  >
                    <p className="text-sm text-muted-foreground italic">
                      "The past is never dead. It's not even past." — William Faulkner
                    </p>
                  </motion.div>
                </div>
              </EgyptianCard>
            </motion.div>
          )}
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <EgyptianButton
              variant="outline"
              onClick={goToPreviousPanel}
              disabled={currentPanelIndex === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </EgyptianButton>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                {currentPanelIndex + 1} / {story.panels.length}
              </span>
            </div>

            <EgyptianButton
              variant={currentPanelIndex === story.panels.length - 1 ? "outline" : "hero"}
              onClick={goToNextPanel}
              disabled={currentPanelIndex === story.panels.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </EgyptianButton>
          </div>
        </div>
      </footer>

      {/* Story Puzzle Modal */}
      <StoryPuzzleModal
        puzzle={activePuzzle}
        onSolve={handlePuzzleSolve}
        onClose={handlePuzzleClose}
      />
    </div>
  );
}
