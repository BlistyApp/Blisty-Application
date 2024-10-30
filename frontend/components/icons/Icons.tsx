import AntDesign from "@expo/vector-icons/AntDesign";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";
import { Text } from "react-native";

interface TabBarProps {
  focused: boolean;
}

export function TabBarIcon({
  style,
  color,
  focused,
  ...rest
}: IconProps<ComponentProps<typeof AntDesign>["name"]> & TabBarProps) {
  return (
    <AntDesign
      size={28}
      style={[{ marginBottom: -3 }, style]}
      color={focused ? "#3e009c" : "#ccc"}
      {...rest}
    />
  );
}

export function TabBarLabel({
  focused,
  children,
}: {
  children: React.ReactNode;
} & TabBarProps) {
  return (
    <Text
      style={{
        color: focused ? "#3e009c" : "#ccc",
        fontSize: 12,
      }}
    >
      {children}
    </Text>
  );
}
