import {
  View,
  Text,
  Modal,
  Dimensions,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SwipeRating } from "@/components/SwipeRating";
import { Input } from "./Input";
import { useRef, useState } from "react";
import { CancelIcon } from "./icons/Icons";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { useFirebaseStore } from "@/stores/FirebaseStore";
import { useUserStore } from "@/stores/UserStore";
import { set } from "react-hook-form";
const { width, height } = Dimensions.get("window");

export function ExitSurvey({
  isVisible,
  closeSurvey,
}: {
  isVisible: boolean;
  closeSurvey: () => void;
}) {
  const { db } = useFirebaseStore((state) => state);
  const { user } = useUserStore((state) => state);
  const inRef = useRef<TextInput>(null);
  const messageInRef = useRef("");
  const [raitings, setRaitings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean | null>(null);

  const handleSubmit = async () => {
    try {
      if (!db) throw new Error("No database connection");
      if (!user) throw new Error("No user found");

      setLoading(true);
      const meesageInput = messageInRef.current;
      messageInRef.current = "";
      if (inRef) inRef?.current?.clear();

      await addDoc(collection(db, "ratings"), {
        rating: raitings,
        message: meesageInput,
        createdAt: Timestamp.fromDate(new Date()),
        userUid: user.uid,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setRaitings(rating);
  };

  return (
    <Modal animationType="fade" visible={isVisible} transparent>
      <View
        style={{ height, width, backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        className="justify-center items-center"
      >
        {loading === null ? (
          <View
            style={{ height: 0.4 * height, width: 0.7 * width }}
            className="bg-white rounded-2xl items-center p-4"
          >
            <Pressable
              onPress={() => {
                closeSurvey();
              }}
              className="absolute -top-3 -right-3 bg-white min-w-min rounded-full items-center justify-center"
            >
              <CancelIcon size={40} color="#3e009c" />
            </Pressable>

            <View className="flex-row">
              <Text className="text-xl">
                Dinos, ¿Que te parecio
                <Text className="font-bold text-primary"> Blisty</Text>?
              </Text>
            </View>
            <SwipeRating maxRating={5} onRatingChange={handleRatingChange} />
            <View
              style={{ maxHeight: height * 0.1, width: "95%" }}
              className="flex-1 mx-3 mt-2"
            >
              <Input
                onChangeText={(value) => (messageInRef.current = value)}
                ref={inRef}
                className="flex-1 p-2 mr-2 ml-2"
                style={{ fontSize: height * 0.018 }}
                scrollEnabled={true}
                multiline={true}
                placeholder="Dejanos un comentario....."
              />
            </View>
            <Pressable
              onPress={handleSubmit}
              className="self-center bg-primary rounded-full p-2 mt-4 w-3/4 items-center"
            >
              <Text className="text-white font-bold text-lg">Calificar</Text>
            </Pressable>
          </View>
        ) : loading ? (
          <View
            style={{ height: 0.4 * height, width: 0.7 * width }}
            className="bg-white rounded-2xl items-center justify-center p-4"
          >
            <ActivityIndicator size={"large"} color={"rgb(62 0 156)"} />
          </View>
        ) : (
          <View
            style={{ height: 0.4 * height, width: 0.7 * width }}
            className="bg-white rounded-2xl items-center justify-center p-4"
          >
            <Text className="text-xl">Gracias por tu apoyo!</Text>
            <Pressable
              className="w-3/4 bg-primary rounded-full p-2 mt-4 items-center"
              onPress={() => closeSurvey()}
            >
              <Text className="text-white font-bold text-lg">Salir</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Modal>
  );
}
