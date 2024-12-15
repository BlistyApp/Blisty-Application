import { View, Text, Pressable } from "react-native";
import React from "react";
import { Screen } from "@/components/Screen";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Icon404 from "@/components/icons/Icon404";
import { useErrorStore } from "@/stores/ErrorsStore";
import { useAppKeyStore } from "@/stores/AppKeyStore";
import { useNavigation } from "expo-router";
import { useRouter } from "expo-router";

export default function Error() {
  const { clearError } = useErrorStore((state) => state);
  const { updateAppKey } = useAppKeyStore((state) => state);
  const navigation = useNavigation();
  const router = useRouter();
  return (
    <View
      style={{ height: hp("100%"), width: wp("100%") }}
      className="bg-white"
    >
      <Screen>
        <View className="w-full h-full flex flex-col items-center justify-center">
          <Icon404 style={{ width: wp("70%"), aspectRatio: 1 }} />
          <Text
            style={{ fontSize: hp("5%") }}
            className="font-bold text-primary"
          >
            Ups...
          </Text>
          <Text
            style={{ fontSize: hp("2.5%") }}
            className="font-light text-primary text-center"
          >
            Parece que algo salió mal :(
          </Text>
          <Pressable
            onPress={() => {
              clearError();
              updateAppKey();
              navigation.reset({
                index: 0,
                routes: [{ name: "index" as never }],
              });
            }}
            style={{
              height: hp("5%"),
              marginTop: hp("4%"),
            }}
            className="w-1/2 bg-primary rounded-full flex items-center justify-center"
          >
            <Text
              style={{ fontSize: hp("1.8%") }}
              className="font-bold text-white"
            >
              Regresar al inicio
            </Text>
          </Pressable>
        </View>
      </Screen>
    </View>
  );
}
