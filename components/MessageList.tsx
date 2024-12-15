import { View, ScrollView, Text } from "react-native";
import { MessageType } from "@/types/MessageType";
import MessageItem from "@/components/MessageItem";
import { formatDate } from "@/lib/utils";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export function MessageList({
  messages,
  userId,
  onContentSizeChange,
  scrollRef,
}: {
  messages?: MessageType[];
  userId: string;
  onContentSizeChange: () => void;
  scrollRef: React.RefObject<ScrollView>;
}) {
  let lastMessageDate: string | null = null;

  return (
    <View className="flex-1 p-3">
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={onContentSizeChange}
      >
        {!messages ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-neutral-500">No messages yet</Text>
          </View>
        ) : (
          messages.map((message) => {
            const messageDate = formatDate(
              new Date(message.createdAt.seconds * 1000)
            );
            const showDate = lastMessageDate !== messageDate;
            lastMessageDate = messageDate;
            return (
              <View
                className="w-full"
                key={message.createdAt.seconds + message.createdAt.nanoseconds}
              >
                {showDate && (
                  <Text style={{width: wp("18%")}} className="text-center self-center text-primary bg-white rounded-lg my-1">
                    {messageDate}
                  </Text>
                )}
                <MessageItem message={message} userId={userId} />
              </View>
            );
          })
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
