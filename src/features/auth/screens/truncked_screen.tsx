import { useAuthState } from "@/features/auth/store/auth.store";
import { assetsPath } from "@/shared/assets";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const keysBoards = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  ["DEL", 0, "OK"],
];

const PIN_LENGTH = 4;
const SAVED_PIN = "1234";

export default function TrunckedScreen() {
  const lang = useLanguageStore((stt) => stt.lang);
  const setTruncked = useAuthState((stt) => stt.setTruncked);

  const [value, setValue] = useState("");

  const handleKeyPress = (key: number | string) => {
    if (key === "DEL") {
      setValue((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "OK") {
      if (value.length !== PIN_LENGTH) return;

      console.log("PIN:", value);

      if (value === SAVED_PIN) {
        setTruncked(false);
      }

      return;
    }

    if (value.length >= PIN_LENGTH) return;

    setValue((prev) => prev + String(key));
  };

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 bg-primary px-6">
        <View className="items-center pt-16">
          <Image
            source={assetsPath.logo}
            style={{
              width: 80,
              height: 80,
            }}
            resizeMode="contain"
          />
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-3xl font-bold text-white">
            {t("welcome", lang)}
          </Text>

          <Text className="mb-10 mt-3 text-center text-base text-white/70">
            {t("enterPin", lang)}
          </Text>

          <View className="flex-row gap-4">
            {Array.from({ length: PIN_LENGTH }).map((_, index) => {
              const filled = index < value.length;

              return (
                <View
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    filled ? "bg-white" : "bg-white/30"
                  }`}
                />
              );
            })}
          </View>
        </View>

        {/* Teclado  */}
        <View className="mb-10 items-center">
          {keysBoards.map((row, rowIndex) => (
            <View
              key={rowIndex}
              className="mb-4 flex-row items-center justify-center gap-4"
            >
              {row.map((key) => {
                const isAction = key === "DEL" || key === "OK";

                return (
                  <Pressable
                    key={key}
                    onPress={() => handleKeyPress(key)}
                    className="h-16 w-16 items-center justify-center rounded-full bg-white/10 active:bg-white/20"
                  >
                    <Text
                      className={`font-semibold ${
                        isAction
                          ? "text-base text-white/70"
                          : "text-xl text-white"
                      }`}
                    >
                      {key === "DEL" ? "⌫" : key === "OK" ? "✓" : key}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
