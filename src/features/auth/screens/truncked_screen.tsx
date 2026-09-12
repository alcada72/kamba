import { useAuthState } from "@/features/auth/store/auth.store";
import { assetsPath } from "@/shared/assets";
import { KeysBoardComponent, PIN_LENGTH } from "@/shared/components/keysBoards";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

const SAVED_PIN = "123456";

export default function TrunckedScreen() {
  const lang = useLanguageStore((stt) => stt.lang);
  const setTruncked = useAuthState((stt) => stt.setTruncked);

  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");
    if (value.length !== PIN_LENGTH) return;

    console.log("PIN:", value);

    if (value === SAVED_PIN) {
      setTruncked(false);
    } else {
      setMessage("O pin inserido não está correto");
    }

    setValue("");
  };

  return (
    <ScrollView
      contentContainerClassName="flex-1"
      className="flex-1  bg-primary"
    >
      <View className="flex-1 items-center justify-start">
        <View className="items-center pt-16">
          <Image
            source={assetsPath.kamba_logo_gold}
            style={{
              width: 200,
              height: 80,
            }}
            resizeMode="contain"
          />
        </View>

        <View className=" items-center justify-center">
          <Text className="text-center text-3xl font-bold text-white">
            {t("welcome", lang)}
          </Text>

          <Text className="mb-10 mt-3 text-center text-base text-white/70">
            {t("enterPin", lang)}
          </Text>
        </View>
      </View>

      <Text className="text-2xl text-center text-error">{message}</Text>

      <View className="flex-row gap-4 items-center justify-center my-8 mb-10">
        {Array.from({ length: PIN_LENGTH }).map((_, index) => {
          const filled = index < value.length;
          return (
            <View
              key={index}
              className={`h-9 w-9 rounded-full ${
                filled ? "bg-secondary border-2 border-white" : "bg-white/30"
              }`}
            />
          );
        })}
      </View>

      {/* Teclado  */}
      <KeysBoardComponent
        onTextChange={(v) => {
          if (value.length >= PIN_LENGTH) return;
          setValue(v);
        }}
        onDelete={setValue}
        onEnter={handleLogin}
        disable={value.length !== PIN_LENGTH}
      />
    </ScrollView>
  );
}
