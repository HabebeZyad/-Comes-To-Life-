import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { PlayerProfile, EpisodeProgress, TombProgress, StoryChoice, MuseumSettings } from '@/types/game';
import type { AuthUser } from '@/types/auth';
import { achievements as achievementData } from '@/data/achievements';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

const LEGACY_PROFILE_KEY = 'comesToLife_profile';
const GUEST_PROFILE_KEY = 'comesToLife_profile_guest';

const getProfileStorageKey = (userId?: string) =>
  userId ? `comesToLife_profile_${userId}` : GUEST_PROFILE_KEY;

const createDefaultProfile = (user?: AuthUser | null): PlayerProfile => ({
  id: user?.id || crypto.randomUUID(),
  authUserId: user?.id,
  email: user?.email,
  name: user?.name || 'Explorer',
  avatar: user?.avatar || 'CT',
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
});

const parseStoredProfile = (value: string | null) => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    if (parsed.mangaProgress && !parsed.storyProgress) {
      parsed.storyProgress = parsed.mangaProgress;
      delete parsed.mangaProgress;
    }

    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      lastPlayed: new Date(parsed.lastPlayed),
      storyProgress: {
        episodesCompleted: parsed.storyProgress?.episodesCompleted || [],
        currentEpisode: parsed.storyProgress?.currentEpisode || 1,
        currentPanel: parsed.storyProgress?.currentPanel || 0,
        choicesMade: parsed.storyProgress?.choicesMade || {},
      },
      tombProgress: {
        tombsExplored: parsed.tombProgress?.tombsExplored || [],
        tombsCompleted: parsed.tombProgress?.tombsCompleted || [],
        currentTomb: parsed.tombProgress?.currentTomb || null,
        coopSessions: parsed.tombProgress?.coopSessions || 0,
        puzzlesSolved: parsed.tombProgress?.puzzlesSolved || 0,
      },
      achievements: parsed.achievements || [],
      storyChoices: parsed.storyChoices || [],
      endingsUnlocked: parsed.endingsUnlocked || [],
      totalPlayTime: parsed.totalPlayTime || 0,
      hieroglyphsScanned: parsed.hieroglyphsScanned || 0,
      puzzlesSolved: parsed.puzzlesSolved || 0,
    } as PlayerProfile;
  } catch {
    return null;
  }
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
  const { user, isLoading: authLoading } = useAuth();
  const [profile, setProfileState] = useState<PlayerProfile | null>(null);
  const [museumSettings, setMuseumSettingsState] = useState<MuseumSettings>(defaultMuseumSettings);
  const [isMuseumMode, setIsMuseumMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [narrationEnabled, setNarrationEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (authLoading) return;

    const storageKey = getProfileStorageKey(user?.id);
    const savedProfile = parseStoredProfile(localStorage.getItem(storageKey));
    const legacyProfile = parseStoredProfile(localStorage.getItem(LEGACY_PROFILE_KEY));
    const guestProfile = user ? parseStoredProfile(localStorage.getItem(GUEST_PROFILE_KEY)) : null;
    const savedMuseumSettings = localStorage.getItem('comesToLife_museumSettings');

    if (savedProfile) {
      setProfileState({
        ...savedProfile,
        id: user?.id || savedProfile.id,
        authUserId: user?.id,
        email: user?.email || savedProfile.email,
        name: user?.name || savedProfile.name,
        avatar: user?.avatar || savedProfile.avatar,
      });
    } else if (user && guestProfile) {
      setProfileState({
        ...guestProfile,
        id: user.id,
        authUserId: user.id,
        email: user.email,
        name: user.name || guestProfile.name,
        avatar: user.avatar || guestProfile.avatar,
        lastPlayed: new Date(),
      });
    } else if (!user && legacyProfile) {
      setProfileState(legacyProfile);
    } else {
      setProfileState(createDefaultProfile(user));
    }

    if (savedMuseumSettings) {
      setMuseumSettingsState(JSON.parse(savedMuseumSettings));
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (profile && !authLoading) {
      localStorage.setItem(getProfileStorageKey(user?.id), JSON.stringify(profile));
    }
  }, [authLoading, profile, user?.id]);

  useEffect(() => {
    localStorage.setItem('comesToLife_museumSettings', JSON.stringify(museumSettings));
  }, [museumSettings]);

  const setProfile = (newProfile: PlayerProfile) => {
    setProfileState({
      ...newProfile,
      id: user?.id || newProfile.id,
      authUserId: user?.id,
      email: user?.email || newProfile.email,
      lastPlayed: new Date(),
    });
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
      const alreadyUnlocked = profile.achievements.find((achievement) => achievement.id === achievementId && achievement.unlockedAt);
      if (alreadyUnlocked) return;

      const achievement = achievementData.find((entry) => entry.id === achievementId);
      if (!achievement) return;

      const updatedAchievements = [
        ...profile.achievements.filter((entry) => entry.id !== achievementId),
        { ...achievement, unlockedAt: new Date() }
      ];

      setProfileState({
        ...profile,
        achievements: updatedAchievements,
        lastPlayed: new Date(),
      });

      toast({
        title: 'Achievement Unlocked',
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
        title: 'New Ending Unlocked',
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

      if (newCount === 1) unlockAchievement('hieroglyph-master');
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
    setProfileState(createDefaultProfile(user));
  };

  const setMuseumSettings = (settings: Partial<MuseumSettings>) => {
    setMuseumSettingsState((previous) => ({ ...previous, ...settings }));
  };

  const toggleMuseumMode = () => {
    setIsMuseumMode((previous) => !previous);
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

