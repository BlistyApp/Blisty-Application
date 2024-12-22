import { Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";

interface DateInputProps {
  value: Date;
  placeholder: string;
  mode: AndroidNativeProps["mode"];
  display: AndroidNativeProps["display"];
  onChange: (...event: any[]) => void;
  error: boolean;
}

export function DateInput({
  value,
  placeholder,
  onChange,
  mode,
  display,
  error,
}: DateInputProps) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const onSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate;
    setShow(false);
    onChange(currentDate);
  };
  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            opacity: pressed ? 0.8 : 1,
            borderColor: error ? "rgb(239,68,68)" : "#000",
          },
        ]}
        onPress={toggleShow}
      >
        <Text style={[styles.text]}>
          {value?.toLocaleDateString("es-PE") || placeholder}
        </Text>
        <AntDesign name="calendar" size={24} color="black" />
      </Pressable>
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={display}
          onChange={onSelect}
          positiveButton={{ label: "Seleccionar", textColor: "#3e009c" }}
          negativeButton={{ label: "Cancelar", textColor: "#3e009c" }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    padding: 20,
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
    //position: "absolute",
    // top: 53,
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderRadius: 6,
    maxHeight: 250,
    top: -32,
  },
  text: {
    fontSize: 15,
    opacity: 0.8,
  },
  button: {
    height: 40,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
  },
});
