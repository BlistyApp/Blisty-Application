import { create } from "zustand";

interface BlistyError {
  code: string;
}

interface ErrorState {
  error: BlistyError | undefined;
  setError: (error: BlistyError) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: undefined,
  setError: (error: BlistyError) => {
    set({ error });
  },
  clearError: () => {
    set({ error: undefined });
  },
}));
