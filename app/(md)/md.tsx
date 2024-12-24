import {
  View,
  StatusBar,
  Dimensions,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Text,
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
  getDoc,
} from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import BlistyError from "@/lib/blistyError";
import { useErrorStore } from "@/stores/ErrorsStore";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const { height } = Dimensions.get("window");

export default function Md() {
  const { toUser } = useMdStore();
  const { db } = useFirebaseStore((state) => state);
  const { user } = useUserStore();
  const router = useRouter();
  const messageInRef = useRef("");
  const inRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<MessageType[]>();
  const [loading, setLoading] = useState(true);
  const { setError } = useErrorStore((state) => state);

  useEffect(() => {
    scrollToEnd();
  }, []);

  const scrollToEnd = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleContentSizeChange = () => {
    scrollToEnd();
  };

  const aiChatPetition = async (userId:string, roomId :string) => {
    const response = await fetch("https://blisty-backend.vercel.app/ai-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        roomId: roomId,
      }),
    });
    return response;
  }

  useEffect(() => {
    try {
      if (!db) {
        throw new BlistyError("No se encontró la base de datos", "error-db");
      }

      if (!user) {
        throw new BlistyError(
          "No se encontró el usuario dirigido",
          "error-user"
        );
      }

      if (!toUser) {
        throw new BlistyError("No se encontró el usuario", "error-toUser");
      }

      const roomId = getRoomId(user.uid, toUser?.uid);
      const roomRef = doc(db, "rooms", roomId);

      const messagesRef = collection(roomRef, "messages");
      const messageQuery = query(messagesRef, orderBy("createdAt", "asc"));

      const unsubscribe = onSnapshot(messageQuery, (querySnapshot) => {
        setLoading(false);
        const allMessages = querySnapshot.docs.map((doc) => {
          const message_data = doc.data();
          /*
            if ("responded" in message_data && message_data.responded === false) {
              await fetch("https://api.blisty.com/ia")
            }
          */
          return message_data;
        }) as MessageType[];
        console.log(allMessages);
        setMessages([...allMessages]);
      });

      if (toUser.uid === "blisty") {
        aiChatPetition(user.uid, roomId);
      }
      return unsubscribe;
    } catch (e) {
      console.error(e);
      if (e instanceof BlistyError) {
        setError({ code: e.code });
      } else {
        setError({ code: "error-md" });
      }

      router.replace("/error");
    }
  }, [toUser]);

  if (!toUser || !user || !db) {
    return;
  }

  const onRefresh = async () => {
    try {
      const roomId = getRoomId(user.uid, toUser.uid);
      const roomRef = doc(db, "rooms", roomId);
      await setDoc(
        roomRef,
        { last_refresh: Timestamp.fromDate(new Date()) },
        { merge: true }
      );

      const messagesRef = collection(roomRef, "messages");
      const new_refresh = await addDoc(messagesRef, {
        type: "refresh_notification",
        text: "Comenzamos de nuevo!",
        createdAt: Timestamp.fromDate(new Date()),
        from: user.uid,
        to: toUser.uid,
        responded: true,
      });
      await aiChatPetition(user.uid, roomId);
      //console.log(new_refresh);
    } catch (e) {
      console.error(e);
      if (e instanceof BlistyError) {
        setError({ code: e.code });
      } else {
        setError({ code: "error-md-refresh" });
      }
      router.replace("/error");
    }
  };

  const onSend = async () => {
    if (messageInRef.current.trim() === "") return;

    try {
      /* ------------------------
       const roomId = getRoomId(user.uid, toUser.uid);
      */
      const meesageInput = messageInRef.current;
      messageInRef.current = "";
      if (inRef) inRef?.current?.clear();
      const roomId = getRoomId(user.uid, toUser.uid);
      const roomRef = doc(db, "rooms", roomId);
      const room = await getDoc(roomRef);

      if (!room.exists()) {
        console.log("room no creado");
        await createNewRoom();
      }

      const messagesRef = collection(roomRef, "messages");

      if (toUser.uid === "blisty") {
        const newMessage = await addDoc(messagesRef, {
          type: "contact",
          text: meesageInput,
          createdAt: Timestamp.fromDate(new Date()),
          from: user.uid,
          to: toUser.uid,
          responded: false,
        });
        const response = await aiChatPetition(user.uid, roomId);
        console.log(newMessage);
        console.log("Document written with ID: ", newMessage.id);
        console.log("Response aichat/ :", response);
      } else {
        const newMessage = await addDoc(messagesRef, {
          type: "contact",
          text: meesageInput,
          createdAt: Timestamp.fromDate(new Date()),
          from: user.uid,
          to: toUser.uid,
        });
        console.log(newMessage);
        console.log("Document written with ID: ", newMessage.id);
      }
    } catch (e) {
      console.error(e);
      if (e instanceof BlistyError) {
        setError({ code: e.code });
      } else {
        setError({ code: "error-md-send" });
      }
      router.replace("/error");
    }
  };

  const createNewRoom = async () => {
    const roomId = getRoomId(user.uid, toUser.uid);
    const users = [];
    users.push({
      uid: user.uid,
      name: user.name,
      profile_pic: user.profile_pic,
    });
    if (toUser.uid === "blisty") {
      users.push({
        uid: "blisty",
        name: "Blisty",
      });
    } else {
      users.push({
        uid: toUser.uid,
        name: toUser.name,
        profile_pic: toUser.profile_pic,
      });
    }
    console.log({
      roomId,
      users: users,
      createdAt: Timestamp.fromDate(new Date()),
      last_refresh: Timestamp.fromDate(new Date()),
      end: false,
      userIds: [user.uid, toUser.uid],
    });
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      users: users,
      createdAt: Timestamp.fromDate(new Date()),
      last_refresh: Timestamp.fromDate(new Date()),
      end: false,
      userIds: [user.uid, toUser.uid],
    }).catch((e) => {
      console.error(e);
    });
  };

  return (
    <KeyboardViewCustom
      backgroundColor="rgb(229 229 229)"
      scrollEnabled={false}
      keyboardVerticalOffset={91}
    >
      <View style={{ height: hp("92%") }} className="bg-neutral-200">
        <StatusBar barStyle="light-content" />
        <MdHeder router={router} onRefresh={onRefresh} />
        <View className="h-2 bg-primary border-b border-neutral-300" />
        <View className="flex-1 justify-between bg-neutral-200">
          <View className="flex-1">
            {/* <MessageList
              scrollRef={scrollRef}
              messages={toUser.uid === "blisty" ? IA_SUGGESTION : messages}
              userId={user?.uid}
              onContentSizeChange={handleContentSizeChange}
            /> */}
            {loading ? (
              <ActivityIndicator size={"large"} color={"rgb(62 0 156)"} />
            ) : messages && messages?.length > 0 ? (
              <MessageList
                scrollRef={scrollRef}
                messages={messages}
                userId={user?.uid}
                onContentSizeChange={handleContentSizeChange}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-neutral-900 font-bold text-xl">
                  Comenzamos? 👋
                </Text>
                <Text className="text-neutral-900 font-light text-xl">
                  Escribe tu primer mensaje
                </Text>
              </View>
            )}
          </View>
          <View
            style={{ paddingTop: height * 0.0001 }}
            className="flex items-center bg-neutral-200"
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
                <Pressable onPress={onSend} className="self-center mr-2">
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
