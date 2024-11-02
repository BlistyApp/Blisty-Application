import { useCredentialStore } from "@/stores/CredentialStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useEffect, useState } from "react";

import { useUserStore } from "@/stores/UserStore";
import { Stack } from "expo-router";
import { Loading } from "@/components/Loading";

export default function RootLayout() {
  const { getCredentials, decrypt } = useCredentialStore();
  const { initFirebase, fbAuth } = useFirebaseStore();
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const { setUser, clearUser } = useUserStore();

  const onAuthStateChanged = (user: any) => {
    if (user) {
      console.log("User is signed in", user);
      setUser({
        email: user.email,
        name: user.displayName,
        profilePic: user.photoURL,
        uid: user.uid,
        role: "patient",
      });
    } else {
      console.log("User is signed out");
      clearUser();
    }
    setLoading(false);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getCredentials();
        await decrypt();
        initFirebase();
      } catch (e) {
        console.error("Initialization error:", e);
      }
    };
    initializeAuth();
  }, []);

  useEffect(() => {
    if (fbAuth) {
      fbAuth.onAuthStateChanged(onAuthStateChanged);
    }
  }, [fbAuth]);

  useEffect(() => {
    setInitializing(false);
  }, []);

  if (loading || initializing) {
    return <Loading />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="welcome"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="login" />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="md" />
    </Stack>
  );
}
