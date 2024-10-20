import { ActivityIndicator, Button, Text, TextInput, View } from "react-native";
import AppTitle from "./AppTitle";
import { useState } from "react";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const onChangeEmail = (text: string) => setEmail(text);
  const onChangePassword = (text: string) => setPassword(text);
  const { fbAuth } = useFirebaseStore();
  const login = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(fbAuth, email, password);
    } catch (e) {
      alert(e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }
  return (
    <View className="flex-1 justify-center items-center">
      <AppTitle />
      <Text className="text-white">Usuario:</Text>
      <TextInput
        className="bg-white w-80 p-2 rounded"
        value={email}
        onChangeText={onChangeEmail}
      />
      <Text className="text-white">Contraseña:</Text>
      <TextInput
        className="bg-white w-80 p-2 rounded"
        value={password}
        onChangeText={onChangePassword}
      />
      <Button title="Iniciar sesión" onPress={login} />
    </View>
  );
};

export default LoginScreen;
