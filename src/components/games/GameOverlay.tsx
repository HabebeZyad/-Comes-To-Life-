import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Skull, Star, Play, ChevronRight, RotateCcw } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';

interface GameOverlayProps {
    type: 'intro' | 'victory' | 'defeat' | 'levelup';
    title: string;
    description?: string;
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
    description,
    score,
    stats,
    stars,
    actionLabel,
    onAction,
    onSecondaryAction,
    secondaryActionLabel
}: GameOverlayProps) {
    const icons = {
        intro: <Play className="w-16 h-16 text-primary" />,
        victory: <Trophy className="w-16 h-16 text-primary" />,
        defeat: <Skull className="w-16 h-16 text-terracotta" />,
        levelup: <Star className="w-16 h-16 text-turquoise" />
    };

    const bgColors = {
        intro: 'bg-obsidian/90',
        victory: 'bg-scarab/95',
        defeat: 'bg-terracotta-dark/95',
        levelup: 'bg-lapis/95'
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 flex items-center justify-center p-6 text-center ${bgColors[type]} backdrop-blur-sm rounded-xl border-2 border-gold/30`}
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-w-md w-full"
            >
                <div className="flex justify-center mb-6">
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: type === 'victory' ? [0, 10, -10, 0] : 0
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                    >
                        {icons[type]}
                    </motion.div>
                </div>

                <h2 className="text-4xl md:text-5xl font-display text-gold-gradient mb-4">
                    {title}
                </h2>

                {description && (
                    <p className="text-lg text-foreground/80 font-body mb-6">
                        {description}
                    </p>
                )}

                {score !== undefined && (
                    <div className="mb-6">
                        <span className="text-sm uppercase tracking-widest text-muted-foreground block mb-1">Final Score</span>
                        <span className="text-5xl font-display text-primary">{score}</span>
                    </div>
                )}

                {stats && stats.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-8 bg-black/20 p-4 rounded-lg border border-white/10">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <span className="text-xs uppercase text-muted-foreground block">{stat.label}</span>
                                <span className="text-xl font-bold text-foreground">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {stars !== undefined && (
                    <div className="flex justify-center gap-2 mb-8">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={i < stars ? 'text-primary fill-primary' : 'text-white/20'}
                                size={32}
                            />
                        ))}
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <EgyptianButton
                        variant={type === 'defeat' ? 'danger' : 'default'}
                        size="xl"
                        onClick={onAction}
                        className="w-full text-xl py-6"
                    >
                        {actionLabel || (type === 'victory' || type === 'levelup' ? 'Continue' : 'Start Trial')}
                        {type === 'levelup' ? <ChevronRight className="ml-2" /> : type === 'defeat' ? <RotateCcw className="ml-2" /> : null}
                    </EgyptianButton>

                    {onSecondaryAction && (
                        <EgyptianButton
                            variant="nav"
                            onClick={onSecondaryAction}
                            className="w-full"
                        >
                            {secondaryActionLabel || 'Back to Menu'}
                        </EgyptianButton>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
