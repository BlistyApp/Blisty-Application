import { create } from "zustand";
import { FirebaseState } from "./Types";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useUserStore } from "./UserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCredentialStore } from "./CredentialStore";
import { doc, getDoc, addDoc, setDoc } from "firebase/firestore";
import { type RegisterType } from "@/types/RegisterType";
import { LoginType } from "@/types/LoginType";

export const useFirebaseStore = create<FirebaseState>((set, get) => ({
  fbApp: null,
  fbAuth: null,
  db: null,
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
      set({ db: getFirestore(app) });
      const fbAuth = require("firebase/auth");
      const auth = fbAuth.initializeAuth(app, {
        persistence: fbAuth.getReactNativePersistence(AsyncStorage),
      });
      set({ fbAuth: auth });
    } catch (e) {
      console.error("Firebase initialization error:", e);
    }
  },
  updateUser: async () => {
    try {
      console.log("UPDATE USER");
      const db = get().db;
      const { setUser, user } = useUserStore.getState();
      if (!db || !user) return;
      const docRef = doc(db, "users", user?.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("DATA USER");
        console.log(data);
        if (typeof data.tuition_number === "string") {
          console.log("PSYCHOLOGIST INGRESADO");
          setUser({
            name: user?.name as string,
            email: user?.email as string,
            profilePic: user?.profilePic as string,
            uid: user?.uid as string,
            role: data.role as "psychologist" | "patient",
            tuition_number: data.tuition_number,
            birth_day: data.birth_day as Date,
            phone: data.phone as string,
          });
        } else {
          setUser({
            name: user?.name as string,
            email: user?.email as string,
            profilePic: user?.profilePic as string,
            uid: user?.uid as string,
            role: data.role as "psychologist" | "patient",
            birth_day: data.birth_day as Date,
            phone: data.phone as string,
          });
        }
        return { success: true };
      } else {
        throw new Error("No such document!");
      }
    } catch (e) {
      return { success: false, message: (e as any).message };
    }
  },
  login: async (data: LoginType) => {
    try {
      const auth = get().fbAuth;
      if (!auth) return;
      const res = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, message: (error as any).message };
    }
  },
  register: async (data: RegisterType) => {
    try {
      console.log("DATA USER REGISTER");
      console.log(data);
      const auth = get().fbAuth;
      const db = get().db;
      if (!auth || !db) return;
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const photoURL = `https://avatar.iran.liara.run/public/${Math.floor(Math.random() * 30) + 1}`;
      await updateProfile(res.user, {
        displayName: data.name,
        photoURL,
      });
      const { email, password, ...dataUser } = data;

      await setDoc(doc(db, "users", res?.user.uid), {
        ...dataUser,
        uid: res?.user.uid,
        profilePic: photoURL,
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
