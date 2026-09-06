import formatCurrency from "@/shared/format-currecy";
import formatDate from "@/shared/formate-date";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { VendasRepository } from "../repositories/vendasRepository";
import { Venda } from "../types";

export default function VendasDetalisScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lang = useLanguageStore((stt) => stt.lang);
  const db = useSQLiteContext();
  const vendasRepository = new VendasRepository(db);

  const [vendaData, setVendaData] = useState<Venda | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const result = await vendasRepository.getSaleById(Number(id));

      setVendaData(result);
    } catch (error) {
      console.log("Erro ao carregar venda:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!vendaData) {
    return (
      <View className="flex-1 bg-background items-center justify-center px-6">
        <Feather name="file-text" size={48} color={colors.textSecondary} />

        <Text className="text-xl font-bold text-primary mt-4">
          Venda não encontrada
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">{t("back", lang)}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* HEADER */}
      <View className="py-2 bg-primary">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className=" rounded-full bg-card items-center justify-center"
          >
            <Feather name="chevron-left" size={30} color={colors.secondary} />
          </Pressable>

          <View className="ml-3">
            <Text className="text-2xl font-bold text-secondary">
              {t("sale", lang)} #{vendaData.id}
            </Text>

            <Text className="text-sm text-textSecondary mt-1">
              {formatDate(vendaData.data_venda)}
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        {/* STATUS */}
        <View className="px-5 mt-6">
          <View className="bg-card rounded-2xl p-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-textSecondary">
                  {t("statusSale", lang)}
                </Text>

                <Text className="text-xl font-bold text-primary mt-1">
                  {vendaData.status}
                </Text>
              </View>

              <View className="w-12 h-12 rounded-full bg-green-100 items-center justify-center">
                <Feather name="check" size={24} color="#16A34A" />
              </View>
            </View>
          </View>
        </View>

        {/* PRODUTOS */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-bold text-primary mb-3">
            {t("products", lang)}
          </Text>

          <View className="overflow-hidden rounded-2xl border border-border bg-surface">
            {vendaData.itens.map((item, index) => (
              <View
                key={item.id}
                className={`p-4 ${
                  index !== vendaData.itens.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <View className="flex-row justify-between pb {index < vendaData.itens.length - 1 && (">
                  <View className="flex-1 pr-4">
                    <Text
                      className="text-base font-bold text-primary"
                      numberOfLines={2}
                    >
                      {item.produto.nome}
                    </Text>

                    <Text className="text-sm text-textSecondary mt-1">
                      {item.quantidade} x {formatCurrency(item.preco_unitario)}
                    </Text>
                  </View>

                  <Text className="text-base font-bold text-primary">
                    {formatCurrency(item.subtotal)}
                  </Text>
                </View>
                {index < vendaData.itens.length - 1 && (
                  <View className="ml-4 h-px bg-border pt-1" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* RESUMO */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-bold text-primary mb-3">
            {t("summary", lang)}
          </Text>

          <View className="bg-card rounded-2xl p-5">
            <View className="flex-row justify-between mb-3">
              <Text className="text-textSecondary">Subtotal</Text>

              <Text className="text-primary font-semibold">
                {formatCurrency(vendaData.total + vendaData.desconto)}
              </Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <Text className="text-textSecondary">Desconto</Text>

              <Text className="text-red-500 font-semibold">
                - {formatCurrency(vendaData.desconto)}
              </Text>
            </View>

            <View className="border-t border-border pt-4 flex-row justify-between">
              <Text className="text-lg font-bold text-primary">Total</Text>

              <Text className="text-xl font-bold text-primary">
                {formatCurrency(vendaData.total)}
              </Text>
            </View>
          </View>
        </View>

        {/* FATURA */}
        {vendaData.fatura && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-bold text-primary mb-3">
              {t("invoice", lang)}
            </Text>

            <View className="bg-card rounded-2xl p-5">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-sm text-textSecondary">
                    {t("invoiceNumber", lang)}
                  </Text>

                  <Text className="text-lg font-bold text-primary mt-1">
                    {vendaData.fatura.numero ?? "-"}
                  </Text>
                </View>

                <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                  <Feather name="file-text" size={20} color={colors.primary} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* PAGAMENTO - caso esteja dentro do JSON da fatura */}
        {/*         {vendaData.fatura?.dados && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-bold text-primary mb-3">
              Pagamento
            </Text>

            <View className="bg-card rounded-2xl p-5">
              <View className="flex-row justify-between mb-3">
                <Text className="text-textSecondary">
                  Forma de pagamento
                </Text>

                <Text className="font-semibold text-primary">
                  {vendaData.fatura.dados.paymentMethod}
                </Text>
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-textSecondary">
                  Valor pago
                </Text>

                <Text className="font-semibold text-primary">
                  {formatCurrency(
                    vendaData.fatura.dados.paidAmount
                  )}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-textSecondary">
                  Troco
                </Text>

                <Text className="font-semibold text-green-600">
                  {formatCurrency(
                    vendaData.fatura.fatura_json.change
                  )}
                </Text>
              </View>
            </View>
          </View>
        )} */}
      </ScrollView>
    </View>
  );
}
