import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Search, User, Menu, X, Volume2, VolumeX, ScrollText, Gamepad2, LogIn, LogOut } from 'lucide-react';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { audioEnabled, setAudioEnabled, isMuseumMode } = useGame();
  const { user, isAuthenticated, signOut } = useAuth();
  const displayName = user?.name?.split(' ')[0] || 'Profile';
  const isImageAvatar = Boolean(user?.avatar?.startsWith('data:image'));
  const items = navItems.map((item) =>
    item.path === '/profile' && !isAuthenticated
      ? { ...item, path: '/auth', label: 'Login', icon: LogIn }
      : item
  );

  // Tab active status check based on path prefixes
  const isTabActive = (itemPath: string) => {
    const p = location.pathname;
    if (itemPath === '/profile' || itemPath === '/auth') {
      return p.startsWith('/profile') || p.startsWith('/auth');
    }
    return p.startsWith(itemPath);
  };

  // Tab target path tracking
  const currentFullPath = location.pathname + location.search + location.hash;
  React.useEffect(() => {
    const p = location.pathname;
    if (p.startsWith('/storytelling')) {
      sessionStorage.setItem('last_tab_/storytelling', currentFullPath);
    } else if (p.startsWith('/stories')) {
      sessionStorage.setItem('last_tab_/stories', currentFullPath);
    } else if (p.startsWith('/games')) {
      sessionStorage.setItem('last_tab_/games', currentFullPath);
    } else if (p.startsWith('/hieroglyphs')) {
      sessionStorage.setItem('last_tab_/hieroglyphs', currentFullPath);
    } else if (p.startsWith('/profile') || p.startsWith('/auth')) {
      sessionStorage.setItem('last_tab_/profile', currentFullPath);
    }
  }, [currentFullPath, location.pathname]);

  const getTargetTabPath = (itemPath: string) => {
    const isProfileOrAuth = itemPath === '/profile' || itemPath === '/auth';
    const isActive = isTabActive(itemPath);

    if (isActive) {
      return itemPath;
    }

    const saved = sessionStorage.getItem('last_tab_' + (isProfileOrAuth ? '/profile' : itemPath));
    if (saved) {
      if (isProfileOrAuth) {
        if (isAuthenticated && saved.startsWith('/auth')) {
          return '/profile';
        }
        if (!isAuthenticated && saved.startsWith('/profile')) {
          return '/auth';
        }
      }
      return saved;
    }
    return itemPath;
  };

  const handleSignOut = () => {
    signOut();
    setIsOpen(false);
    if (location.pathname === '/profile') {
      navigate('/auth');
    }
  };

  if (isMuseumMode) {
    return null;
  }

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-50 hidden md:block">
        <div className="border-b border-gold/20 bg-background/80 shadow-[0_14px_44px_hsl(0_0%_0%/0.24)] backdrop-blur-xl">
          <div className="container mx-auto px-6">
            <div className="flex h-16 items-center justify-between">
              <Link to="/" className="group flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 shadow-gold-glow transition-transform group-hover:scale-105">
                  <span className="text-xl text-gold-light drop-shadow-gold-glow">𓂀</span>
                </span>
                <span className="font-display text-xl text-gold-gradient">
                  Comes To Life
                </span>
              </Link>

              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/25 p-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isTabActive(item.path);

                  return (
                    <Link key={item.path} to={getTargetTabPath(item.path)}>
                      <motion.div
                        className={cn(
                          'relative flex items-center gap-2 rounded-lg px-4 py-2 font-display text-sm transition-all',
                          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                        )}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-lg border border-gold/30 bg-gold/15"
                            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          />
                        )}
                        <Icon className="relative h-4 w-4" />
                        <span className="relative hidden lg:inline">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}

                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  aria-label={audioEnabled ? 'Disable sound' : 'Enable sound'}
                  className="ml-2 rounded-lg border border-transparent p-2 text-muted-foreground transition-all hover:border-gold/20 hover:bg-gold/10 hover:text-foreground"
                >
                  {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={handleSignOut}
                    aria-label="Sign out"
                    title="Sign out"
                    className="rounded-lg border border-transparent p-2 text-muted-foreground transition-all hover:border-gold/20 hover:bg-gold/10 hover:text-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                )}
              </div>

              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="hidden xl:flex items-center gap-2 rounded-xl border border-gold/25 bg-gold/10 px-3 py-2 font-display text-xs text-gold-light transition-all hover:bg-gold/15"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/30 text-[11px] font-bold">
                    {isImageAvatar ? (
                      <img src={user?.avatar} alt="" className="h-full w-full rounded-lg object-cover" />
                    ) : (
                      user?.avatar || 'CT'
                    )}
                  </span>
                  <span className="max-w-[9rem] truncate">{displayName}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed right-4 top-4 z-50 md:hidden">
        <EgyptianButton
          variant="default"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className="shadow-deep"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />
            <div className="luxury-panel absolute bottom-0 right-0 top-0 w-80 max-w-[86vw] border-l border-gold/25 p-6 pt-20">
              <Link
                to="/"
                className="mb-8 flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-gold/30 bg-gold/10">
                  <span className="text-2xl text-gold-light drop-shadow-gold-glow">𓂀</span>
                </span>
                <span className="font-display text-lg text-gold-gradient">Comes To Life</span>
              </Link>

              <div className="flex flex-col gap-2">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isTabActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={getTargetTabPath(item.path)}
                      onClick={() => setIsOpen(false)}
                    >
                      <motion.div
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 font-display transition-all',
                          isActive
                            ? 'border border-gold/30 bg-gold/15 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="mt-6 flex w-full items-center gap-3 rounded-lg border border-gold/20 px-4 py-3 font-display text-sm text-muted-foreground transition-all hover:bg-gold/10 hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gold/20 bg-background/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-16px_42px_rgba(0,0,0,0.46)] backdrop-blur-xl md:hidden">
        <div className="flex h-16 items-center justify-around px-2 sm:px-4">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = isTabActive(item.path);

            return (
              <Link
                key={item.path}
                to={getTargetTabPath(item.path)}
                className="flex flex-1 justify-center py-2"
                aria-label={item.label}
              >
                <motion.div
                  className={cn(
                    'flex min-w-12 flex-col items-center justify-center rounded-lg p-2 transition-all',
                    isActive
                      ? 'scale-105 bg-gold/10 text-primary shadow-[0_0_15px_rgba(255,191,0,0.15)]'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon className="h-6 w-6" />
                  <span className="sr-only">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
