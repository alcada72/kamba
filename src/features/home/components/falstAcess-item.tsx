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
  blocked = false,
  info,
}: Readonly<Props>) {
  const lang = useLanguageStore((state) => state.lang);

  const handlePress = () => {
    if (blocked) {
      Alert.alert(
        t("blockedFeature", lang),
        info || t("blockedFeatureDescription", lang),
        [{ text: t("confirm", lang) }],
      );
      return;
    }

    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={
        blocked ? t("blockedFeatureDescription", lang) : undefined
      }
      className="w-28 active:opacity-70"
    >
      {({ pressed }) => (
        <View
          className={`relative items-center overflow-hidden rounded-2xl border p-4 ${
            blocked
              ? "border-border bg-surface"
              : "border-transparent bg-surface"
          }`}
          style={{
            opacity: pressed ? 0.8 : 1,
          }}
        >
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-green-50">
            <Feather name={icon} size={24} color={colors.primary} />
          </View>

          <Text
            numberOfLines={2}
            className="mt-2 text-center text-sm font-semibold leading-5 text-text"
          >
            {label}
          </Text>

          {blocked && (
            <View className="absolute inset-0 items-center justify-center rounded-2xl bg-black/55">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
                <Ionicons name="lock-closed" size={22} color={colors.white} />
              </View>

              <Text className="mt-1 text-xs text-center font-semibold text-white">
                {t("blockedFeature", lang)}
              </Text>
            </View>
          )}
        </View>
      )}
    </Pressable>
  );
}
