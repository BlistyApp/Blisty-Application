import { Pressable, StatusBar, Text, View } from "react-native";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { DropDownList } from "@/components/DropDownList";
import { RegisterType, Psychologist } from "@/types/RegisterType";
import { DateInput } from "@/components/DateInput";
import { useEffect } from "react";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";

const StyledView = styled(View);

type FormsType = RegisterType | Psychologist;

export default function Register() {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    watch,
    unregister,
    formState: { errors },
  } = useForm<FormsType>();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    if (watch("type") === "patient") {
      unregister("tuition_number");
    }
  }, [watch("type")]);

  return (
    <KeyboardViewCustom>
      <View className="bg-white flex-1 items-center">
        <StatusBar barStyle={"light-content"} />
        <StyledView className="flex-1 absolute top-0 left-0 right-0 justify-center items-center w-full">
          <StyledView className="w-full h-60 bg-[#3e009c] rounded-t-lg overflow-hidden" />
          <StyledView className="w-[500px] h-[450px] bg-white rounded-full absolute -bottom-80 -right-6" />
        </StyledView>

        <Text className="absolute top-44 text-4xl font-bold text-[#3e009c]">
          Unete!
        </Text>
        <View
          style={{ paddingTop: watch("type") ? 260 : 384 }}
          className="px-6 w-full"
        >
          <View className="my-3 relative">
            <View className="my-1">
              <Label className={`${errors.type && "text-red-500"}`}>
                Tipo de usuario
              </Label>
              <Controller
                control={control}
                render={({ field: { onChange } }) => (
                  <DropDownList
                    placeholder="Tipo de usuario"
                    data={[
                      { label: "Psicologo", value: "psychologist" },
                      { label: "Paciente", value: "patient" },
                    ]}
                    onChange={onChange}
                    error={errors.type !== undefined}
                  />
                )}
                name="type"
                rules={{ required: "Debe seleccionar un tipo de usuario" }}
              />
              {errors.type && (
                <Text className="text-red-500 text-sm">
                  {errors.type.message}
                </Text>
              )}
            </View>

            {watch("type") && (
              <>
                {watch("type") === "psychologist" && (
                  <View className="my-1">
                    <Label>Numero de Colegiatura</Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="123456789"
                          keyboardType={"number"}
                          onBlur={onBlur}
                          onChangeText={(value: any) => onChange(value)}
                          value={value}
                        />
                      )}
                      name="tuition_number"
                      rules={{ required: "Digite su número de colegiatura" }}
                    />
                    {"tuition_number" in errors && (
                      <Text className="text-red-500 text-sm">
                        {errors.tuition_number?.message}
                      </Text>
                    )}
                  </View>
                )}

                <View className="flex-row w-full">
                  <View className="my-1 w-1/2 pr-2">
                    <Label className={`${errors.phone && "text-red-500"}`}>
                      Telefono
                    </Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          placeholder="123456789"
                          onBlur={onBlur}
                          onChangeText={(value: any) => onChange(value)}
                          value={value}
                          keyboardType={"number-pad"}
                          className={`${errors.email && "border-red-500"}`}
                        />
                      )}
                      name="phone"
                      rules={{ required: "Digite su número de telefono" }}
                    />
                    {errors.phone && (
                      <Text className="text-red-500 text-sm">
                        {errors.phone.message}
                      </Text>
                    )}
                  </View>

                  <View className="my-1 w-1/2 pl-2">
                    <Label className={`${errors.birth_day && "text-red-500"}`}>
                      Fecha de Nacimiento
                    </Label>
                    <Controller
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DateInput
                          value={value}
                          placeholder="MM/DD/YYYY"
                          mode="date"
                          display="default"
                          onChange={onChange}
                          error={errors.birth_day !== undefined}
                        />
                      )}
                      name="birth_day"
                      rules={{ required: "Campo necesario" }}
                    />
                    {errors.birth_day && (
                      <Text className="text-red-500 text-sm">
                        {errors.birth_day.message}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="my-1">
                  <Label className={`${errors.email && "text-red-500"}`}>
                    Correo
                  </Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="example@gmail.com"
                        keyboardType={"email-address"}
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        className={`${errors.email && "border-red-500"}`}
                      />
                    )}
                    name="email"
                    rules={{ required: "Correo electronico es necesario" }}
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-sm">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
                <View className="my-1">
                  <Label className={`${errors.password && "text-red-500"}`}>
                    Contraseña
                  </Label>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="*********"
                        secureTextEntry={true}
                        onBlur={onBlur}
                        onChangeText={(value: any) => onChange(value)}
                        value={value}
                        className={`${errors.password && "border-red-500"}`}
                      />
                    )}
                    name="password"
                    rules={{ required: "Contraseña es necesaria" }}
                  />
                  {errors.password && (
                    <Text className="text-red-500 text-sm">
                      {errors.password.message}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
          <Pressable
            className="bg-[#3e009c] h-12 rounded-full py-2 mt-9 items-center justify-center"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-bold text-lg text-center">
              Registrar
            </Text>
          </Pressable>

          <Pressable
            className="h-12 rounded-full py-2 mt-1 items-center justify-center"
            onPress={() => {
              router.navigate("/login");
            }}
          >
            <Text className="font-light text-lg text-center">
              Ya tienes una cuenta?{" "}
              <Text className="text-[#3e009c] font-semibold underline">
                Inicia Sesión
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardViewCustom>
  );
}
