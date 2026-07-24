import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';

type UiState = {
  mode: ThemeMode;
  sidebarOpen: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const getInitialMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      mode: getInitialMode(),
      sidebarOpen: false,
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === 'light' ? 'dark' : 'light' }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
    }),
    {
      name: 'examforge-ui',
      partialize: (state) => ({ mode: state.mode, sidebarOpen: state.sidebarOpen }),
    },
  ),
);

