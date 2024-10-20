import LoginScreen from "@/components/LoginScreen";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useUserStore } from "@/stores/UserStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const { fbAuth } = useFirebaseStore();
  const { user, setUser, clearUser } = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
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
          setLoggedIn(true);
        }
      } else {
        clearUser();
      }
    });
    setInitializing(false);
    return subscriber;
  }, [initializing]);
  if (initializing && loggedIn) {
    return (
      <View className="bg-black flex-1">
        <ActivityIndicator size="large" color="#ffff" />
      </View>
    );
  } else if (!loggedIn) {
    return (
      <View className="bg-black flex-1 items-center justify-center">
        <LoginScreen />
      </View>
    );
  }
  return (
    <View className="bg-black flex-1 justify-center items-center">
      <Text className="text-white">Logueado como {user?.email}</Text>
    </View>
  );
}
