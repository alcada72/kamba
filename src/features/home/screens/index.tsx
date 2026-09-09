import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import {
  DashboardRepository,
  RecentSale,
} from "@/features/home/repositories/dashboardRepository";
import { useSQLiteContext } from "expo-sqlite";

import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { User } from "@/features/profile/types/user";
import formatCurrency from "@/shared/format-currecy";
import { FastAcessItem } from "../components/falstAcess-item";
import { HomeHeader } from "../components/header";
import { SaleCardHome } from "../components/sale-card";

export default function HomeScreen() {
  const { lang } = useLanguageStore();

  const db = useSQLiteContext();

  const dashboardRepository = new DashboardRepository(db);
  const userRepository = new UserRepository(db);

  const [todaySalesTotal, setTodaySalesTotal] = useState(0);

  const [todaySalesCount, setTodaySalesCount] = useState(0);

  const [totalProducts, setTotalProducts] = useState(0);

  const [userData, setUserData] = useState<User | null>(null);

  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, []),
  );

  async function loadDashboard() {
    try {
      setLoading(true);

      const [summary, sales, user] = await Promise.all([
        dashboardRepository.getSummary(),
        dashboardRepository.getRecentSales(15),
        userRepository.getFrist(),
      ]);

      setTodaySalesTotal(summary.todaySalesTotal);

      setTodaySalesCount(summary.todaySalesCount);

      setTotalProducts(summary.totalProducts);
      setUserData(user);
      setRecentSales(sales);
    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <HomeHeader user={userData} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-10"
      >
        <View className="mt-8">
          <Text className="mb-4 text-xl font-bold text-text">
            {t("quickAccess", lang)}
          </Text>

          <View className="flex-row flex-wrap items-center gap-2">
            <FastAcessItem
              icon="shopping-cart"
              label={t("newSale", lang)}
              onPress={() => router.push("/(private)/sold")}
            />

            <FastAcessItem
              icon="package"
              label={t("products", lang)}
              onPress={() => router.push("/(private)/produtcs")}
            />

            <FastAcessItem
              icon="users"
              label={t("customers", lang)}
              onPress={() => console.log("Clientes")}
            />

            <FastAcessItem
              icon="bar-chart-2"
              label={t("reports", lang)}
              onPress={() => console.log("Relatórios")}
            />
          </View>
        </View>

        <View className="mt-8">
          <Text className="mb-4 text-xl font-bold text-text">
            {t("summary", lang)}
          </Text>

          {loading ? (
            <View className="items-center py-8">
              <ActivityIndicator />
            </View>
          ) : (
            <View className="flex-row gap-3">
              {/* VENDAS */}

              <View className="flex-1 rounded-2xl bg-primary p-4">
                <Text className="text-sm text-secondary/70">
                  {t("todaysSales", lang)}
                </Text>

                <Text className="mt-2 text-2xl font-bold text-secondary">
                  {formatCurrency(todaySalesTotal)}
                </Text>

                <Text className="mt-1 text-xs text-secondary/60">
                  {todaySalesCount} {lang === "pt" ? "vendas" : "sales"}
                </Text>
              </View>

              {/* PRODUTOS */}

              <View className="flex-1 rounded-2xl bg-secondary p-4">
                <Text className="text-sm text-primary/70">
                  {t("products", lang)}
                </Text>

                <Text className="mt-2 text-2xl font-bold text-primary">
                  {totalProducts}
                </Text>

                <Text className="mt-1 text-xs text-primary/60">
                  {lang === "pt" ? "cadastrados" : "registered"}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="mt-8">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-xl font-bold text-text">
              {t("recentSales", lang)}
            </Text>

            {recentSales.length > 0 && (
              <Pressable onPress={() => router.navigate("/(private)/vendas")}>
                <Text className="text-xl font-semibold text-primary">
                  {t("viewAll", lang)}
                </Text>
              </Pressable>
            )}
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
            <View className="overflow-hidden rounded-2xl border border-border bg-surface">
              {recentSales.map((sale, index) => (
                <SaleCardHome
                  key={sale.id}
                  sale={sale}
                  showBorder={index < recentSales.length - 1}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
