import {
  Platform,
  KeyboardAvoidingView,
  FlatList,
  StyleProp,
  ViewStyle,
} from "react-native";
import React from "react";
import { ScrollView } from "react-native";

const android = Platform.OS === "android";

export default function KeyboardViewCustom({
  children,
  style = { flex: 1 },
  keyboardVerticalOffset,
  scrollEnabled = false,
  backgroundColor = "white",
}: {
  children: React.ReactNode;
  keyboardVerticalOffset?: number;
  scrollEnabled?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <KeyboardAvoidingView
      behavior={android ? "height" : "padding"}
      style={[ style, { backgroundColor }]}
      keyboardVerticalOffset={
        keyboardVerticalOffset ? keyboardVerticalOffset : 0
      }
    >
      {/* <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsHorizontalScrollIndicator={false}
      >
        {children}
      </ScrollView> */}
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={<>{children}</>}
        ListHeaderComponentStyle={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
}
