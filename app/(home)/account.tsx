import React from "react";
import { View, Pressable, StatusBar, Text } from "react-native";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useUserStore } from "@/stores/UserStore";
import { Screen } from "@/components/Screen";
import { LogOutIcon } from "@/components/icons/Icons";
import { useRouter } from "expo-router";
import { FieldAccount } from "@/components/FieldAccount";
import { formatFullDate } from "@/lib/utils";
import AccountDisplay from "@/components/AccountDisplay";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";
import { FirebaseError } from "firebase/app";
import { useErrorStore } from "@/stores/ErrorsStore";

export default function Account() {
  const { user, clearUser } = useUserStore();
  const { fbAuth } = useFirebaseStore();
  const router = useRouter();
  const { setError } = useErrorStore((state) => state);

  const handleLogout = async () => {
    try {
      await fbAuth?.signOut();
      clearUser();
      router.replace("/welcome");
    } catch (error) {
      console.error(error);
      if (error instanceof FirebaseError) {
        setError({ code: error.code });
      } else {
        setError({ code: "logout_error" });
      }
      router.replace("/error");
    }
  };

  return (
    <KeyboardViewCustom scrollEnabled={true}>
      <Screen>
        <View className="bg-white flex-1 items-center">
          <StatusBar barStyle={"light-content"} />
          <AccountDisplay profilePic={user?.profile_pic} />

          <View className="flex-1 justify-start w-full px-10">
            <View className="w-full flex items-center">
              <Text className="text-4xl font-medium text-primary mb-2">
                {user?.name}
              </Text>
              <Text className="text-lg text-slate-600 -mt-3">Nombre</Text>
            </View>

            <FieldAccount
              label="Correo"
              value={user ? user.email : "not found"}
            />
            <View className="w-full flex-row">
              <View className="w-1/2">
                <FieldAccount
                  label="Rol"
                  value={
                    user
                      ? user.role === "psychologist"
                        ? "Psicologo"
                        : "Paciente"
                      : "error"
                  }
                />
              </View>
              <View className="w-1/2">
                <FieldAccount
                  label="Teléfono"
                  value={user?.phone ? user.phone : "not found"}
                />
              </View>
            </View>
            {user?.role === "psychologist" && (
              <>
                <FieldAccount
                  label="Número de colegiatura"
                  value={
                    user.tuition_number
                      ? user.tuition_number.toString()
                      : "not found"
                  }
                />
                <FieldAccount
                  label="Experiencia"
                  value={user.experience ? user.experience : "not found"}
                />
                <FieldAccount
                  label="Disponibilidad"
                  value={
                    user.available_mode ? user.available_mode : "not found"
                  }
                />
                <FieldAccount
                  label="Especializaciónes primarias"
                  value={
                    user.mTags
                      ? user.mTags?.map((tag) => `  - ${tag}`).join("\n")
                      : "not found"
                  }
                />
                <FieldAccount
                  label="Especializaciónes secundarias"
                  value={
                    user.tags
                      ? user.tags?.map((tag) => `  - ${tag}`).join("\n")
                      : "not found"
                  }
                />
                <FieldAccount
                  label="Descripción"
                  value={user.description ? user.description : "not found"}
                />
              </>
            )}

            <FieldAccount
              label="Fecha de nacimiento"
              value={
                user?.birth_day
                  ? `${formatFullDate(user.birth_day.toDate())}`
                  : "not found"
              }
            />
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
    </KeyboardViewCustom>
  );
}
