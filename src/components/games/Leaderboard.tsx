import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Crown, Medal, Star, Trash2, Award, Activity, CalendarDays, Flame, Filter } from 'lucide-react';
import { EgyptianCard } from '@/components/ui/EgyptianCard';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useHighScores } from '@/hooks/useHighScores';

const GAME_NAMES: Record<string, { label: string; code: string }> = {
  memory: { label: 'Sacred Symbols', code: 'SS' },
  maze: { label: 'Mummy Maze', code: 'MM' },
  riddles: { label: "Pharaoh's Riddles", code: 'PR' },
  pyramid: { label: 'Pyramid Builder', code: 'PB' },
  decoder: { label: 'Hieroglyph Decoder', code: 'HD' },
  'temple-escape': { label: 'Temple Escape', code: 'TE' },
  'nile-navigator': { label: 'Nile Navigator', code: 'NN' },
  'scarab-collector': { label: 'Scarab Collector', code: 'SC' },
  'guess-the-pharaoh': { label: 'Guess the Pharaoh', code: 'GP' },
  'pyramid-trail': { label: 'The Pyramid Trail', code: 'PT' },
  'order-builders': { label: 'Order of the Builders', code: 'OB' },
  'great-minds': { label: 'The Great Minds', code: 'GM' },
  'scribes-journal': { label: "Scribe's Journal", code: 'SJ' },
  'tomb-explorer': { label: 'Tomb Explorer', code: 'TX' },
  'hieroglyph-match': { label: 'Hieroglyph Match', code: 'HM' },
  'glyph-reveal': { label: 'Hidden Pharaoh', code: 'HP' },
  'nile-games': { label: 'Games of the Nile', code: 'GN' },
  senet: { label: 'Senet', code: 'SN' },
};

const filters = [
  { key: 'all', label: 'All Records', code: 'ALL' },
  { key: 'recent', label: 'Recent Runs', code: 'NEW' },
  ...Object.entries(GAME_NAMES).map(([key, value]) => ({ key, ...value })),
];

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(date));
  } catch {
    return 'Unknown';
  }
}

export function Leaderboard() {
  const { getGameScores, getTopScores, getRecentScores, clearScores, getPlayerProgression } = useHighScores();
  const [filter, setFilter] = useState('all');
  const progression = getPlayerProgression();

  const displayScores =
    filter === 'all'
      ? getTopScores(20)
      : filter === 'recent'
        ? getRecentScores(20)
        : getGameScores(filter);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="text-primary fill-primary" size={20} />;
    if (index === 1) return <Medal className="text-papyrus" size={20} />;
    if (index === 2) return <Medal className="text-terracotta" size={20} />;
    return <span className="text-muted-foreground font-body text-sm w-5 text-center">{index + 1}</span>;
  };

  const handleClear = () => {
    clearScores(filter === 'all' || filter === 'recent' ? undefined : filter);
  };

  return (
    <EgyptianCard variant="tomb" padding="lg" className="overflow-hidden">
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Trophy className="text-primary" size={28} />
            <h2 className="text-3xl font-display text-gold-gradient">Hall of Records</h2>
          </div>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Persistent records for every challenge, ranked by score and preserved locally for fast replay goals.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
          {[
            { label: 'Rank', value: progression.rankTitle, icon: Award },
            { label: 'Total', value: progression.totalScore.toLocaleString(), icon: Star },
            { label: 'Best', value: progression.bestScore.toLocaleString(), icon: Flame },
            { label: 'Runs', value: progression.totalPlays, icon: Activity },
          ].map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-lg border border-gold/15 bg-black/25 p-3 text-center">
                <Icon className="mx-auto mb-2 h-4 w-4 text-primary" />
                <div className="text-[10px] uppercase text-muted-foreground">{metric.label}</div>
                <div className="mt-1 truncate font-display text-sm text-gold-light">{metric.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2 text-xs uppercase text-muted-foreground">
        <Filter className="h-4 w-4 text-primary" />
        Record Filter
      </div>

      <div className="mb-6 overflow-x-auto scrollbar-none">
        <div className="flex w-max gap-2 pr-2">
          {filters.map(({ key, label, code }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-lg border px-3 py-2 text-sm font-body transition-all ${
                filter === key
                  ? 'border-gold/50 bg-primary text-primary-foreground shadow-gold-glow'
                  : 'border-border bg-card/80 text-muted-foreground hover:border-gold/30 hover:text-foreground'
              }`}
            >
              <span className="mr-1.5 font-display text-[10px] text-gold-light">{code}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {displayScores.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border border-white/10 bg-black/20 py-14 text-center">
              <Trophy className="mx-auto mb-4 h-12 w-12 text-primary/70" />
              <p className="text-xl text-muted-foreground font-body">No records yet. Start a trial to open the archive.</p>
            </motion.div>
          ) : (
            displayScores.map((entry, index) => {
              const gameInfo = GAME_NAMES[entry.game] || { label: entry.game, code: 'GM' };

              return (
                <motion.div
                  layout
                  key={`${entry.game}-${entry.date}-${index}`}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 18 }}
                  transition={{ delay: index * 0.025 }}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    index < 3 ? 'bg-gold-dark/10 border-gold/25' : 'bg-card/50 border-border'
                  }`}
                >
                  <div className="w-7 flex justify-center">{getRankIcon(index)}</div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/25 font-display text-sm text-gold-light">
                    {gameInfo.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-display text-foreground truncate">{entry.playerName}</span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] uppercase text-primary">
                        {gameInfo.label}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-body">
                      {entry.difficulty && <span className="capitalize">{entry.difficulty}</span>}
                      {entry.details && <span>{entry.details}</span>}
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(entry.date)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="text-primary" size={14} />
                    <span className="font-display text-lg text-primary">{entry.score.toLocaleString()}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {displayScores.length > 0 && (
        <div className="mt-4 flex justify-end">
          <EgyptianButton variant="ghost" size="sm" onClick={handleClear}>
            <Trash2 size={14} /> {filter === 'all' || filter === 'recent' ? 'Clear All Records' : 'Clear This Game'}
          </EgyptianButton>
        </div>
      )}
    </EgyptianCard>
  );
}
