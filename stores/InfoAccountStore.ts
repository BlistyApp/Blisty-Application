import { create } from "zustand";

interface InfoAccountState {
  infoUid: string | null;
  setInfoUid: (infoUid: string) => void;
  clearInfoUid: () => void;
}

export const useInfoAccountStore = create<InfoAccountState>((set) => ({
  infoUid: null,
  setInfoUid: (infoUid: string) => {
    set({ infoUid });
  },
  clearInfoUid: () => {
    set({ infoUid: null });
  },
}));
