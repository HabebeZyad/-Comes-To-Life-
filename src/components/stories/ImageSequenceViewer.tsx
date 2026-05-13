import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Maximize2, Minimize2 } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { getAssetUrl } from '@/lib/utils';

interface ImageSequenceViewerProps {
  title: string;
  images: string[];
  onClose: () => void;
}

export function ImageSequenceViewer({ title, images, onClose }: ImageSequenceViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playTransitionSound = () => {
    const audio = new Audio(getAssetUrl('/sounds/paper-transition.mp3'));
    audio.volume = 0.3;
    audio.play().catch(() => {});
  };

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      playTransitionSound();
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, images.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      playTransitionSound();
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose, isFullscreen]);

  const progress = ((currentIndex + 1) / images.length) * 100;

  const pageVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      originX: direction > 0 ? 1 : 0,
      z: 50,
      scale: 0.95,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      z: 0,
      originX: 0.5,
      scale: 1,
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      originX: direction < 0 ? 1 : 0,
      z: 50,
      scale: 0.95,
    })
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col backdrop-blur-md">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/50 border-b border-border/50 p-4 flex items-center justify-between z-10 transition-opacity duration-300 hover:opacity-100 opacity-90">
        <div className="flex items-center gap-4">
          <EgyptianButton variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close Tale
          </EgyptianButton>
          <div className="hidden sm:block">
            <h2 className="font-display text-gold-light text-lg">{title}</h2>
            <p className="text-muted-foreground text-xs">
              Page {currentIndex + 1} of {images.length}
            </p>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold/50 to-gold"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Viewer Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden perspective-[1000px]">
        {/* Previous Image Hint (for visual depth) */}
        {currentIndex > 0 && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/4 h-[80vh] opacity-20 blur-sm transform -translate-x-1/2 -rotate-y-12 pointer-events-none hidden md:block">
            <img src={getAssetUrl(images[currentIndex - 1])} alt="" className="w-full h-full object-contain" />
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8 z-10 [perspective:2000px]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={getAssetUrl(images[currentIndex])}
              alt={`Page ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-md shadow-[0_0_50px_rgba(212,175,55,0.15)] ring-1 ring-white/10"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>

        {/* Next Image Hint */}
        {currentIndex < images.length - 1 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-[80vh] opacity-20 blur-sm transform translate-x-1/2 rotate-y-12 pointer-events-none hidden md:block">
            <img src={getAssetUrl(images[currentIndex + 1])} alt="" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Navigation Overlays */}
        <div 
          className="absolute inset-y-0 left-0 w-1/3 cursor-pointer group z-20"
          onClick={goToPrev}
        >
          {currentIndex > 0 && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white/50 group-hover:text-gold group-hover:bg-black/80 transition-all backdrop-blur-sm border border-white/10">
              <ChevronLeft className="w-8 h-8" />
            </div>
          )}
        </div>
        
        <div 
          className="absolute inset-y-0 right-0 w-1/3 cursor-pointer group z-20"
          onClick={goToNext}
        >
          {currentIndex < images.length - 1 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white/50 group-hover:text-gold group-hover:bg-black/80 transition-all backdrop-blur-sm border border-white/10">
              <ChevronRight className="w-8 h-8" />
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile progress indicator */}
      <div className="md:hidden h-1 bg-white/10 absolute bottom-0 left-0 right-0">
        <motion.div
          className="h-full bg-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
