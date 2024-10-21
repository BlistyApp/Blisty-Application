import { useCredentialStore } from "@/stores/CredentialStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { Stack } from "expo-router";
import { View, ActivityIndicator } from "react-native";

import { useCredentialStore } from "@/stores/CredentialStore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const { getCredentials, decrypt } = useCredentialStore();
  const { initApp, initAuth } = useFirebaseStore();
  const [loading, setLoading] = useState(true);
  const [authInit, setAuthInit] = useState(false);

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
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="register"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="welcome"
         options={{
          headerShown: false,
        }}/>
      </Stack>
    </View>
  );
}
