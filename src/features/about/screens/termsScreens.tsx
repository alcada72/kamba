import { GeneralHeader } from "@/shared/components/general_header";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { ScrollView, Text, View } from "react-native";

const sections = [
  {
    title: "1. Aceitação dos termos",
    content:
      "Ao utilizar o Kamba, o utilizador declara que leu, compreendeu e concorda com estes Termos e Condições. Caso não concorde com alguma das disposições, deverá deixar de utilizar a aplicação.",
  },
  {
    title: "2. Sobre o Kamba",
    content:
      "O Kamba é uma aplicação destinada a facilitar a gestão de pequenos negócios, disponibilizando ferramentas para organização de produtos, vendas e outras informações relacionadas com a atividade comercial.",
  },
  {
    title: "3. Conta do utilizador",
    content:
      "O utilizador é responsável por fornecer informações corretas e atualizadas ao criar a sua conta. Também é responsável por manter as suas credenciais de acesso seguras e por todas as atividades realizadas através da sua conta.",
  },
  {
    title: "4. Utilização da aplicação",
    content:
      "O Kamba deve ser utilizado de forma legal e responsável. O utilizador não deverá utilizar a aplicação para atividades fraudulentas, ilícitas ou que possam prejudicar outros utilizadores, o serviço ou terceiros.",
  },
  {
    title: "5. Dados e informações",
    content:
      "As informações introduzidas pelo utilizador na aplicação, incluindo dados de produtos e vendas, são da responsabilidade do próprio utilizador. O utilizador deve garantir que possui autorização para inserir e utilizar quaisquer dados de terceiros.",
  },
  {
    title: "6. Disponibilidade do serviço",
    content:
      "Procuramos manter o Kamba disponível e funcional, mas o serviço poderá ficar temporariamente indisponível devido a manutenção, atualizações, problemas técnicos ou circunstâncias fora do nosso controlo.",
  },
  {
    title: "7. Responsabilidades",
    content:
      "O Kamba disponibiliza ferramentas de apoio à gestão do negócio, mas não substitui a responsabilidade do utilizador pelas suas decisões comerciais, fiscais, financeiras ou legais.",
  },
  {
    title: "8. Alterações aos termos",
    content:
      "Estes Termos e Condições poderão ser atualizados periodicamente para refletir alterações na aplicação, nos serviços ou nos requisitos legais. Sempre que possível, o utilizador será informado sobre alterações relevantes.",
  },
  {
    title: "9. Suspensão ou encerramento",
    content:
      "O acesso à aplicação poderá ser suspenso ou encerrado quando houver violação destes termos, utilização indevida do serviço ou outras situações que justifiquem a adoção dessa medida.",
  },
  {
    title: "10. Contacto",
    content:
      "Se tiver dúvidas sobre estes Termos e Condições ou sobre a utilização do Kamba, entre em contacto com a nossa equipa através dos canais de suporte disponibilizados na aplicação.",
  },
];

export default function TermsScreen() {
  const lang = useLanguageStore((state) => state.lang);

  return (
    <View className="flex-1 bg-white">
      <GeneralHeader>
        <Text className="text-2xl font-bold text-secondary">
          {t("terms", lang)}
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
        {/* Introdução */}
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            {t("terms", lang)}
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-600">
            Estes Termos e Condições estabelecem as regras para a utilização da
            aplicação Kamba. Leia atentamente este documento antes de utilizar
            os nossos serviços.
          </Text>

          <View className="mt-4 rounded-xl bg-gray-50 p-4">
            <Text className="text-sm leading-5 text-gray-500">
              {t("LastUpdate", lang)}: 03 de Outubro de 2026
            </Text>
          </View>
        </View>

        {/* Termos */}
        <View className="mt-8 gap-7">
          {sections.map((section) => (
            <View key={section.title}>
              <Text className="text-lg font-bold text-gray-900">
                {section.title}
              </Text>

              <Text className="mt-2 text-base leading-6 text-gray-600">
                {section.content}
              </Text>
            </View>
          ))}
        </View>

        {/* Aceitação */}
        <View className="mt-10 rounded-2xl bg-gray-50 p-5">
          <Text className="text-base font-semibold leading-6 text-gray-800">
            Ao continuar a utilizar o Kamba, confirma que aceita estes Termos e
            Condições.
          </Text>
        </View>

        {/* Footer */}
        <View className="mt-8 items-center">
          <Text className="text-sm text-gray-400">
            Kamba • Gestão de negócios
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
