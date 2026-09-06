import { RecentSale } from "@/features/home/repositories/dashboardRepository";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SaleCard } from "../components/sale-card";
import { VendasRepository } from "../repositories/vendasRepository";

export default function VendasScreen() {
  const db = useSQLiteContext();
  const vendasRepository = new VendasRepository(db);
  const lang = useLanguageStore((state) => state.lang);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const sales = await vendasRepository.getSales();

      setRecentSales(sales);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <View className="bg-primary py-5 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()}>
          <Feather name="chevron-left" color={colors.secondary} size={30} />
        </Pressable>
        <View className=" pr-5">
          <Text className="text-3xl font-bold text-secondary">
            {t("sale", lang)}s
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10"
      >
        <View className="mt-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-text">
              {t("recentSales", lang)}
            </Text>
          </View>

          {!loading && recentSales.length === 0 && (
            <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-5 py-8">
              <Text className="text-4xl">🧾</Text>

              <Text className="mt-3 font-semibold text-text">
                {t("noSalesYet", lang)}
              </Text>

              <Text className="mt-1 text-center text-sm text-textSecondary">
                {lang === "pt"
                  ? "As suas vendas recentes aparecerão aqui."
                  : "Your recent sales will appear here."}
              </Text>
            </View>
          )}

          {!loading && recentSales.length > 0 && (
            <View className="overflow-hidden gap-2">
              {recentSales.map((sale, index) => (
                <SaleCard sale={sale} key={sale.id} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
