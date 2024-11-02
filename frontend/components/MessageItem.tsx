import { View, Text, Dimensions } from "react-native";
import { MessageType } from "@/types/MessageType";

const { width, height } = Dimensions.get("window");

export default function MessageItem({
  message,
  userId,
}: {
  message: MessageType;
  userId: string;
}) {
  if (message.type === "ia_suggestion") {
    return <IaSuggestion text={message.text} />;
  }

  return message.userId === userId ? (
    <MyMessage text={message.text} />
  ) : (
    <TheirMessage text={message.text} />
  );
}

function MyMessage({ text }: { text: string }) {
  return (
    <View className="flex w-full items-end">
      <View
        style={{ maxWidth: width * 0.7 }}
        className="flex bg-primary p-2 my-1 rounded-xl border border-neutral-200"
      >
        <Text style={{ fontSize: height * 0.018 }} className="text-white">
          {text}
        </Text>
      </View>
    </View>
  );
}

function TheirMessage({ text }: { text: string }) {
  return (
    <View className="flex w-full items-start">
      <View
        style={{ maxWidth: width * 0.7 }}
        className="flex bg-white p-2 my-1 rounded-xl border border-neutral-200"
      >
        <Text style={{ fontSize: height * 0.018 }}>{text}</Text>
      </View>
    </View>
  );
}

function IaSuggestion({ text }: { text: string }) {
  return (
    <View className="flex w-full items-center">
      <View
        style={{ maxWidth: width * 0.7 }}
        className="flex bg-white p-2 my-1 rounded-xl border border-neutral-200"
      >
        <Text style={{ fontSize: height * 0.018 }}>{text}</Text>
      </View>
    </View>
  );
}
