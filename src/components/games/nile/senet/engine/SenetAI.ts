import { GameState, Player, AIDifficulty } from './types';
import { SenetEngine } from './SenetEngine';

export class SenetAI {
  static getBestMove(state: GameState, result: number, difficulty: AIDifficulty): number | null {
    const legalMoves = SenetEngine.getLegalMoves(state, result);
    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) return legalMoves[0];

    switch (difficulty) {
      case 'beginner':
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      case 'normal':
        return this.getHeuristicMove(state, result, legalMoves);
      case 'pro':
        return this.getExpectimaxMove(state, result, legalMoves);
      default:
        return legalMoves[0];
    }
  }

  private static getHeuristicMove(state: GameState, result: number, moves: number[]): number {
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      const nextState = SenetEngine.makeMove(state, move, result);
      const score = this.evaluateState(nextState, state.currentPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private static evaluateState(state: GameState, player: Player): number {
    if (state.winner === player) return 10000;
    if (state.winner && state.winner !== player) return -10000;

    let score = 0;
    const opponent = player === 'player1' ? 'player2' : 'player1';

    state.board.forEach((square, idx) => {
      if (square.piece === player) {
        score += (idx + 1) * 2;
        
        if (square.type === 'happiness' || square.type === 'three-truths' || square.type === 're-atum' || square.type === 'last') {
          score += 10;
        }
        
        if (square.type === 'water') {
          score -= 50;
        }

        if (SenetEngine.isProtected(state, idx, player)) {
          score += 5;
        }
        
        if (SenetEngine.isBlockade(state, idx, player)) {
          score += 15;
        }
      } else if (square.piece === opponent) {
        score -= (idx + 1) * 1.5;
        
        if (SenetEngine.isProtected(state, idx, opponent)) {
          score -= 5;
        }
      }
    });

    score += state.piecesOffBoard[player] * 100;
    score -= state.piecesOffBoard[opponent] * 80;

    if (state.extraTurn && state.currentPlayer === player) {
      score += 20;
    }

    return score;
  }

  private static getExpectimaxMove(state: GameState, result: number, moves: number[]): number {
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      const nextState = SenetEngine.makeMove(state, move, result);
      const score = this.expectimax(nextState, 1, false, state.currentPlayer);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  }

  private static expectimax(state: GameState, depth: number, isMaximizing: boolean, originalPlayer: Player): number {
    if (depth === 0 || state.isGameOver) {
      return this.evaluateState(state, originalPlayer);
    }

    return this.averageOverThrows(state, depth, isMaximizing, originalPlayer);
  }

  private static averageOverThrows(state: GameState, depth: number, isMaximizing: boolean, originalPlayer: Player): number {
    const probabilities = [
      { res: 1, p: 4/16 }, { res: 2, p: 6/16 }, { res: 3, p: 4/16 },
      { res: 4, p: 1/16 }, { res: 5, p: 1/16 }
    ];

    let expectedValue = 0;

    for (const { res, p } of probabilities) {
      const moves = SenetEngine.getLegalMoves(state, res);
      if (moves.length === 0) {
        const nextState = { ...state, currentPlayer: (state.currentPlayer === 'player1' ? 'player2' : 'player1') as Player };
        expectedValue += p * this.expectimax(nextState, depth - 1, !isMaximizing, originalPlayer);
      } else {
        let bestVal = isMaximizing ? -Infinity : Infinity;
        for (const move of moves) {
          const nextState = SenetEngine.makeMove(state, move, res);
          const val = this.expectimax(nextState, depth - 1, nextState.currentPlayer === originalPlayer, originalPlayer);
          if (isMaximizing) bestVal = Math.max(bestVal, val);
          else bestVal = Math.min(bestVal, val);
        }
        expectedValue += p * bestVal;
      }
    }

    return expectedValue;
  }
}
