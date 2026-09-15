import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { useCameraPermissions } from "expo-camera";
import { Pressable, Text, View } from "react-native";

export const NopermissionCamera = () => {
  const [_, requestPermission] = useCameraPermissions();
  const lang = useLanguageStore((state) => state.lang);
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <View className="h-20 w-20 items-center justify-center rounded-3xl bg-green-50">
        <Text className="text-4xl">📷</Text>
      </View>

      <Text className="mt-6 text-center text-2xl font-bold text-primary">
        {t("CameraAccess", lang)}
      </Text>

      <Text className="mt-3 text-center text-base leading-6 text-textSecondary">
        {lang === "pt"
          ? "Precisamos de acesso à câmera para ler os códigos de barras dos produtos."
          : "We need camera access to scan product barcodes."}
      </Text>

      <Pressable
        onPress={requestPermission}
        className="mt-8 rounded-2xl bg-primary px-8 py-4 active:opacity-80"
      >
        <Text className="font-bold text-white">{t("AllowCamera", lang)}</Text>
      </Pressable>
    </View>
  );
};
