import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";

import BackupRepositories from "../repositories/backupRepositories";

//const backupService = new BackupService(new GoogleDriveAdapter());

export default function BackupScreen() {
  const lang = useLanguageStore((state) => state.lang);
  const db = useSQLiteContext();

  const backupRepositories = new BackupRepositories(db);

  const handleMakeBackup = async () => {
    try {
      const data = await backupRepositories.getBackupDatabase();

      // await backupService.backup("google_drive", data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Header */}
      <View className="bg-primary px-5 pb-6 pt-10">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="h-full w-10"
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-2xl font-semibold text-white">
            {t("backup", lang)}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Introdução */}
        <View className="items-center px-6 py-8">
          <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Ionicons name="cloud-upload-outline" size={40} color="#25D366" />
          </View>

          <Text className="text-xl font-semibold text-foreground">
            {t("backupSalesTitle", lang)}
          </Text>

          <Text className="mt-2 text-center text-sm leading-5 text-muted-foreground">
            {t("backupSalesDescription", lang)}
          </Text>
        </View>

        {/* Backup manual */}
        <View className="mx-4 overflow-hidden rounded-2xl bg-card">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleMakeBackup}
            className="flex-row items-center px-4 py-4"
          >
            <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="cloud-upload" size={22} color={colors.green700} />
            </View>

            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">
                {t("backupNow", lang)}
              </Text>

              <Text className="mt-1 text-sm text-muted-foreground">
                {t("lastBackup", lang)}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Definições */}
        <Text className="mb-2 ml-5 mt-7 text-sm font-medium uppercase text-primary">
          {t("backupSettings", lang)}
        </Text>

        <View className="mx-4 overflow-hidden rounded-2xl bg-card">
          {/* Backup automático */}
          <View className="flex-row items-center px-4 py-4">
            <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Ionicons name="sync-outline" size={22} color={colors.green700} />
            </View>

            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">
                {t("automaticBackup", lang)}
              </Text>

              <Text className="mt-1 text-sm text-muted-foreground">
                {t("automaticBackupDescription", lang)}
              </Text>
            </View>

            <Switch
              value={false}
              trackColor={{
                false: "#D1D5DB",
                true: "#86EFAC",
              }}
              thumbColor="#25D366"
            />
          </View>

          <View className="ml-[76px] border-t border-border" />

          {/* Frequência */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center px-4 py-4"
          >
            <View className="flex-1">
              <Text className="text-base text-foreground">
                {t("frequency", lang)}
              </Text>

              <Text className="mt-1 text-sm text-muted-foreground">
                {t("daily", lang)}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <View className="ml-[76px] border-t border-border" />

          {/* Vídeos */}
          <View className="flex-row items-center px-4 py-4">
            <View className="flex-1">
              <Text className="text-base text-foreground">
                {t("includeVideos", lang)}
              </Text>

              <Text className="mt-1 text-sm leading-5 text-muted-foreground">
                {t("includeVideosDescription", lang)}
              </Text>
            </View>

            <Switch
              value={false}
              trackColor={{
                false: "#D1D5DB",
                true: "#86EFAC",
              }}
              thumbColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Armazenamento */}
        <Text className="mb-2 ml-5 mt-7 text-sm font-medium uppercase text-primary">
          {t("storage", lang)}
        </Text>

        <View className="mx-4 overflow-hidden rounded-2xl bg-card">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center px-4 py-4"
          >
            <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Ionicons
                name="server-outline"
                size={22}
                color={colors.green700}
              />
            </View>

            <View className="flex-1">
              <Text className="text-base font-medium text-foreground">
                {t("backupSize", lang)}
              </Text>

              <Text className="mt-1 text-sm text-muted-foreground">128 MB</Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Segurança */}
        <View className="mx-5 mt-7 flex-row">
          <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />

          <Text className="ml-2 flex-1 text-xs leading-5 text-muted-foreground">
            {t("backupSecurity", lang)}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
