import formatCurrency from "@/shared/format-currecy";
import formatDate from "@/shared/formate-date";
import { useLanguageStore } from "@/store/i18n.store";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { RecentSale } from "../repositories/vendasRepository";
interface Porops {
  sale: RecentSale;
}
export const SaleCard = ({ sale }: Porops) => {
  const lang = useLanguageStore((stt) => stt.lang);

  function navigate() {
    router.push(`/(private)/vendas/${sale.id}`);
  }

  return (
    <TouchableOpacity
      onPress={navigate}
      className="flex-row items-center px-4 py-4 bg-slate-200 rounded-xl"
    >
      {/* ÍCONE */}

      <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary">
        <Text className="text-xl">🧾</Text>
      </View>

      {/* INFORMAÇÃO */}

      <View className="flex-1">
        <Text className="font-semibold text-text">
          {lang === "pt" ? `Venda #${sale.id}` : `Sale #${sale.id}`}
        </Text>

        <Text className="mt-1 text-xs text-textSecondary">
          {formatDate(sale.data_venda)}
        </Text>
      </View>

      {/* TOTAL */}

      <View className="items-end">
        <Text className="font-bold text-primary">
          {formatCurrency(sale.total)}
        </Text>

        <Text className="mt-1 text-xs text-textMuted">{sale.status}</Text>
      </View>
    </TouchableOpacity>
  );
};
