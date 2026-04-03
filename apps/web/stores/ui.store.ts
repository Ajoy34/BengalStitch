import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  locale: 'en' | 'bn';
  toggleSidebar: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLocale: (locale: 'en' | 'bn') => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  theme: 'dark',
  locale: 'en',

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setTheme: (theme) => set({ theme }),
  setLocale: (locale) => set({ locale }),
}));
