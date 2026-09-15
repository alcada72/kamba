import { GeneralProfileHeader } from "@/shared/components/general_profile_header";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import Constants from "expo-constants";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NavigationCard } from "../components/navigation-card";

export default function SettingsScreen() {
  const { lang, switchLanguage } = useLanguageStore();

  const isPortuguese = lang === "pt";

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-10 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <GeneralProfileHeader />

      <View className="mb-6 mt-3 px-5">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-textMuted">
          {t("general", lang)}
        </Text>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          <Pressable
            onPress={switchLanguage}
            className="flex-row items-center justify-between px-4 py-4 active:bg-green-50"
          >
            <View className="flex-row items-center">
              <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-green-50">
                <Text className="text-lg">{isPortuguese ? "🇵🇹" : "🇬🇧"}</Text>
              </View>

              <View>
                <Text className="text-base font-semibold text-text">
                  {t("language", lang)}
                </Text>

                <Text className="mt-1 text-sm text-textSecondary">
                  {isPortuguese ? "Português" : "English"}
                </Text>
              </View>
            </View>

            <Text className="text-xl text-textMuted">›</Text>
          </Pressable>

          <View className="ml-4 h-px bg-border" />
        </View>
      </View>

      <View className="mb-6  px-5">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-textMuted">
          {t("account", lang)}
        </Text>

        <View className="overflow-hidden rounded-2xl border border-border bg-surface">
          <NavigationCard
            icon="user"
            label="profile"
            link={"/(private)/profile"}
          />

          <NavigationCard
            colorIcon={colors.secondary}
            icon="bell"
            label="notifications"
          />

          <NavigationCard
            colorIcon={colors.secondary}
            icon="upload-cloud"
            label="notifications"
          />

          <NavigationCard
            colorIcon={colors.secondary}
            icon="lock"
            label="security"
            showBorder={false}
          />
        </View>
      </View>

      <View className="mb-6  px-5">
        <Text className="mb-3 text-sm font-semibold uppercase tracking-wider text-textMuted">
          {t("information", lang)}
        </Text>

        <View className="rounded-2xl border border-border bg-surface px-4">
          <NavigationCard label="about" />
          <NavigationCard label="terms" />
          <NavigationCard label="privacy" showBorder={false} />
        </View>
      </View>

      <View className="items-center pt-4  px-5">
        <Text className="text-xs text-textMuted">
          {t("version", lang)} {Constants.expoConfig?.version}
        </Text>
      </View>
    </ScrollView>
  );
}
