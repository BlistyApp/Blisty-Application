import { cn } from "@/lib/utils";
import { View, Pressable } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

export function CheckBox({
  checked,
  onChecked,
}: {
  checked: boolean;
  onChecked?: (checked: boolean) => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
      onPress={() => {
        onChecked && onChecked(!checked);
      }}
    >
      <View
        style={{
          width: wp("5%"),
          height: wp("5%"),
          padding: wp("3%"),
        }}
        className={cn(
          "justify-center items-center border border-separate rounded-lg",
          checked ? "border-primary" : "border-gray-400"
        )}
      >
        <View
          style={{
            width: wp("5%"),
            height: wp("5%"),
          }}
          className={cn(
            "justify-center items-center rounded-lg",
            checked ? "bg-primary" : ""
          )}
        />
      </View>
    </Pressable>
  );
}
