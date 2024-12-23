import { create } from "zustand";
import "react-native-get-random-values";
import CryptoJS from "crypto-js";
import { Credentials, CredentialState } from "./Types";

const decrypt = async (encrypted: string) => {
  const bytes = CryptoJS.AES.decrypt(
    encrypted,
    process.env.EXPO_PUBLIC_SECRET_KEY ?? "",
  );
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const useCredentialStore = create<CredentialState>((set, get) => ({
  credentials: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  },
  getCredentials: async () => {
    const res = (await (
      await fetch("https://xenial-sherrie-blisty-65d38a90.koyeb.app/creds")
    ).json()) as Credentials;
    set((_state) => ({ credentials: res }));
  },
  decrypt: async () => {
    const decryptedApiKey = await decrypt(get().credentials.apiKey);
    const decryptedAuthDomain = await decrypt(get().credentials.authDomain);
    const decryptedProjectId = await decrypt(get().credentials.projectId);
    const decryptedStorageBucket = await decrypt(
      get().credentials.storageBucket,
    );
    const decryptedMessagingSenderId = await decrypt(
      get().credentials.messagingSenderId,
    );
    const decryptedAppId = await decrypt(get().credentials.appId);
    set((_state) => ({
      credentials: {
        apiKey: decryptedApiKey,
        authDomain: decryptedAuthDomain,
        projectId: decryptedProjectId,
        storageBucket: decryptedStorageBucket,
        messagingSenderId: decryptedMessagingSenderId,
        appId: decryptedAppId,
      },
    }));
  },
}));
