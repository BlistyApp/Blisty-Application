import { View, FlatList } from "react-native";
import React from "react";
import { ChatUser } from "@/types/ChatUser";
import ChatItem from "./ChatItem";

interface ChatListProps {
  users: ChatUser[];
  handlePress: (item: ChatUser) => void;
}

export default function ChatList({ users, handlePress }: ChatListProps) {
  return (
    <View className="flex-1 w-full">
      <FlatList
        data={users}
        contentContainerStyle={{ flex: 1, paddingVertical: 2 }}
        keyExtractor={(item) => item.uid}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ChatItem item={item} handlePress={handlePress} />}
      />
    </View>
  );
}
