import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface HighScoreEntry {
  playerName: string;
  score: number;
  game: string;
  difficulty?: string;
  date: string;
  details?: string;
}

export interface GameScoreSummary {
  game: string;
  plays: number;
  bestScore: number;
  averageScore: number;
  latestScore: number;
  lastPlayed?: string;
  difficulty?: string;
}

export interface PlayerProgression {
  totalPlays: number;
  totalScore: number;
  bestScore: number;
  masteredGames: number;
  rankTitle: string;
  favoriteGame?: string;
  recentScores: HighScoreEntry[];
}

const STORAGE_KEY = 'comesToLife_highScores';
const MAX_SCORES_PER_GAME = 12;

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const DEFAULT_SCORES: HighScoreEntry[] = [
  { playerName: 'Imhotep', score: 450, game: 'great-minds', difficulty: 'Expert', date: '2026-05-15T12:00:00.000Z', details: 'Completed Old Kingdom perfectly' },
  { playerName: 'Scribe Ani', score: 380, game: 'scribal-crosswords', difficulty: 'Medium', date: '2026-05-16T14:30:00.000Z', details: 'Mastered the Papyrus of Ani' },
  { playerName: 'Pharaoh Ahmose', score: 500, game: 'temple-escape', difficulty: 'Expert', date: '2026-05-18T09:15:00.000Z', details: 'Escaped Apepi\'s trap chambers' },
  { playerName: 'Vizier Ptahhotep', score: 320, game: 'memory', difficulty: 'Medium', date: '2026-05-20T16:00:00.000Z', details: 'Flawless recall of wisdom' },
  { playerName: 'Navigator Harkhuf', score: 420, game: 'nile-navigator', difficulty: 'Hard', date: '2026-05-22T11:45:00.000Z', details: 'Navigated the south rapids' },
];

function isValidScore(entry: unknown): entry is HighScoreEntry {
  if (!entry || typeof entry !== 'object') return false;
  const score = entry as Partial<HighScoreEntry>;
  return (
    typeof score.playerName === 'string' &&
    typeof score.score === 'number' &&
    Number.isFinite(score.score) &&
    typeof score.game === 'string' &&
    typeof score.date === 'string'
  );
}

function sortScores(scores: HighScoreEntry[]) {
  return [...scores].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

function trimScores(scores: HighScoreEntry[]) {
  const grouped: Record<string, HighScoreEntry[]> = {};

  for (const score of sortScores(scores)) {
    if (!grouped[score.game]) grouped[score.game] = [];
    if (grouped[score.game].length < MAX_SCORES_PER_GAME) {
      grouped[score.game].push(score);
    }
  }

  return Object.values(grouped).flat();
}

function getRankTitle(bestScore: number, masteredGames: number) {
  if (bestScore >= 10000 || masteredGames >= 10) return 'Royal Champion';
  if (bestScore >= 6500 || masteredGames >= 6) return 'Temple Master';
  if (bestScore >= 3500 || masteredGames >= 3) return 'High Scribe';
  if (bestScore >= 1500) return 'Apprentice Strategist';
  return 'New Explorer';
}

function loadScores(): HighScoreEntry[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      saveScores(DEFAULT_SCORES);
      return DEFAULT_SCORES;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const valid = parsed.filter(isValidScore);
      if (valid.length === 0) {
        saveScores(DEFAULT_SCORES);
        return DEFAULT_SCORES;
      }
      return trimScores(valid);
    }
    saveScores(DEFAULT_SCORES);
    return DEFAULT_SCORES;
  } catch {
    return DEFAULT_SCORES;
  }
}

function saveScores(scores: HighScoreEntry[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

// Module-level state & listener registry to sync hook instances across the whole app
let globalScores: HighScoreEntry[] = [];
let listeners: Array<(scores: HighScoreEntry[]) => void> = [];

if (isBrowser()) {
  globalScores = loadScores();
}

function notifyListeners() {
  listeners.forEach(l => {
    try {
      l(globalScores);
    } catch (e) {
      console.error('Error notifying hook listener:', e);
    }
  });
}

export function useHighScores() {
  const [scores, setScores] = useState<HighScoreEntry[]>(globalScores);
  
  let user: any = null;
  try {
    const auth = useAuth();
    user = auth?.user;
  } catch (e) {
    // Graceful fallback if hook is used outside AuthProvider
  }

  useEffect(() => {
    listeners.push(setScores);
    return () => {
      listeners = listeners.filter(l => l !== setScores);
    };
  }, []);

  const addScore = useCallback((entry: Omit<HighScoreEntry, 'date'>) => {
    const resolvedName = user?.name || entry.playerName.trim() || 'Explorer';
    const newEntry: HighScoreEntry = {
      ...entry,
      playerName: resolvedName,
      score: Math.max(0, Math.round(entry.score)),
      date: new Date().toISOString(),
    };
    
    const fresh = trimScores([...loadScores(), newEntry]);
    saveScores(fresh);
    globalScores = fresh;
    notifyListeners();
    return newEntry;
  }, [user]);

  const getGameScores = useCallback((game: string) => {
    return sortScores(scores.filter(s => s.game === game));
  }, [scores]);

  const getTopScores = useCallback((limit = 20) => {
    return sortScores(scores).slice(0, limit);
  }, [scores]);

  const getRecentScores = useCallback((limit = 8) => {
    return [...scores]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }, [scores]);

  const getGameSummary = useCallback((game: string): GameScoreSummary | null => {
    const gameScores = scores.filter(s => s.game === game);
    if (gameScores.length === 0) return null;

    const sortedByScore = sortScores(gameScores);
    const latest = [...gameScores].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    const total = gameScores.reduce((sum, score) => sum + score.score, 0);

    return {
      game,
      plays: gameScores.length,
      bestScore: sortedByScore[0].score,
      averageScore: Math.round(total / gameScores.length),
      latestScore: latest.score,
      lastPlayed: latest.date,
      difficulty: sortedByScore[0].difficulty,
    };
  }, [scores]);

  const getPlayerProgression = useCallback((): PlayerProgression => {
    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const bestScore = scores.reduce((best, score) => Math.max(best, score.score), 0);
    const masteredGames = new Set(scores.filter(score => score.score >= 3000).map(score => score.game)).size;
    const gameCounts = scores.reduce<Record<string, number>>((counts, score) => {
      counts[score.game] = (counts[score.game] || 0) + 1;
      return counts;
    }, {});
    const favoriteGame = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    return {
      totalPlays: scores.length,
      totalScore,
      bestScore,
      masteredGames,
      favoriteGame,
      rankTitle: getRankTitle(bestScore, masteredGames),
      recentScores: getRecentScores(5),
    };
  }, [getRecentScores, scores]);

  const clearScores = useCallback((game?: string) => {
    const fresh = game ? loadScores().filter(score => score.game !== game) : [];
    saveScores(fresh);
    globalScores = fresh;
    notifyListeners();
  }, []);

  return {
    scores,
    addScore,
    clearScores,
    getGameScores,
    getTopScores,
    getRecentScores,
    getGameSummary,
    getPlayerProgression,
  };
}
