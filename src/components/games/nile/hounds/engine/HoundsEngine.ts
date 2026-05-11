import { GameState, PlayerSide, Peg, HoleType } from './types';

export class HoundsEngine {
  static TRACK_LENGTH = 29;

  static createInitialState(): GameState {
    const pegs: Peg[] = [];
    
    // 5 hounds and 5 jackals
    for (let i = 0; i < 5; i++) {
      pegs.push({ id: `hound-${i}`, side: 'hounds', position: -1, isFinished: false, isInPlay: false });
      pegs.push({ id: `jackal-${i}`, side: 'jackals', position: -1, isFinished: false, isInPlay: false });
    }

    return {
      pegs,
      currentPlayer: 'hounds',
      throwResult: 0,
      sticks: [true, true, true, true],
      isGameOver: false,
      winner: null,
      moveLog: ['Hounds vs Jackals begins.'],
      history: [],
      turnNumber: 1,
    };
  }

  static throwSticks(): { sticks: boolean[]; result: number } {
    const sticks = Array.from({ length: 4 }, () => Math.random() > 0.5);
    const whiteCount = sticks.filter(s => s).length;
    let result = whiteCount === 0 ? 6 : whiteCount;
    return { sticks, result };
  }

  static getLegalMoves(state: GameState, throwResult: number): string[] {
    const playerPegs = state.pegs.filter(p => p.side === state.currentPlayer && !p.isFinished);
    const legalMoves: string[] = [];

    for (const peg of playerPegs) {
      const nextPos = peg.position + throwResult;
      
      if (nextPos <= this.TRACK_LENGTH) {
        // In 58 Holes, pieces generally move on their own track
        // Check if the target hole is occupied by another of player's pieces
        const occupied = playerPegs.some(p => p.position === nextPos && p.id !== peg.id);
        if (!occupied) {
          legalMoves.push(peg.id);
        }
      }
    }

    return legalMoves;
  }

  static makeMove(state: GameState, pegId: string): GameState {
    const pegIndex = state.pegs.findIndex(p => p.id === pegId);
    if (pegIndex === -1) return state;

    const newPegs = [...state.pegs];
    const peg = { ...newPegs[pegIndex] };
    const oldPos = peg.position;
    let newPos = peg.position + state.throwResult;
    
    peg.isInPlay = true;
    
    // Handle Shortcuts (Holes 6 and 8 are classic shortcuts in Hounds & Jackals)
    if (newPos === 6) {
      newPos = 20; // Shortcut forward
      state.moveLog.unshift(`${state.currentPlayer} took a shortcut!`);
    } else if (newPos === 8) {
      newPos = 10; // Smaller shortcut
    }

    // Handle Penalties (Hole 15 is often a trap)
    if (newPos === 15) {
      newPos = 10; // Penalty back
      state.moveLog.unshift(`${state.currentPlayer} fell into a trap!`);
    }

    peg.position = newPos;

    if (newPos === this.TRACK_LENGTH) {
      peg.isFinished = true;
    }

    newPegs[pegIndex] = peg;

    // Check win condition
    const allFinished = newPegs.filter(p => p.side === state.currentPlayer).every(p => p.isFinished);
    
    let isGameOver = false;
    let winner = state.winner;

    if (allFinished) {
      isGameOver = true;
      winner = state.currentPlayer;
    }

    return {
      ...state,
      pegs: newPegs,
      currentPlayer: isGameOver ? state.currentPlayer : (state.currentPlayer === 'hounds' ? 'jackals' : 'hounds'),
      throwResult: 0,
      isGameOver,
      winner,
      turnNumber: state.turnNumber + 1,
      moveLog: [`${state.currentPlayer} moved to hole ${newPos}.`, ...state.moveLog].slice(0, 50),
    };
  }

  static getHoleType(index: number): HoleType {
    if (index === 6 || index === 8) return 'shortcut_start';
    if (index === 10 || index === 20) return 'shortcut_end';
    if (index === 15) return 'penalty';
    if (index === 25) return 'safe';
    return 'normal';
  }
}
