import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { ComponentProps } from "react";
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

export function ProfileIcon({ ...props }) {
  return <AntDesign name="user" {...props} />;
}

export function LogOutIcon({ ...props }) {
  return <AntDesign name="logout" {...props} />;
}

export function LeftIcon({ ...props }) {
  return <AntDesign name="left" {...props} />;
}

export function SendIcon({ ...props }) {
  return <MaterialCommunityIcons name="send-circle" {...props} />;
}

export function SendedIcon({ ...props }) {
  return <FontAwesome name="send" {...props} />;
}

export function ReturnIcon({ ...props }) {
  return <MaterialCommunityIcons name="keyboard-return" {...props} />;
}

export function CancelIcon({ ...props }) {
  return <MaterialCommunityIcons name="close-circle" {...props} />;
}

export function EyeIcon({ ...props }) {
  return <MaterialCommunityIcons name="eye" {...props} />;
}

export function EyeOffIcon({ ...props }) {
  return <MaterialCommunityIcons name="eye-off" {...props} />;
}
