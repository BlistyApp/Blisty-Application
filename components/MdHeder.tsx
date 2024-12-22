import { Stack } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { LeftIcon } from "@/components/icons/Icons";
import { type Router } from "expo-router";
import { useMdStore } from "@/stores/MdStore";
import { ProfilePicture } from "./ProfilePicture";
import { useInfoAccountStore } from "@/stores/InfoAccountStore";

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

interface MdHederProps {
  router: Router;
  onRefresh: () => void;
}

export default function MdHeder({ router, onRefresh }: MdHederProps) {
  const { toUser } = useMdStore();
  const { setInfoUid } = useInfoAccountStore((state) => state);

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
            <Pressable
              onPress={() => {
                if (toUser.uid !== "blisty") {
                  setInfoUid(toUser.uid);
                  router.navigate("/(md)/contactinf");
                }
              }}
              className="flex-1"
            >
              <View className="flex-row items-center gap-x-4">
                <View>
                  <ProfilePicture
                    name={toUser?.uid}
                    uri={toUser?.profile_pic}
                  />
                </View>
                <Text className="font-bold text-xl text-white">
                  {toUser?.name}
                </Text>
              </View>
            </Pressable>
            {toUser.uid === "blisty" && (
              <Pressable
                onPress={() => {
                  onRefresh();
                }}
                style={{
                  width: wp("25%"),
                  marginRight: wp("8%"),
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  paddingVertical: hp("1%"),
                  paddingHorizontal: wp("3%"),
                }}
                className="self-center rounded-full items-center"
              >
                <Text
                  style={{ fontSize: hp("1.5%") }}
                  className="text-white text-center font-medium"
                >
                  Comenzar de nuevo
                </Text>
              </Pressable>
            )}
          </View>
        ),
      }}
    />
  );
}
