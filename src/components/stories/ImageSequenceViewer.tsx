import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bookmark, ChevronLeft, ChevronRight, Maximize2, Minimize2, X, ArrowRight } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { cn, getAssetUrl } from '@/lib/utils';

interface ImageSequenceViewerProps {
  title: string;
  images: string[];
  onClose: () => void;
  onNextTale?: () => void;
  nextTaleTitle?: string;
}

interface BookPageProps {
  image?: string;
  pageNumber?: number;
  side: 'left' | 'right' | 'single';
  title: string;
}

function playTransitionSound() {
  const audio = new Audio(getAssetUrl('/sounds/paper-transition.mp3'));
  audio.volume = 0.25;
  audio.play().catch(() => {});
}

function BookPage({ image, pageNumber, side, title }: BookPageProps) {
  const isLeft = side === 'left';
  const isSingle = side === 'single';

  return (
    <div
      className={cn(
        'relative h-full overflow-hidden border border-[#9b7440]/60 bg-[#ead9ad] shadow-[inset_0_0_40px_rgba(97,57,24,0.22)]',
        isSingle ? 'rounded-xl' : isLeft ? 'rounded-xl md:rounded-r-none' : 'rounded-r-xl md:rounded-l-none',
      )}
    >
      <div className="absolute inset-0 papyrus-texture opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.33),transparent_46%),linear-gradient(90deg,rgba(83,45,18,0.12),transparent_13%,transparent_86%,rgba(83,45,18,0.16))]" />
      <div
        className={cn(
          'absolute inset-y-0 z-20 w-14 pointer-events-none',
          isSingle
            ? 'left-0 right-0 bg-gradient-to-r from-black/10 via-transparent to-black/10'
            : isLeft
              ? 'right-0 bg-gradient-to-l from-black/22 via-black/8 to-transparent'
              : 'left-0 bg-gradient-to-r from-black/24 via-black/8 to-transparent',
        )}
      />

      <div className="relative z-10 flex h-full flex-col p-3 sm:p-4 md:p-6">
        <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#8f6430]/30 pb-2 font-display text-[10px] uppercase tracking-[0.24em] text-[#6f4b24]">
          <span className="truncate">{title}</span>
          {pageNumber && <span>{pageNumber}</span>}
        </div>

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          {image ? (
            <img
              src={getAssetUrl(image)}
              alt={`${title} page ${pageNumber}`}
              className="max-h-full max-w-full object-contain drop-shadow-[0_22px_28px_rgba(64,39,18,0.26)]"
              draggable={false}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-center">
              <div>
                <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#8a642f]/50" />
                <p className="font-display text-sm uppercase tracking-[0.22em] text-[#7b572d]/70">Scroll Concluded</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ImageSequenceViewer({ 
  title, 
  images, 
  onClose,
  onNextTale,
  nextTaleTitle
}: ImageSequenceViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndOverlay, setShowEndOverlay] = useState(false);
  const [direction, setDirection] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const maxIndex = Math.max(images.length - 1, 0);

  const progress = useMemo(() => {
    if (images.length === 0) return 0;
    return ((currentIndex + 1) / images.length) * 100;
  }, [currentIndex, images.length]);

  const literaryTheme = useMemo(() => {
    const lowercaseTitle = title.toLowerCase();
    if (lowercaseTitle.includes('first')) {
      return {
        header: 'First Scroll Deciphered',
        subtext: 'The wonders of the ancient Sage Imhotep are inscribed in the House of Life. Prepare to unroll the next chronicle of magic.',
        action: 'UNROLL THE SECOND SCROLL',
        buttonText: 'Roll to Next Scroll'
      };
    }
    if (lowercaseTitle.includes('second')) {
      return {
        header: 'Second Scroll Deciphered',
        subtext: 'The wax crocodile has executed divine justice upon the trespasser. The pharaoh demands the next account.',
        action: 'UNROLL THE THIRD SCROLL',
        buttonText: 'Roll to Next Scroll'
      };
    }
    if (lowercaseTitle.includes('third')) {
      return {
        header: 'Third Scroll Deciphered',
        subtext: 'The green jasper amulet is recovered from the lake, and the oarswomen sing of Sneferu. Let us seek deeper wisdom.',
        action: 'UNROLL THE FOURTH SCROLL',
        buttonText: 'Roll to Next Scroll'
      };
    }
    if (lowercaseTitle.includes('fourth')) {
      return {
        header: 'Fourth Scroll Deciphered',
        subtext: 'The magician Djedi has foretold the birth of the royal triplets. The thread of destiny leads to the temple of Re.',
        action: 'UNROLL THE FINAL SCROLL',
        buttonText: 'Roll to Next Scroll'
      };
    }
    return {
      header: 'Westcar Papyrus Deciphered',
      subtext: 'The royal children of Re have ascended. The great chronicles of Khufu’s court are fully sealed in your memory.',
      action: 'RETURN TO TEMPLE ARCHIVES',
      buttonText: 'Seal the Papyrus'
    };
  }, [title]);

  const goToNext = useCallback(() => {
    if (currentIndex < maxIndex) {
      playTransitionSound();
      setDirection(1);
      setCurrentIndex((previous) => Math.min(previous + 1, maxIndex));
    } else if (currentIndex === maxIndex) {
      if (onNextTale) {
        playTransitionSound();
        onNextTale();
      } else {
        onClose();
      }
    }
  }, [currentIndex, maxIndex, onNextTale, onClose]);

  const goToPrev = useCallback(() => {
    if (showEndOverlay) {
      setShowEndOverlay(false);
      return;
    }
    if (currentIndex > 0) {
      playTransitionSound();
      setDirection(-1);
      setCurrentIndex((previous) => Math.max(previous - 1, 0));
    }
  }, [currentIndex, showEndOverlay]);

  const goToPage = (index: number) => {
    if (index === currentIndex) return;
    playTransitionSound();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setShowEndOverlay(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goToNext();
      if (event.key === 'ArrowLeft') goToPrev();
      if (event.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Reset page index back to 0 (the first page) whenever a new tale is loaded
  useEffect(() => {
    setCurrentIndex(0);
    setShowEndOverlay(false);
  }, [title, images]);

  const spreadVariants = {
    enter: (turnDirection: number) => ({
      opacity: 0,
      rotateY: turnDirection > 0 ? -34 : 34,
      x: turnDirection > 0 ? 72 : -72,
      scale: 0.97,
      transformOrigin: turnDirection > 0 ? 'left center' : 'right center',
    }),
    center: {
      opacity: 1,
      rotateY: 0,
      x: 0,
      scale: 1,
    },
    exit: (turnDirection: number) => ({
      opacity: 0,
      rotateY: turnDirection > 0 ? 34 : -34,
      x: turnDirection > 0 ? -72 : 72,
      scale: 0.97,
      transformOrigin: turnDirection > 0 ? 'right center' : 'left center',
    }),
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-[#080604]/95 text-foreground backdrop-blur-2xl">
      <div className="absolute inset-0 temple-grid opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(212,175,55,0.15),transparent_36%),linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.8))]" />

      <header className="relative z-20 flex flex-shrink-0 items-center justify-between gap-3 border-b border-gold/20 bg-background/70 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <EgyptianButton variant="ghost" size="icon" onClick={onClose} aria-label="Close book">
            <X className="h-4 w-4" />
          </EgyptianButton>
          <div className="min-w-0">
            <h2 className="truncate font-display text-base text-gold-light sm:text-lg">{title}</h2>
            <p className="text-xs text-muted-foreground">
              <span>Page {currentIndex + 1} of {images.length}</span>
            </p>
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center px-6 md:flex">
          <div className="h-1 w-full max-w-lg overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-dark via-gold to-turquoise"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <button
          onClick={toggleFullscreen}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-white/10 hover:text-gold"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
        </button>
      </header>

      <main className="relative z-10 flex min-h-0 flex-1 items-center justify-center px-3 py-4 sm:px-6 md:px-10">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="absolute left-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/20 bg-black/55 text-gold backdrop-blur-md transition-all hover:border-gold/50 hover:bg-black/80 disabled:pointer-events-none disabled:opacity-0 sm:left-6"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        <div className="relative h-[68vh] min-h-[430px] max-h-[860px] w-full max-w-4xl [perspective:2400px]">
          <div className="absolute -left-2 bottom-6 top-6 w-8 rounded-l-xl bg-[#8c6131] shadow-[inset_-10px_0_18px_rgba(0,0,0,0.25)]" />
          <div className="absolute -right-2 bottom-6 top-6 w-8 rounded-r-xl bg-[#8c6131] shadow-[inset_10px_0_18px_rgba(0,0,0,0.25)]" />
          <div className="absolute -bottom-4 left-8 right-8 h-10 rounded-[50%] bg-black/55 blur-xl" />

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={spreadVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full overflow-hidden rounded-xl border border-gold/30 bg-[#7d572b] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.65),0_0_60px_rgba(212,175,55,0.12)] [transform-style:preserve-3d]"
            >
              <BookPage image={images[currentIndex]} pageNumber={currentIndex + 1} side="single" title={title} />

              {/* Cinematic Next Tale Overlay inside the page */}
              {showEndOverlay && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-black/98 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 text-center border-2 border-gold/40 rounded-xl"
                >
                  <div className="absolute inset-0 papyrus-texture opacity-30 pointer-events-none" />
                  <div className="max-w-md space-y-6 relative z-10">
                    <span className="text-5xl inline-block animate-bounce mb-2">📜</span>
                    <p className="text-[#d4af37] font-display text-sm uppercase tracking-[0.25em] font-extrabold">{literaryTheme.header}</p>
                    <h3 className="text-2xl font-display text-white uppercase tracking-wider leading-tight font-extrabold">{title}</h3>
                    <p className="text-zinc-200 font-body text-xs italic leading-relaxed px-4">
                      "{literaryTheme.subtext}"
                    </p>
                    
                    <div className="h-px bg-[#d4af37]/35 my-4" />
                    
                    {onNextTale ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <p className="text-[#00e5ff] text-xs uppercase tracking-widest font-extrabold">Next Scroll</p>
                          <h4 className="text-xl font-display text-[#f9e7b9] uppercase leading-tight font-bold">{nextTaleTitle || 'The Next Tale'}</h4>
                        </div>

                        <EgyptianButton 
                          variant="hero" 
                          size="lg" 
                          onClick={onNextTale}
                          className="w-full mt-4 font-display font-bold tracking-widest text-xs shadow-gold-glow animate-pulse border border-[#d4af37]/50"
                        >
                          {literaryTheme.action} <ArrowRight className="inline ml-1.5 w-4 h-4" />
                        </EgyptianButton>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-emerald-400 text-xs uppercase tracking-widest font-extrabold">Temple Scribe Initiated</p>
                        <EgyptianButton 
                          variant="gold" 
                          size="lg" 
                          onClick={onClose}
                          className="w-full mt-4 font-display font-bold tracking-widest text-xs border border-[#d4af37]/40 shadow-gold-glow"
                        >
                          {literaryTheme.action}
                        </EgyptianButton>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="absolute right-5 top-5 z-40 flex items-center gap-2 rounded-full border border-gold/25 bg-black/45 px-3 py-1.5 font-display text-xs uppercase tracking-[0.18em] text-gold-light backdrop-blur">
            <Bookmark className="h-3.5 w-3.5" />
            {Math.round(progress)}%
          </div>
        </div>

        <button
          onClick={goToNext}
          disabled={currentIndex === maxIndex && showEndOverlay}
          className="absolute right-3 top-1/2 z-30 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/20 bg-black/55 text-gold backdrop-blur-md transition-all hover:border-gold/50 hover:bg-black/80 disabled:pointer-events-none disabled:opacity-0 sm:right-6"
          aria-label="Next page"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </main>

      <footer className="relative z-20 flex flex-shrink-0 flex-col gap-3 border-t border-gold/15 bg-background/70 px-3 py-3 backdrop-blur-xl sm:px-5">
        <div className="flex items-center justify-center gap-3">
          <EgyptianButton variant="outline" size="sm" onClick={goToPrev} disabled={currentIndex === 0 && !showEndOverlay}>
            <ChevronLeft className="h-4 w-4" />
            Previous
          </EgyptianButton>
          <div className="flex items-center gap-2 rounded-full border border-gold/20 bg-black/30 px-4 py-2 font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <BookOpen className="h-4 w-4 text-gold" />
            {currentIndex + 1} / {images.length}
          </div>
          <EgyptianButton 
            variant="hero" 
            size="sm" 
            onClick={goToNext}
            disabled={currentIndex === maxIndex && showEndOverlay}
            className={cn(currentIndex === maxIndex && !showEndOverlay && "animate-pulse shadow-gold-glow")}
          >
            {currentIndex === maxIndex ? literaryTheme.buttonText : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </EgyptianButton>
        </div>

        <div className="scrollbar-none mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => goToPage(index)}
              className={cn(
                'relative h-14 w-10 flex-shrink-0 overflow-hidden rounded-sm border transition-all',
                index === currentIndex
                  ? 'border-gold shadow-[0_0_18px_rgba(212,175,55,0.35)]'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              )}
              aria-label={`Go to page ${index + 1}`}
            >
              <img src={getAssetUrl(image)} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-0 left-0 right-0 bg-black/70 py-0.5 text-[9px] font-bold text-white">
                {index + 1}
              </span>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}
