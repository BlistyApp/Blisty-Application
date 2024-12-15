import { View, Text, Pressable } from "react-native";
import LogoBlisty from "@/components/icons/LogoBlisty";
import WaveBackground from "@/components/icons/WaveBackground";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import "@/styles/global.css";

export default function Welcome() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/login");
  };

  const handleRegister = () => {
    router.replace("/register");
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        height: hp("100%"),
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{ fontSize: hp("5%") }}
        className="mb-4 text-center font-bold leading-none tracking-tight text-gray-900 dark:text-white"
      >
        ¡Bienvenido a{"\n"}
        <Text
          style={{ fontSize: hp("7%") }}
          className="text-[#3e009c] font-extrabold"
        >
          Blisty!
        </Text>
      </Text>
      <View className="mt-8 mb-4">
        <WaveBackground color="#3e009c" top={-1 * hp("16%")} left={wp("0%")} />
        <View className="bg-[#3e009c] pb-6">
          <LogoBlisty width={wp("100%")} height={500} />
        </View>
        <WaveBackground color="white" top={hp("42%")} left={-1 * wp("4%")} />
      </View>

      <Text className="text-xl text-center text-gray-900 dark:text-white">
        Comenzamos?
      </Text>

      <View
        style={{ paddingTop: hp("1%") }}
        className="flex flex-row w-full px-2"
      >
        <Pressable
          style={{ marginRight: wp("0.5%") }}
          className="bg-[#3e009c] h-12 rounded-full w-1/2 items-center justify-center"
          onPress={handleLogin}
        >
          <Text
            style={{ fontSize: hp("1.8%") }}
            className="text-white font-bold text-center"
          >
            Iniciar Sesión
          </Text>
        </Pressable>
        <Pressable
          style={{ marginLeft: wp("0.5%") }}
          className="bg-[#1b0043] h-12 rounded-full w-1/2 items-center justify-center"
          onPress={handleRegister}
        >
          <Text
            style={{ fontSize: hp("1.8%") }}
            className="text-white font-bold text-center"
          >
            Registrarse
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
