import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerProfile, MangaProgress, TombProgress, StoryChoice, Achievement, MuseumSettings } from '@/types/game';

interface GameContextType {
  profile: PlayerProfile | null;
  setProfile: (profile: PlayerProfile) => void;
  updateMangaProgress: (progress: Partial<MangaProgress>) => void;
  updateTombProgress: (progress: Partial<TombProgress>) => void;
  addStoryChoice: (choice: StoryChoice) => void;
  unlockAchievement: (achievementId: string) => void;
  unlockEnding: (endingId: string) => void;
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
  mangaProgress: {
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

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('comesToLife_profile');
    const savedMuseumSettings = localStorage.getItem('comesToLife_museumSettings');
    
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
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

  const updateMangaProgress = (progress: Partial<MangaProgress>) => {
    if (profile) {
      setProfileState({
        ...profile,
        mangaProgress: { ...profile.mangaProgress, ...progress },
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
      const updatedAchievements = profile.achievements.map(a =>
        a.id === achievementId ? { ...a, unlockedAt: new Date() } : a
      );
      setProfileState({
        ...profile,
        achievements: updatedAchievements,
        lastPlayed: new Date(),
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
      updateMangaProgress,
      updateTombProgress,
      addStoryChoice,
      unlockAchievement,
      unlockEnding,
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
