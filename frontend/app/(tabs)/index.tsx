import { View, Text } from "react-native";
import { Screen } from "@/components/Screen";
import { useUserStore } from "@/stores/UserStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import "../../styles/global.css";

export default function Index() {
  const { user } = useUserStore();
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setInitializing(false);
  }, []);

  useEffect(() => {
    if (!user && !initializing) {
      router.navigate("/welcome");
    }
  }, [router, user, initializing]);
  
  return (
    <Screen>
      <View className="bg-white flex-1 items-center">
        <Text className="text-black text-6xl">Index</Text>
      </View>
    </Screen>
  );
}
