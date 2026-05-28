import { LucideIcon } from 'lucide-react';

export type Player = 'player1' | 'player2' | 'player3' | 'player4' | 'player5' | 'player6';

export type SpaceType = 'normal' | 'safe' | 'trap' | 'leap' | 'protection' | 'duel' | 'head' | 'tail';

export type RuleMode = 'historical' | 'casual' | 'strategic';

export type AIDifficulty = 'beginner' | 'normal' | 'pro';

export interface Piece {
  id: string;
  owner: Player;
  position: number; // 0 is tail, boardSize is head
  isLion: boolean; // Lions are special pieces that can capture others
  isHome: boolean;
  isFinished: boolean;
}

export interface MehenSettings {
  boardSize: number;
  playersCount: number;
  ruleMode: RuleMode;
  aiDifficulty: AIDifficulty;
  is3D: boolean;
}

export interface GameState {
  pieces: Piece[];
  currentPlayer: Player;
  throwResult: number;
  sticks: boolean[];
  isGameOver: boolean;
  winner: Player | null;
  moveLog: string[];
  history: GameState[];
  turnNumber: number;
}
