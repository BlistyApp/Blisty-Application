import { View, Modal, Dimensions, ActivityIndicator } from "react-native";
import React from "react";
const { width, height } = Dimensions.get("window");

export default function LoadingModal({ loading }: { loading: boolean }) {
  return (
    <Modal animationType="fade" visible={loading} transparent>
      <View style={{ height, width }} className="justify-center items-center">
        <View
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          className="w-56 h-56 rounded-2xl justify-center items-center"
        >
          <ActivityIndicator size="large" color="white" />
        </View>
      </View>
    </Modal>
  );
}
