import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, Star, Trash2 } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';

const GAME_NAMES: Record<string, { label: string; emoji: string }> = {
  all: { label: 'All Games', emoji: '🏆' },
  memory: { label: 'Sacred Symbols', emoji: '𓋹' },
  maze: { label: 'Mummy Maze', emoji: '🧟' },
  riddles: { label: "Pharaoh's Riddles", emoji: '🦁' },
  pyramid: { label: 'Pyramid Builder', emoji: '🏛️' },
  decoder: { label: 'Hieroglyph Decoder', emoji: '𓂀' },
  'temple-escape': { label: 'Temple Escape', emoji: '🏛️' },
  'nile-navigator': { label: 'Nile Navigator', emoji: '⛵' },
  'scarab-collector': { label: 'Scarab Collector', emoji: '𓆣' },
  'guess-the-pharaoh': { label: 'Guess the Pharaoh', emoji: '👑' },
  'pyramid-trail': { label: 'The Pyramid Trail', emoji: '📍' },
  'order-builders': { label: 'Order of the Builders', emoji: '⏳' },
  'great-minds': { label: 'The Great Minds', emoji: '🧠' },
  'scribes-journal': { label: "Scribe's Journal", emoji: '📓' },
  'tomb-explorer': { label: 'Tomb Explorer', emoji: '𓊖' },
  'hieroglyph-match': { label: 'Hieroglyph Match', emoji: '𓇚' },
};

export function Leaderboard() {
  const { getGameScores, getTopScores, clearScores } = useHighScores();
  const [filter, setFilter] = useState('all');

  const displayScores = filter === 'all' ? getTopScores(20) : getGameScores(filter);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="text-primary fill-primary" size={20} />;
    if (index === 1) return <Medal className="text-papyrus" size={20} />;
    if (index === 2) return <Medal className="text-terracotta" size={20} />;
    return <span className="text-muted-foreground font-body text-sm w-5 text-center">{index + 1}</span>;
  };

  return (
    <EgyptianCard variant="tomb" padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-primary" size={28} />
        <h2 className="text-3xl font-display text-gold-gradient">Hall of Records</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(GAME_NAMES).map(([key, { label, emoji }]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-body transition-all border ${filter === key
              ? 'bg-primary text-primary-foreground border-gold-light/50'
              : 'bg-card text-muted-foreground border-border hover:border-gold/30'
              }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* Scores */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
        <AnimatePresence>
          {displayScores.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="text-6xl mb-4">📜</div>
              <p className="text-xl text-muted-foreground font-body">No records yet. Play some games!</p>
            </motion.div>
          ) : (
            displayScores.map((entry, index) => (
              <motion.div
                key={`${entry.game}-${entry.date}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${index < 3 ? 'bg-gold-dark/10 border-gold/20' : 'bg-card/50 border-border'
                  }`}
              >
                <div className="w-6 flex justify-center">{getRankIcon(index)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-foreground truncate">{entry.playerName}</span>
                    <span className="text-xs text-muted-foreground font-body">
                      {GAME_NAMES[entry.game]?.emoji || '🎮'} {GAME_NAMES[entry.game]?.label || entry.game}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                    {entry.difficulty && <span className="capitalize">{entry.difficulty}</span>}
                    {entry.details && <span>• {entry.details}</span>}
                    <span>• {new Date(entry.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="text-primary" size={14} />
                  <span className="font-display text-lg text-primary">{entry.score}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {displayScores.length > 0 && (
        <div className="mt-4 flex justify-end">
          <EgyptianButton variant="ghost" size="sm" onClick={clearScores}>
            <Trash2 size={14} /> Clear All Records
          </EgyptianButton>
        </div>
      )}
    </EgyptianCard>
  );
}
