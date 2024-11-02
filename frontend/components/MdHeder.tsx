import { Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { LeftIcon } from "@/components/icons/Icons";
import { type Router } from "expo-router";
import { Image } from "expo-image";
import { useMdStore } from "@/stores/MdStore";
import { ProfilePicture } from "./ProfilePicture";

interface MdHederProps {
  router: Router;
}

export default function MdHeder({ router }: MdHederProps) {
  const { toUser } = useMdStore();
  
  if (!toUser) return null;

  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: "#3e009c",
        },
        headerLeft: () => (
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()}>
              <LeftIcon size={22} color={"white"} />
            </Pressable>
            <View className="flex-row items-center gap-x-4">
              {/* <Image
                source={{ uri: toUser?.profilePic }}
                className="w-12 h-12 rounded-full"
              /> */}
              <View>
                <ProfilePicture name={toUser?.uid} uri={toUser?.profilePic} />
              </View>
              <Text className="font-bold text-xl text-white">
                {toUser?.name}
              </Text>
            </View>
          </View>
        ),
      }}
    />
  );
}
