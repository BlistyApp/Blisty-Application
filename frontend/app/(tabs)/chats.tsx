import { View, Text, StatusBar, Dimensions } from "react-native";
import { Screen } from "@/components/Screen";
import { useUserStore } from "@/stores/UserStore";
import ChatList from "@/components/ChatList";
import { useState } from "react";
import { ChatUser } from "@/types/ChatUser";
import { Loading } from "@/components/Loading";
import { useRouter } from "expo-router";
import { useMdStore } from "@/stores/MdStore";
import ChatItem from "@/components/ChatItem";

const height = Dimensions.get("window").height;

const _IA = {
  name: "Blisty",
  uid: "blisty",
  profilePic: "https://avatar.iran.liara.run/public",
  lastMessage: {
    text: "¡Hola! ¿Cómo estás?",
    time: "10:15 AM",
  },
};

const _USERS = [
  {
    name: "Aube Coope",
    uid: "50436-5604",
    profilePic: "https://avatar.iran.liara.run/public",
    lastMessage: {
      text: "¡Hola! ¿Cómo estás?",
      time: "10:15 AM",
    },
  },
  {
    name: "Niels Heliar",
    uid: "60840-0200",
    profilePic: "https://avatar.iran.liara.run/public/boy",
    lastMessage: {
      text: "¿Todo bien por ahí?",
      time: "2:30 PM",
    },
  },
  {
    name: "Englebert Matthiesen",
    uid: "49967-810",
    profilePic: "https://avatar.iran.liara.run/public/59",
    lastMessage: {
      text: "Te cuento luego, ¿va?",
      time: "4:45 PM",
    },
  },
  {
    name: "Donia Bowditch",
    uid: "63146-101",
    profilePic: "https://avatar.iran.liara.run/public/job/designer/female",
    lastMessage: {
      text: "¿Tienes un minuto?",
      time: "11:20 AM",
    },
  },
  {
    name: "Chen Onge",
    uid: "52810-701",
    profilePic: "https://avatar.iran.liara.run/public/19",
    lastMessage: {
      text: "¡Hey! ¿Qué tal?",
      time: "9:05 AM",
    },
  },
  {
    name: "Chris Halfhide",
    uid: "49349-242",
    profilePic: "https://avatar.iran.liara.run/public/38",
    lastMessage: {
      text: "¿Nos vemos pronto?",
      time: "6:00 PM",
    },
  },
];

export default function Chats() {
  const { user } = useUserStore();
  const { setToUser } = useMdStore();
  const router = useRouter();

  const [users, setUsers] = useState<ChatUser[] | null>(_USERS);

  if (!user) {
    return null;
  }

  const handlePress = (item: ChatUser) => {
    setToUser(item);
    router.push("/md");
  };

  return (
    <Screen>
      <View className="bg-white flex-1 items-center">
        <StatusBar barStyle={"light-content"} backgroundColor={"#3e009c"} />
        <View
          style={{
            height: height * 0.08,
            borderBottomEndRadius: 40,
            borderBottomStartRadius: 40,
          }}
          className="bg-primary w-full flex items-center justify-center"
        >
          <Text className="text-white text-2xl font-extrabold">Blisty</Text>
        </View>
        <View className="h-2" />
        <ChatItem item={_IA} handlePress={handlePress} />
        <View className="bg-white mt-3 flex-1 w-full items-center">
          <Text className="text-lg font-semibold text-neutral-800 mb-2">
            Conversaciones con{" "}
            {user.role === "psychologist" ? "pacientes" : "especialistas"}
          </Text>
          {users?.length ? (
            <ChatList users={users} handlePress={handlePress} />
          ) : (
            <View className="z-10 absolute w-1/2 h-1/4 flex-1 bg-white opacity-50 rounded-3xl top-1/3">
              <Loading className="rounded-3xl" />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}
