import { View, Pressable, StatusBar, Text, Dimensions } from "react-native";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useUserStore } from "@/stores/UserStore";
import { styled } from "nativewind";
import { Screen } from "@/components/Screen";
import { LogOutIcon, ProfileIcon } from "@/components/icons/Icons";
import { useRouter } from "expo-router";
import { FieldAccount } from "@/components/FieldAccount";
import { Image } from "expo-image";
import { blurhash } from "@/lib/utils";

const StyledView = styled(View);

const { height } = Dimensions.get("window");

export default function Account() {
  const { user, clearUser } = useUserStore();
  const { fbAuth } = useFirebaseStore();
  const router = useRouter();

  const handleLogout = async () => {
    await fbAuth?.signOut();
    clearUser();
    router.replace("/welcome");
  };

  return (
    <Screen>
      <View className="bg-white flex-1 items-center">
        <StatusBar barStyle={"light-content"} />
        <View
          style={{ height: height * 0.4 }}
          className="flex relative w-fulljustify-center items-center"
        >
          <StyledView
            style={{
              width: height,
              height,
              marginBottom: -height / 6,
              left: -height / 7,
            }}
            className="flex-1 justify-center items-center transform rotate-45 bottom-full"
          >
            <StyledView className="bg-primary w-full h-full rounded-[150px] relative">
              <View className="bg-white absolute h-56 w-56  p-2 rounded-full bottom-20 -rotate-45 right-20">
                <View className=" bg-primary flex h-full w-full justify-center items-center rounded-full ">
                  {user?.profilePic ? (
                    <Image
                      style={{
                        flex: 1,
                        width: "100%",
                        height: "100%",
                        borderRadius: 100,
                      }}
                      source={{ uri: user.profilePic }}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      transition={500}
                    />
                  ) : (
                    <ProfileIcon size={100} color="white" />
                  )}
                </View>
              </View>
            </StyledView>
          </StyledView>
        </View>

        <View className="flex-1 justify-start w-full pl-10">
          <FieldAccount
            label="Nombre"
            value={user ? user.name || "Usuario" : "not found"}
          />
          <FieldAccount
            label="Correo"
            value={user ? user.email : "not found"}
          />
          <FieldAccount label="Rol" value="Paciente" />
        </View>

        <View className="w-full flex justify-center items-end py-4 pr-6">
          <Pressable
            onPress={handleLogout}
            className="p-2 rounded-md justify-center items-center flex"
          >
            <Text className="text-[#3e009c] pb-2">Cerrar sesión</Text>
            <LogOutIcon size={40} color="#3e009c" />
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}
