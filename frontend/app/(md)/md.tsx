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
import { getRoomId } from "@/lib/utils";
import {
  doc,
  collection,
  setDoc,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";

const height = Dimensions.get("window").height;

export default function Md() {
  const { toUser } = useMdStore();
  const { db } = useFirebaseStore((state) => state);
  const { user } = useUserStore();
  const router = useRouter();
  const messageInRef = useRef("");
  const inRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<MessageType[]>();

  useEffect(() => {
    scrollToEnd();
  }, [messages]);

  useEffect(() => {
    createNewRoom();
    if (!toUser || !user || !db) {
      return;
    }
    const roomId = getRoomId(user.uid, toUser?.uid);
    const roomRef = doc(db, "rooms", roomId);
    const messagesRef = collection(roomRef, "messages");
    const messageQuery = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
      const allMessages = querySnapshot.docs.map((doc) =>
        doc.data()
      ) as MessageType[];
      console.log(allMessages);
      setMessages([...allMessages]);
    });

    return unsubscribe;
  }, []);

  if (!toUser || !user || !db) {
    return;
  }

  const onSend = async () => {
    if (messageInRef.current.trim() === "") return;

    try {
      /* ------------------------
       const roomId = getRoomId(user.uid, toUser.uid);
      */
      const roomId = getRoomId(user.uid, toUser.uid);
      const roomRef = doc(db, "rooms", roomId);
      const messagesRef = collection(roomRef, "messages");
      const newMessage = await addDoc(messagesRef, {
        senderName: user?.name,
        type: "contact",
        text: messageInRef.current,
        createdAt: Timestamp.fromDate(new Date()),
        userId: user?.uid,
      });
      messageInRef.current = "";
      if (inRef) inRef?.current?.clear();
      console.log("Document written with ID: ", newMessage.id);
    } catch (e) {
      console.log(e);
    }
  };

  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const createNewRoom = async () => {
    const roomId = getRoomId(user.uid, toUser.uid);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      users: [user.uid, toUser.uid],
      createdAt: Timestamp.fromDate(new Date()),
      end: false,
    });
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
