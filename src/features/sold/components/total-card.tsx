import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { Pressable, Text, View } from "react-native";

interface Props {
  handleFinishSale: () => void;
  clearCart: () => void;
  productsLength: number;
  finishingSale: boolean;
  total: number;
}

export const TotalCard = ({
  clearCart,
  handleFinishSale,
  finishingSale,
  productsLength,
  total,
}: Props) => {
  const { lang } = useLanguageStore();

  return (
    <View className="mx-5 mb-6 rounded-3xl bg-primary p-4">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-sm text-white/70">{t("Saletotal", lang)}</Text>

          <Text className="mt-1 text-3xl font-bold text-white">
            {formatCurrency(total)}
          </Text>
        </View>

        {productsLength > 0 && (
          <Pressable
            onPress={clearCart}
            disabled={finishingSale}
            className="rounded-xl bg-white/10 px-4 py-3 active:bg-white/20"
          >
            <Text className="font-semibold text-white">
              {lang === "pt" ? "Limpar" : "Clear"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* FINALIZAR */}

      <Pressable
        disabled={productsLength === 0 || finishingSale}
        onPress={handleFinishSale}
        className={`mt-2 items-center rounded-2xl py-4 ${
          productsLength > 0 && !finishingSale ? "bg-secondary" : "bg-white/20"
        }`}
      >
        <Text
          className={`font-bold ${
            productsLength > 0 && !finishingSale
              ? "text-primary"
              : "text-white/50"
          }`}
        >
          {finishingSale ? t("Completing", lang) : t("CompleteSale", lang)}
        </Text>
      </Pressable>
    </View>
  );
};
