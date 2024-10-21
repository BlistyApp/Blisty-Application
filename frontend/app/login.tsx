import {
  ActivityIndicator,
  Modal,
  Pressable,
  StatusBar,
  Text,
  View,
  Dimensions,
} from "react-native";
import { Label } from "@/components/Label";
import { Input } from "@/components/Input";
import { Stack, useRouter } from "expo-router";
import { styled } from "nativewind";
import { useForm, Controller, SubmitErrorHandler } from "react-hook-form";
import { LoginType } from "@/types/LoginType";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";

const StyledView = styled(View);

const { width, height } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<LoginType>();

  const [loading, setLoading] = useState(false);
  const { fbAuth } = useFirebaseStore();

  const onSubmit = async (data: LoginType) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(fbAuth, data.email, data.password);
      router.replace("/");
    } catch (e) {
      setError("root", {
        type: "manual",
        message: "Correo y/o contraseña incorrectos",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-white flex-1 items-center">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <StatusBar barStyle={"light-content"} />
      <StyledView className="flex-1 absolute top-0 left-0 right-0 justify-center items-center w-full">
        <StyledView className="w-full h-40 bg-[#3e009c] rounded-t-lg overflow-hidden" />
        <StyledView className="w-[500px] h-[450px] bg-[#3e009c] rounded-full absolute -bottom-44 -right-6" />
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
              rules={{ required: "Correo electronico es necesario" }}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm">
                {errors.email.message}
              </Text>
            )}
          </View>
          <View className="my-1">
            <Label>Contraseña</Label>
            <Controller
              control={control}
              disabled={loading}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="*********"
                  secureTextEntry={true}
                  onBlur={onBlur}
                  onChangeText={(value: any) => onChange(value)}
                  value={value}
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
            router.push("/register");
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

      <Modal animationType="fade" visible={loading} transparent>
        <View style={{ height, width }} className="justify-center items-center">
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            className="w-56 h-56 rounded-2xl justify-center items-center"
          >
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      </Modal>
    </View>
  );
}
