import {
  View,
  Text,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Screen } from "@/components/Screen";
import { useUserStore } from "@/stores/UserStore";
import ChatList from "@/components/ChatList";
import { useEffect, useState } from "react";
import { ChatUser } from "@/types/ChatUser";
import { useRouter } from "expo-router";
import { useMdStore } from "@/stores/MdStore";
import ChatItem from "@/components/ChatItem";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { RoomType } from "@/types/RoomType";
import { useErrorStore } from "@/stores/ErrorsStore";
import BlistyError from "@/lib/blistyError";

const height = Dimensions.get("window").height;

const _IA = {
  name: "Blisty",
  uid: "blisty",
  lastMessage: {
    fromUid: "blisty",
    text: "¡Hola! ¿Cómo estás?",
    createdAt: Timestamp.fromDate(new Date()),
  },
};

export default function Chats() {
  const { user } = useUserStore();
  const { setToUser } = useMdStore();
  const { db } = useFirebaseStore((state) => state);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setError } = useErrorStore((state) => state);

  const [users, setUsers] = useState<ChatUser[]>([]);
  const [iaChat, setIaChat] = useState<ChatUser>({
    name: "Blisty",
    uid: "blisty",
  });

  useEffect(() => {
    try {
      if (!db) {
        throw new BlistyError("No se encontró la base de datos", "error-db");
      }

      if (!user) {
        throw new BlistyError(
          "No se encontró el usuario dirigido",
          "error-user"
        );
      }

      const roomsRef = collection(db, "rooms");
      const roomsQuery = query(
        roomsRef,
        where("userIds", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      let initialFetchDone = false;
      const unsubscribe = onSnapshot(roomsQuery, (querySnapshot) => {
        try {
          const chatsData = [] as ChatUser[];

          const promises = querySnapshot.docs.map(async (doc) => {
            const roomData = doc.data() as RoomType;

            const messageQuery = query(
              collection(db, "rooms", roomData.roomId, "messages"),
              orderBy("createdAt", "desc"),
              limit(1)
            );
            setLoading(false);

            const unsubscribeMesages = onSnapshot(
              messageQuery,
              async (querySnapshot) => {
                if (querySnapshot.empty) return;
                const lastMessage = querySnapshot.docs[0].data();
                console.log("DEL ROOM");
                console.log(roomData);
                console.log("LastMessage");
                console.log(lastMessage);
                const to =
                  roomData.users[0].uid === user.uid
                    ? roomData.users[1]
                    : roomData.users[0];
                console.log("TO");
                console.log(to);
                if (to.uid === "blisty") {
                  setIaChat({
                    ...iaChat,
                    lastMessage: {
                      fromUid: "blisty",
                      text: lastMessage.text,
                      createdAt: lastMessage.createdAt,
                    },
                  });
                  return;
                }

                if (!chatsData.find((chat) => chat.uid === to.uid)) {
                  chatsData.push({
                    name: to.name,
                    uid: to.uid,
                    profilePic: to.profilePic,
                    lastMessage: {
                      fromUid: lastMessage.from,
                      text: lastMessage.text,
                      createdAt: lastMessage.createdAt,
                    },
                  });
                } else {
                  chatsData.forEach((chat) => {
                    if (chat.uid === to.uid) {
                      chat.lastMessage = {
                        fromUid: lastMessage.from,
                        text: lastMessage.text,
                        createdAt: lastMessage.createdAt,
                      };
                    }
                  });
                }

                chatsData.sort((a, b) => {
                  if (a.lastMessage && b.lastMessage) {
                    return (
                      b.lastMessage.createdAt.toMillis() -
                      a.lastMessage.createdAt.toMillis()
                    );
                  }
                  return a.lastMessage ? -1 : 1;
                });

                setUsers([...chatsData]);
              }
            );
            return unsubscribeMesages;
          });

          Promise.all(promises).then(() => {
            if (!initialFetchDone) {
              initialFetchDone = true;
              setLoading(false);
            }
          });
        } catch (error) {
          console.error(error);
          setError({ code: "error-chats" });
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error(error);
      if (error instanceof BlistyError) {
        setError({ code: error.code });
      } else {
        setError({ code: "error-chats" });
      }
      router.replace("/error");
    }
  }, []);

  if (!user) {
    return null;
  }

  const handlePress = (item: ChatUser) => {
    setToUser(item);
    router.push("/(md)/md");
  };

  const handlePressIA = () => {
    setToUser(iaChat);
    router.push("/(md)/md");
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
        {user.role !== "psychologist" && (
          <>
            <View className="h-2" />
            <ChatItem item={_IA} handlePress={handlePressIA} />
          </>
        )}
        <View className="bg-white mt-3 flex-1 w-full items-center">
          <Text className="text-lg font-semibold text-neutral-800 mb-2">
            Conversaciones con{" "}
            {user.role === "psychologist" ? "pacientes" : "especialistas"}
          </Text>
          {loading ? (
            <ActivityIndicator size={"large"} color={"rgb(62 0 156)"} />
          ) : users?.length > 0 ? (
            <ChatList users={users} handlePress={handlePress} />
          ) : (
            <Text className="text-neutral-500">No hay conversaciones</Text>
          )}
        </View>
      </View>
    </Screen>
  );
}
