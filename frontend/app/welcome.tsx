import { View, Text, Pressable } from "react-native";
import LogoBlisty from "@/components/icons/LogoBlisty";
import WaveBackground from "@/components/icons/WaveBackground";
import { useRouter } from "expo-router";

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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="mb-4 text-5xl text-center font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        ¡Bienvenido a{"\n"}
        <Text className="text-[#3e009c] font-extrabold text-6xl">Blisty!</Text>
      </Text>
      <View className="mt-8 mb-4">
        <WaveBackground color="#3e009c" top={-140} left={26} />
        <View className="bg-[#3e009c] pb-6">
          <LogoBlisty width={500} height={500} />
        </View>
        <WaveBackground color="white" top={380} left={26} />
      </View>

      <Text className="text-xl text-center text-gray-900 dark:text-white">
        Comenzamos?
      </Text>

      <View className="flex flex-row w-full px-2">
        <Pressable
          className="bg-[#3e009c] h-12 rounded-full w-1/2 mr-1 py-2 mt-9 items-center justify-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-bold text-lg text-center">
            Iniciar Sesión
          </Text>
        </Pressable>
        <Pressable
          className="bg-[#1b0043] h-12 rounded-full w-1/2 py-2 mt-9 items-center justify-center"
          onPress={handleRegister}
        >
          <Text className="text-white font-bold text-lg text-center">
            Registrarse
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
