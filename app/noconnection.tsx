import { View, Text, Pressable } from "react-native";
import { useNavigation } from "expo-router";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { Screen } from "@/components/Screen";
import IconNoConnection from "@/components/icons/IconNoConnection";
import { useErrorStore } from "@/stores/ErrorsStore";
import { useAppKeyStore } from "@/stores/AppKeyStore";

export default function NoConnection() {
  const navigation = useNavigation();
  const { clearError} = useErrorStore((state) => state);
  const { updateAppKey } = useAppKeyStore((state) => state);
  return (
    <View
      style={{ height: hp("100%"), width: wp("100%") }}
      className="bg-white"
    >
      <Screen>
        <View className="w-full h-full flex flex-col items-center justify-center">
          <IconNoConnection style={{ width: wp("50%"), aspectRatio: 1 }} />
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
            Parece que no podemos conectarnos :(
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
              Volver a conectarme
            </Text>
          </Pressable>
        </View>
      </Screen>
    </View>
  );
}
