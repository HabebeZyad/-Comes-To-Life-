import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Brain, Crown, Star, Trophy } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGameAudio } from '@/hooks/useGameAudio';
import { useHighScores } from '@/hooks/useHighScores';

interface PharaohRiddlesGameProps {
  onBack: () => void;
}

interface Riddle {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const riddles: Riddle[] = [
  { question: "I am the god of the afterlife with the head of a jackal. I weigh hearts against the feather of Ma'at. Who am I?", options: ["Ra", "Anubis", "Horus", "Osiris"], correctAnswer: 1, explanation: "Anubis is the jackal-headed god who guides souls and weighs their hearts in the afterlife.", difficulty: 'easy' },
  { question: "I flow through Egypt, bringing life to the desert. Without me, civilization would not exist. What am I?", options: ["The Mediterranean Sea", "The Nile River", "The Red Sea", "The Sahara"], correctAnswer: 1, explanation: "The Nile River was the lifeline of ancient Egypt, providing water, food, and transportation.", difficulty: 'easy' },
  { question: "I stand guard with the body of a lion and the head of a pharaoh. I have witnessed millennia. What am I?", options: ["The Great Pyramid", "The Sphinx", "A Temple", "A Colossus"], correctAnswer: 1, explanation: "The Great Sphinx of Giza is one of the world's largest and oldest statues.", difficulty: 'easy' },
  { question: "I am the only surviving Wonder of the Ancient World. I was built as a tomb for Khufu. What am I?", options: ["The Hanging Gardens", "The Great Pyramid", "The Lighthouse", "The Temple of Artemis"], correctAnswer: 1, explanation: "The Great Pyramid of Giza is the oldest and only remaining Wonder of the Ancient World.", difficulty: 'medium' },
  { question: "I am a sacred writing system using pictures and symbols. Priests and scribes used me. What am I?", options: ["Cuneiform", "Hieroglyphics", "Latin", "Sanskrit"], correctAnswer: 1, explanation: "Hieroglyphics were the formal writing system of ancient Egypt.", difficulty: 'easy' },
  { question: "I am the falcon-headed god of the sky and kingship. My eye is a powerful symbol. Who am I?", options: ["Set", "Horus", "Thoth", "Sobek"], correctAnswer: 1, explanation: "Horus, the falcon god, was associated with pharaohs and his eye became a symbol of protection.", difficulty: 'medium' },
  { question: "I was the female pharaoh who dressed as a man and built great monuments. I ruled for over 20 years. Who am I?", options: ["Cleopatra", "Nefertiti", "Hatshepsut", "Nefertari"], correctAnswer: 2, explanation: "Hatshepsut was one of the most successful female pharaohs, known for her building projects.", difficulty: 'medium' },
  { question: "I am the young pharaoh whose tomb was discovered nearly intact in 1922. Who am I?", options: ["Ramesses II", "Tutankhamun", "Akhenaten", "Thutmose III"], correctAnswer: 1, explanation: "King Tutankhamun's tomb was discovered by Howard Carter, revealing incredible treasures.", difficulty: 'easy' },
  { question: "I am the process used to preserve bodies for the afterlife. What am I?", options: ["Cremation", "Burial", "Mummification", "Preservation"], correctAnswer: 2, explanation: "Mummification was the ancient Egyptian method of preserving bodies for eternal life.", difficulty: 'easy' },
  { question: "I am the last pharaoh of Egypt, known for my relationships with Caesar and Marc Antony. Who am I?", options: ["Cleopatra VII", "Nefertiti", "Hatshepsut", "Ankhesenamun"], correctAnswer: 0, explanation: "Cleopatra VII was the last active pharaoh of Egypt before it became a Roman province.", difficulty: 'medium' },
  { question: "I am the beetle sacred to ancient Egyptians, representing the sun and rebirth. What am I?", options: ["Beetle", "Scarab", "Locust", "Cricket"], correctAnswer: 1, explanation: "The scarab beetle was sacred, symbolizing the sun god Khepri and the cycle of rebirth.", difficulty: 'easy' },
  { question: "I am the goddess of magic, motherhood, and healing. I am the wife of Osiris. Who am I?", options: ["Hathor", "Bastet", "Isis", "Sekhmet"], correctAnswer: 2, explanation: "Isis was one of the most important goddesses, known for her magical powers and devotion.", difficulty: 'medium' },
  { question: "We are the massive stone coffins used to bury pharaohs. What are we called?", options: ["Crypts", "Sarcophagi", "Tombs", "Vaults"], correctAnswer: 1, explanation: "Sarcophagi are stone coffins, often elaborately decorated with hieroglyphics.", difficulty: 'medium' },
  { question: "I am the ancient Egyptian concept of truth, justice, and cosmic order. What am I?", options: ["Ka", "Ba", "Ma'at", "Akh"], correctAnswer: 2, explanation: "Ma'at represented truth and order, symbolized by a feather used in the weighing of hearts.", difficulty: 'hard' },
  { question: "I am the plant that grows along the Nile, used to make paper in ancient times. What am I?", options: ["Reed", "Papyrus", "Lotus", "Palm"], correctAnswer: 1, explanation: "Papyrus was used to make an early form of paper and was crucial for record-keeping.", difficulty: 'medium' },
];

export function PharaohRiddlesGame({ onBack }: PharaohRiddlesGameProps) {
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [wisdom, setWisdom] = useState(0);
  const { playSound, startAmbientMusic, stopAmbientMusic } = useGameAudio();
  const { addScore } = useHighScores();
  const [musicStarted, setMusicStarted] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    if (!musicStarted) {
      startAmbientMusic();
      setMusicStarted(true);
    }

    const correct = answerIndex === riddles[currentRiddle].correctAnswer;
    
    if (correct) {
      playSound('correct');
      const points = riddles[currentRiddle].difficulty === 'easy' ? 10 : 
                     riddles[currentRiddle].difficulty === 'medium' ? 20 : 30;
      setScore(score + points);
      setWisdom(wisdom + 1);
    } else {
      playSound('wrong');
      setLives(lives - 1);
    }
    
    setShowExplanation(true);
  };

  const nextRiddle = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    playSound('click');
    
    if (lives <= 0 || currentRiddle >= riddles.length - 1) {
      setGameOver(true);
      stopAmbientMusic();
      if (wisdom >= 5) {
        playSound('victory');
      } else {
        playSound('defeat');
      }
      addScore({ playerName: 'Explorer', score, game: 'riddles', details: `${wisdom} correct answers` });
    } else {
      setCurrentRiddle(currentRiddle + 1);
    }
  };

  const resetGame = () => {
    setCurrentRiddle(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setGameOver(false);
    setWisdom(0);
    setMusicStarted(false);
    playSound('gameStart');
  };

  const riddle = riddles[currentRiddle];

  return (
    <div className="min-h-screen pt-20 pb-28 md:pb-12 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => { stopAmbientMusic(); onBack(); }}
            className="flex items-center gap-2 text-primary hover:text-gold-light transition-colors mb-4 font-body text-lg"
          >
            <ArrowLeft size={20} />
            Back to Games
          </button>
          <h1 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">Pharaoh's Riddles</h1>
          <p className="text-xl text-muted-foreground font-body">Answer the sphinx's riddles and prove your wisdom</p>
        </div>

        <EgyptianCard variant="gold" padding="lg" className="relative overflow-hidden">
          <div className="relative">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <div className="flex items-center gap-2 bg-gold-dark/30 px-4 py-2 rounded-lg border border-gold/30">
                <Trophy className="text-primary" size={24} />
                <span className="text-2xl text-foreground font-body">{score}</span>
              </div>
              <div className="flex items-center gap-2 bg-lapis/30 px-4 py-2 rounded-lg border border-lapis-light/30">
                <Brain className="text-turquoise" size={24} />
                <span className="text-xl text-foreground font-body">Wisdom: {wisdom}</span>
              </div>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${i < lives ? 'bg-primary' : 'bg-muted'} flex items-center justify-center border border-gold-light/30`}>
                    <Crown className="text-primary-foreground" size={16} />
                  </div>
                ))}
              </div>
            </div>

            {!gameOver ? (
              <AnimatePresence mode="wait">
                <motion.div key={currentRiddle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-body ${riddle.difficulty === 'easy' ? 'bg-scarab text-foreground' : riddle.difficulty === 'medium' ? 'bg-primary text-primary-foreground' : 'bg-terracotta text-foreground'}`}>
                        {riddle.difficulty.toUpperCase()}
                      </span>
                      <span className="text-muted-foreground font-body">Riddle {currentRiddle + 1} of {riddles.length}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-to-r from-gold-dark to-primary h-2 rounded-full transition-all duration-300" style={{ width: `${((currentRiddle + 1) / riddles.length) * 100}%` }}></div>
                    </div>
                  </div>

                  <div className="text-center text-8xl mb-6">?«Œ?</div>

                  <EgyptianCard variant="tomb" padding="lg">
                    <p className="text-2xl text-foreground font-body leading-relaxed text-center">"{riddle.question}"</p>
                  </EgyptianCard>

                  {!showExplanation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {riddle.options.map((option, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className="p-6 bg-card hover:bg-muted rounded-xl text-lg text-foreground font-body border-2 border-gold/30 hover:border-gold/50 transition-all duration-200 text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-primary-foreground font-display">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {showExplanation && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                      <div className={`p-6 rounded-xl ${selectedAnswer === riddle.correctAnswer ? 'bg-scarab/50 border border-turquoise/30' : 'bg-terracotta/50 border border-terracotta/30'} text-foreground`}>
                        <p className="text-2xl mb-2 flex items-center gap-2 font-display">
                          {selectedAnswer === riddle.correctAnswer ? <>Ÿ£– Correct! Well done, wise one!</> : <>Ÿ≈Ó Incorrect. The answer was: {riddle.options[riddle.correctAnswer]}</>}
                        </p>
                        <p className="text-lg opacity-90 font-body">{riddle.explanation}</p>
                      </div>
                      <EgyptianButton variant="hero" size="lg" shimmer onClick={nextRiddle} className="w-full">
                        {lives <= 0 || currentRiddle >= riddles.length - 1 ? 'See Results' : 'Next Riddle'}
                      </EgyptianButton>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="text-8xl mb-6">{wisdom >= 10 ? '?«¯¯' : wisdom >= 5 ? 'Ÿ’?' : '?«Ù£'}</div>
                <h2 className="text-5xl font-display text-gold-gradient mb-4">
                  {wisdom >= 10 ? 'Supreme Wisdom!' : wisdom >= 5 ? 'Well Done!' : 'Keep Learning!'}
                </h2>
                <div className="space-y-3 mb-8">
                  <p className="text-3xl text-foreground font-body">Score: {score}</p>
                  <p className="text-2xl text-muted-foreground font-body">Correct Answers: {wisdom}</p>
                  <div className="flex items-center justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={i < Math.floor(wisdom / 3) ? 'text-primary fill-primary' : 'text-muted'} size={32} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <EgyptianButton variant="default" size="lg" onClick={resetGame}>Try Again</EgyptianButton>
                  <EgyptianButton variant="lapis" size="lg" onClick={() => { stopAmbientMusic(); onBack(); }}>Back to Games</EgyptianButton>
                </div>
              </motion.div>
            )}
          </div>
        </EgyptianCard>
      </div>
    </div>
  );
}
