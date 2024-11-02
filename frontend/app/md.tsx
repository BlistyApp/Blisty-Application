import {
  View,
  StatusBar,
  Dimensions,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import MdHeder from "@/components/MdHeder";
import { useMdStore } from "@/stores/MdStore";
import { MessageList } from "@/components/MessageList";
import { SendIcon } from "@/components/icons/Icons";
import KeyboardViewCustom from "@/components/KeyboardViewCustom";
import { MessageType } from "@/types/MessageType";
import { useUserStore } from "@/stores/UserStore";

const height = Dimensions.get("window").height;

const _MESSAGES: MessageType[] = [
  {
    senderName: "Alice",
    type: "contact",
    text: "Hey, how's it going?",
    createdAt: new Date("2024-11-01T10:00:00Z"),
    userId: "pYJYugukQpNrZkOCNNbtyurn6Gz1",
  },
  {
    senderName: "Bob",
    type: "contact",
    text: "Hi Alice! I'm good, just working on the project. You?",
    createdAt: new Date("2024-11-01T10:01:00Z"),
    userId: "30492-0500",
  },
  {
    senderName: "Alice",
    type: "contact",
    text: "Same here! Are you still stuck with that bug?",
    createdAt: new Date("2024-11-01T10:02:30Z"),
    userId: "pYJYugukQpNrZkOCNNbtyurn6Gz1",
  },
  {
    senderName: "Bob",
    type: "contact",
    text: "Yes! Can't figure it out. Have any suggestions?",
    createdAt: new Date("2024-11-01T10:03:15Z"),
    userId: "30492-0500",
  },
  {
    senderName: "Alice",
    type: "contact",
    text: "I might. Want to hop on a call to check it together?",
    createdAt: new Date("2024-11-01T10:04:00Z"),
    userId: "pYJYugukQpNrZkOCNNbtyurn6Gz1",
  },
  {
    senderName: "Bob",
    type: "contact",
    text: "Sure, sounds great! Give me a minute to set it up.",
    createdAt: new Date("2024-11-01T10:05:10Z"),
    userId: "30492-0500",
  },
  {
    senderName: "Blisty",
    type: "ia_suggestion",
    text: "Why don't you try restarting the server?",
    createdAt: new Date("2024-11-01T10:06:00Z"),
    userId: "blisty",
  },
];

export default function Md() {
  const { toUser } = useMdStore();
  const { user } = useUserStore();
  const router = useRouter();
  const messageInRef = useRef("");
  const inRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<MessageType[]>(_MESSAGES);

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  if (!toUser || !user) {
    return;
  }

  const onSend = () => {
    if (messageInRef.current.trim() === "") return;
    setMessages([
      ...messages,
      {
        senderName: user?.name,
        type: "contact",
        text: messageInRef.current,
        createdAt: new Date(),
        userId: user?.uid,
      },
    ]);
    messageInRef.current = "";
    if (inRef) inRef?.current?.clear();
  };

  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardViewCustom scrollEnabled={false} keyboardVerticalOffset={90}>
      <View style={{ height: height * 0.87 }} className="bg-neutral-200">
        <StatusBar barStyle="light-content" />
        <MdHeder router={router} />
        <View className="h-2 bg-primary border-b border-neutral-300" />
        <View className="flex-1 justify-between bg-neutral-200">
          <View className="flex-1">
            <MessageList
              scrollRef={scrollRef}
              messages={messages}
              userId={user?.uid}
            />
          </View>
          <View
            style={{ marginBottom: height * 0.02 }}
            className="pt-2 flex items-center bg-neutral-200 "
          >
            <View
              style={{ maxHeight: height * 0.08 }}
              className="flex-row justify-between items-center mx-3"
            >
              <View
                style={{ width: "95%" }}
                className="flex-row bg-white justify-between rounded-full border border-neutral-300"
              >
                <TextInput
                  onChangeText={(value) => (messageInRef.current = value)}
                  ref={inRef}
                  className="flex-1 p-2 mr-2 ml-2"
                  style={{ fontSize: height * 0.018 }}
                  scrollEnabled={true}
                  multiline={true}
                  placeholder="Type a message"
                />
                <Pressable
                  onPress={() => {
                    onSend();
                  }}
                  className="self-center mr-2"
                >
                  <SendIcon size={38} color="#3e009c" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </KeyboardViewCustom>
  );
}
