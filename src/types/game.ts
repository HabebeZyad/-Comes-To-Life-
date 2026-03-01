export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  lastPlayed: Date;

  // Story progress
  storyProgress: EpisodeProgress;
  tombProgress: TombProgress;

  // Achievements
  achievements: Achievement[];

  // Choices that affect the game
  storyChoices: StoryChoice[];

  // Endings unlocked
  endingsUnlocked: string[];

  // Stats
  totalPlayTime: number;
  hieroglyphsScanned: number;
  puzzlesSolved: number;
}

export interface EpisodeProgress {
  episodesCompleted: number[];
  currentEpisode: number;
  currentPanel: number;
  choicesMade: Record<string, string>;
}

export interface TombProgress {
  tombsExplored: string[];
  tombsCompleted: string[];
  currentTomb: string | null;
  coopSessions: number;
  puzzlesSolved: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date | null;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface StoryChoice {
  episodeId: number;
  choiceId: string;
  optionSelected: string;
  timestamp: Date;
  consequences: string[];
}

export interface StoryPanel {
  id: string;
  imageUrl: string;
  narration: string;
  dialogue?: {
    speaker: string;
    text: string;
    position: 'left' | 'right' | 'center';
  }[];
  choices?: AdventureChoice[];
  effects?: PanelEffect[];
}

export interface AdventureChoice {
  id: string;
  text: string;
  consequence: string;
  leadsTo: string;
  affectsEnding: boolean;
  morality: 'truth' | 'deception' | 'neutral';
}

export interface PanelEffect {
  type: 'shake' | 'flash' | 'fade' | 'zoom' | 'dust';
  intensity: number;
  duration: number;
}

export interface InteractiveEpisode {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  panels: StoryPanel[];
  characters: Character[];
  unlockRequirements?: string[];
}

export interface Character {
  id: string;
  name: string;
  title: string;
  avatar: string;
  description: string;
  alignment: 'protagonist' | 'antagonist' | 'neutral';
}

export interface TombRoom {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  puzzles: Puzzle[];
  exits: Exit[];
  artifacts: Artifact[];
  hieroglyphs: Hieroglyph[];
}

export interface Puzzle {
  id: string;
  type: 'pressure-plate' | 'mirror' | 'lever' | 'sequence' | 'riddle' | 'timed';
  name: string;
  description: string;
  solved: boolean;
  requiredPlayers: number;
  solution: string[];
  hints: string[];
  reward: string;
}

export interface Exit {
  id: string;
  direction: 'north' | 'south' | 'east' | 'west';
  leadsTo: string;
  locked: boolean;
  unlockCondition?: string;
}

export interface Artifact {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  loreText: string;
  collected: boolean;
}

export interface Hieroglyph {
  id: string;
  symbol: string;
  meaning: string;
  pronunciation: string;
  lore: string;
  unlocksStory?: string;
  unlocksPuzzle?: string;
}

export interface CoopSession {
  id: string;
  hostId: string;
  players: CoopPlayer[];
  currentRoom: string;
  puzzleStates: Record<string, boolean>;
  signals: Signal[];
}

export interface CoopPlayer {
  id: string;
  name: string;
  role: 'reader' | 'solver' | 'watcher';
  position: { x: number; y: number };
  isReady: boolean;
}

export interface Signal {
  id: string;
  playerId: string;
  type: 'look' | 'come' | 'wait' | 'danger' | 'found';
  position: { x: number; y: number };
  timestamp: Date;
}

export interface MuseumSettings {
  kioskMode: boolean;
  touchNavigation: boolean;
  largeText: boolean;
  highContrast: boolean;
  autoNarration: boolean;
  idleTimeout: number;
  attractLoop: boolean;
  curatorLock: boolean;
  sequencedContent: string[];
}
