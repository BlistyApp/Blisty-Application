import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { ProfilePicture } from "@/components/ProfilePicture";
import { User } from "@/stores/Types";
import { useInfoAccountStore } from "@/stores/InfoAccountStore";
export function IaSuggestion({ psyco }: { psyco: User }) {
  const router = useRouter();
  const { setInfoUid } = useInfoAccountStore((state) => state);
  return (
    <Pressable
      onPress={() => {
        setInfoUid(psyco.uid);
        router.navigate("/(md)/suggestioninf");
      }}
      className="w-2/3"
    >
      <View className="flex-row items-center gap-x-4 py-2">
        <View>
          <ProfilePicture name={psyco?.uid} uri={psyco?.profile_pic} />
        </View>
        <View className="flex w-full">
          <Text className="font-bold text-lg text-black">{psyco?.name}</Text>
          <Text className="text-sm text-gray-500">Número de colegiatura</Text>
          <Text className="text-gray-500">{psyco.tuition_number}</Text>
        </View>
      </View>
    </Pressable>
  );
}
