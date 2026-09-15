import { User } from "@/features/profile/types/user";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  user: User | null;
};

export function HomeHeader({ user }: Readonly<Props>) {
  const { lang } = useLanguageStore();
  return (
    <View className="bg-primary w-full pt-6 min-h-32 flex-row items-center justify-between z-10 px-4 rounded-b-3xl">
      <View className="flex-1 items-center flex-row gap-2">
        <Pressable onPress={() => router.navigate("/(private)/profile")}>
          <FontAwesome name="user-circle" color={colors.secondary} size={30} />
        </Pressable>
        <Text numberOfLines={1} className="text-secondary text-2xl flex-1">
          {t("hello", lang)}, {user?.nome}
        </Text>
      </View>

      <Pressable onPress={() => router.push("/(private)/settings")}>
        <Feather name="settings" color={colors.secondary} size={24} />
      </Pressable>
    </View>
  );
}
