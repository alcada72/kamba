import { langs, t } from "@/shared/i18n";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

interface HeaderProps {
  lang: langs;
  productsCount: number;
  search: string;
  setSearch: (value: string) => void;
}

export function Header({
  lang,
  productsCount,
  search,
  setSearch,
}: Readonly<HeaderProps>) {
  return (
    <View className="pr-5 pt-5 pb-2 bg-primary">
      <View className="flex-row items-center justify-between">
        <Feather
          onPress={() => router.back()}
          name="chevron-left"
          size={30}
          color={colors.secondary}
        />
        <View className="flex-1">
          <Text className="text-3xl font-bold text-secondary">
            {t("products", lang)}
          </Text>

          <Text className="mt-1 text-sm text-textSecondary">
            {productsCount}{" "}
            {lang === "pt" ? "produtos cadastrados" : "registered products"}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/(private)/produtcs/create")}
          className="h-12 w-12 items-center justify-center rounded-2xl bg-secondary active:opacity-80"
        >
          <Feather name="plus" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {/* PESQUISA */}

      <View className="mt-6 ml-5 flex-row items-center rounded-2xl border border-border bg-surface px-4">
        <Feather name="search" size={20} color="#8A948F" />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={
            lang === "pt" ? "Pesquisar produto..." : "Search product..."
          }
          placeholderTextColor="#8A948F"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          className="ml-3 flex-1 py-4 text-base text-text"
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")} hitSlop={10}>
            <Feather name="x-circle" size={20} color="#8A948F" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
