import { GameState, Player, Piece, RuleMode, SpaceType, MehenSettings } from './types';

export class MehenEngine {
  static createInitialState(settings: MehenSettings): GameState {
    const pieces: Piece[] = [];
    const players: Player[] = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
    
    for (let i = 0; i < settings.playersCount; i++) {
      const owner = players[i];
      // Each player starts with 3 marbles and 1 lion
      for (let j = 0; j < 3; j++) {
        pieces.push({
          id: `${owner}-marble-${j}`,
          owner,
          position: 0,
          isLion: false,
          isHome: true,
          isFinished: false,
        });
      }
      pieces.push({
        id: `${owner}-lion`,
        owner,
        position: 0,
        isLion: true,
        isHome: true,
        isFinished: false,
      });
    }

    return {
      pieces,
      currentPlayer: 'player1',
      throwResult: 0,
      sticks: [true, true, true, true],
      isGameOver: false,
      winner: null,
      moveLog: ['The game of Mehen begins.'],
      history: [],
      turnNumber: 1,
    };
  }

  static throwSticks(): { sticks: boolean[]; result: number } {
    const sticks = Array.from({ length: 4 }, () => Math.random() > 0.5);
    const whiteCount = sticks.filter(s => s).length;
    
    // Traditional scoring:
    // 1 white = 1
    // 2 white = 2
    // 3 white = 3
    // 4 white = 4
    // 0 white = 6
    let result = whiteCount === 0 ? 6 : whiteCount;
    
    return { sticks, result };
  }

  static getLegalMoves(state: GameState, throwResult: number, boardSize: number): string[] {
    const playerPieces = state.pieces.filter(p => p.owner === state.currentPlayer && !p.isFinished);
    const legalMoves: string[] = [];

    for (const piece of playerPieces) {
      const nextPos = piece.position + throwResult;
      
      // Basic movement: can't overshoot the head (boardSize) unless rules say so
      if (nextPos <= boardSize) {
        // In Mehen, multiple pieces can often occupy the same space, 
        // but let's check for specific rule constraints if any
        legalMoves.push(piece.id);
      }
    }

    return legalMoves;
  }

  static makeMove(state: GameState, pieceId: string, boardSize: number, ruleMode: RuleMode): GameState {
    const pieceIndex = state.pieces.findIndex(p => p.id === pieceId);
    if (pieceIndex === -1) return state;

    const newPieces = [...state.pieces];
    const piece = { ...newPieces[pieceIndex] };
    const oldPos = piece.position;
    const newPos = piece.position + state.throwResult;
    
    piece.position = newPos;
    piece.isHome = false;

    if (newPos === boardSize) {
      piece.isFinished = true;
    }

    // Handle interactions (Lions capturing marbles, etc.)
    if (piece.isLion) {
      // Lions can capture marbles of other players on the same space
      const targets = newPieces.filter(p => 
        p.position === newPos && 
        p.owner !== state.currentPlayer && 
        !p.isLion && 
        !p.isFinished
      );
      
      targets.forEach(t => {
        const tIdx = newPieces.findIndex(p => p.id === t.id);
        newPieces[tIdx] = { ...newPieces[tIdx], position: 0, isHome: true };
      });
      
      if (targets.length > 0) {
        state.moveLog.unshift(`Lion captured ${targets.length} pieces!`);
      }
    }

    newPieces[pieceIndex] = piece;

    // Check win condition
    const playerPieces = newPieces.filter(p => p.owner === state.currentPlayer);
    const allFinished = playerPieces.every(p => p.isFinished);
    
    let isGameOver = false;
    let winner = state.winner;

    if (allFinished) {
      isGameOver = true;
      winner = state.currentPlayer;
    }

    // Determine next player
    const players: Player[] = (['player1', 'player2', 'player3', 'player4', 'player5', 'player6'] as Player[]).slice(0, state.pieces.length / 4);
    const currentIndex = players.indexOf(state.currentPlayer);
    const nextPlayer = players[(currentIndex + 1) % players.length];

    return {
      ...state,
      pieces: newPieces,
      currentPlayer: isGameOver ? state.currentPlayer : nextPlayer,
      throwResult: 0,
      isGameOver,
      winner,
      turnNumber: state.turnNumber + 1,
      moveLog: [`${state.currentPlayer} moved to space ${newPos}.`, ...state.moveLog].slice(0, 50),
    };
  }

  static getSpaceType(index: number, boardSize: number): SpaceType {
    if (index === 0) return 'tail';
    if (index === boardSize) return 'head';
    
    // Special spaces at intervals or specific locations
    if (index === Math.floor(boardSize / 4)) return 'safe';
    if (index === Math.floor(boardSize / 2)) return 'trap';
    if (index === Math.floor(boardSize * 0.75)) return 'leap';
    if (index === boardSize - 5) return 'duel';
    
    return 'normal';
  }
}
