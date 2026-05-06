import { GameState, Player, Square, RuleMode, SquareType } from './types';

export class SenetEngine {
  static readonly BOARD_SIZE = 30;
  static readonly INITIAL_PIECES = 5;

  static createInitialState(ruleMode: RuleMode = 'modern'): GameState {
    const board: Square[] = Array.from({ length: this.BOARD_SIZE }, (_, i) => ({
      id: i + 1,
      type: this.getSquareType(i + 1),
      piece: null,
    }));
    const numPieces = ruleMode === 'fast' ? 3 : this.INITIAL_PIECES;
    for (let i = 0; i < numPieces * 2; i++) {
      board[i].piece = i % 2 === 0 ? 'player2' : 'player1';
    }
    return {
      board,
      currentPlayer: 'player1',
      sticks: [true, true, true, true],
      throwResult: 0,
      winner: null,
      history: [],
      turnCount: 0,
      isGameOver: false,
      extraTurn: false,
      moveLog: ['Game started'],
      piecesOffBoard: { player1: 0, player2: 0 },
    };
  }

  static getSquareType(id: number): SquareType {
    switch (id) {
      case 15: return 'rebirth';
      case 26: return 'happiness';
      case 27: return 'water';
      case 28: return 'three-truths';
      case 29: return 're-atum';
      case 30: return 'last';
      default: return 'normal';
    }
  }

  static throwSticks(): { sticks: boolean[], result: number, extraTurn: boolean } {
    const sticks = Array.from({ length: 4 }, () => Math.random() > 0.5);
    const whiteSticks = sticks.filter(s => s).length;
    let result = 0;
    let extraTurn = false;
    switch (whiteSticks) {
      case 1: result = 1; extraTurn = true; break;
      case 2: result = 2; extraTurn = false; break;
      case 3: result = 3; extraTurn = false; break;
      case 4: result = 4; extraTurn = true; break;
      case 0: result = 5; extraTurn = true; break;
    }
    return { sticks, result, extraTurn };
  }

  static getLegalMoves(state: GameState, result: number): number[] {
    if (result === 0) return [];
    const moves: number[] = [];
    const player = state.currentPlayer;
    state.board.forEach((square, index) => {
      if (square.piece === player) {
        if (this.isValidMove(state, index + 1, result)) {
          moves.push(index + 1);
        }
      }
    });
    return moves;
  }

  static isValidMove(state: GameState, fromId: number, steps: number): boolean {
    const fromIndex = fromId - 1;
    const toIndex = fromIndex + steps;
    const player = state.currentPlayer;
    const opponent = player === 'player1' ? 'player2' : 'player1';
    if (toIndex >= this.BOARD_SIZE) {
      if (fromId < 26) return false;
      if (fromId === 28 && steps !== 3) return false;
      if (fromId === 29 && steps !== 2) return false;
      if (fromId === 30 && steps !== 1) return false;
      if (toIndex === this.BOARD_SIZE) return true;
      return false; 
    }
    const targetSquare = state.board[toIndex];
    if (targetSquare.piece === player) return false;
    if (targetSquare.piece === opponent) {
      if (targetSquare.type !== 'normal' && targetSquare.type !== 'rebirth') return false;
      if (this.isProtected(state, toIndex, opponent)) return false;
    }
    for (let i = fromIndex + 1; i < toIndex; i++) {
      if (this.isBlockade(state, i, opponent)) return false;
    }
    return true;
  }

  static isProtected(state: GameState, index: number, player: Player): boolean {
    const prev = index > 0 ? state.board[index - 1] : null;
    const next = index < this.BOARD_SIZE - 1 ? state.board[index + 1] : null;
    return prev?.piece === player || next?.piece === player;
  }

  static isBlockade(state: GameState, index: number, player: Player): boolean {
    let count = 0;
    let i = index;
    while (i >= 0 && state.board[i].piece === player) { count++; i--; }
    i = index + 1;
    while (i < this.BOARD_SIZE && state.board[i].piece === player) { count++; i++; }
    return count >= 3;
  }

  static makeMove(state: GameState, fromId: number, steps: number): GameState {
    const newState = JSON.parse(JSON.stringify(state)) as GameState;
    const fromIndex = fromId - 1;
    const toIndex = fromIndex + steps;
    const player = newState.currentPlayer;
    const opponent = player === 'player1' ? 'player2' : 'player1';
    const piece = newState.board[fromIndex].piece;
    newState.board[fromIndex].piece = null;
    if (toIndex >= this.BOARD_SIZE) {
      newState.piecesOffBoard[player]++;
      newState.moveLog.unshift(`${player} moved a piece off!`);
    } else {
      const targetSquare = newState.board[toIndex];
      if (targetSquare.piece === opponent) {
        newState.board[fromIndex].piece = opponent;
        targetSquare.piece = player;
        newState.moveLog.unshift(`${player} swapped at ${toIndex + 1}`);
      } else {
        targetSquare.piece = player;
        newState.moveLog.unshift(`${player} moved to ${toIndex + 1}`);
      }
      if (targetSquare.type === 'water') {
        targetSquare.piece = null;
        const rebirthIndex = 14;
        if (newState.board[rebirthIndex].piece === null) {
          newState.board[rebirthIndex].piece = player;
        } else {
          for (let i = 0; i < this.BOARD_SIZE; i++) {
            if (newState.board[i].piece === null) {
              newState.board[i].piece = player;
              break;
            }
          }
        }
      }
    }
    const p1OnBoard = newState.board.filter(s => s.piece === 'player1').length;
    const p2OnBoard = newState.board.filter(s => s.piece === 'player2').length;
    if (p1OnBoard === 0 && newState.piecesOffBoard.player1 > 0) {
      newState.winner = 'player1'; newState.isGameOver = true;
    } else if (p2OnBoard === 0 && newState.piecesOffBoard.player2 > 0) {
      newState.winner = 'player2'; newState.isGameOver = true;
    }
    if (!newState.extraTurn) newState.currentPlayer = opponent;
    newState.throwResult = 0;
    newState.turnCount++;
    return newState;
  }
}
