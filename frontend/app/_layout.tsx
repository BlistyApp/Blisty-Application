import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {} from "react-native";
import { useCredentialStore } from "@/stores/CredentialStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/UserStore";
import { Stack } from "expo-router";
import Welcome from "./welcome";

export default function RootLayout() {
  const { getCredentials, decrypt } = useCredentialStore();
  const { initFirebase, fbAuth } = useFirebaseStore();
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useUserStore();

  const onAuthStateChanged = (user: any) => {
    if (user) {
      console.log("User is signed in", user);
      setUser({
        email: user.email,
        name: user.displayName,
        profilePic: user.photoURL,
        uid: user.uid,
      });
    } else {
      console.log("User is signed out");
      clearUser();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getCredentials();
        await decrypt();
        initFirebase();
        setLoading(false);
      } catch (e) {
        console.error("Initialization error:", e);
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);
  useEffect(() => {
    if (fbAuth) {
      fbAuth.onAuthStateChanged(onAuthStateChanged);
    }
  }, [fbAuth]);

  if (loading) {
    return (
      <SafeAreaProvider>
        <View className="bg-black flex-1">
          <ActivityIndicator size="large" color="#ffff" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <Stack>
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
    </Stack>
  );
}
