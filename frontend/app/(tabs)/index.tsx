import { View, Text } from "react-native";
import { Screen } from "@/components/Screen";

export default function Chats() {
  return (
    <Screen>
      <View className="bg-white flex-1 items-center">
        <Text className="text-black">Chats</Text>
      </View>
    </Screen>
  );
}
