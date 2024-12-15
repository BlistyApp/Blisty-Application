import { create } from "zustand";

interface AppKeyState {
  appKey: number;
  updateAppKey: () => void;
}

export const useAppKeyStore = create<AppKeyState>((set) => ({
  appKey: 0,
  updateAppKey: () => set((state) => ({ appKey: state.appKey + 1 })),
}));
