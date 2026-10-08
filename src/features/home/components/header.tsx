import { User } from "@/features/profile/types/user";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Props = {
  user: User | null;
};

export function HomeHeader({ user }: Readonly<Props>) {
  const { lang } = useLanguageStore();
  return (
    <View
      className="bg-primary w-full pt-6 min-h-32 flex-row items-center 
    justify-between z-10 px-5 rounded-b-3xl"
    >
      <View className="flex-1 justify-center flex-col">
        <Text numberOfLines={1} className="text-secondary text-lg ">
          {t("hello", lang)},
        </Text>
        <Text numberOfLines={1} className="text-secondary text-2xl">
          {user?.nome}
        </Text>
      </View>

      <Pressable onPress={() => router.push("/(private)/settings")}>
        <Feather name="settings" color={colors.secondary} size={28} />
      </Pressable>
    </View>
  );
}
