import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Clock, CheckCircle, XCircle, RotateCcw, Zap, Brain, BookOpen, Hash, ArrowRight, Sparkles } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { hieroglyphDatabase, HieroglyphEntry } from '@/data/hieroglyphDatabase';

type QuestionType = 'symbol-to-meaning' | 'meaning-to-symbol' | 'pronunciation' | 'category';
type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

interface Question {
  type: QuestionType;
  correctAnswer: HieroglyphEntry;
  options: HieroglyphEntry[];
  question: string;
  displaySymbol?: boolean;
}

interface QuizState {
  currentQuestion: number;
  score: number;
  streak: number;
  maxStreak: number;
  answers: { correct: boolean; timeSpent: number }[];
  startTime: number;
}

const QUESTIONS_PER_ROUND = 10;
const TIME_LIMIT = { easy: 30, medium: 20, hard: 15, expert: 10 };
const POINTS = { easy: 10, medium: 20, hard: 35, expert: 50 };

export function HieroglyphQuiz() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'result'>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['symbol-to-meaning']);
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [currentQ, setCurrentQ] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  // Generate a random question
  const generateQuestion = useCallback((): Question => {
    const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const shuffled = [...hieroglyphDatabase].sort(() => Math.random() - 0.5);
    const correct = shuffled[0];

    // Get options count based on difficulty
    const optionCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : difficulty === 'hard' ? 5 : 6;
    const options = shuffled.slice(0, optionCount);

    // Ensure correct answer is in options
    if (!options.includes(correct)) {
      options[Math.floor(Math.random() * options.length)] = correct;
    }

    let question = '';
    let displaySymbol = false;

    switch (type) {
      case 'symbol-to-meaning':
        question = `What does this hieroglyph mean?`;
        displaySymbol = true;
        break;
      case 'meaning-to-symbol':
        question = `Which hieroglyph means "${correct.meaning.split(',')[0]}"?`;
        break;
      case 'pronunciation':
        question = `Which hieroglyph is pronounced "${correct.pronunciation}"?`;
        break;
      case 'category':
        question = `This hieroglyph belongs to which category?`;
        displaySymbol = true;
        break;
    }

    return { type, correctAnswer: correct, options: options.sort(() => Math.random() - 0.5), question, displaySymbol };
  }, [questionTypes, difficulty]);

  // Start a new game
  const startGame = () => {
    setQuiz({
      currentQuestion: 0,
      score: 0,
      streak: 0,
      maxStreak: 0,
      answers: [],
      startTime: Date.now(),
    });
    setCurrentQ(generateQuestion());
    setGameState('playing');
    setTimeLeft(TIME_LIMIT[difficulty]);
    setTimerActive(true);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // Handle answer selection
  const handleAnswer = useCallback((answerId: string | null) => {
    if (showFeedback || !quiz || !currentQ) return;

    setTimerActive(false);
    setSelectedAnswer(answerId);
    setShowFeedback(true);

    const isCorrect = answerId === currentQ.correctAnswer.gardinerCode;
    const timeSpent = TIME_LIMIT[difficulty] - timeLeft;

    // Calculate bonus points for speed
    const basePoints = POINTS[difficulty];
    const timeBonus = isCorrect ? Math.floor((timeLeft / TIME_LIMIT[difficulty]) * basePoints * 0.5) : 0;
    const streakBonus = isCorrect ? quiz.streak * 5 : 0;
    const totalPoints = isCorrect ? basePoints + timeBonus + streakBonus : 0;

    setQuiz(prev => {
      if (!prev) return prev;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      return {
        ...prev,
        score: prev.score + totalPoints,
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        answers: [...prev.answers, { correct: isCorrect, timeSpent }],
      };
    });

    // Move to next question after delay
    setTimeout(() => {
      if (quiz.currentQuestion + 1 >= QUESTIONS_PER_ROUND) {
        setGameState('result');
      } else {
        setQuiz(prev => prev ? { ...prev, currentQuestion: prev.currentQuestion + 1 } : prev);
        setCurrentQ(generateQuestion());
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(TIME_LIMIT[difficulty]);
        setTimerActive(true);
      }
    }, 1500);
  }, [showFeedback, quiz, currentQ, difficulty, timeLeft, generateQuestion]);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAnswer(null); // Time's up
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft, handleAnswer]);

  // Toggle question type
  const toggleQuestionType = (type: QuestionType) => {
    setQuestionTypes(prev => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  // Render option based on question type
  const renderOption = (option: HieroglyphEntry) => {
    if (!currentQ) return null;

    switch (currentQ.type) {
      case 'symbol-to-meaning':
        return <span className="text-sm md:text-base">{option.meaning.split(',')[0]}</span>;
      case 'meaning-to-symbol':
      case 'pronunciation':
        return <span className="text-3xl md:text-4xl">{option.symbol}</span>;
      case 'category':
        return <span className="text-sm">{option.category}</span>;
      default:
        return null;
    }
  };

  // Get unique categories for category questions
  const getUniqueCategories = (options: HieroglyphEntry[]) => {
    const seen = new Set<string>();
    return options.filter(opt => {
      if (seen.has(opt.category)) return false;
      seen.add(opt.category);
      return true;
    });
  };

  const displayOptions = currentQ?.type === 'category'
    ? getUniqueCategories(currentQ.options)
    : currentQ?.options || [];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {gameState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <EgyptianCard variant="tomb" className="p-6 md:p-8">
              <div className="text-center mb-8">
                <span className="text-5xl mb-4 inline-block">𓏛</span>
                <h2 className="font-display text-3xl md:text-4xl text-gold-gradient mb-2">
                  Hieroglyph Challenge
                </h2>
                <p className="text-muted-foreground font-body">
                  Test your knowledge of ancient Egyptian writing
                </p>
              </div>

              {/* Difficulty Selection */}
              <div className="mb-8">
                <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gold" />
                  Difficulty
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`p-4 rounded-xl border-2 transition-all font-display capitalize ${difficulty === d
                        ? 'border-gold bg-gold/20 text-gold shadow-gold-glow'
                        : 'border-border bg-card hover:border-gold/50 text-foreground'
                        }`}
                    >
                      <div className="text-2xl mb-1">
                        {d === 'easy' && '🌱'}
                        {d === 'medium' && '⚡'}
                        {d === 'hard' && '🔥'}
                        {d === 'expert' && '💀'}
                      </div>
                      <div>{d}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {TIME_LIMIT[d]}s / {POINTS[d]}pts
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Types */}
              <div className="mb-8">
                <h3 className="font-display text-lg text-foreground mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-turquoise" />
                  Question Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { type: 'symbol-to-meaning' as QuestionType, label: 'Symbol → Meaning', icon: '𓂀 → ?', desc: 'Identify what a symbol means' },
                    { type: 'meaning-to-symbol' as QuestionType, label: 'Meaning → Symbol', icon: '? → 𓂀', desc: 'Find the symbol for a meaning' },
                    { type: 'pronunciation' as QuestionType, label: 'Pronunciation', icon: '𓂋 = r', desc: 'Match phonetic values' },
                    { type: 'category' as QuestionType, label: 'Category', icon: '📁', desc: 'Classify by Gardiner category' },
                  ].map(({ type, label, icon, desc }) => (
                    <button
                      key={type}
                      onClick={() => toggleQuestionType(type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${questionTypes.includes(type)
                        ? 'border-turquoise bg-turquoise/10 text-turquoise'
                        : 'border-border bg-card hover:border-turquoise/50 text-foreground'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-mono">{icon}</span>
                        <div>
                          <div className="font-display">{label}</div>
                          <div className="text-xs text-muted-foreground">{desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Button */}
              <div className="text-center">
                <EgyptianButton variant="hero" size="xl" onClick={startGame} shimmer>
                  <Sparkles className="w-5 h-5" />
                  Begin Challenge
                  <ArrowRight className="w-5 h-5" />
                </EgyptianButton>
                <p className="text-sm text-muted-foreground mt-3">
                  {QUESTIONS_PER_ROUND} questions • {TIME_LIMIT[difficulty]}s per question
                </p>
              </div>
            </EgyptianCard>
          </motion.div>
        )}

        {gameState === 'playing' && quiz && currentQ && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <EgyptianCard variant="tomb" className="p-6 md:p-8">
              {/* Header Stats */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="font-display text-lg">
                    <span className="text-gold">{quiz.currentQuestion + 1}</span>
                    <span className="text-muted-foreground">/{QUESTIONS_PER_ROUND}</span>
                  </div>
                  <div className="flex items-center gap-2 text-turquoise">
                    <Trophy className="w-5 h-5" />
                    <span className="font-display">{quiz.score}</span>
                  </div>
                  {quiz.streak > 1 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center gap-1 bg-gold/20 text-gold px-3 py-1 rounded-full"
                    >
                      <Zap className="w-4 h-4" />
                      <span className="font-display text-sm">{quiz.streak}x streak!</span>
                    </motion.div>
                  )}
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 font-display text-lg ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : timeLeft <= 10 ? 'text-gold' : 'text-foreground'
                  }`}>
                  <Clock className="w-5 h-5" />
                  <span>{timeLeft}s</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-turquoise to-gold"
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / TIME_LIMIT[difficulty]) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <h3 className="font-display text-xl md:text-2xl text-foreground mb-4">
                  {currentQ.question}
                </h3>

                {currentQ.displaySymbol && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-block"
                  >
                    <div className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-2xl bg-card border-2 border-gold/50 flex items-center justify-center shadow-gold-glow">
                      <span className="text-6xl md:text-8xl">{currentQ.correctAnswer.symbol}</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Options Grid */}
              <div className={`grid gap-3 ${displayOptions.length <= 4 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
                }`}>
                {displayOptions.map((option, idx) => {
                  const isSelected = selectedAnswer === option.gardinerCode;
                  const isCorrect = option.gardinerCode === currentQ.correctAnswer.gardinerCode;
                  const showResult = showFeedback && (isSelected || isCorrect);

                  return (
                    <motion.button
                      key={option.gardinerCode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleAnswer(option.gardinerCode)}
                      disabled={showFeedback}
                      className={`p-4 md:p-5 rounded-xl border-2 transition-all flex items-center justify-center ${showResult
                        ? isCorrect
                          ? 'border-green-500 bg-green-500/20 text-green-400'
                          : isSelected
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : 'border-border bg-card text-foreground opacity-50'
                        : 'border-border bg-card hover:border-gold/50 hover:bg-gold/5 text-foreground'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {showResult && (
                          isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                          ) : isSelected ? (
                            <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                          ) : null
                        )}
                        {renderOption(option)}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback Message */}
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 text-center"
                  >
                    <p className={`font-display text-lg ${selectedAnswer === currentQ.correctAnswer.gardinerCode ? 'text-green-400' : 'text-red-400'
                      }`}>
                      {selectedAnswer === currentQ.correctAnswer.gardinerCode
                        ? `Correct! +${POINTS[difficulty]} points`
                        : selectedAnswer === null
                          ? "Time's up!"
                          : `Wrong! It was ${currentQ.correctAnswer.name}`
                      }
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </EgyptianCard>
          </motion.div>
        )}

        {gameState === 'result' && quiz && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <EgyptianCard variant="tomb" className="p-6 md:p-8">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-block"
                >
                  <Trophy className="w-20 h-20 text-gold mx-auto mb-4" />
                </motion.div>
                <h2 className="font-display text-3xl md:text-4xl text-gold-gradient mb-2">
                  Challenge Complete!
                </h2>
                <p className="text-muted-foreground font-body">
                  You've proven your knowledge of ancient hieroglyphs
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-xl p-4 text-center border border-gold/30"
                >
                  <Trophy className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="font-display text-3xl text-gold">{quiz.score}</div>
                  <div className="text-sm text-muted-foreground">Total Score</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-card rounded-xl p-4 text-center border border-turquoise/30"
                >
                  <CheckCircle className="w-8 h-8 text-turquoise mx-auto mb-2" />
                  <div className="font-display text-3xl text-turquoise">
                    {quiz.answers.filter(a => a.correct).length}/{QUESTIONS_PER_ROUND}
                  </div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-card rounded-xl p-4 text-center border border-border"
                >
                  <Zap className="w-8 h-8 text-gold mx-auto mb-2" />
                  <div className="font-display text-3xl text-foreground">{quiz.maxStreak}</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-card rounded-xl p-4 text-center border border-border"
                >
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="font-display text-3xl text-foreground">
                    {Math.round(quiz.answers.reduce((sum, a) => sum + a.timeSpent, 0) / quiz.answers.length)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Time</div>
                </motion.div>
              </div>

              {/* Performance Rating */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => {
                    const percentage = (quiz.answers.filter(a => a.correct).length / QUESTIONS_PER_ROUND) * 100;
                    const filled = percentage >= (i + 1) * 20;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                      >
                        <Star
                          className={`w-8 h-8 ${filled ? 'text-gold fill-gold' : 'text-muted-foreground'}`}
                        />
                      </motion.div>
                    );
                  })}
                </div>
                <p className="font-display text-lg text-foreground">
                  {quiz.answers.filter(a => a.correct).length >= 9 ? 'Master Scribe!' :
                    quiz.answers.filter(a => a.correct).length >= 7 ? 'Expert Knowledge!' :
                      quiz.answers.filter(a => a.correct).length >= 5 ? 'Good Progress!' :
                        'Keep Studying!'}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <EgyptianButton variant="hero" size="lg" onClick={startGame}>
                  <RotateCcw className="w-5 h-5" />
                  Play Again
                </EgyptianButton>
                <EgyptianButton variant="outline" size="lg" onClick={() => setGameState('menu')}>
                  <BookOpen className="w-5 h-5" />
                  Change Settings
                </EgyptianButton>
              </div>
            </EgyptianCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
