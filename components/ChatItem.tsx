import React from "react";
import { View, Text, Pressable } from "react-native";
import { ChatUser } from "@/types/ChatUser";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useUserStore } from "@/stores/UserStore";
import { formatDate } from "@/lib/utils";

interface ChatItemProps {
  item: ChatUser;
  handlePress: (item: ChatUser) => void;
}

export default function ChatItem({ item, handlePress }: ChatItemProps) {
  const { user } = useUserStore();
  /* const { db } = useFirebaseStore();
  const [lastMessage, setLastMessage] = useState<MessageType | null>(null);
  useEffect(() => {
    if (!item.uid || !user || !db) {
      return;
    }
    const roomId = getRoomId(user.uid, item.uid);
    const roomRef = doc(db, "rooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    const messageQuery = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
      const allMessages = querySnapshot.docs.map((doc) =>
        doc.data()
      ) as MessageType[];
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });

    return unsubscribe;
  }, []); */

  const renderTimeMessage = () => {
    if (item.lastMessage) {
      return formatDate(new Date(item.lastMessage.createdAt.seconds * 1000));
    }
    return "";
  };

  const renderLastMessage = () => {
    if (item.lastMessage) {
      if (item.lastMessage.fromUid === user?.uid)
        return "Tú: " + item.lastMessage.text;
      return item.lastMessage.text;
    }
    return "Hola!!";
  };

  return (
    <Pressable
      onPress={() => handlePress(item)}
      className="w-full flex flex-row justify-between gap-3 mb-2 pb-2 px-2 border-b border-b-neutral-200"
    >
      <View>
        <ProfilePicture name={item.uid} uri={item.profile_pic} />
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text className="font-semibold text-lg text-neutral-800">
            {item.name}
          </Text>
          <Text className="text-neutral-500 text-sm">
            {renderTimeMessage()}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-neutral-500 text-sm pr-6"
        >
          {renderLastMessage()}
        </Text>
      </View>
    </Pressable>
  );
}
