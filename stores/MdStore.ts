import { create } from "zustand";
import { ChatUser } from "@/types/ChatUser";

interface MdState {
  toUser: ChatUser | null;
  setToUser: (toUser: ChatUser) => void;
  clearToUser: () => void;
}

export const useMdStore = create<MdState>((set) => ({
  toUser: null,
  setToUser: (toUser: ChatUser) => {
    set({ toUser });
  },
  clearToUser: () => {
    set({ toUser: null });
  },
}));
