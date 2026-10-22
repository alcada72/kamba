import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colors";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

type Props = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  blocked?: boolean;
  info?: string;
};

export function FastAcessItem({
  icon,
  label,
  onPress,
  blocked,
  info,
}: Readonly<Props>) {
  const lang = useLanguageStore((state) => state.lang);

  const handlePress = () => {
    console.log("Clicou");

    if (blocked) {
      Alert.alert(
        t("blockedFeature", lang),
        info || t("blockedFeatureDescription", lang),
        [{ text: t("confirm", lang) }],
      );
    } else {
      onPress?.();
    }
  };

  return (
    <Pressable onPress={handlePress} className={`active:opacity-70 w-28  `}>
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
      {blocked && (
        <Pressable
          onPress={handlePress}
          className="absolute z-10 inset-0 bg-black/50 items-center justify-center rounded-2xl"
        >
          <Ionicons name="lock-closed" size={50} color={colors.white} />
        </Pressable>
      )}
    </Pressable>
  );
}
