import type { AuthSession } from './types';

const authStorageKey = 'examforge-auth-session';

export function loadAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(authStorageKey);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(authStorageKey);
    return;
  }

  window.localStorage.setItem(authStorageKey, JSON.stringify(session));
}

