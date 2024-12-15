import { View, Text, Pressable, Modal, FlatList } from "react-native";
import { useCallback, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox } from "./CheckBox";

interface Item {
  value: string;
  label: string;
}

interface MultiSelectionProps {
  data: Item[];
  selecteds: string[];
  onChange: (item: string[]) => void;
  placeholder: string;
  error: boolean;
}

export function MultiSelection({
  data,
  selecteds,
  onChange,
  placeholder,
  error,
}: MultiSelectionProps) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen(!open), [open]);

  const onSelect = useCallback(
    (item: Item) => {
      if (!selecteds) return;
      console.log([...selecteds, item.value]);
      if (selecteds.includes(item.value)) {
        onChange(selecteds.filter((selected) => selected !== item.value));
      } else {
        onChange([...selecteds, item.value]);
      }
    },
    [onChange, selecteds]
  );

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
          },
          {
            height: 50,
            justifyContent: "space-between",
            backgroundColor: "#fff",
            flexDirection: "row",
            width: "100%",
            alignItems: "center",
            paddingHorizontal: 15,
            borderRadius: 8,
            borderWidth: 2,
          },
        ]}
        onPress={toggleOpen}
      >
        <Text
          style={{ color: error ? "red" : "black", fontSize: hp("1.7%") }}
          className="opacity-80"
        >
          {placeholder}
        </Text>
        <AntDesign name={"plus"} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade">
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
              height: hp("75%"),
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
              Seleccionar Especializaciones
            </Text>
            <FlatList
              style={{ height: hp("80%"), marginTop: hp("2%") }}
              keyExtractor={(item) => item.value}
              data={data}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <Pressable
                  className="flex flex-row items-center space-x-2"
                  onPress={() => onSelect(item)}
                >
                  <CheckBox
                    checked={selecteds && selecteds.includes(item.value)}
                    onChecked={() => onSelect(item)}
                  />
                  <Text style={{ fontSize: hp("1.5%") }}>{item.label}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => (
                <View style={{ height: hp("1%") }} />
              )}
            />
            <View className="w-fullflex items-center justify-center">
              <Pressable
                onPress={toggleOpen}
                style={{
                  height: hp("5%"),
                  marginTop: hp("1%"),
                }}
                className="w-1/2 bg-primary rounded-full flex items-center justify-center"
              >
                <Text className="font-bold text-white">Hecho</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
