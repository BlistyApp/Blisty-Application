import { create } from "zustand";
import { FirebaseState } from "./Types";
import { FirebaseError, initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useUserStore } from "./UserStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCredentialStore } from "./CredentialStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { type RegisterType } from "@/types/RegisterType";
import { LoginType } from "@/types/LoginType";
import BlistyError from "@/lib/blistyError";

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
      if (e instanceof FirebaseError) {
        throw new BlistyError(e.message, e.code);
      }

      throw new BlistyError("Error al inicializar Firebase");
    }
  },
  updateUser: async () => {
    try {
      console.log("UPDATE USER");
      const db = get().db;
      const { setUser, user } = useUserStore.getState();

      if (!db) {
        throw new BlistyError("No se encontró la base de datos", "error-db");
      }

      if (!user) {
        throw new BlistyError(
          "No se encontró el usuario dirigido",
          "error-user"
        );
      }

      const userRef = doc(db, "users", user?.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        //console.log("DATA USER");
        //console.log(data);
        if (typeof data.tuition_number === "number") {
          console.log("PSYCHOLOGIST LOGED IN");

          const tagsRef = query(
            collection(db, "tags"),
            where("id", "in", data.tags)
          );
          const tagsSnap = await getDocs(tagsRef);
          const tagsData = tagsSnap.docs.map((doc) => doc.data().label);
          const mTagsRef = query(
            collection(db, "master-tags"),
            where("id", "in", data.mTags)
          );
          const mTagsSnap = await getDocs(mTagsRef);
          const mTagsData = mTagsSnap.docs.map((doc) => doc.data().label);

          //console.log("TAGS DATA");
          //console.log(tagsData);
          //console.log("MTAGS DATA");
          //console.log(mTagsData);
          console.log(data);

          setUser({
            name: data?.name as string,
            email: user?.email as string,
            profile_pic: data?.profile_pic as string,
            uid: user?.uid as string,
            role: data.role as "psychologist" | "patient",
            tuition_number: data.tuition_number,
            birth_day: data.birth_day,
            phone: data.phone as string,
            mTags: mTagsData,
            tags: tagsData,
            experience: data.experience,
            description: data.description,
            available_mode: data.available_mode,
          });
        } else {
          setUser({
            name: data?.name as string,
            email: user?.email as string,
            profile_pic: data?.profile_pic as string,
            uid: user?.uid as string,
            role: data.role as "psychologist" | "patient",
            birth_day: data.birth_day,
            phone: data.phone as string,
          });
        }
      } else {
        throw new Error("No user Found");
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        throw new BlistyError(e.message, e.code);
      }

      throw new BlistyError("Error al actualizar usuario", "update_user_error");
    }
  },
  login: async (data: LoginType) => {
    try {
      const auth = get().fbAuth;
      if (!auth) return;
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new BlistyError(error.message, error.code);
      }
      throw new BlistyError("Error al iniciar sesión", "login_error");
    }
  },
  register: async (data: RegisterType) => {
    try {
      const auth = get().fbAuth;
      const db = get().db;
      if (!auth || !db) return;
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const photoURL = `https://avatar.iran.liara.run/public/${
        Math.floor(Math.random() * 30) + 1
      }`;
      await updateProfile(res.user, {
        displayName: data.name,
        photoURL,
      });

      const { password, birth_day, ...dataUser } = data;

      await setDoc(doc(db, "users", res?.user.uid), {
        ...dataUser,
        birth_day: Timestamp.fromDate(data.birth_day),
        uid: res?.user.uid,
        profile_pic: photoURL,
      });

      console.log("DATA USER REGISTER");
      console.log(data);
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new BlistyError(error.message, error.code);
      }

      throw new BlistyError("Error al registrar usuario");
    }
  },
}));
