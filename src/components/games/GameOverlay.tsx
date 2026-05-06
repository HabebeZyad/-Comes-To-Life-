import { motion } from 'framer-motion';
import { Trophy, Skull, Star, Play, ChevronRight, RotateCcw, Sparkles, ScrollText, Target } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';

interface GameOverlayProps {
    type: 'intro' | 'victory' | 'defeat' | 'levelup';
    title: string;
    eyebrow?: string;
    description?: string;
    objectives?: string[];
    tip?: string;
    score?: number;
    stats?: Array<{ label: string; value: string | number }>;
    stars?: number;
    actionLabel?: string;
    onAction: () => void;
    onSecondaryAction?: () => void;
    secondaryActionLabel?: string;
}

export function GameOverlay({
    type,
    title,
    eyebrow,
    description,
    objectives,
    tip,
    score,
    stats,
    stars,
    actionLabel,
    onAction,
    onSecondaryAction,
    secondaryActionLabel
}: GameOverlayProps) {
    const icons = {
        intro: <Play className="w-14 h-14 text-primary" />,
        victory: <Trophy className="w-14 h-14 text-primary" />,
        defeat: <Skull className="w-14 h-14 text-terracotta" />,
        levelup: <Star className="w-14 h-14 text-turquoise" />
    };

    const bgColors = {
        intro: 'from-obsidian/95 via-lapis-deep/90 to-black/95',
        victory: 'from-scarab/95 via-obsidian/90 to-gold-dark/95',
        defeat: 'from-terracotta/95 via-obsidian/90 to-black/95',
        levelup: 'from-lapis/95 via-obsidian/90 to-turquoise/80'
    };

    const labels = {
        intro: eyebrow || 'Mission Brief',
        victory: eyebrow || 'Trial Complete',
        defeat: eyebrow || 'Trial Failed',
        levelup: eyebrow || 'New Rank'
    };

    const accent = type === 'defeat' ? 'text-terracotta' : type === 'levelup' ? 'text-turquoise' : 'text-primary';
    const hasDetails = Boolean(score !== undefined || (stats && stats.length > 0) || (objectives && objectives.length > 0));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-br ${bgColors[type]} backdrop-blur-md rounded-xl border border-gold/30 overflow-hidden`}
        >
            <div className="absolute inset-0 opacity-[0.08] hieroglyph-pattern" />
            <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
            <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
            <div className="absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <motion.div
                initial={{ scale: 0.92, y: 18 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-gold-light">
                    <ScrollText className="h-4 w-4 text-primary" />
                    {labels[type]}
                </div>

                <div className="flex justify-center mb-5">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: type === 'victory' ? [0, 8, -8, 0] : 0
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="relative rounded-full border border-gold/30 bg-black/35 p-5 shadow-[0_0_45px_hsl(var(--gold)/0.22)]"
                    >
                        <span className="absolute inset-0 rounded-full border border-primary/30 animate-ping" />
                        {icons[type]}
                    </motion.div>
                </div>

                <h2 className="text-3xl md:text-5xl font-display text-gold-gradient mb-4 leading-tight">
                    {title}
                </h2>

                {description && (
                    <p className="mx-auto max-w-xl text-base md:text-lg text-foreground/85 font-body mb-6 leading-relaxed">
                        {description}
                    </p>
                )}

                {hasDetails && (
                    <div className="mb-7 rounded-xl border border-gold/20 bg-black/30 p-4 shadow-inner">
                        {score !== undefined && (
                            <div className="mb-4">
                                <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground block mb-1">Final Score</span>
                                <span className={`text-5xl font-display ${accent}`}>{score.toLocaleString()}</span>
                            </div>
                        )}

                        {objectives && objectives.length > 0 && (
                            <div className="mb-4 grid gap-2 text-left">
                                {objectives.map((objective, i) => (
                                    <div key={`${objective}-${i}`} className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                                        <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span className="text-sm text-foreground/85">{objective}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {stats && stats.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {stats.map((stat, i) => (
                                    <div key={i} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3 text-center">
                                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">{stat.label}</span>
                                        <span className="text-lg md:text-xl font-bold text-foreground">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {stars !== undefined && (
                    <div className="flex justify-center gap-2 mb-7">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={i < stars ? 'text-primary fill-primary drop-shadow-gold-glow' : 'text-white/20'}
                                size={32}
                            />
                        ))}
                    </div>
                )}

                {tip && (
                    <div className="mb-6 flex items-center justify-center gap-2 rounded-lg border border-turquoise/20 bg-turquoise/10 px-4 py-2 text-sm text-turquoise">
                        <Sparkles className="h-4 w-4" />
                        {tip}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <EgyptianButton
                        variant={type === 'defeat' ? 'danger' : 'default'}
                        size="lg"
                        onClick={onAction}
                        shimmer={type === 'victory' || type === 'levelup'}
                        className="w-full sm:w-auto min-w-[190px] text-base py-6"
                    >
                        {actionLabel || (type === 'victory' || type === 'levelup' ? 'Continue' : 'Start Trial')}
                        {type === 'levelup' ? <ChevronRight className="ml-2" /> : type === 'defeat' ? <RotateCcw className="ml-2" /> : null}
                    </EgyptianButton>

                    {onSecondaryAction && (
                        <EgyptianButton
                            variant="nav"
                            onClick={onSecondaryAction}
                            className="w-full sm:w-auto min-w-[170px]"
                        >
                            {secondaryActionLabel || 'Back to Menu'}
                        </EgyptianButton>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
