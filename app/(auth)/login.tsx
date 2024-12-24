import { Pressable, StatusBar, Text, View } from "react-native";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Stack, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useForm, Controller } from "react-hook-form";
import { LoginType } from "@/types/LoginType";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import LoadingModal from "@/components/LoadingModal";
import BlistyError from "@/lib/blistyError";
import { useErrorStore } from "@/stores/ErrorsStore";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";
import { EyeIcon, EyeOffIcon } from "@/components/icons/Icons";

const StyledView = styled(View);

export default function Login() {
  const router = useRouter();
  const { login } = useFirebaseStore((state) => state);
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm<LoginType>();

  const err_app = useErrorStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (data: LoginType) => {
    setLoading(true);
    try {
      await login(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      if (error instanceof BlistyError) {
        if (error.code === "auth/invalid-credential" || error.code === "auth/invalid-email") {
          setError("root", {
            type: "manual",
            message: "Correo y/o contraseña incorrectos",
          });
          return;
        }

        if (error.code === "auth/network-request-failed") {
          err_app.setError({ code: error.code });
          router.replace("/noconnection");
          return;
        }

        err_app.setError({ code: error.code });
      }

      err_app.setError({ code: "login_error" });
      router.replace("/error");
    }
  };

  return (
    <KeyboardViewCustom scrollEnabled={true}>
      <View className="bg-white flex-1 items-center">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <StatusBar barStyle={"light-content"} />
        <StyledView className="flex-1 absolute top-0 left-0 right-0 justify-center items-center w-full">
          <StyledView
            style={{ height: hp("20%") }}
            className="w-full bg-[#3e009c] rounded-t-lg overflow-hidden"
          />
          <StyledView
            style={{
              height: hp("55%"),
              width: wp("120%"),
              bottom: -hp("20%"),
              right: -hp("5%"),
            }}
            className="w-[500px] h-[450px] bg-[#3e009c] rounded-full absolute"
          />
        </StyledView>

        <Text className="absolute top-44 text-4xl font-bold text-white">
          Ingresa!
        </Text>
        <View className="px-6 mt-96 w-full">
          <View className="my-3">
            <View className="my-1">
              <Label className={`${errors.email && "text-red-500"}`}>
                Correo
              </Label>
              <Controller
                control={control}
                disabled={loading}
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
                rules={{ required: "Debe ingresar un correo electronico" }}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm">
                  {errors.email.message}
                </Text>
              )}
            </View>
            <View className="my-1">
              <Label>Contraseña</Label>
              <View className="flex flex-row justify-between items-center border-2 rounded-lg">
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      secureTextEntry={!showPassword}
                      placeholder="*********"
                      onBlur={onBlur}
                      onChangeText={(value: any) => onChange(value)}
                      value={value}
                      className="border-0 flex-1"
                    />
                  )}
                  name="password"
                  rules={{ required: "Debe ingresar una contraseña" }}
                />
                <Pressable
                  onPress={() => {
                    setShowPassword(!showPassword);
                  }}
                  style={{ marginHorizontal: wp("3%") }}
                >
                  {showPassword ? (
                    <EyeIcon size={24} color="#3e009c" />
                  ) : (
                    <EyeOffIcon size={24} color="#ccc" />
                  )}
                </Pressable>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm">
                  {errors.password.message}
                </Text>
              )}
            </View>
          </View>
          {errors.root && (
            <Text className="text-red-500 text-sm">{errors.root.message}</Text>
          )}
          <Pressable
            className="bg-[#3e009c] h-12 rounded-full py-2 mt-6 items-center justify-center"
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-bold text-lg text-center">
              Ingresar
            </Text>
          </Pressable>
          <Pressable
            className="h-12 rounded-full py-2 mt-1 items-center justify-center"
            onPress={() => {
              router.replace("/(auth)/register");
            }}
          >
            <Text className="font-light text-lg text-center">
              No tienes cuenta?{" "}
              <Text className="text-[#3e009c] font-semibold underline">
                Registrate
              </Text>
            </Text>
          </Pressable>
        </View>

        <LoadingModal loading={loading} />
      </View>
    </KeyboardViewCustom>
  );
}
