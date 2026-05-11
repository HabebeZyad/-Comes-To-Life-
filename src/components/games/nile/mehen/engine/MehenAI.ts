import { GameState, AIDifficulty, MehenSettings } from './types';
import { MehenEngine } from './MehenEngine';

export class MehenAI {
  static getBestMove(state: GameState, throwResult: number, settings: MehenSettings): string | null {
    const legalMoves = MehenEngine.getLegalMoves(state, throwResult, settings.boardSize);
    
    if (legalMoves.length === 0) return null;
    
    if (settings.aiDifficulty === 'beginner') {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const scores = legalMoves.map(pieceId => {
      const piece = state.pieces.find(p => p.id === pieceId)!;
      let score = piece.position + throwResult; // Prefer moving forward

      if (settings.aiDifficulty === 'pro') {
        // Prefer moving the lion if it can capture something
        if (piece.isLion) {
          const targetPos = piece.position + throwResult;
          const captures = state.pieces.filter(p => 
            p.position === targetPos && 
            p.owner !== state.currentPlayer && 
            !p.isLion
          ).length;
          score += captures * 50;
        }

        // Avoid traps
        const spaceType = MehenEngine.getSpaceType(piece.position + throwResult, settings.boardSize);
        if (spaceType === 'trap') score -= 30;
        if (spaceType === 'safe') score += 10;
        if (spaceType === 'head') score += 100;
      }

      return { pieceId, score };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores[0].pieceId;
  }
}
