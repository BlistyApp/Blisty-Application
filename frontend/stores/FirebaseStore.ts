import { create } from "zustand";
import { Credentials, FirebaseState } from "./Types";
import { initializeApp, FirebaseApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Auth } from "firebase/auth";

export const useFirebaseStore = create<FirebaseState>((set) => ({
  fbApp: {} as FirebaseApp,
  fbAuth: {} as Auth,
  initApp: async (credentials: Credentials) => {
    const app = initializeApp({
      apiKey: credentials.apiKey,
      authDomain: credentials.authDomain,
      projectId: credentials.projectId,
      storageBucket: credentials.storageBucket,
      messagingSenderId: credentials.messagingSenderId,
      appId: credentials.appId,
    });
    set({ fbApp: app });
  },
  initAuth: async (fbApp: FirebaseApp) => {
    const fbAuth = require("firebase/auth");
    const auth = fbAuth.initializeAuth(fbApp, {
      persistence: (fbAuth as any).getReactNativePersistence(AsyncStorage),
    });
    set({ fbAuth: auth });
  },
}));
