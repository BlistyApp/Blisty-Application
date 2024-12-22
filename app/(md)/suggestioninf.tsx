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

export default function SuggestionInf() {
  const { infoUid } = useInfoAccountStore((state) => state);
  const { setToUser } = useMdStore();
  const [info, setInfo] = useState<User>();

  useEffect(() => {
    const fetchData = async () => {
      if (infoUid) {
        const data = await getUsersData([infoUid]);
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
    <Screen>
      <View className="bg-white flex-1 items-center">
        <AccountDisplay profilePic={info?.profile_pic} />

        <View className="flex-1 justify-start w-full pl-10 px-10">
          <FieldAccount
            label="Nombre"
            value={info ? info.name || "Usuario" : "not found"}
          />
          <FieldAccount
            label="Correo"
            value={info ? info.email : "not found"}
          />
          <FieldAccount
            label="Número de colegiatura"
            value={
              info.tuition_number ? info.tuition_number.toString() : "not found"
            }
          />
          <FieldAccount
            label="Fecha de nacimiento"
            value={
              info.birth_day
                ? `${formatFullDate(new Date(info.birth_day.seconds * 1000))}`
                : "not found"
            }
          />
          <Pressable
            onPress={() => {
              handleContact();
            }}
            className="bg-primary w-full flex-row justify-center rounded-lg py-2 mt-10"
          >
            <Text className="text-white text-lg font-bold pr-2">Contactar</Text>
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
  );
}
