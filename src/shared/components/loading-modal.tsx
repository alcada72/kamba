import colors from "@/theme/colos";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

export function LoandingModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={80} color={colors.secondary} />
      </View>
    </Modal>
  );
}
