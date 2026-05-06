export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
}

export const achievements: Achievement[] = [
  { id: 'first-choice', title: 'Path Chosen', description: 'Made your first moral choice', icon: '𓃀', rarity: 'common' },
  { id: 'truth-seeker', title: 'Truth Seeker', description: 'Chose truth in Episode 3', icon: '𓂋', rarity: 'rare' },
  { id: 'tomb-explorer', title: 'Tomb Explorer', description: 'Completed your first tomb', icon: '𓊖', rarity: 'common' },
  { id: 'hieroglyph-master', title: 'Hieroglyph Master', description: 'Scanned 20 hieroglyphs', icon: '𓏤', rarity: 'epic' },
  { id: 'coop-champion', title: 'Co-op Champion', description: 'Completed 5 co-op sessions', icon: '𓅃', rarity: 'rare' },
  { id: 'all-endings', title: 'Keeper of Fates', description: 'Unlocked all story endings', icon: '𓋹', rarity: 'legendary' },
  { id: 'speed-reader', title: 'Swift Scribe', description: 'Read 3 stories in one session', icon: '𓏞', rarity: 'rare' },
  { id: 'puzzle-king', title: 'Riddle of the Sphinx', description: 'Solved 10 puzzles', icon: '𓃬', rarity: 'epic' },
  { id: 'lore-keeper', title: 'Keeper of Scrolls', description: 'Unlocked all historical notes', icon: '𓏛', rarity: 'legendary' },
];
