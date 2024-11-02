import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import React, { Fragment, useCallback, useRef, useState } from "react";
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
}

export function DropDownList({
  data,
  onChange,
  placeholder,
  error,
}: DropDownProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const [value, setValue] = useState("");

  const onSelect = useCallback((item: OptionItem) => {
    onChange(item.value);
    setValue(item.label);
    setExpanded(false);
  }, []);
  return (
    <View className="relative">
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
        <View className="z-[100] absolute w-full mt-14">
          <Pressable
            onPress={() => setExpanded(false)}
            style={[styles.backdrop]}
          >
            <View style={[styles.options /*, { top: -100 }*/]}>
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
          </Pressable>
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
    borderRadius: 6,
    maxHeight: 250,
  },
  text: {
    fontSize: 15,
    opacity: 0.8,
  },
  button: {
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
});
