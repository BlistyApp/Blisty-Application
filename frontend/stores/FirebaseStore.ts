import { create } from "zustand";
import { FirebaseState } from "./Types";
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCredentialStore } from "./CredentialStore";

export const useFirebaseStore = create<FirebaseState>((set) => ({
  fbApp: null,
  fbAuth: null,
  initFirebase: async () => {
    const { credentials } = useCredentialStore.getState();
    if (!credentials.apiKey || useFirebaseStore.getState().fbApp) return;
    try {
      const app = initializeApp({
        apiKey: credentials.apiKey,
        authDomain: credentials.authDomain,
        projectId: credentials.projectId,
        storageBucket: credentials.storageBucket,
        messagingSenderId: credentials.messagingSenderId,
        appId: credentials.appId,
      });
      set({ fbApp: app });
      const fbAuth = require("firebase/auth");
      const auth = fbAuth.initializeAuth(app, {
        persistence: fbAuth.getReactNativePersistence(AsyncStorage),
      });
      set({ fbAuth: auth });
    } catch (e) {
      console.error("Firebase initialization error:", e);
    }
  },
}));
