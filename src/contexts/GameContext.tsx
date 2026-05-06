import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerProfile, EpisodeProgress, TombProgress, StoryChoice, Achievement, MuseumSettings } from '@/types/game';
import { achievements as achievementData } from '@/data/achievements';
import { useToast } from '@/hooks/use-toast';

interface GameContextType {
  profile: PlayerProfile | null;
  setProfile: (profile: PlayerProfile) => void;
  updateStoryProgress: (progress: Partial<EpisodeProgress>) => void;
  updateTombProgress: (progress: Partial<TombProgress>) => void;
  addStoryChoice: (choice: StoryChoice) => void;
  unlockAchievement: (achievementId: string) => void;
  unlockEnding: (endingId: string) => void;
  incrementHieroglyphsScanned: () => void;
  incrementPuzzlesSolved: () => void;
  recordPlayTime: (minutes: number) => void;
  resetProgress: () => void;

  // Museum mode
  museumSettings: MuseumSettings;
  setMuseumSettings: (settings: Partial<MuseumSettings>) => void;
  isMuseumMode: boolean;
  toggleMuseumMode: () => void;

  // Audio settings
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  narrationEnabled: boolean;
  setNarrationEnabled: (enabled: boolean) => void;
}

const defaultProfile: PlayerProfile = {
  id: crypto.randomUUID(),
  name: 'Explorer',
  avatar: '🏺',
  createdAt: new Date(),
  lastPlayed: new Date(),
  storyProgress: {
    episodesCompleted: [],
    currentEpisode: 1,
    currentPanel: 0,
    choicesMade: {},
  },
  tombProgress: {
    tombsExplored: [],
    tombsCompleted: [],
    currentTomb: null,
    coopSessions: 0,
    puzzlesSolved: 0,
  },
  achievements: [],
  storyChoices: [],
  endingsUnlocked: [],
  totalPlayTime: 0,
  hieroglyphsScanned: 0,
  puzzlesSolved: 0,
};

const defaultMuseumSettings: MuseumSettings = {
  kioskMode: false,
  touchNavigation: true,
  largeText: false,
  highContrast: false,
  autoNarration: false,
  idleTimeout: 60,
  attractLoop: true,
  curatorLock: false,
  sequencedContent: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<PlayerProfile | null>(null);
  const [museumSettings, setMuseumSettingsState] = useState<MuseumSettings>(defaultMuseumSettings);
  const [isMuseumMode, setIsMuseumMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('comesToLife_profile');
    const savedMuseumSettings = localStorage.getItem('comesToLife_museumSettings');

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);

      // Migration: legacy progress -> storyProgress
      if (parsed.mangaProgress && !parsed.storyProgress) {
        parsed.storyProgress = parsed.mangaProgress;
        delete parsed.mangaProgress;
      }

      parsed.createdAt = new Date(parsed.createdAt);
      parsed.lastPlayed = new Date(parsed.lastPlayed);
      setProfileState(parsed);
    } else {
      setProfileState(defaultProfile);
    }

    if (savedMuseumSettings) {
      setMuseumSettingsState(JSON.parse(savedMuseumSettings));
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('comesToLife_profile', JSON.stringify(profile));
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('comesToLife_museumSettings', JSON.stringify(museumSettings));
  }, [museumSettings]);

  const setProfile = (newProfile: PlayerProfile) => {
    setProfileState({ ...newProfile, lastPlayed: new Date() });
  };

  const updateStoryProgress = (progress: Partial<EpisodeProgress>) => {
    if (profile) {
      setProfileState({
        ...profile,
        storyProgress: { ...profile.storyProgress, ...progress },
        lastPlayed: new Date(),
      });
    }
  };

  const updateTombProgress = (progress: Partial<TombProgress>) => {
    if (profile) {
      setProfileState({
        ...profile,
        tombProgress: { ...profile.tombProgress, ...progress },
        lastPlayed: new Date(),
      });
    }
  };

  const addStoryChoice = (choice: StoryChoice) => {
    if (profile) {
      setProfileState({
        ...profile,
        storyChoices: [...profile.storyChoices, choice],
        lastPlayed: new Date(),
      });
    }
  };

  const unlockAchievement = (achievementId: string) => {
    if (profile) {
      const alreadyUnlocked = profile.achievements.find(a => a.id === achievementId && a.unlockedAt);
      if (alreadyUnlocked) return;

      const achievement = achievementData.find(a => a.id === achievementId);
      if (!achievement) return;

      const updatedAchievements = [
        ...profile.achievements.filter(a => a.id !== achievementId),
        { ...achievement, unlockedAt: new Date() }
      ];

      setProfileState({
        ...profile,
        achievements: updatedAchievements,
        lastPlayed: new Date(),
      });

      toast({
        title: "Achievement Unlocked! 🏆",
        description: achievement.title,
      });
    }
  };

  const unlockEnding = (endingId: string) => {
    if (profile && !profile.endingsUnlocked.includes(endingId)) {
      setProfileState({
        ...profile,
        endingsUnlocked: [...profile.endingsUnlocked, endingId],
        lastPlayed: new Date(),
      });
      
      toast({
        title: "New Ending Unlocked! ✨",
        description: `You've discovered: ${endingId}`,
      });

      if (profile.endingsUnlocked.length + 1 >= 4) {
        unlockAchievement('all-endings');
      }
    }
  };

  const incrementHieroglyphsScanned = () => {
    if (profile) {
      const newCount = profile.hieroglyphsScanned + 1;
      setProfileState({
        ...profile,
        hieroglyphsScanned: newCount,
        lastPlayed: new Date(),
      });

      if (newCount === 1) unlockAchievement('hieroglyph-master'); // Or a smaller one
      if (newCount === 20) unlockAchievement('hieroglyph-master');
    }
  };

  const incrementPuzzlesSolved = () => {
    if (profile) {
      const newCount = (profile.puzzlesSolved || 0) + 1;
      const newTombPuzzles = (profile.tombProgress.puzzlesSolved || 0) + 1;
      
      setProfileState({
        ...profile,
        puzzlesSolved: newCount,
        tombProgress: {
          ...profile.tombProgress,
          puzzlesSolved: newTombPuzzles
        },
        lastPlayed: new Date(),
      });

      if (newCount === 1) unlockAchievement('tomb-explorer');
      if (newCount === 10) unlockAchievement('puzzle-king');
    }
  };

  const recordPlayTime = (minutes: number) => {
    if (profile) {
      setProfileState({
        ...profile,
        totalPlayTime: profile.totalPlayTime + minutes,
        lastPlayed: new Date(),
      });
    }
  };

  const resetProgress = () => {
    setProfileState({ ...defaultProfile, id: crypto.randomUUID() });
  };

  const setMuseumSettings = (settings: Partial<MuseumSettings>) => {
    setMuseumSettingsState(prev => ({ ...prev, ...settings }));
  };

  const toggleMuseumMode = () => {
    setIsMuseumMode(prev => !prev);
  };

  return (
    <GameContext.Provider value={{
      profile,
      setProfile,
      updateStoryProgress,
      updateTombProgress,
      addStoryChoice,
      unlockAchievement,
      unlockEnding,
      incrementHieroglyphsScanned,
      incrementPuzzlesSolved,
      recordPlayTime,
      resetProgress,
      museumSettings,
      setMuseumSettings,
      isMuseumMode,
      toggleMuseumMode,
      audioEnabled,
      setAudioEnabled,
      narrationEnabled,
      setNarrationEnabled,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
