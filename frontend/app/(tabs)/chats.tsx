import { View, Text } from "react-native";
import { Screen } from "@/components/Screen";
import { useUserStore } from "@/stores/UserStore";

export default function Chats() {
  const { user } = useUserStore();
  if (!user) {
    return null;
  }
  return (
    <Screen>
      <View className="bg-white flex-1 items-center">
        <Text className="text-black">Chats</Text>
      </View>
    </Screen>
  );
}
