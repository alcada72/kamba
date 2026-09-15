import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
};

export function FastAcessItem({ icon, label, onPress }: Props) {
  return (
    <Pressable onPress={onPress} className="active:opacity-70 w-28">
      <View className="items-center rounded-2xl bg-surface p-4">
        <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-50">
          <Feather name={icon} size={24} color={colors.primary} />
        </View>

        <Text
          numberOfLines={1}
          className="mt-2 text-center text-sm font-semibold text-text"
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
