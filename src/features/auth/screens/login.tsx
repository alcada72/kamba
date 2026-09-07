import { assetsPath } from "@/shared/assets";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
  const lang = useLanguageStore((stt) => stt.lang);

  return (
    <View className="flex-1 bg-primary px-6">
      {/* Logo */}
      <View className="pt-16 items-center">
        <Image
          source={assetsPath.logo}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-white text-center">
          {t("welcome", lang)}
        </Text>

        <Text className="text-base text-white/70 text-center mt-3 mb-10">
          {t("signInWithGoogle", lang)}
        </Text>

        {/* Google Login */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-white rounded-2xl p-4 flex-row items-center justify-center"
        >
          <FontAwesome name="google" size={22} color={colors.blue} />

          <Text className="text-base font-bold text-gray-800 ml-3">
            {t("signInWithGoogle", lang)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="pb-10 items-center">
        <Text className="text-xs text-white/50 text-center">
          {t("continueWithGoogle", lang)}
        </Text>
      </View>
    </View>
  );
}
