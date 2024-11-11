import { create } from "zustand";
import { User, UserState } from "./Types";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  userRegistering: null,
  setUserRegistering: (userRegistering: boolean) => {
    set({ userRegistering });
  },
  setUser: async (user: User) => {
    set({ user });
  },
  clearUser: () => {
    set({ user: null });
  },
}));
