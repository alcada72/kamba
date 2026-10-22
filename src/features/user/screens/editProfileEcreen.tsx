import { GeneralButton } from "@/shared/components/button";
import { GeneralHeader } from "@/shared/components/general_header";
import { Input } from "@/shared/components/input";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { UserRepository } from "../repositories/userrepositories";
import { User } from "../types/user";

export default function EditProfileScreen() {
  const lang = useLanguageStore((state) => state.lang);
  const [user, setuser] = useState<User>();
  const [telefone, settelefone] = useState("");
  const db = useSQLiteContext();

  const userRepositories = useMemo(() => new UserRepository(db), [db]);

  useEffect(() => {
    loadDataUser();
  }, []);

  const loadDataUser = async () => {
    try {
      const res = await userRepositories.getFrist(1);
      if (!res) return;
      setuser(res);
      settelefone(res.telefone || "");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    if (!telefone) {
      Alert.alert(t("error", lang), t("fillAllInput", lang));
      return;
    }
    try {
      await userRepositories.update({ telefone }, user?.id || 1);
      Alert.alert(t("success", lang), t("savedSuccessfully", lang), [
        {
          text: "Ok",
          onPress: () => router.back(),
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <GeneralHeader>
        <Text className="text-secondary font-bold text-2xl">Editar perfil</Text>
      </GeneralHeader>
      <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
        <Input label={t("name", lang)} value={user?.nome} editable={false} />
        <Input label={t("email", lang)} value={user?.email} editable={false} />
        <Input
          required
          onChangeText={settelefone}
          label={t("phone", lang)}
          value={telefone}
        />
        <View className="mt-6">
          <GeneralButton label={t("save", lang)} onPress={handleSave} />
        </View>
      </ScrollView>
    </View>
  );
}
