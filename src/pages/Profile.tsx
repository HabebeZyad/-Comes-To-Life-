import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Trophy, Book, Map, Camera, Clock, RotateCcw, Save, Edit2, Check } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardTitle, EgyptianCardDescription } from '@/components/ui/EgyptianCard';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { useGame } from '@/contexts/GameContext';

const avatarOptions = ['🏺', '𓂀', '𓃭', '𓆣', '𓋹', '𓊖', '𓅃', '𓃠', '𓆙', '𓃗'];

const achievements = [
  { id: 'first-choice', title: 'Path Chosen', description: 'Made your first moral choice', icon: '𓃀', rarity: 'common' },
  { id: 'truth-seeker', title: 'Truth Seeker', description: 'Chose truth in Episode 3', icon: '𓂋', rarity: 'rare' },
  { id: 'tomb-explorer', title: 'Tomb Explorer', description: 'Completed your first tomb', icon: '𓊖', rarity: 'common' },
  { id: 'hieroglyph-master', title: 'Hieroglyph Master', description: 'Scanned 20 hieroglyphs', icon: '𓏤', rarity: 'epic' },
  { id: 'coop-champion', title: 'Co-op Champion', description: 'Completed 5 co-op sessions', icon: '𓅃', rarity: 'rare' },
  { id: 'all-endings', title: 'Keeper of Fates', description: 'Unlocked all story endings', icon: '𓋹', rarity: 'legendary' },
];

const rarityColors: Record<string, string> = {
  common: 'text-foreground/70 border-border',
  rare: 'text-turquoise border-turquoise/50',
  epic: 'text-lapis-light border-lapis-light/50',
  legendary: 'text-gold border-gold/50',
};

export default function Profile() {
  const { profile, setProfile, resetProgress } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || 'Explorer');
  const [editAvatar, setEditAvatar] = useState(profile?.avatar || '🏺');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = () => {
    if (profile) {
      setProfile({
        ...profile,
        name: editName,
        avatar: editAvatar,
      });
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-glow-pulse">𓂀</span>
          <p className="font-display text-xl text-muted-foreground mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <DustParticles count={15} />
      <HieroglyphBackground density="low" animated />

      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EgyptianCard variant="gold" className="mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-2xl bg-lapis-deep flex items-center justify-center text-5xl border-2 border-gold/50 shadow-gold-glow"
                  whileHover={{ scale: 1.05 }}
                >
                  {isEditing ? editAvatar : profile.avatar}
                </motion.div>
                {isEditing && (
                  <button
                    onClick={() => {
                      const currentIdx = avatarOptions.indexOf(editAvatar);
                      setEditAvatar(avatarOptions[(currentIdx + 1) % avatarOptions.length]);
                    }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gold text-primary-foreground flex items-center justify-center"
                    aria-label="Change avatar"
                    title="Change avatar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-display text-3xl bg-transparent border-b-2 border-gold text-foreground focus:outline-none w-full md:w-auto text-center md:text-left"
                    maxLength={20}
                    aria-label="Edit explorer name"
                    title="Edit name"
                    placeholder="Enter your name"
                  />
                ) : (
                  <h1 className="font-display text-3xl text-gold-gradient">{profile.name}</h1>
                )}
                <p className="font-body text-muted-foreground mt-1">
                  Explorer since {profile.createdAt.toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-turquoise" />
                    <span className="text-foreground/70">{formatPlayTime(profile.totalPlayTime)} played</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Book className="w-4 h-4 text-gold" />
                    <span className="text-foreground/70">{(profile.storyProgress?.episodesCompleted?.length || 0)} episodes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Camera className="w-4 h-4 text-lapis-light" />
                    <span className="text-foreground/70">{profile.hieroglyphsScanned} scanned</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <EgyptianButton variant="turquoise" size="sm" onClick={handleSave}>
                      <Check className="w-4 h-4" />
                      Save
                    </EgyptianButton>
                    <EgyptianButton variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </EgyptianButton>
                  </>
                ) : (
                  <>
                    <EgyptianButton variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </EgyptianButton>
                    <EgyptianButton variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </EgyptianButton>
                  </>
                )}
              </div>
            </div>
          </EgyptianCard>
        </motion.div>

        {/* Reset Confirmation */}
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <EgyptianCard variant="lapis" className="border-terracotta/50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl text-terracotta">Reset All Progress?</h3>
                  <p className="font-body text-foreground/70">This will erase all your choices, achievements, and unlocks. This cannot be undone.</p>
                </div>
                <div className="flex gap-2">
                  <EgyptianButton variant="danger" size="sm" onClick={handleReset}>
                    Confirm Reset
                  </EgyptianButton>
                  <EgyptianButton variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                    Cancel
                  </EgyptianButton>
                </div>
              </div>
            </EgyptianCard>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Story Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="font-display text-2xl text-gold-gradient mb-4 flex items-center gap-2">
              <Book className="w-6 h-6" />
              Story Progress
            </h2>

            <EgyptianCard variant="tomb" className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-body text-foreground">Episodes Completed</span>
                <span className="font-display text-turquoise">
                  {profile.storyProgress?.episodesCompleted?.length || 0} / 3
                </span>
              </div>

              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-turquoise"
                  style={{ width: `${((profile.storyProgress?.episodesCompleted?.length || 0) / 3) * 100}%` }}
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-display text-lg text-foreground mb-3">Choices Made</h4>
                {profile.storyChoices.length > 0 ? (
                  <div className="space-y-2">
                    {profile.storyChoices.slice(-3).map((choice, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Episode {choice.episodeId}:</span>
                        <p className="font-body text-foreground">{choice.optionSelected}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground font-body italic">No choices made yet</p>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-display text-lg text-foreground mb-3">Endings Unlocked</h4>
                <div className="flex gap-2">
                  {profile.endingsUnlocked.length > 0 ? (
                    profile.endingsUnlocked.map((ending) => (
                      <span
                        key={ending}
                        className="px-3 py-1 bg-gold/20 border border-gold/30 rounded-full font-display text-sm text-gold"
                      >
                        {ending}
                      </span>
                    ))
                  ) : (
                    <p className="text-muted-foreground font-body italic">Complete episodes to unlock endings</p>
                  )}
                </div>
              </div>
            </EgyptianCard>
          </motion.div>

          {/* Exploration Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-2xl text-gold-gradient mb-4 flex items-center gap-2">
              <Map className="w-6 h-6" />
              Exploration Stats
            </h2>

            <EgyptianCard variant="tomb" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <span className="text-3xl font-display text-gold">{profile.tombProgress.tombsExplored.length}</span>
                  <p className="text-sm text-muted-foreground">Tombs Explored</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <span className="text-3xl font-display text-turquoise">{profile.tombProgress.puzzlesSolved}</span>
                  <p className="text-sm text-muted-foreground">Puzzles Solved</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <span className="text-3xl font-display text-lapis-light">{profile.tombProgress.coopSessions}</span>
                  <p className="text-sm text-muted-foreground">Co-op Sessions</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-xl">
                  <span className="text-3xl font-display text-scarab">{profile.hieroglyphsScanned}</span>
                  <p className="text-sm text-muted-foreground">Hieroglyphs Scanned</p>
                </div>
              </div>
            </EgyptianCard>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="font-display text-2xl text-gold-gradient mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Achievements
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {achievements.map((achievement) => {
              const unlocked = profile.achievements.find(a => a.id === achievement.id && a.unlockedAt);

              return (
                <EgyptianCard
                  key={achievement.id}
                  variant={unlocked ? 'gold' : 'default'}
                  padding="sm"
                  className={`${unlocked ? '' : 'opacity-50'} border ${rarityColors[achievement.rarity]}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl ${unlocked ? 'animate-glow-pulse' : 'grayscale'}`}>
                      {achievement.icon}
                    </span>
                    <div>
                      <h4 className="font-display text-foreground">{achievement.title}</h4>
                      <p className="font-body text-sm text-muted-foreground">{achievement.description}</p>
                      <span className={`text-xs uppercase tracking-wider ${rarityColors[achievement.rarity].split(' ')[0]}`}>
                        {achievement.rarity}
                      </span>
                    </div>
                  </div>
                </EgyptianCard>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
