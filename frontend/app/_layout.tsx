import { Stack } from "expo-router/stack";
import { View, ActivityIndicator } from "react-native";

import { useCredentialStore } from "@/stores/CredentialStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useEffect, useState } from "react";

import { Tabs, useRouter } from "expo-router";
import { TabBarIcon } from "@/components/icons/Icons";
import { useUserStore } from "@/stores/UserStore";
import { onAuthStateChanged } from "firebase/auth";

export default function RootLayout() {
  const { getCredentials, decrypt } = useCredentialStore();
  const { initApp, initAuth } = useFirebaseStore();
  const [loading, setLoading] = useState(true);
  const [authInit, setAuthInit] = useState(false);
  const { fbAuth } = useFirebaseStore();
  const { user, setUser, clearUser } = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        await getCredentials();
        await decrypt();
        const { credentials } = useCredentialStore.getState();
        await initApp(credentials);
        if (!authInit) {
          await initAuth(useFirebaseStore.getState().fbApp);
          setAuthInit(true);
        }
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCredentials();
  }, []);

  useEffect(() => {
    setInitializing(false);
  }, []);

  useEffect(() => {
    const subscriber = onAuthStateChanged(fbAuth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email ?? "",
          name: user.displayName ?? "",
          profilePic: user.photoURL ?? "",
        });
        if (!loggedIn) {
          console.log("Logged in");
          setLoggedIn(true);
          router.replace("/");
        }
      } else {
        console.log("Not logged in");
        router.replace("/welcome");
        clearUser();
        setLoggedIn(false);
      }
    });
    return subscriber;
  }, [initializing, user]);

  if (loading) {
    return (
      <View className="bg-black flex-1">
        <ActivityIndicator size="large" color="#ffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="login" />
        <Stack.Screen
          name="register"
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
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
