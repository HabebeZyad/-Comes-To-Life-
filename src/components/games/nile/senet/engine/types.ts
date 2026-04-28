
export type Player = 'player1' | 'player2';

export type SquareType = 'normal' | 'rebirth' | 'happiness' | 'water' | 'three-truths' | 're-atum' | 'last';

export interface Square {
  id: number; // 1 to 30
  type: SquareType;
  piece: Player | null;
}

export type RuleMode = 'historical' | 'modern' | 'fast';

export type AIDifficulty = 'beginner' | 'normal' | 'pro';

export interface GameState {
  board: Square[];
  currentPlayer: Player;
  sticks: boolean[]; // true = flat/white, false = rounded/black
  throwResult: number;
  winner: Player | null;
  history: GameState[];
  turnCount: number;
  isGameOver: boolean;
  extraTurn: boolean;
  moveLog: string[];
  piecesOffBoard: Record<Player, number>;
}

export interface SenetSettings {
  ruleMode: RuleMode;
  aiDifficulty: AIDifficulty;
  is3D: boolean;
}
