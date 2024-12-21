import { type AlertType } from "@/types/AlertType";
import { LoginType } from "@/types/LoginType";
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore, Timestamp } from "firebase/firestore";

export interface CredentialState {
  credentials: Credentials;
  getCredentials: () => Promise<void>;
  decrypt: () => Promise<void>;
}

export interface Credentials {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface FirebaseState {
  fbApp: FirebaseApp | null;
  fbAuth: Auth | null;
  db: Firestore | null;
  initFirebase: () => Promise<void>;
  updateUser: () => Promise<void>;
  register: (data: RegisterType) => Promise<void>;
  login: (data: LoginType) => Promise<void>;
}

export interface UserState {
  user: User | null;
  userRegistering: boolean | null;
  setUserRegistering: (userRegistering: boolean) => void;
  setUser: (user: User) => Promise<void>;
  clearUser: () => void;
}

export interface User {
  name: string;
  birth_day?: Timestamp;
  phone?: string;
  email: string;
  profile_pic: string;
  uid: string;
  role?: "psychologist" | "patient";
  tuition_number?: number;
  mTags?: string[];
  tags?: string[];
  experience?: string;
  description?: string;
  available_mode?: string;
}
