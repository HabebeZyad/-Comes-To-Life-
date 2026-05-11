import { GameState, HoundsSettings } from './types';
import { HoundsEngine } from './HoundsEngine';

export class HoundsAI {
  static getBestMove(state: GameState, throwResult: number, settings: HoundsSettings): string | null {
    const legalMoves = HoundsEngine.getLegalMoves(state, throwResult);
    
    if (legalMoves.length === 0) return null;
    
    if (settings.aiDifficulty === 'beginner') {
      return legalMoves[Math.floor(Math.random() * legalMoves.length)];
    }

    const scores = legalMoves.map(pegId => {
      const peg = state.pegs.find(p => p.id === pegId)!;
      let score = peg.position + throwResult;

      // Prioritize shortcuts
      const targetType = HoundsEngine.getHoleType(peg.position + throwResult);
      if (targetType === 'shortcut_start') score += 40;
      
      // Avoid penalties
      if (targetType === 'penalty') score -= 30;
      
      // Finishing is best
      if (peg.position + throwResult === HoundsEngine.TRACK_LENGTH) score += 100;

      return { pegId, score };
    });

    scores.sort((a, b) => b.score - a.score);
    return scores[0].pegId;
  }
}
