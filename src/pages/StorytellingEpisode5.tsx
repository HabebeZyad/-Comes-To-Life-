import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { useGame } from '@/contexts/GameContext';
import { storytellingEpisode5 } from '@/data/storytellingEpisode5';
import { InteractiveEpisode, StoryPanel, AdventureChoice } from '@/types/game';
import { DustParticles } from '@/components/effects/DustParticles';

// Import storytelling panel images (using placeholders)
import panelCover from '@/assets/hero-tomb.jpg';
import panel1 from '@/assets/storytelling/ep3-panel1.jpg';
import panel2 from '@/assets/storytelling/ep3-panel2.jpg';
import panel3 from '@/assets/storytelling/ep3-panel3.jpg';
import panel4 from '@/assets/storytelling/ep3-panel4.jpg';
import panel5 from '@/assets/storytelling/ep3-panel5.jpg';

const panelImages: Record<string, string> = {
  'ep5-panel-1': panel1,
  'ep5-panel-2': panel2,
  'ep5-panel-3': panel3,
  'ep5-panel-4': panel4,
  'ep5-panel-5': panel5,
  // Add more panels as needed
};

export default function StorytellingEpisode5() {
  const { addStoryChoice, narrationEnabled, setNarrationEnabled } = useGame();
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showChoiceConsequence, setShowChoiceConsequence] = useState(false);
  const [panelHistory, setPanelHistory] = useState<string[]>(['ep5-panel-1']);

  const episode = storytellingEpisode5;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPanelIndex]);

  const getCurrentPanel = (): StoryPanel => {
    const currentId = panelHistory[currentPanelIndex];
    return episode.panels.find(p => p.id === currentId) || episode.panels[0];
  };

  const currentPanel = getCurrentPanel();
  const isLastPanel = !currentPanel.choices && (episode.panels.findIndex(p => p.id === currentPanel.id) === episode.panels.length - 1);
  const hasChoices = currentPanel.choices && currentPanel.choices.length > 0;

  const handleNext = () => {
    if (hasChoices && !selectedChoice) return;

    if (selectedChoice && currentPanel.choices) {
      const choice = currentPanel.choices.find(c => c.id === selectedChoice);
      if (choice) {
        setPanelHistory(prev => [...prev.slice(0, currentPanelIndex + 1), choice.leadsTo]);
        setCurrentPanelIndex(prev => prev + 1);
        setSelectedChoice(null);
        setShowChoiceConsequence(false);

        addStoryChoice({
          episodeId: 5,
          choiceId: choice.id,
          optionSelected: choice.text,
          timestamp: new Date(),
          consequences: [choice.consequence],
        });
      }
    } else if (!hasChoices) {
      const currentIdxInEpisode = episode.panels.findIndex(p => p.id === currentPanel.id);
      const nextPanelInSequence = episode.panels[currentIdxInEpisode + 1];
      if (nextPanelInSequence) {
        setPanelHistory(prev => [...prev.slice(0, currentPanelIndex + 1), nextPanelInSequence.id]);
        setCurrentPanelIndex(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(prev => prev - 1);
      setSelectedChoice(null);
      setShowChoiceConsequence(false);
    }
  };

  const handleChoiceSelect = (choice: AdventureChoice) => {
    setSelectedChoice(choice.id);
    setShowChoiceConsequence(true);
  };

  const handleRestart = () => {
    setCurrentPanelIndex(0);
    setPanelHistory(['ep5-panel-1']);
    setSelectedChoice(null);
    setShowChoiceConsequence(false);
  };

  const getPanelImage = (panelId: string) => {
    return panelImages[panelId] || panelCover;
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <DustParticles count={15} />

      <div className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/storytelling">
            <EgyptianButton variant="ghost" size="sm">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Storytelling Home</span>
            </EgyptianButton>
          </Link>

          <div className="text-center">
            <span className="font-display text-sm text-muted-foreground hidden sm:block">Episode 5</span>
            <span className="font-display text-lg text-gold-gradient">The Heretic Pharaoh</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNarrationEnabled(!narrationEnabled)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label={narrationEnabled ? 'Disable narration' : 'Enable narration'}
            >
              {narrationEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <EgyptianButton variant="ghost" size="sm" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Restart</span>
            </EgyptianButton>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-5xl mt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPanel.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <EgyptianCard variant="tomb" padding="none" className="overflow-hidden mb-6">
              <div className="relative h-[65vh] bg-black">
                <img
                  src={getPanelImage(currentPanel.id)}
                  alt={`Panel ${currentPanelIndex + 1}`}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                {currentPanel.narration && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-0 left-0 right-0 p-6"
                  >
                    <div className="bg-black/70 backdrop-blur-sm border border-gold/20 rounded-xl p-4 max-w-3xl mx-auto">
                      <p className="font-body text-base sm:text-lg text-white/90 italic text-center leading-relaxed">
                        {currentPanel.narration}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </EgyptianCard>

            {currentPanel.dialogue && (
              <div className="space-y-4 mb-6">
                {currentPanel.dialogue.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.15 }}
                  >
                    <p className="font-display text-sm text-gold mb-1">{line.speaker}</p>
                    <p className="font-body text-base sm:text-lg bg-card p-3 rounded-lg border border-border">{line.text}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {hasChoices && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 bg-card border border-gold/30 rounded-xl p-6"
              >
                <div className="text-center mb-4">
                  <h3 className="font-display text-2xl text-gold-gradient">Your Decision</h3>
                  <p className="text-muted-foreground font-body">Choose a path to continue the story.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {currentPanel.choices!.map((choice) => (
                    <motion.button
                      key={choice.id}
                      onClick={() => handleChoiceSelect(choice)}
                      className={`text-left p-4 rounded-lg border-2 transition-colors duration-300 h-full flex flex-col justify-between ${selectedChoice === choice.id ? 'border-gold bg-gold/10' : 'border-border hover:border-gold/50 bg-background/50'}`}
                      whileHover={{ scale: 1.03 }}
                    >
                      <div>
                        <p className="font-body text-foreground mb-2">{choice.text}</p>
                      </div>
                      {selectedChoice === choice.id && showChoiceConsequence && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-muted-foreground italic mt-2"
                        >
                          {choice.consequence}
                        </motion.p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8 py-4 border-t border-border">
          <EgyptianButton
            variant="outline"
            onClick={handlePrev}
            disabled={currentPanelIndex === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </EgyptianButton>
          <span className="font-display text-muted-foreground">
            Panel {currentPanelIndex + 1} / {panelHistory.length}
          </span>
          <EgyptianButton
            variant={isLastPanel ? 'turquoise' : 'default'}
            onClick={handleNext}
            disabled={hasChoices && !selectedChoice}
          >
            {isLastPanel ? 'Finish Episode' : 'Next'}
            {!isLastPanel && <ChevronRight className="w-4 h-4 ml-2" />}
          </EgyptianButton>
        </div>

        <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-turquoise"
            animate={{ width: `${(currentPanelIndex + 1) / panelHistory.length * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </main>
    </div>
  );
}
