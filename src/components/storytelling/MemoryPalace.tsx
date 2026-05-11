
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, BookOpen, X } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { ScryingOrb } from './ScryingOrb';

interface Chamber {
    id: string;
    title: string;
    tagline: string;
    description: string;
    image: string;
    path: string;
    color: string;
}

interface MemoryPalaceProps {
    chambers: Chamber[];
}

export const MemoryPalace: React.FC<MemoryPalaceProps> = ({ chambers }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPanoOpen, setIsPanoOpen] = useState(false);

    const nextChamber = () => {
        setDirection(1);
        setActiveIndex((prev) => (prev + 1) % chambers.length);
    };

    const prevChamber = () => {
        setDirection(-1);
        setActiveIndex((prev) => (prev - 1 + chambers.length) % chambers.length);
    };

    const activeChamber = chambers[activeIndex];

    return (
        <div className="relative w-full min-h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden perspective-1000 py-12 md:py-20">
            {/* Background Depth Layers */}
            <div className="absolute inset-0 bg-[#0a0805] pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,144,36,0.1),transparent_70%)]" />
                <div className="absolute inset-0 opacity-20 bg-[url('/textures/papyrus-texture.png')] mix-blend-overlay" />
            </div>

            <div className="container mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 px-4">
                {/* Spatial Chamber View */}
                <div className="relative w-full lg:w-[55%] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeChamber.id}
                            custom={direction}
                            variants={{
                                enter: (direction: number) => ({
                                    x: direction > 0 ? 500 : -500,
                                    opacity: 0,
                                    scale: 0.8,
                                    rotateY: direction > 0 ? 45 : -45,
                                }),
                                center: {
                                    x: 0,
                                    opacity: 1,
                                    scale: 1,
                                    rotateY: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: [0.16, 1, 0.3, 1],
                                    },
                                },
                                exit: (direction: number) => ({
                                    x: direction < 0 ? 500 : -500,
                                    opacity: 0,
                                    scale: 0.8,
                                    rotateY: direction < 0 ? 45 : -45,
                                    transition: {
                                        duration: 0.6,
                                    },
                                }),
                            }}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="absolute inset-0 w-full h-full flex items-center justify-center"
                        >
                            <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-gold/30 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group">
                                <img
                                    src={activeChamber.image}
                                    alt={activeChamber.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t pointer-events-none from-black/90 via-black/20 to-transparent" />

                                {activeChamber.id === 'shipwrecked-sailor' && (
                                    <div
                                        className="absolute top-3 right-3 md:top-6 md:right-6 z-40 group/orb-trigger cursor-pointer flex items-center"
                                        onClick={() => setIsPanoOpen(true)}
                                    >
                                        <div className="absolute right-full mr-4 whitespace-nowrap px-4 py-2 bg-black/90 border border-gold/40 rounded-lg text-gold font-display text-xs md:text-sm opacity-0 group-hover/orb-trigger:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-none">
                                            See where The Papyrus is kept in Now
                                        </div>
                                        <div className="w-12 h-12 md:w-20 md:h-20 shrink-0 aspect-square flex items-center justify-center rounded-full overflow-hidden border border-gold shadow-[0_0_20px_rgba(218,165,32,0.4)] transition-all duration-300 hover:border-gold/80 hover:shadow-[0_0_30px_rgba(218,165,32,0.6)] bg-black/80">
                                            <ScryingOrb mode="globe" />
                                        </div>
                                    </div>
                                )}

                                {/* Decorative Egyptian Corners */}
                                <div className="absolute top-4 left-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-l-2 border-gold/60" />
                                <div className="absolute top-4 right-4 w-6 h-6 md:w-8 md:h-8 border-t-2 border-r-2 border-gold/60" />
                                <div className="absolute bottom-4 left-4 w-6 h-6 md:w-8 md:h-8 border-b-2 border-l-2 border-gold/60" />
                                <div className="absolute bottom-4 right-4 w-6 h-6 md:w-8 md:h-8 border-b-2 border-r-2 border-gold/60" />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Narrative Details */}
                <div className="w-full lg:w-[40%] flex flex-col justify-center text-center lg:text-left">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeChamber.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                                <span className="p-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20">
                                    <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                                </span>
                                <span className="font-display text-[10px] md:text-sm tracking-widest text-turquoise uppercase">Story {activeIndex + 1}</span>
                            </div>

                            <h2 className="font-display text-3xl md:text-5xl font-bold text-gold-gradient mb-3 md:mb-4">
                                {activeChamber.title}
                            </h2>

                            <p className="font-display text-lg md:text-xl text-gold/80 mb-4 md:mb-6 italic">
                                “{activeChamber.tagline}”
                            </p>

                            <p className="text-muted-foreground text-base md:text-lg mb-6 md:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                {activeChamber.description}
                            </p>

                            <div className="flex gap-4">
                                <Link to={activeChamber.path} className="flex-1">
                                    <EgyptianButton variant="hero" size="xl" shimmer className="w-full py-4 md:py-6">
                                        <Play className="w-5 h-5" />
                                        Enter Chamber
                                    </EgyptianButton>
                                </Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-center lg:justify-start gap-6 mt-8 md:mt-12">
                        <button
                            onClick={prevChamber}
                            className="p-2.5 md:p-3 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all"
                            aria-label="Previous chamber"
                        >
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="flex gap-2">
                            {chambers.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300",
                                        i === activeIndex ? "w-6 md:w-8 bg-gold" : "bg-gold/20"
                                    )}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextChamber}
                            className="p-2.5 md:p-3 rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all"
                            aria-label="Next chamber"
                        >
                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isPanoOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-5xl bg-[#0a0805] border-2 border-gold/30 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(218,165,32,0.15)] relative flex flex-col"
                        >
                            <button
                                onClick={() => setIsPanoOpen(false)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-gold/20 text-gold rounded-full border border-gold/30 transition-colors"
                                aria-label="Close viewer"
                                title="Close"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="w-full h-[60vh] min-h-[400px] relative shrink-0">
                                <ScryingOrb mode="viewer" />
                            </div>

                            <div className="p-6 md:p-8 text-center border-t-2 border-gold/20 bg-gradient-to-b from-black/60 to-black/90 flex flex-col justify-center shrink-0">
                                <h3 className="text-2xl md:text-3xl font-display text-gold-gradient drop-shadow-md">
                                    Pushkin State Museum of Fine Arts
                                </h3>
                                <p className="text-gold/60 font-display tracking-widest text-sm uppercase mt-2">
                                    (Moscow, Russia)
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
