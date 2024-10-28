import { View, Pressable, Text } from "react-native";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useUserStore } from "@/stores/UserStore";

export default function Account() {
  const { user, clearUser } = useUserStore();
  const { fbAuth } = useFirebaseStore();

  return (
    <View className="bg-white flex-1 items-center">
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="">Logueado como {user?.email}</Text>
        <Pressable
          onPress={async () => {
            await fbAuth.signOut();
            clearUser();
          }}
          className="bg-black p-2 rounded-md mt-2"
        >
          <Text className="text-white">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
