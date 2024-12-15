import AccountDisplay from "@/components/AccountDisplay";
import { FieldAccount } from "@/components/FieldAccount";
import { getUsersData } from "@/lib/gets";
import { User } from "@/stores/Types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Screen } from "@/components/Screen";
import { formatFullDate } from "@/lib/utils";
import { LeftIcon } from "@/components/icons/Icons";
import { useInfoAccountStore } from "@/stores/InfoAccountStore";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Loading } from "@/components/Loading";
import BlistyError from "@/lib/blistyError";
import { useErrorStore } from "@/stores/ErrorsStore";

export default function ContactInf() {
  const { infoUid } = useInfoAccountStore((state) => state);
  const [info, setInfo] = useState<User>();
  const { setError } = useErrorStore((state) => state);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (infoUid) {
          const data = await getUsersData([infoUid]);
          console.log(data);
          if (data && data.length > 0) {
            setInfo(data[0]);
            return;
          }

          throw new BlistyError("No se encontró la información del usuario");
        }
      } catch (error) {
        console.log(error);
        setError({ code: "fetch-error" });
        router.replace("/error");
      }
    };

    fetchData();
  }, []);

  if (!infoUid || !info) return <Loading />;

  const handleBack = () => {
    router.dismiss();
  };

  return (
    <KeyboardViewCustom scrollEnabled={true}>
      <Screen>
        <View
          style={{ paddingBottom: hp("3%") }}
          className="bg-white flex-1 items-center"
        >
          <Pressable
            onPress={handleBack}
            className="z-10 absolute top-4 left-4 bg-white p-3 border rounded-full"
          >
            <LeftIcon size={20} color={"rgb(62 0 156)"} />
          </Pressable>
          <AccountDisplay profilePic={info?.profilePic} />

          <View className="flex-1 justify-start w-full pl-10 px-10">
            <FieldAccount
              label="Nombre"
              value={info ? info.name || "Usuario" : "---"}
            />
            <FieldAccount
              label="Correo"
              value={info ? info.email : "---"}
            />
            {info.role === "psychologist" && (
              <>
                <FieldAccount
                  label="Número de colegiatura"
                  value={
                    info.tuition_number ? info.tuition_number : "---"
                  }
                />
                <FieldAccount
                  label="Experiencia"
                  value={info.experience ? info.experience : "---"}
                />
                <FieldAccount
                  label="Disponibilidad"
                  value={
                    info.available_mode ? info.available_mode : "---"
                  }
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
              </>
            )}
            <FieldAccount
              label="Fecha de nacimiento"
              value={
                info.birth_day
                  ? `${formatFullDate(new Date(info.birth_day.seconds * 1000))}`
                  : "---"
              }
            />
          </View>
        </View>
      </Screen>
    </KeyboardViewCustom>
  );
}
