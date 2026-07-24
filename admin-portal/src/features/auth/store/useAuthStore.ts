import { create } from 'zustand';
import { loadAuthSession, saveAuthSession } from '../../../shared/auth/tokenStorage';
import type { AuthSession } from '../../../shared/auth/types';

type AuthState = {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  (set) => ({
    session: loadAuthSession(),
    setSession: (session) => {
      saveAuthSession(session);
      set({ session });
    },
    clearSession: () => {
      saveAuthSession(null);
      set({ session: null });
    },
  }),
);
