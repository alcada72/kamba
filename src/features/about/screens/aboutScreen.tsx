import { assetsPath } from "@/shared/assets";
import { GeneralHeader } from "@/shared/components/general_header";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { Image, ScrollView, Text, View } from "react-native";

const features = [
  "Venda de produtos",
  "Cadastro de produtos",
  "Gestão de produtos",
  "Acompanhamento das vendas",
];

export default function AboutScreen() {
  const lang = useLanguageStore((state) => state.lang);

  return (
    <View className="flex-1 bg-white">
      <GeneralHeader>
        <Text className="text-2xl font-bold text-secondary">
          {t("about", lang)}
        </Text>
      </GeneralHeader>

      <ScrollView
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 100,
        }}
      >
        {/* Logo */}
        <View className="items-center">
          <Image
            source={assetsPath.kamba_logo_gold}
            className="h-20 w-52"
            resizeMode="contain"
          />
        </View>

        {/* Introdução */}
        <View className="mt-8">
          <Text className="text-center text-2xl font-bold text-gray-900">
            {t("about", lang)} Kamba
          </Text>

          <Text className="mt-4 text-center text-base leading-6 text-gray-600">
            O Kamba é uma solução criada para facilitar a gestão de pequenos
            negócios. A aplicação ajuda comerciantes e empreendedores a
            organizar as suas operações de forma simples, prática e eficiente.
          </Text>
        </View>

        {/* Proposta */}
        <View className="mt-8 rounded-2xl bg-gray-50 p-5">
          <Text className="text-lg font-bold text-gray-900">
            O seu parceiro de negócio
          </Text>

          <Text className="mt-2 text-base leading-6 text-gray-600">
            Com o Kamba, pode gerir as principais atividades do seu negócio num
            único lugar, tornando o seu dia a dia mais organizado e produtivo.
          </Text>
        </View>

        {/* Funcionalidades */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-900">
            Funcionalidades
          </Text>

          <View className="mt-4 gap-3">
            {features.map((feature) => (
              <View
                key={feature}
                className="flex-row items-center rounded-xl border border-gray-100 bg-white"
              >
                <View className="mr-3 h-2.5 w-2.5 rounded-full bg-secondary" />

                <Text className="flex-1 text-base text-gray-700">
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Missão */}
        <View className="mt-8">
          <Text className="text-xl font-bold text-gray-900">
            A nossa missão
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-600">
            Tornar a gestão de pequenos negócios mais simples e acessível,
            oferecendo ferramentas que ajudam os comerciantes a controlar e
            desenvolver melhor as suas atividades.
          </Text>
        </View>

        {/* Versão */}
        <View className="mt-12 items-center">
          <Text className="text-sm text-gray-400">
            Kamba • Gestão de negócios
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
