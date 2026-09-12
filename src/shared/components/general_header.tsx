import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export const GeneralHeader = ({ children }: Props) => {
  return (
    <View className="w-full bg-primary items-center  flex-row py-2">
      <TouchableOpacity
        className="items-center justify-center"
        onPress={() => router.back()}
      >
        <Feather name="chevron-left" size={30} color={colors.secondary} />
      </TouchableOpacity>
      <View className="flex-1">{children}</View>
    </View>
  );
};
