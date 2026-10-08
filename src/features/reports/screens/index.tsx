import { GeneralHeader } from "@/shared/components/general_header";
import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import SalesContributionChart from "../components/contribuitiosChart";
import { ResumeCard } from "../components/resumeCard";
import ReportsRepository from "../repositories/reportsRepositories";
import {
  CategoryPlusSale,
  ProductPlusSale,
  SalesSummary,
} from "../types/reports";

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

  const [categories, setcategories] = useState<CategoryPlusSale[]>([]);

  const [productsPlusSale, setProductsPlusSale] = useState<ProductPlusSale[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const reportsRepository = new ReportsRepository(db);

        const [salesSummary, salesByDay, salesCategorie, productPlusSale] =
          await Promise.all([
            reportsRepository.getSalesSummary(),
            reportsRepository.getQtdSaleDay(),
            reportsRepository.getCategoriesPlusSale(),
            reportsRepository.getProductsPlusSale(),
          ]);

        setSummary(salesSummary);
        setContributionsByDay(salesByDay);
        setcategories(salesCategorie);
        setProductsPlusSale(productPlusSale);
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
        <Text numberOfLines={1} className="text-2xl font-bold text-secondary">
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
              <ResumeCard
                title={"Faturamento"}
                value={formatCurrency(summary.faturamento)}
              />

              {/* Vendas */}
              <ResumeCard title={"Vendas"} value={summary.quantidade_vendas} />

              {/* Ticket médio */}
              <ResumeCard
                title={"Ticket médio"}
                value={formatCurrency(summary.ticket_medio)}
              />

              {/* Produtos vendidos */}
              <ResumeCard
                title={"Produtos vendidos"}
                value={productsPlusSale.length}
              />
            </View>

            {/* Produtos mais vendidos  */}
            <View className="rounded-2xl bg-white p-5 mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Produtos Mais Vendidos
              </Text>
              <View className="flex-row gap-4 items-center justify-between mb-2 border-b border-border">
                <Text className="flex-1 text-base font-semibold">
                  {t("category", lang)}
                </Text>
                <Text className="text-base text-start font-semibold  w-12">
                  Qtd.
                </Text>
                <Text className=" text-base ml-5 font-semibold">Valor</Text>
              </View>
              <View>
                {productsPlusSale.slice(0, 10).map((item) => (
                  <View
                    key={item.produto_id}

                    className="flex-row items-center gap-4 justify-between"
                  >
                    <Text numberOfLines={1} className="flex-1 text-start">
                      {item.nome}
                    </Text>

                    <Text numberOfLines={1} className="text-center  w-20">
                      {item.quantidade_vendida} de {item.numero_vendas}
                      {t("sale", lang)}
                    </Text>
                    <Text numberOfLines={1} className="text-center w-20">
                      {formatCurrency(item.faturamento)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Vendas por categpria  */}
            <View className="rounded-2xl bg-white p-5 mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Vendas por categorias
              </Text>
              <View className="flex-row gap-4 items-center justify-between mb-2 border-b border-border">
                <Text className="flex-1 text-base font-semibold">
                  {t("category", lang)}
                </Text>
                <Text className="text-base text-start font-semibold  w-12">
                  Qtd.
                </Text>
                <Text className=" text-base ml-5 font-semibold"> Valor </Text>
              </View>
              <View>
                {categories.map((item) => (
                  <View
                    key={item.categoria_id}

                    className="flex-row items-center gap-4 justify-between"
                  >
                    <Text numberOfLines={1} className="flex-1 text-start">
                      {item.categoria}
                    </Text>

                    <Text className="text-center  w-12">
                      {item.quantidade_vendida}
                    </Text>
                    <Text className="text-center w-20">
                      {formatCurrency(item.faturamento)}
                    </Text>
                  </View>
                ))}
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
