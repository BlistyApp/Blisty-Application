import {
  View,
  Text,
  Dimensions,
  FlatList,
  ActivityIndicator,
  LayoutChangeEvent,
} from "react-native";
import { MessageType } from "@/types/MessageType";
import React, { useEffect, useState } from "react";
import { getPsycos } from "@/lib/gets";
import { IaSuggestion } from "./IaSuggestion";
import { User } from "@/stores/Types";
import { cn, formatHour, formatDate } from "@/lib/utils";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Timestamp } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

export default function MessageItem({
  message,
  userId,
}: {
  message: MessageType;
  userId: string;
}) {
  const [isOverflowing, setIsOverflowing] = useState<boolean>(false);

  const handleTextLayout = (event: LayoutChangeEvent) => {
    const { height: textHeight } = event.nativeEvent.layout;
    const viewHeight = height * 0.018;
    if (textHeight > viewHeight * 2) {
      setIsOverflowing(true);
    }
  };

  if (message.type === "contact") {
    return (
      <Message
        text={message.text}
        time={
          new Date(
            message.createdAt.seconds * 1000 +
              message.createdAt.nanoseconds / 1000000
          )
        }
        isOverflowing={isOverflowing}
        handleTextLayout={handleTextLayout}
        type={message.from === userId ? "my" : "their"}
      />
    );
  }

  if (message.type === "ia_suggestion" && message.psicoUids) {
    return <IaSuggestions text={message.text} uids={message.psicoUids} />;
  }

  return <RefreshNotification text={message.text} date={message.createdAt} />;
}

function Message({
  text,
  time,
  isOverflowing,
  handleTextLayout,
  type,
}: {
  text: string;
  time: Date;
  isOverflowing: boolean;
  handleTextLayout: (event: LayoutChangeEvent) => void;
  type: "my" | "their";
}) {
  return (
    <View
      className={cn("flex w-full", type === "my" ? "items-end" : "items-start")}
    >
      <View
        style={{
          maxWidth: width * 0.7,
          flexDirection: isOverflowing ? "column" : "row",
        }}
        className={cn(
          "flex-row p-2 rounded-xl my-1 border border-neutral-200",
          type === "my" ? "bg-primary" : "bg-white"
        )}
      >
        <Text
          onLayout={handleTextLayout}
          style={{ fontSize: height * 0.018, flexWrap: "wrap" }}
          className={cn(type === "my" && "text-white")}
        >
          {text}
        </Text>
        <Text
          style={{ position: isOverflowing ? "relative" : "static" }}
          className={cn(
            "z-10 self-end text-slate-700 bottom-0 right-0 pl-3",
            type === "my" ? "text-slate-300" : "text-slate-700"
          )}
        >
          {formatHour(time)}
        </Text>
      </View>
    </View>
  );
}

function IaSuggestions({ text, uids }: { text: string; uids: string[] }) {
  const [psycos, setPsycos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setPsycosAsync = async () => {
      const newPsycos = await getPsycos(uids);
      if (!newPsycos) return;
      setPsycos(newPsycos);
      setLoading(false);
    };
    setPsycosAsync();
  }, [uids]);

  return (
    <View className="flex w-full items-center">
      <View
        style={{ width: width * 0.7 }}
        className="flex bg-white p-2 my-1 rounded-xl border border-neutral-200"
      >
        <Text style={{ fontSize: height * 0.018 }}>{text}</Text>
        {loading ? (
          <ActivityIndicator size={24} color={"rgb(62 0 156)"} />
        ) : (
          <FlatList
            data={psycos}
            keyExtractor={(item) => item.uid}
            renderItem={({ item }) => <IaSuggestion psyco={item} />}
          />
        )}
      </View>
    </View>
  );
}

function RefreshNotification({
  date,
  text,
}: {
  date: Timestamp;
  text: string;
}) {
  return (
    <View
      style={{ marginVertical: hp("1%") }}
      className="flex flex-row w-full items-center justify-center"
    >
      <View
        style={{ width: wp("20%"), height: hp("0.3%") }}
        className="bg-primary rounded-full self-center"
      ></View>
      <View className="flex flex-col gap-y-0">
        <Text
          style={{ width: wp("55%") }}
          className="text-center self-center text-primary rounded-lg my-1"
        >
          {text}
        </Text>
        <Text
          style={{ width: wp("55%") }}
          className="text-center self-center text-primary rounded-lg my-1"
        >
          {formatDate(new Date(date.seconds * 1000), true)} - {formatHour(new Date(date.seconds * 1000))}
        </Text>
      </View>
      <View
        style={{ width: wp("20%"), height: hp("0.3%") }}
        className="bg-primary rounded-full self-center"
      ></View>
    </View>
  );
}
