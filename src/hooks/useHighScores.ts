import { useState, useCallback } from 'react';

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
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? trimScores(parsed.filter(isValidScore)) : [];
  } catch {
    return [];
  }
}

function saveScores(scores: HighScoreEntry[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function useHighScores() {
  const [scores, setScores] = useState<HighScoreEntry[]>(loadScores);

  const addScore = useCallback((entry: Omit<HighScoreEntry, 'date'>) => {
    const newEntry: HighScoreEntry = {
      ...entry,
      playerName: entry.playerName.trim() || 'Explorer',
      score: Math.max(0, Math.round(entry.score)),
      date: new Date().toISOString(),
    };
    const trimmed = trimScores([...loadScores(), newEntry]);

    saveScores(trimmed);
    setScores(trimmed);
    return newEntry;
  }, []);

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
    const updated = game ? scores.filter(score => score.game !== game) : [];
    saveScores(updated);
    setScores(updated);
  }, [scores]);

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
