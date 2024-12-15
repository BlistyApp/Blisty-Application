import { Platform, KeyboardAvoidingView, FlatList } from "react-native";
import React from "react";
import { ScrollView } from "react-native";

const android = Platform.OS === "android";

export default function KeyboardViewCustom({
  children,
  keyboardVerticalOffset,
  scrollEnabled = false,
  backgroundColor = "white",
}: {
  children: React.ReactNode;
  keyboardVerticalOffset?: number;
  scrollEnabled?: boolean;
  backgroundColor?: string;
}) {
  return (
    <KeyboardAvoidingView
      behavior={android ? "height" : "padding"}
      style={{ flex: 1, backgroundColor }}
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
      />
    </KeyboardAvoidingView>
  );
}
