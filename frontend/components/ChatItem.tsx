import { View, Text, Pressable, Dimensions } from "react-native";
import React from "react";
import { ChatUser } from "@/types/ChatUser";
import { ProfilePicture } from "@/components/ProfilePicture";

interface ChatItemProps {
  item: ChatUser;
  handlePress: (item: ChatUser) => void;
}

const height = Dimensions.get("window").height;

export default function ChatItem({ item, handlePress }: ChatItemProps) {
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
            {item.lastMessage.time}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-neutral-500 text-sm pr-6"
        >
          {item.lastMessage.text}
        </Text>
      </View>
    </Pressable>
  );
}
