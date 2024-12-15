import { View, Text, StyleSheet, FlatList, Pressable, StyleProp, ViewStyle } from "react-native";
import React, { useCallback, useState } from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";

type OptionItem = {
  value: string;
  label: string;
};

interface DropDownProps {
  data: OptionItem[];
  onChange: (item: string) => void;
  placeholder: string;
  error: boolean;
  defaultValue?: string;
  style?: StyleProp<ViewStyle>;
}

export function DropDownList({
  data,
  onChange,
  placeholder,
  error,
  defaultValue,
  style,
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const [value, setValue] = useState(defaultValue || "");

  const onSelect = useCallback((item: OptionItem) => {
    onChange(item.value);
    setValue(item.label);
    setExpanded(false);
  }, []);
  return (
    <View style={style} className={"relative flex flex-row w-full"}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
        onPress={toggleExpanded}
      >
        <Text style={[styles.text, { color: error ? "red" : "black" }]}>
          {value || placeholder}
        </Text>
        <AntDesign name={expanded ? "caretup" : "caretdown"} />
      </Pressable>
      {expanded && (
        <View
          style={{ marginTop: hp("6%") }}
          className="z-[100] absolute w-full"
        >
          <View style={[styles.options]}>
            {/* {data.map((item) => (
                <Fragment key={item.value}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.optionItem,
                      {
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                    onPress={() => onSelect(item)}
                  >
                    <Text>{item.label}</Text>
                  </Pressable>
                  <View style={styles.separator} />
                </Fragment>
              ))} */}
            <FlatList
              keyExtractor={(item) => item.value}
              data={data}
              scrollEnabled={true}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [
                    styles.optionItem,
                    {
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => onSelect(item)}
                >
                  <Text>{item.label}</Text>
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  optionItem: {
    height: 40,
    justifyContent: "center",
  },
  separator: {
    height: 4,
  },
  options: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
    flex: 1,
  },
  text: {
    fontSize: hp("1.7%"),
    opacity: 0.8,
  },
  button: {
    height: 50,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
});
