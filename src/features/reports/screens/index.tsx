import { GeneralHeader } from "@/shared/components/general_header";
import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import SalesContributionChart from "../components/contribuitiosChart";
import ReportsRepository from "../repositories/reportsRepositories";
import { SalesSummary } from "../types/reports";

export default function ReportsScreen() {
  const lang = useLanguageStore((stt) => stt.lang);
  const db = useSQLiteContext();

  const [contributionsByDay, setContributionsByDay] = useState<
    SaleQuantityByDay[]
  >([]);

  const [summary, setSummary] = useState<SalesSummary>({
    quantidade_vendas: 0,
    faturamento: 0,
    ticket_medio: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const reportsRepository = new ReportsRepository(db);

        const [salesSummary, salesByDay] = await Promise.all([
          reportsRepository.getSalesSummary(),
          reportsRepository.getQtdSaleDay(),
        ]);

        setSummary(salesSummary);
        setContributionsByDay(salesByDay);
      } catch (error) {
        console.error("Erro ao carregar relatórios:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [db]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <GeneralHeader>
        <Text numberOfLines={1} className="text-2xl font-semibold">
          {t("reports", lang)}
        </Text>
      </GeneralHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 32,
        }}
      >
        {/* Cabeçalho */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">Visão geral</Text>

          <Text className="mt-1 text-base leading-6 text-gray-500">
            Consulte os seus relatórios e acompanhe os principais resultados.
          </Text>
        </View>

        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Resumo */}
            <View className="flex-row flex-wrap justify-between">
              {/* Faturamento */}
              <View className="mb-4 w-[48%] rounded-2xl bg-white p-4">
                <Text className="text-sm font-medium text-gray-500">
                  Faturamento
                </Text>

                <Text
                  numberOfLines={1}
                  className="mt-2 text-xl font-bold text-gray-900"
                >
                  {formatCurrency(summary.faturamento)}
                </Text>
              </View>

              {/* Vendas */}
              <View className="mb-4 w-[48%] rounded-2xl bg-white p-4">
                <Text className="text-sm font-medium text-gray-500">
                  Vendas
                </Text>

                <Text className="mt-2 text-2xl font-bold text-gray-900">
                  {summary.quantidade_vendas}
                </Text>
              </View>

              {/* Ticket médio */}
              <View className="mb-4 w-[48%] rounded-2xl bg-white p-4">
                <Text className="text-sm font-medium text-gray-500">
                  Ticket médio
                </Text>

                <Text
                  numberOfLines={1}
                  className="mt-2 text-xl font-bold text-gray-900"
                >
                  {formatCurrency(summary.ticket_medio)}
                </Text>
              </View>

              {/* Produtos vendidos */}
              <View className="mb-4 w-[48%] rounded-2xl bg-white p-4">
                <Text className="text-sm font-medium text-gray-500">
                  Produtos vendidos
                </Text>

                <Text className="mt-2 text-2xl font-bold text-gray-900">—</Text>
              </View>
            </View>

            {/* Contribuições */}
            <SalesContributionChart data={contributionsByDay} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
