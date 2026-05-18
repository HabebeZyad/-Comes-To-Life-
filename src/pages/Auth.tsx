import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
} from 'lucide-react';
import { DustParticles } from '@/components/effects/DustParticles';
import { HieroglyphBackground } from '@/components/effects/HieroglyphBackground';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

type AuthMode = 'sign-in' | 'sign-up';

interface LocationState {
  from?: string;
}

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, signIn, signUp } = useAuth();
  const initialMode: AuthMode = location.pathname.includes('sign-up') || location.pathname.includes('signup')
    ? 'sign-up'
    : 'sign-in';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as LocationState | null)?.from || '/profile';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setConfirmPassword('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      if (mode === 'sign-up') {
        if (password !== confirmPassword) {
          throw new Error('The passwords do not match.');
        }
        await signUp({ name, email, password });
        toast({
          title: 'Account created',
          description: 'Your profile vault is ready.',
        });
      } else {
        await signIn({ email, password });
        toast({
          title: 'Welcome back',
          description: 'Your profile has been restored.',
        });
      }

      navigate(from, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-background pt-16 md:pt-20">
      <DustParticles count={18} />
      <HieroglyphBackground density="low" animated />

      <main className="content-shell relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <div className="section-kicker mb-6">
            <ShieldCheck className="h-4 w-4" />
            Member Access
          </div>
          <h1 className="max-w-xl font-display text-5xl font-bold leading-tight text-gold-gradient">
            Enter the archive with a profile that remembers every discovery.
          </h1>
          <p className="mt-6 max-w-lg text-xl leading-relaxed text-muted-foreground">
            Save story progress, achievements, avatar details, and reading history under one personal identity.
          </p>

          <div className="mt-10 grid max-w-xl gap-4 sm:grid-cols-3">
            {[
              { icon: BookOpen, label: 'Stories', value: 'Synced' },
              { icon: Sparkles, label: 'Rewards', value: 'Tracked' },
              { icon: ShieldCheck, label: 'Vault', value: 'Private' },
            ].map((item) => (
              <div key={item.label} className="gold-border-gradient rounded-lg bg-card/40 p-4 backdrop-blur-sm">
                <item.icon className="mb-4 h-5 w-5 text-gold-light" />
                <p className="font-display text-sm text-foreground">{item.label}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="luxury-panel rounded-2xl p-1">
            <div className="rounded-[0.85rem] border border-white/10 bg-background/78 p-5 shadow-deep sm:p-7">
              <div className="mb-7 flex rounded-xl border border-gold/20 bg-black/30 p-1">
                {(['sign-in', 'sign-up'] as AuthMode[]).map((entry) => {
                  const isActive = mode === entry;
                  const Icon = entry === 'sign-in' ? LogIn : UserPlus;
                  return (
                    <button
                      key={entry}
                      type="button"
                      onClick={() => handleModeChange(entry)}
                      className={cn(
                        'relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-display text-sm transition-colors',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="auth-mode"
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-gold-dark via-primary to-gold-light"
                          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                        />
                      )}
                      <Icon className="relative h-4 w-4" />
                      <span className="relative">{entry === 'sign-in' ? 'Login' : 'Sign Up'}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mb-7">
                <p className="font-display text-xs uppercase tracking-[0.28em] text-primary">
                  Comes To Life
                </p>
                <h2 className="mt-2 font-display text-3xl font-bold text-gold-gradient">
                  {mode === 'sign-in' ? 'Welcome Back' : 'Create Your Profile'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence initial={false}>
                  {mode === 'sign-up' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Label htmlFor="name" className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Profile Name
                      </Label>
                      <div className="relative mt-2">
                        <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(event) => setName(event.target.value)}
                          className="h-12 border-gold/20 bg-black/30 pl-10 font-body text-lg"
                          placeholder="Ancient Explorer"
                          autoComplete="name"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <Label htmlFor="email" className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Email
                  </Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 border-gold/20 bg-black/30 pl-10 font-body text-lg"
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Password
                  </Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="h-12 border-gold/20 bg-black/30 pl-10 pr-11 font-body text-lg"
                      placeholder="At least 8 characters"
                      autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-gold"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {mode === 'sign-up' && (
                  <>
                    <div>
                      <Label htmlFor="confirmPassword" className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Confirm Password
                      </Label>
                      <div className="relative mt-2">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold/70" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(event) => setConfirmPassword(event.target.value)}
                          className="h-12 border-gold/20 bg-black/30 pl-10 font-body text-lg"
                          placeholder="Repeat password"
                          autoComplete="new-password"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[0, 1, 2, 3].map((index) => (
                        <span
                          key={index}
                          className={cn(
                            'h-1.5 rounded-full bg-muted transition-colors',
                            passwordStrength > index && 'bg-gradient-to-r from-gold-dark to-gold-light'
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <EgyptianButton
                  type="submit"
                  variant="hero"
                  size="lg"
                  shimmer
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sealing...' : mode === 'sign-in' ? 'Login' : 'Create Account'}
                  <ArrowRight className="h-4 w-4" />
                </EgyptianButton>
              </form>

              <div className="mt-6 border-t border-gold/10 pt-5 text-center text-sm text-muted-foreground">
                {mode === 'sign-in' ? (
                  <button
                    type="button"
                    onClick={() => handleModeChange('sign-up')}
                    className="font-display text-primary transition-colors hover:text-gold-light"
                  >
                    New to the archive? Create an account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleModeChange('sign-in')}
                    className="font-display text-primary transition-colors hover:text-gold-light"
                  >
                    Already have an account? Login
                  </button>
                )}
              </div>
            </div>
          </div>

          <Link to="/" className="mx-auto mt-6 flex w-fit items-center gap-2 font-display text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-gold">
            Return Home
          </Link>
        </motion.section>
      </main>
    </div>
  );
}

