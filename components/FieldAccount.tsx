import { useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

export function FieldAccount({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const [showMore, setShowMore] = useState(false);
  return (
    <View>
      <Text className="text-2xl font-bold text-primary mt-3 mb-2">{label}</Text>
      <Text className="text-lg">
        {value.length > 100 ? `${value.slice(0, 100)}...` : value}
      </Text>
      {value.length > 100 && (
        <Text
          className="text-lg text-primary mt-1"
          onPress={() => setShowMore(!showMore)}
        >
          Ver mas
        </Text>
      )}
      <Modal visible={showMore} transparent animationType="fade">
        <View
          style={{
            height: hp("100%"),
            width: wp("100%"),
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          className="flex items-center justify-center"
        >
          <View
            style={{
              maxHeight: hp("75%"),
              width: wp("80%"),
              alignSelf: "center",
              padding: wp("5%"),
            }}
            className="bg-white flex flex-col rounded-lg"
          >
            <Text
              style={{ fontSize: hp("2.5%") }}
              className="text-center font-bold"
            >
              {label}
            </Text>

            <FlatList
              style={{ maxHeight: hp("60%"), marginTop: hp("1%") }}
              data={[]}
              renderItem={null}
              ListHeaderComponent={
                <Text style={{ fontSize: hp("2%") }}>{value}</Text>
              }
              ListHeaderComponentStyle={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              bounces={false}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
            />

            <View className="w-fullflex items-center justify-center">
              <Pressable
                onPress={() => setShowMore(false)}
                style={{
                  height: hp("5%"),
                  marginTop: hp("1%"),
                }}
                className="w-1/2 bg-primary rounded-full flex items-center justify-center"
              >
                <Text className="font-bold text-white">Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
