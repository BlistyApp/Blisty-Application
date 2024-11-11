import { View, ScrollView, Text } from "react-native";
import React from "react";
import { MessageType } from "@/types/MessageType";
import MessageItem from "@/components/MessageItem";

export function MessageList({
  messages,
  userId,
  scrollRef,
}: {
  messages?: MessageType[];
  userId: string;
  scrollRef: React.RefObject<ScrollView>;
}) {
  return (
    <View className="flex-1 p-3">
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {!messages ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-neutral-500">No messages yet</Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageItem
              key={message.createdAt.toString()}
              message={message}
              userId={userId}
            />
          ))
        )}
      </ScrollView>
      {/* <FlatList
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        data={messages}
        renderItem={({ item }) => (
          <MessageItem message={item} userId={userId} />
        )}
        keyExtractor={(item) => item.createdAt.toString()}
      /> */}
    </View>
  );
}
