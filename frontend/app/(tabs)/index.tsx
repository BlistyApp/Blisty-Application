import { Link, Stack, useRouter, Href } from "expo-router";
import { Text, View, ActivityIndicator, Pressable } from "react-native";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useUserStore } from "@/stores/UserStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();

  const { fbAuth } = useFirebaseStore();
  const { user, setUser, clearUser } = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

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
          router.replace("/chats");
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

  /* if (loggedIn) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="">Logueado como {user?.email}</Text>
        <Pressable
          onPress={async () => {
            await fbAuth.signOut();
            setLoggedIn(false);
          }}
          className="bg-black p-2 rounded-md mt-2"
        >
          <Text className="text-white">Logout</Text>
        </Pressable>
      </View>
    );
  } */

  return (
    <View className="bg-black flex-1">
      <ActivityIndicator size="large" color="#ffff" />
    </View>
  );
}
