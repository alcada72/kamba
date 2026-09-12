import colors from "@/theme/colos";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

export function LoandingModal({ visible, onClose }: Props) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size={200} color={colors.secondary} />
      </View>
    </Modal>
  );
}
