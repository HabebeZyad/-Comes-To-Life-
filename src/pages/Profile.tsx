import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Trophy, Book, Clock, RotateCcw, Edit2, Check,
  Flame, Star, Zap, Shield, Scroll, Eye, Sparkles,
  ChevronRight, TrendingUp, Award, Target, Upload, X
} from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const isImageAvatar = (avatar: string) => avatar.startsWith('data:image');

const avatarOptions = ['🏺', '𓂀', '𓃭', '𓆣', '𓋹', '𓊖', '𓅃', '𓃠', '𓆙', '𓃗'];

const achievements = [
  { id: 'first-choice', title: 'Path Chosen', description: 'Made your first moral choice', icon: '𓃀', rarity: 'common' as const },
  { id: 'truth-seeker', title: 'Truth Seeker', description: 'Chose truth in Episode 3', icon: '𓂋', rarity: 'rare' as const },
  { id: 'tomb-explorer', title: 'Tomb Explorer', description: 'Completed your first tomb', icon: '𓊖', rarity: 'common' as const },
  { id: 'hieroglyph-master', title: 'Hieroglyph Master', description: 'Scanned 20 hieroglyphs', icon: '𓏤', rarity: 'epic' as const },
  { id: 'coop-champion', title: 'Co-op Champion', description: 'Completed 5 co-op sessions', icon: '𓅃', rarity: 'rare' as const },
  { id: 'all-endings', title: 'Keeper of Fates', description: 'Unlocked all story endings', icon: '𓋹', rarity: 'legendary' as const },
  { id: 'speed-reader', title: 'Swift Scribe', description: 'Read 3 stories in one session', icon: '𓏞', rarity: 'rare' as const },
  { id: 'puzzle-king', title: 'Riddle of the Sphinx', description: 'Solved 10 puzzles', icon: '𓃬', rarity: 'epic' as const },
  { id: 'lore-keeper', title: 'Keeper of Scrolls', description: 'Unlocked all historical notes', icon: '𓏛', rarity: 'legendary' as const },
];

const rarityConfig = {
  common: { label: 'Common', color: 'text-foreground/70', border: 'border-border', bg: 'bg-muted/30', glow: '' },
  rare: { label: 'Rare', color: 'text-turquoise', border: 'border-turquoise/40', bg: 'bg-turquoise/10', glow: 'shadow-[0_0_15px_hsl(175_60%_40%/0.15)]' },
  epic: { label: 'Epic', color: 'text-lapis-light', border: 'border-lapis-light/40', bg: 'bg-lapis/10', glow: 'shadow-[0_0_15px_hsl(210_45%_40%/0.2)]' },
  legendary: { label: 'Legendary', color: 'text-gold', border: 'border-gold/50', bg: 'bg-gold/10', glow: 'shadow-[0_0_20px_hsl(43_70%_47%/0.25)]' },
};

const titles = [
  { level: 1, title: 'Initiate Scribe' },
  { level: 3, title: 'Temple Student' },
  { level: 5, title: 'Scroll Reader' },
  { level: 8, title: 'Lore Seeker' },
  { level: 12, title: 'Tomb Scholar' },
  { level: 16, title: 'High Priest' },
  { level: 20, title: 'Pharaoh\'s Advisor' },
  { level: 25, title: 'Living Legend' },
];

function getPlayerLevel(profile: NonNullable<ReturnType<typeof useGame>['profile']>) {
  const xp =
    profile.storyProgress.episodesCompleted.length * 100 +
    profile.storyChoices.length * 25 +
    profile.tombProgress.puzzlesSolved * 50 +
    profile.tombProgress.tombsExplored.length * 75 +
    profile.hieroglyphsScanned * 10 +
    profile.endingsUnlocked.length * 150 +
    profile.tombProgress.coopSessions * 30 +
    Math.floor(profile.totalPlayTime / 10) * 5;

  const level = Math.max(1, Math.floor(Math.sqrt(xp / 25)) + 1);
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 25;
  const xpForNextLevel = Math.pow(level, 2) * 25;
  const progress = xpForNextLevel > xpForCurrentLevel
    ? ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    : 0;

  const currentTitle = [...titles].reverse().find(t => level >= t.level)?.title || 'Initiate Scribe';

  return { xp, level, progress: Math.min(progress, 100), xpForNextLevel, currentTitle };
}

// Animated radial progress ring
function RadialProgress({ value, max, size = 80, strokeWidth = 6, color = 'hsl(var(--primary))', label, sublabel }: {
  value: number; max: number; size?: number; strokeWidth?: number; color?: string; label: string; sublabel?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = max > 0 ? Math.min(value / max, 1) : 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--muted))" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - percentage) }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatedCounter value={value} className="font-display text-lg font-bold text-foreground" />
        </div>
      </div>
      <div className="text-center">
        <p className="font-display text-xs font-semibold text-foreground">{label}</p>
        {sublabel && <p className="text-[10px] text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}

// Animated number counter
function AnimatedCounter({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 800;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span className={className}>{display}</span>;
}

// Stat card with icon
function StatCard({ icon: Icon, label, value, color, delay = 0 }: {
  icon: React.ElementType; label: string; value: string | number; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <div className={cn(
        "relative p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-colors"
      )}>
        <div className={cn("absolute top-0 left-0 w-1 h-full rounded-r", color)} />
        <div className="flex items-center gap-3 pl-2">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", color.replace('bg-', 'bg-') + '/15')}>
            <Icon className={cn("w-5 h-5", color.replace('bg-', 'text-'))} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-display uppercase tracking-wider">{label}</p>
            <p className="font-display text-xl font-bold text-foreground">
              {typeof value === 'number' ? <AnimatedCounter value={value} className="" /> : value}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type TabId = 'overview' | 'achievements' | 'history';

export default function Profile() {
  const { profile, setProfile, resetProgress } = useGame();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || 'Explorer');
  const [editAvatar, setEditAvatar] = useState(profile?.avatar || '🏺');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file', description: 'Please choose an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Image too large', description: 'Please use an image under 2MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const ratio = Math.max(size / img.width, size / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        setEditAvatar(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const playerStats = useMemo(() => {
    if (!profile) return null;
    return getPlayerLevel(profile);
  }, [profile]);

  const unlockedCount = useMemo(() => {
    if (!profile) return 0;
    return achievements.filter(a => profile.achievements.find(pa => pa.id === a.id && pa.unlockedAt)).length;
  }, [profile]);

  const handleSave = () => {
    if (profile) {
      setProfile({ ...profile, name: editName, avatar: editAvatar });
    }
    setIsEditing(false);
  };

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    setEditName('Explorer');
    setEditAvatar('🏺');
  };

  const formatPlayTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (!profile || !playerStats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-glow-pulse">𓂀</span>
          <p className="font-display text-xl text-muted-foreground mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'history', label: 'Journey', icon: Scroll },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <DustParticles count={12} />
      <HieroglyphBackground density="low" animated />

      <div className="container mx-auto px-4 max-w-6xl">

        {/* ═══ Hero Profile Card ═══ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative rounded-2xl border border-gold/20 bg-gradient-to-br from-card via-card to-lapis-deep/30 overflow-hidden mb-8">
            {/* Decorative top bar */}
            <div className="h-1.5 bg-gradient-to-r from-gold via-turquoise to-gold" />

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar with level ring */}
                <div className="relative">
                  <div className="relative w-28 h-28">
                    <svg width={112} height={112} className="absolute inset-0 -rotate-90">
                      <circle cx={56} cy={56} r={50} fill="none" stroke="hsl(var(--muted))" strokeWidth={4} />
                      <motion.circle
                        cx={56} cy={56} r={50} fill="none" stroke="hsl(var(--primary))" strokeWidth={4}
                        strokeLinecap="round"
                        initial={{ strokeDasharray: 314, strokeDashoffset: 314 }}
                        animate={{ strokeDashoffset: 314 * (1 - playerStats.progress / 100) }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                      />
                    </svg>
                    <motion.div
                      className="absolute inset-2 rounded-full bg-lapis-deep flex items-center justify-center text-5xl border-2 border-gold/30 overflow-hidden shadow-inner-gold"
                      whileHover={{ scale: 1.08 }}
                    >
                      {(() => {
                        const av = isEditing ? editAvatar : profile.avatar;
                        return isImageAvatar(av) ? (
                          <img src={av} alt="Profile photo" className="w-full h-full object-cover" />
                        ) : (
                          <span>{av}</span>
                        );
                      })()}
                    </motion.div>
                    {/* Level badge */}
                    <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary flex items-center justify-center border-2 border-background shadow-gold-glow">
                      <span className="font-display text-sm font-bold text-primary-foreground">{playerStats.level}</span>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="mt-3 flex flex-col items-center gap-2 max-w-[220px]">
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          aria-label="Upload profile photo"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/15 border border-primary/30 text-primary text-xs font-display hover:bg-primary/25 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload Photo
                        </button>
                        {isImageAvatar(editAvatar) && (
                          <button
                            type="button"
                            onClick={() => setEditAvatar(avatarOptions[0])}
                            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-muted/60 border border-border text-muted-foreground text-xs font-display hover:bg-muted transition-all"
                            aria-label="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-display">or pick a glyph</div>
                      <div className="flex gap-1 flex-wrap justify-center">
                        {avatarOptions.map(av => (
                          <button
                            key={av}
                            onClick={() => setEditAvatar(av)}
                            className={cn(
                              "w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all",
                              editAvatar === av ? "bg-primary/20 ring-2 ring-primary scale-110" : "hover:bg-muted"
                            )}
                          >
                            {av}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="font-display text-3xl bg-transparent border-b-2 border-gold text-foreground focus:outline-none w-full md:w-auto text-center md:text-left"
                      maxLength={20}
                      autoFocus
                      aria-label="Profile name"
                      placeholder="Enter your name"
                    />
                  ) : (
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-gold-gradient">{profile.name}</h1>
                  )}

                  <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm text-primary">{playerStats.currentTitle}</span>
                  </div>

                  {/* XP Bar */}
                  <div className="mt-4 max-w-sm mx-auto md:mx-0">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span className="font-display">Level {playerStats.level}</span>
                      <span className="font-display">{playerStats.xp} / {playerStats.xpForNextLevel} XP</span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-gold-light to-turquoise rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${playerStats.progress}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* Quick stats row */}
                  <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-turquoise" />
                      <span>{formatPlayTime(profile.totalPlayTime)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Trophy className="w-3.5 h-3.5 text-gold" />
                      <span>{unlockedCount}/{achievements.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Flame className="w-3.5 h-3.5 text-terracotta" />
                      <span>{playerStats.xp} XP</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {isEditing ? (
                    <>
                      <EgyptianButton variant="turquoise" size="sm" onClick={handleSave}>
                        <Check className="w-4 h-4" /> Save
                      </EgyptianButton>
                      <EgyptianButton variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                        Cancel
                      </EgyptianButton>
                    </>
                  ) : (
                    <>
                      <EgyptianButton variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4" /> Edit
                      </EgyptianButton>
                      <EgyptianButton variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
                        <RotateCcw className="w-4 h-4" />
                      </EgyptianButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reset Confirmation */}
        <AnimatePresence>
          {showResetConfirm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-4 rounded-xl border border-destructive/50 bg-destructive/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg text-destructive">Reset All Progress?</h3>
                    <p className="text-sm text-muted-foreground">All choices, achievements, and stats will be erased permanently.</p>
                  </div>
                  <div className="flex gap-2">
                    <EgyptianButton variant="danger" size="sm" onClick={handleReset}>Confirm Reset</EgyptianButton>
                    <EgyptianButton variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>Cancel</EgyptianButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Tabs ═══ */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-xl mb-8 w-fit mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-lg font-display text-sm transition-all",
                  activeTab === tab.id
                    ? "bg-card text-primary shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══ Tab Content ═══ */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Book} label="Episodes" value={profile.storyProgress.episodesCompleted.length} color="bg-gold" delay={0} />
                <StatCard icon={Target} label="Puzzles Solved" value={profile.tombProgress.puzzlesSolved} color="bg-turquoise" delay={0.1} />
                <StatCard icon={Eye} label="Hieroglyphs" value={profile.hieroglyphsScanned} color="bg-lapis-light" delay={0.2} />
                <StatCard icon={Star} label="Endings" value={profile.endingsUnlocked.length} color="bg-terracotta" delay={0.3} />
              </div>

              {/* Radial Progress Section */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <EgyptianCard className="p-6">
                  <h3 className="font-display text-lg font-semibold text-gold-gradient mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Progress Rings
                  </h3>
                  <div className="flex justify-around flex-wrap gap-4">
                    <RadialProgress value={profile.storyProgress.episodesCompleted.length} max={3} label="Episodes" sublabel="of 3" color="hsl(var(--primary))" />
                    <RadialProgress value={unlockedCount} max={achievements.length} label="Achievements" sublabel={`of ${achievements.length}`} color="hsl(var(--turquoise))" />
                    <RadialProgress value={profile.endingsUnlocked.length} max={4} label="Endings" sublabel="of 4" color="hsl(var(--terracotta))" />
                  </div>
                </EgyptianCard>

                {/* Story Progress Detail */}
                <EgyptianCard className="p-6">
                  <h3 className="font-display text-lg font-semibold text-gold-gradient mb-4 flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Story Progress
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Story Episodes</span>
                        <span className="text-primary font-display">{profile.storyProgress.episodesCompleted.length}/3</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(profile.storyProgress.episodesCompleted.length / 3) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <h4 className="font-display text-sm font-semibold text-foreground mb-2">Recent Choices</h4>
                      {profile.storyChoices.length > 0 ? (
                        <div className="space-y-2">
                          {profile.storyChoices.slice(-3).map((choice, idx) => (
                            <div key={idx} className="p-2.5 rounded-lg bg-muted/40 border border-border/50">
                              <span className="text-xs text-muted-foreground">Episode {choice.episodeId}</span>
                              <p className="text-sm text-foreground">{choice.optionSelected}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No choices made yet — start a story!</p>
                      )}
                    </div>

                    {profile.endingsUnlocked.length > 0 && (
                      <div className="pt-3 border-t border-border">
                        <h4 className="font-display text-sm font-semibold text-foreground mb-2">Endings Unlocked</h4>
                        <div className="flex flex-wrap gap-2">
                          {profile.endingsUnlocked.map(ending => (
                            <span key={ending} className="px-3 py-1 bg-gold/15 border border-gold/25 rounded-full font-display text-xs text-gold">
                              {ending}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </EgyptianCard>
              </div>

              {/* Exploration Stats */}
              <EgyptianCard className="p-6">
                <h3 className="font-display text-lg font-semibold text-gold-gradient mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Exploration Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Tombs Explored', value: profile.tombProgress.tombsExplored.length, icon: '𓊖' },
                    { label: 'Puzzles Solved', value: profile.tombProgress.puzzlesSolved, icon: '𓂋' },
                    { label: 'Co-op Sessions', value: profile.tombProgress.coopSessions, icon: '𓅃' },
                    { label: 'Play Time', value: formatPlayTime(profile.totalPlayTime), icon: '𓇳' },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="text-center p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/20 transition-colors"
                    >
                      <span className="text-2xl block mb-1">{stat.icon}</span>
                      <p className="font-display text-xl font-bold text-foreground">
                        {typeof stat.value === 'number' ? <AnimatedCounter value={stat.value} className="" /> : stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </EgyptianCard>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {/* Achievement summary */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-gold-gradient">Achievements</h2>
                  <p className="text-sm text-muted-foreground">{unlockedCount} of {achievements.length} unlocked</p>
                </div>
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="font-display text-sm text-primary font-semibold">{Math.round((unlockedCount / achievements.length) * 100)}%</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, i) => {
                  const unlocked = profile.achievements.find(a => a.id === achievement.id && a.unlockedAt);
                  const config = rarityConfig[achievement.rarity];

                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className={cn(
                        "relative p-4 rounded-xl border transition-all",
                        unlocked
                          ? `${config.border} ${config.bg} ${config.glow}`
                          : "border-border/50 bg-muted/20 opacity-50 grayscale"
                      )}>
                        <div className="flex items-start gap-3">
                          <span className={cn("text-3xl", unlocked && "animate-glow-pulse")}>
                            {achievement.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-semibold text-foreground text-sm">{achievement.title}</h4>
                            <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                            <span className={cn("text-[10px] uppercase tracking-widest font-display mt-1.5 inline-block", config.color)}>
                              {config.label}
                            </span>
                          </div>
                          {unlocked && (
                            <Sparkles className={cn("w-4 h-4 flex-shrink-0", config.color)} />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-display text-2xl font-bold text-gold-gradient mb-6">Your Journey</h2>

              {profile.storyChoices.length === 0 && profile.storyProgress.episodesCompleted.length === 0 ? (
                <EgyptianCard className="p-8 text-center">
                  <span className="text-5xl block mb-4">𓂀</span>
                  <h3 className="font-display text-xl text-foreground mb-2">Your Story Awaits</h3>
                  <p className="text-muted-foreground mb-6">Begin exploring to fill your timeline with discoveries and choices.</p>
                  <a href="/stories">
                    <EgyptianButton variant="hero" shimmer>
                      <Book className="w-4 h-4" /> Start Your Journey
                    </EgyptianButton>
                  </a>
                </EgyptianCard>
              ) : (
                <div className="relative pl-8 border-l-2 border-primary/20 space-y-6">
                  {/* Completed episodes */}
                  {profile.storyProgress.episodesCompleted.map(ep => (
                    <motion.div
                      key={`ep-${ep}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <div className="absolute -left-[calc(1rem+5px)] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                      <EgyptianCard className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
                            <Book className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-foreground">Episode {ep} Completed</h4>
                            <p className="text-xs text-muted-foreground">Story chapter finished</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                        </div>
                      </EgyptianCard>
                    </motion.div>
                  ))}

                  {/* Story choices */}
                  {profile.storyChoices.map((choice, idx) => (
                    <motion.div
                      key={`choice-${idx}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="relative"
                    >
                      <div className="absolute -left-[calc(1rem+5px)] top-1 w-3 h-3 rounded-full bg-turquoise border-2 border-background" />
                      <EgyptianCard className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-turquoise/15 flex items-center justify-center flex-shrink-0">
                            <Scroll className="w-5 h-5 text-turquoise" />
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-foreground text-sm">Choice Made — Episode {choice.episodeId}</h4>
                            <p className="text-sm text-foreground/80 mt-0.5">"{choice.optionSelected}"</p>
                            {choice.consequences.length > 0 && (
                              <p className="text-xs text-muted-foreground mt-1 italic">{choice.consequences[0]}</p>
                            )}
                          </div>
                        </div>
                      </EgyptianCard>
                    </motion.div>
                  ))}

                  {/* Endings unlocked */}
                  {profile.endingsUnlocked.map(ending => (
                    <motion.div
                      key={`ending-${ending}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative"
                    >
                      <div className="absolute -left-[calc(1rem+5px)] top-1 w-3 h-3 rounded-full bg-gold border-2 border-background" />
                      <EgyptianCard variant="gold" className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center">
                            <Star className="w-5 h-5 text-gold" />
                          </div>
                          <div>
                            <h4 className="font-display font-semibold text-gold">Ending Unlocked</h4>
                            <p className="text-sm text-foreground/80">{ending}</p>
                          </div>
                        </div>
                      </EgyptianCard>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
