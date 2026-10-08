import { GeneralButton } from "@/shared/components/button";
import { GeneralHeader } from "@/shared/components/general_header";
import { Input } from "@/shared/components/input";
import { LoandingModal } from "@/shared/components/loading-modal";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import EnterpriseRepository from "../repositories/enterpriseRepository";

export default function EmnterpriseScreen() {
  const lang = useLanguageStore((stt) => stt.lang);
  const [nome, setNome] = useState("");
  const [id, setId] = useState<number | null>();
  const [nif, setNif] = useState<string | null>("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [isloanding, setIsloanding] = useState(false);

  const db = useSQLiteContext();

  const handleSave = async () => {
    if (!nome || !nif || !telefone || !endereco) {
      Alert.alert(t("error", lang), t("fillAllInput", lang));
    }
    setIsloanding(true);
    try {
      const enterpriserepository = new EnterpriseRepository(db);
      if (id) {
        await enterpriserepository.update(id, {
          nome,
          nif: nif || undefined,
          telefone,
          endereco,
        });
      } else {
        await enterpriserepository.create({
          nome,
          nif,
          telefone,
          endereco,
        });
      }

      Alert.alert(t("success", lang), t("savedSuccessfully", lang), [
        {
          text: "Ok",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloanding(false);
    }
  };

  useEffect(() => {
    getEnterpriseInfo();
  }, []);

  const getEnterpriseInfo = async () => {
    setIsloanding(true);
    try {
      const enterpriserepository = new EnterpriseRepository(db);
      const info = await enterpriserepository.getById();
      if (!info) return;

      setId(info.id);
      setNome(info.nome);
      setNif(info.nif);
      setEndereco(info.endereco);
      setTelefone(info.telefone);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloanding(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <GeneralHeader>
        <Text numberOfLines={1} className="text-2xl font-bold text-white">
          {t("enterprise", lang)}
        </Text>
      </GeneralHeader>

      <ScrollView
        contentContainerStyle={{
          flex: 1,
          paddingHorizontal: 10,
          paddingBottom: 24,
          paddingTop: 10,
          gap: 4,
        }}
      >
        <Input
          required
          value={nome}
          onChangeText={setNome}
          label={t("companyName", lang)}
          autoCorrect={false}
        />

        <Input
          required
          value={nif || ""}
          onChangeText={setNif}
          label={t("TaxIdentificationNumber", lang)}
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="numeric"
          textContentType="flightNumber"
        />

        <Input
          required
          value={telefone}
          onChangeText={setTelefone}
          label={t("phone", lang)}
          autoCapitalize="none"
          keyboardType="numeric"
          textContentType="telephoneNumber"
        />

        <Input
          required
          value={endereco}
          onChangeText={setEndereco}
          label={t("address", lang)}
          autoCorrect={false}
          autoComplete="address-line1"
          textContentType="addressCityAndState"
        />

        <View className="pt-5 w-full">
          <GeneralButton
            variant="primary"
            label={t("save", lang)}
            onPress={handleSave}
          />
        </View>
      </ScrollView>

      <LoandingModal visible={isloanding} />
    </View>
  );
}
