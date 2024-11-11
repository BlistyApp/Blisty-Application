import { View, Text, Pressable, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { ChatUser } from "@/types/ChatUser";
import { ProfilePicture } from "@/components/ProfilePicture";
import { useUserStore } from "@/stores/UserStore";
import { formatDate, getRoomId } from "@/lib/utils";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { MessageType } from "@/types/MessageType";

interface ChatItemProps {
  item: ChatUser;
  handlePress: (item: ChatUser) => void;
}

const height = Dimensions.get("window").height;

export default function ChatItem({ item, handlePress }: ChatItemProps) {
  const { user } = useUserStore();
  const { db } = useFirebaseStore();
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
  }, []);

  const renderTimeMessage = () => {
    if (lastMessage) {
      return formatDate(new Date(lastMessage.createdAt.seconds * 1000));
    }
    return "Time";
  };

  const renderLastMessage = () => {
    if (lastMessage) {
      if (lastMessage.userId === user?.uid) return "Tú: " + lastMessage.text;
      return lastMessage.text;
    }
    return "Hola!!";
  };
  return (
    <Pressable
      onPress={() => handlePress(item)}
      className="w-full flex flex-row justify-between gap-3 mb-2 pb-2 px-2 border-b border-b-neutral-200"
    >
      <View>
        <ProfilePicture name={item.uid} uri={item.profilePic} />
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
