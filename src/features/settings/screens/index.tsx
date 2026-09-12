import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { User } from "@/features/profile/types/user";
import { GeneralProfileHeader } from "@/shared/components/general_profile_header";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import Constants from "expo-constants";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { NavigationCard } from "../components/navigation-card";

export default function SettingsScreen() {
  const { lang, switchLanguage } = useLanguageStore();
  const [user, setuser] = useState<User>();
  const db = useSQLiteContext();
  const userRepositories = new UserRepository(db);

  const isPortuguese = lang === "pt";

  useEffect(() => {
    loadDataUser();
  }, []);

  const loadDataUser = async () => {
    try {
      const res = await userRepositories.getFrist(1);
      if (!res) return;
      setuser(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerClassName="pb-10 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <GeneralProfileHeader user={user} />

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
                <Text className="text-2xl">{isPortuguese ? "🇵🇹" : "🇬🇧"}</Text>
              </View>

              <View>
                <Text className="text-lg font-semibold text-text">
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
            colorIcon={colors.secondary}
            icon="bell"
            label="notifications"
          />

          <NavigationCard
            colorIcon={colors.blue}
            icon="upload-cloud"
            label="backup"
            link={"/(private)/settings/backup"}
          />

          <NavigationCard
            colorIcon={colors.error}
            icon="lock"
            label="security"
          />

          <NavigationCard
            colorIcon={colors.error}
            icon="git-pull-request"
            label="security"
            link={"/(private)/settings/security"}
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
