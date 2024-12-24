import AccountDisplay from "@/components/AccountDisplay";
import { FieldAccount } from "@/components/FieldAccount";
import { getUsersData } from "@/lib/gets";
import { User } from "@/stores/Types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Screen } from "@/components/Screen";
import { formatFullDate } from "@/lib/utils";
import { ReturnIcon, SendedIcon } from "@/components/icons/Icons";
import { useInfoAccountStore } from "@/stores/InfoAccountStore";
import { useMdStore } from "@/stores/MdStore";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";

export default function SuggestionInf() {
  const { infoUid } = useInfoAccountStore((state) => state);
  const { setToUser } = useMdStore();
  const [info, setInfo] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      if (infoUid) {
        const data = await getUsersData([infoUid]);
        console.log("In SuggestionInf");
        console.log(data);
        if (data && data.length > 0) setInfo(data[0]);
      }
    };

    fetchData();
  }, []);

  if (!infoUid || !info) return null;
  const handleContact = () => {
    setToUser(info);
    router.dismissAll();
  };

  const handleBack = () => {
    router.dismiss();
  };

  return (
    <KeyboardViewCustom scrollEnabled={true}>
      <Screen>
        <View className="bg-white flex-1 items-center">
          <AccountDisplay profilePic={info?.profile_pic} />

          <View className="flex-1 justify-start w-full pl-10 px-10 pb-6">
            <FieldAccount
              label="Nombre"
              value={info ? info.name || "Usuario" : "---"}
            />
            <FieldAccount label="Correo" value={info ? info.email : "---"} />
            <FieldAccount
              label="Número de colegiatura"
              value={
                info.tuition_number ? info.tuition_number.toString() : "---"
              }
            />
            <FieldAccount
              label="Fecha de nacimiento"
              value={
                info.birth_day
                  ? `${formatFullDate(new Date(info.birth_day.seconds * 1000))}`
                  : "---"
              }
            />
            <FieldAccount
              label="Experiencia"
              value={info.experience ? info.experience : "---"}
            />
            <FieldAccount
              label="Disponibilidad"
              value={info.available_mode ? info.available_mode : "---"}
            />
            <FieldAccount
              label="Especializaciónes primarias"
              value={
                info.mTags
                  ? info.mTags?.map((tag) => `  - ${tag}`).join("\n")
                  : "---"
              }
            />
            <FieldAccount
              label="Especializaciónes secundarias"
              value={
                info.tags
                  ? info.tags?.map((tag) => `  - ${tag}`).join("\n")
                  : "---"
              }
            />
            <FieldAccount
              label="Descripción"
              value={info.description ? info.description : "---"}
            />
            <Pressable
              onPress={() => {
                handleContact();
              }}
              className="bg-primary w-full flex-row justify-center rounded-lg py-2 mt-10"
            >
              <Text className="text-white text-lg font-bold pr-2">
                Contactar
              </Text>
              <SendedIcon size={24} color={"white"} />
            </Pressable>
            <Pressable
              onPress={() => {
                handleBack();
              }}
              className="bg-slate-600 w-full flex-row justify-center rounded-lg py-2 mt-4"
            >
              <Text className="text-white text-lg font-bold pr-2">Volver</Text>
              <ReturnIcon size={24} color={"white"} />
            </Pressable>
          </View>
        </View>
      </Screen>
    </KeyboardViewCustom>
  );
}
