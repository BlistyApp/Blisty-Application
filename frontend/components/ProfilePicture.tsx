import { View, Dimensions } from "react-native";
import { Image } from "expo-image";
import LogoBlisty from "@/components/icons/LogoBlisty";

const height = Dimensions.get("window").height;

export function ProfilePicture({ name, uri }: { name: string; uri?: string }) {
  return name === "blisty" ? (
    <View className="bg-primary rounded-full p-1">
      <LogoBlisty height={height * 0.055} width={height * 0.055} />
    </View>
  ) : (
    <Image
      source={{ uri: uri }}
      style={{ width: height * 0.06, height: height * 0.06 }}
      className="rounded-full"
    />
  );
}
