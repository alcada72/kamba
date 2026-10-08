import { GeneralHeader } from "@/shared/components/general_header";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { ScrollView, Text, View } from "react-native";

const sections = [
  {
    title: "1. Introdução",
    content:
      "A sua privacidade é importante para nós. Esta Política de Privacidade explica como o Kamba recolhe, utiliza, armazena e protege as informações dos seus utilizadores durante a utilização da aplicação.",
  },
  {
    title: "2. Informações que podemos recolher",
    content:
      "Dependendo das funcionalidades utilizadas, o Kamba poderá recolher informações fornecidas pelo utilizador, como nome, contacto, informações da conta, dados do negócio, produtos, vendas e outras informações necessárias para o funcionamento da aplicação.",
  },
  {
    title: "3. Informações do negócio",
    content:
      "As informações relacionadas com o negócio, incluindo produtos, preços, vendas, clientes e outros registos inseridos na aplicação, são fornecidas pelo utilizador. O utilizador é responsável por garantir que possui autorização para utilizar essas informações.",
  },
  {
    title: "4. Como utilizamos as informações",
    content:
      "As informações recolhidas podem ser utilizadas para criar e gerir a conta do utilizador, disponibilizar as funcionalidades do Kamba, melhorar a experiência de utilização, prestar suporte, manter a segurança da aplicação e cumprir obrigações legais aplicáveis.",
  },
  {
    title: "5. Armazenamento e segurança",
    content:
      "Adotamos medidas técnicas e organizacionais destinadas a proteger as informações dos utilizadores contra acesso não autorizado, perda, alteração ou divulgação indevida. No entanto, nenhum sistema de armazenamento ou transmissão de dados pode ser considerado totalmente seguro.",
  },
  {
    title: "6. Partilha de informações",
    content:
      "Não partilhamos informações pessoais dos utilizadores com terceiros para fins incompatíveis com esta Política de Privacidade. Poderemos partilhar determinadas informações quando necessário para prestar o serviço, cumprir uma obrigação legal, proteger os nossos direitos ou responder a solicitações legítimas das autoridades competentes.",
  },
  {
    title: "7. Prestadores de serviços",
    content:
      "O Kamba poderá utilizar serviços de terceiros para apoiar determinadas funcionalidades, como alojamento, autenticação, armazenamento, análise técnica, notificações ou outros serviços necessários ao funcionamento da aplicação. Esses prestadores poderão ter acesso apenas às informações necessárias para executar os serviços contratados.",
  },
  {
    title: "8. Dados de menores",
    content:
      "O Kamba não é direcionado a crianças. Caso tenhamos conhecimento de que informações pessoais de um menor foram fornecidas sem a devida autorização, poderão ser tomadas medidas para remover essas informações, quando aplicável.",
  },
  {
    title: "9. Retenção dos dados",
    content:
      "As informações serão mantidas durante o período necessário para disponibilizar os serviços, cumprir obrigações legais, resolver conflitos e fazer cumprir os nossos acordos. Quando os dados deixarem de ser necessários, poderão ser eliminados ou anonimizados, de acordo com as circunstâncias aplicáveis.",
  },
  {
    title: "10. Direitos do utilizador",
    content:
      "Dependendo da legislação aplicável, o utilizador poderá ter direitos relacionados com os seus dados pessoais, incluindo solicitar acesso, correção, atualização ou eliminação de determinadas informações. Para exercer esses direitos, poderá entrar em contacto connosco através dos canais de suporte disponibilizados.",
  },
  {
    title: "11. Cookies e tecnologias semelhantes",
    content:
      "Dependendo das funcionalidades disponibilizadas pelo Kamba, poderemos utilizar tecnologias semelhantes a cookies para manter sessões, melhorar o funcionamento da aplicação, compreender a utilização do serviço e reforçar a segurança.",
  },
  {
    title: "12. Alterações à Política de Privacidade",
    content:
      "Esta Política de Privacidade poderá ser atualizada periodicamente. Quando forem realizadas alterações relevantes, procuraremos disponibilizar uma indicação adequada na aplicação ou através de outros canais de comunicação.",
  },
  {
    title: "13. Contacto",
    content:
      "Se tiver dúvidas, pedidos ou preocupações relacionados com esta Política de Privacidade ou com o tratamento dos seus dados, entre em contacto com a equipa do Kamba através dos canais de suporte disponibilizados na aplicação.",
  },
];

export default function PrivacyScreen() {
  const lang = useLanguageStore((state) => state.lang);

  return (
    <View className="flex-1 bg-white">
      <GeneralHeader>
        <Text className="text-2xl font-bold text-secondary">
          {t("privacy", lang)}
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
        {/* Cabeçalho */}
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            {t("privacy", lang)}
          </Text>

          <Text className="mt-3 text-base leading-6 text-gray-600">
            Nesta Política de Privacidade explicamos como o Kamba trata as
            informações dos seus utilizadores e as medidas adotadas para
            proteger a sua privacidade.
          </Text>

          <View className="mt-4 rounded-xl bg-gray-50 p-4">
            <Text className="text-sm leading-5 text-gray-500">
              {t("LastUpdate", lang)}: 03 de Outubro de 2026
            </Text>
          </View>
        </View>

        {/* Secções */}
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

        {/* Nota de privacidade */}
        <View className="mt-10 rounded-2xl bg-gray-50 p-5">
          <Text className="text-base font-semibold leading-6 text-gray-800">
            Ao utilizar o Kamba, reconhece que leu e compreendeu esta Política
            de Privacidade.
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
