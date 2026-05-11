export type PlayerSide = 'hounds' | 'jackals';

export type HoleType = 'normal' | 'safe' | 'bonus' | 'penalty' | 'shortcut_start' | 'shortcut_end';

export interface Peg {
  id: string;
  side: PlayerSide;
  position: number; // 0 to 29 (30 holes per track)
  isFinished: boolean;
  isInPlay: boolean;
}

export interface HoundsSettings {
  aiDifficulty: 'beginner' | 'normal' | 'pro';
  is3D: boolean;
}

export interface GameState {
  pegs: Peg[];
  currentPlayer: PlayerSide;
  throwResult: number;
  sticks: boolean[];
  isGameOver: boolean;
  winner: PlayerSide | null;
  moveLog: string[];
  history: GameState[];
  turnNumber: number;
}
