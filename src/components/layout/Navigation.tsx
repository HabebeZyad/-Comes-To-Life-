import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, User, Menu, X, Volume2, VolumeX, Globe, ScrollText, Gamepad2 } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/storytelling', label: 'Storytelling', icon: Sparkles },
  { path: '/stories', label: 'Stories', icon: ScrollText },
  { path: '/games', label: 'Games', icon: Gamepad2 },
  { path: '/hieroglyphs', label: 'Hieroglyphs', icon: Search },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { audioEnabled, setAudioEnabled, isMuseumMode } = useGame();

  if (isMuseumMode) {
    return null; // Hide navigation in museum mode
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="bg-background/80 backdrop-blur-lg border-b border-gold/20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-3 group">
                <span className="text-3xl animate-glow-pulse">𓂀</span>
                <span className="font-display text-xl tracking-wider text-gold-gradient">
                  Comes to Life
                </span>
              </Link>

              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link key={item.path} to={item.path}>
                      <motion.div
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-lg font-display text-sm tracking-wide transition-all",
                          isActive
                            ? "bg-gold/20 text-primary border border-gold/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="ml-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <EgyptianButton
          variant="default"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </EgyptianButton>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-lg"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-card border-l border-gold/20 p-6 pt-20">
              <Link
                to="/"
                className="flex items-center gap-3 mb-8"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-3xl">𓂀</span>
                <span className="font-display text-lg text-gold-gradient">Comes to Life</span>
              </Link>

              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg font-display tracking-wide transition-all",
                          isActive
                            ? "bg-gold/20 text-primary border border-gold/30"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
