import EnterpriseRepository from "@/features/enterprise/repositories/enterpriseRepository";
import { FaturaRepository } from "@/features/faturas/repository/faturaRepository";
import { FaturaParsed } from "@/features/faturas/types/indx";
import { expoPrintAdapter } from "@/features/print/repositories/adpters/expo-print-adapter";
import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SendEmailModal } from "../components/sendEmailModal";

export default function FinishSoldScree() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [fatura, setFatura] = useState<FaturaParsed | null>(null);
  const [loading, setLoading] = useState(false);
  const [openModalEmail, setopenModalEmail] = useState(false);

  const { lang } = useLanguageStore();
  const db = useSQLiteContext();

  const faturaRepository = new FaturaRepository(db);

  const enteproiseRepository = new EnterpriseRepository(db);

  useEffect(() => {
    console.log("Id da factura", id);

    loadFaturaData();
  }, [id]);

  const loadFaturaData = async () => {
    if (!id) return;

    setLoading(true);

    try {
      const res = await faturaRepository.findById(Number(id));

      if (!res) return;

      setFatura(res);
    } catch (error) {
      console.error("Erro ao carregar fatura:", error);
    } finally {
      setLoading(false);
    }
  };

  const share = async () => {
    if (!fatura) return;

    try {
      const company = await enteproiseRepository.getById();
      if (!company) return;

      await expoPrintAdapter.share(fatura.fatura_json, company);
    } catch (error) {
      console.error("Erro ao compartilhar fatura:", error);
    }
  };

  const print = async () => {
    if (!fatura) return;

    router.push({
      pathname: "/(private)/printers",
      params: {
        fatura_json: JSON.stringify(fatura.fatura_json),
      },
    });
  };

  if (loading) {
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <ActivityIndicator color={colors.secondary} size="large" />
      </View>
    );
  }

  if (!fatura) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-4">
        <Feather name="alert-circle" size={40} color={colors.border} />

        <Text className="text-lg font-semibold mt-3">
          {t("InvoiceNotFound", lang)}
        </Text>
      </View>
    );
  }

  const invoice = fatura.fatura_json;

  const items = invoice.items;
  const total = invoice.total;
  const subtotal = invoice.total;
  const discount = invoice.discount ?? 0;

  const formatMoney = (value: number) => {
    return formatCurrency(value);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      className="bg-background"
    >
      {/* Header */}
      <View className="w-full bg-primary items-center justify-center py-6">
        <View className="bg-secondary rounded-full p-3 mb-3">
          <Feather name="check" size={32} color={colors.primary} />
        </View>

        <Text className="text-2xl font-semibold text-secondary">
          {t("SaleCompleted", lang)}
        </Text>

        <Text className="text-secondary mt-1 opacity-80">
          {t("SaleCompletedDescription", lang)}
        </Text>
      </View>

      {/* Ações */}
      <View className="flex-row items-center justify-around py-4">
        <TouchableOpacity
          onPress={share}
          disabled={!fatura}
          className="items-center"
        >
          <View className="bg-primary rounded-full p-4">
            <Feather
              name="share"
              size={24}
              disabled={!fatura}
              color={fatura ? colors.secondary : colors.border}
            />
          </View>

          <Text className="mt-2">{t("share", lang)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setopenModalEmail(true)}
          disabled={!fatura}
          className="items-center"
        >
          <View className="bg-primary rounded-full p-4">
            <Feather name="inbox" size={24} color={colors.secondary} />
          </View>

          <Text className="mt-2">Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={print}
          disabled={!fatura}
          className="items-center"
        >
          <View className="bg-primary rounded-full p-4">
            <Feather name="printer" size={24} color={colors.secondary} />
          </View>

          <Text className="mt-2">{t("Print", lang)}</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 p-4">
        {/* Total */}
        <View className="bg-white rounded-2xl p-5 mb-4 items-center">
          <Text className="text-gray-500 text-sm">{t("SaleTotal", lang)}</Text>

          <Text className="text-3xl font-bold text-primary mt-1">
            {formatMoney(total)}
          </Text>
        </View>

        {/* Informações da fatura */}
        <View className="bg-white rounded-2xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-4">
            {t("InvoiceInformation", lang)}
          </Text>

          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-500">{t("InvoiceNumber", lang)}</Text>

            <Text className="font-semibold">{fatura.numero}</Text>
          </View>

          <View className="flex-row justify-between py-3 border-b border-gray-100">
            <Text className="text-gray-500">{t("Sale", lang)}</Text>

            <Text className="font-semibold">#{fatura.venda_id}</Text>
          </View>

          <View className="flex-row justify-between py-3">
            <Text className="text-gray-500">{t("ID", lang)}</Text>

            <Text className="font-semibold">#{fatura.id}</Text>
          </View>
        </View>

        {/* Produtos */}
        {items.length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-lg font-semibold mb-4">
              {t("Products", lang)}
            </Text>

            {items.map((item, index: number) => {
              return (
                <View
                  key={index}
                  className="flex-row justify-between py-3 border-b border-gray-100"
                >
                  <View className="flex-1 pr-3">
                    <Text className="font-medium">{item.name}</Text>

                    <Text className="text-gray-500 text-sm mt-1">
                      {item.quantity} × {formatMoney(item.price)}
                    </Text>
                  </View>

                  <Text className="font-semibold">
                    {formatMoney(item.price * item.quantity)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Resumo financeiro */}
        <View className="bg-white rounded-2xl p-4 mb-5">
          <Text className="text-lg font-semibold mb-4">
            {t("Summary", lang)}
          </Text>

          <SummaryRow
            label={t("Subtotal", lang)}
            value={formatMoney(subtotal)}
          />

          <SummaryRow
            label={t("Discount", lang)}
            value={`- ${formatMoney(discount)}`}
            valueColor="text-red-500"
          />

          <SummaryRow label={t("Tax", lang)} value={formatMoney(0)} />

          <View className="border-t border-gray-200 mt-3 pt-3">
            <SummaryRow
              label={t("Total", lang)}
              value={formatMoney(total)}
              bold
            />
          </View>
        </View>
      </View>

      <SendEmailModal
        visible={openModalEmail}
        onClose={() => setopenModalEmail(false)}
        faturaDada={fatura.fatura_json}
      />
    </ScrollView>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
  valueColor = "text-black",
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <View className="flex-row justify-between py-2">
      <Text className={bold ? "font-bold text-lg" : "text-gray-600"}>
        {label}
      </Text>

      <Text
        className={`${valueColor} ${
          bold ? "font-bold text-lg" : "font-medium"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}
