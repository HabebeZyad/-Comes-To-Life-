import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { AuthCredentials, AuthUser, SignUpCredentials } from '@/types/auth';

interface StoredAccount extends AuthUser {
  passwordHash: string;
  salt: string;
}

interface StoredSession {
  userId: string;
  createdAt: string;
  expiresAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: AuthCredentials) => Promise<AuthUser>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthUser>;
  signOut: () => void;
  updateUser: (updates: Partial<Pick<AuthUser, 'name' | 'avatar'>>) => Promise<AuthUser>;
}

const ACCOUNTS_KEY = 'comesToLife_auth_accounts';
const SESSION_KEY = 'comesToLife_auth_session';
const SESSION_DAYS = 30;
const DEFAULT_AVATAR = 'CT';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

const makeSalt = () => {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const hashPassword = async (password: string, salt: string) => {
  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', encoded);
  return toHex(digest);
};

const publicUser = (account: StoredAccount): AuthUser => ({
  id: account.id,
  name: account.name,
  email: account.email,
  avatar: account.avatar,
  createdAt: account.createdAt,
  lastLoginAt: account.lastLoginAt,
});

const getAccounts = () => safeParse<StoredAccount[]>(localStorage.getItem(ACCOUNTS_KEY), []);

const saveAccounts = (accounts: StoredAccount[]) => {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
};

const createSession = (userId: string): StoredSession => {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  return {
    userId,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = safeParse<StoredSession | null>(localStorage.getItem(SESSION_KEY), null);

    if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      setIsLoading(false);
      return;
    }

    const account = getAccounts().find((entry) => entry.id === session.userId);
    if (!account) {
      localStorage.removeItem(SESSION_KEY);
      setIsLoading(false);
      return;
    }

    setUser(publicUser(account));
    setIsLoading(false);
  }, []);

  const signIn = async ({ email, password }: AuthCredentials) => {
    const normalizedEmail = normalizeEmail(email);
    const accounts = getAccounts();
    const account = accounts.find((entry) => entry.email === normalizedEmail);

    if (!account) {
      throw new Error('No account was found for this email.');
    }

    const attemptedHash = await hashPassword(password, account.salt);
    if (attemptedHash !== account.passwordHash) {
      throw new Error('The email and password do not match.');
    }

    const updatedAccount: StoredAccount = {
      ...account,
      lastLoginAt: new Date().toISOString(),
    };
    saveAccounts(accounts.map((entry) => (entry.id === account.id ? updatedAccount : entry)));

    const nextUser = publicUser(updatedAccount);
    setUser(nextUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(createSession(nextUser.id)));
    return nextUser;
  };

  const signUp = async ({ name, email, password }: SignUpCredentials) => {
    const normalizedEmail = normalizeEmail(email);
    const trimmedName = name.trim();

    if (!trimmedName) {
      throw new Error('Enter a profile name.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error('Enter a valid email address.');
    }

    if (password.length < 8) {
      throw new Error('Use at least 8 characters for the password.');
    }

    const accounts = getAccounts();
    if (accounts.some((entry) => entry.email === normalizedEmail)) {
      throw new Error('An account already exists for this email.');
    }

    const salt = makeSalt();
    const now = new Date().toISOString();
    const account: StoredAccount = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      avatar: DEFAULT_AVATAR,
      createdAt: now,
      lastLoginAt: now,
      passwordHash: await hashPassword(password, salt),
      salt,
    };

    saveAccounts([...accounts, account]);

    const nextUser = publicUser(account);
    setUser(nextUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(createSession(nextUser.id)));
    return nextUser;
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const updateUser = async (updates: Partial<Pick<AuthUser, 'name' | 'avatar'>>) => {
    if (!user) {
      throw new Error('You must be signed in to update your account.');
    }

    const accounts = getAccounts();
    const account = accounts.find((entry) => entry.id === user.id);
    if (!account) {
      throw new Error('Account not found.');
    }

    const updatedAccount: StoredAccount = {
      ...account,
      ...updates,
      name: updates.name?.trim() || account.name,
    };

    saveAccounts(accounts.map((entry) => (entry.id === user.id ? updatedAccount : entry)));
    const nextUser = publicUser(updatedAccount);
    setUser(nextUser);
    return nextUser;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
