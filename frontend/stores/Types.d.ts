import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";

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
  initFirebase: () => Promise<void>;
}

export interface UserState {
  user: User | null;
  setUser: (user: User) => Promise<void>;
  clearUser: () => void;
}

export interface User {
  email: string;
  name: string;
  profilePic?: string;
  uid: string;
  role: "psychologist" | "patient";
}
