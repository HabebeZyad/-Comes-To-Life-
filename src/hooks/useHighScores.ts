import { useState, useCallback } from 'react';

export interface HighScoreEntry {
  playerName: string;
  score: number;
  game: string;
  difficulty?: string;
  date: string;
  details?: string;
}

const STORAGE_KEY = 'comesToLife_highScores';
const MAX_SCORES_PER_GAME = 10;

function loadScores(): HighScoreEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveScores(scores: HighScoreEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
}

export function useHighScores() {
  const [scores, setScores] = useState<HighScoreEntry[]>(loadScores);

  const addScore = useCallback((entry: Omit<HighScoreEntry, 'date'>) => {
    const newEntry: HighScoreEntry = { ...entry, date: new Date().toISOString() };
    const updated = [...loadScores(), newEntry]
      .sort((a, b) => b.score - a.score);
    
    // Keep top scores per game
    const grouped: Record<string, HighScoreEntry[]> = {};
    for (const s of updated) {
      if (!grouped[s.game]) grouped[s.game] = [];
      if (grouped[s.game].length < MAX_SCORES_PER_GAME) {
        grouped[s.game].push(s);
      }
    }
    const trimmed = Object.values(grouped).flat();
    saveScores(trimmed);
    setScores(trimmed);
    return newEntry;
  }, []);

  const getGameScores = useCallback((game: string) => {
    return scores.filter(s => s.game === game).sort((a, b) => b.score - a.score);
  }, [scores]);

  const getTopScores = useCallback((limit = 20) => {
    return [...scores].sort((a, b) => b.score - a.score).slice(0, limit);
  }, [scores]);

  const clearScores = useCallback(() => {
    saveScores([]);
    setScores([]);
  }, []);

  return { scores, addScore, getGameScores, getTopScores, clearScores };
}
