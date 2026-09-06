import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import { ScrollView, Text, View } from "react-native";
import { CartProduct } from "../types/sold";
import ListProdutCart from "./list-produt-card";

interface Props {
  removeProduct: (id: number | string) => void;
  rmQtd: (id: number | string) => void;
  addQtd: (id: number | string) => void;
  products: CartProduct[];
}

export const ListProdutsCart = ({
  products,
  removeProduct,
  addQtd,
  rmQtd,
}: Props) => {
  const lang = useLanguageStore((state) => state.lang);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerClassName="pb-8"
    >
      <View className="mt-7 px-5">
        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-text">
            {t("products", lang)}
          </Text>

          <Text className="text-sm text-textSecondary">
            {products.length} {lang === "pt" ? "item(ns)" : "item(s)"}
          </Text>
        </View>

        {products.length === 0 ? (
          <View className="items-center rounded-2xl border border-dashed border-border bg-surface px-6 py-10">
            <Text className="text-3xl">🛒</Text>

            <Text className="mt-3 text-center font-semibold text-text">
              {lang === "pt"
                ? "Nenhum produto adicionado"
                : "No products added"}
            </Text>

            <Text className="mt-1 text-center text-sm text-textSecondary">
              {lang === "pt"
                ? "Leia um código de barras para adicionar um produto."
                : "Scan a barcode to add a product."}
            </Text>
          </View>
        ) : (
          <View className="overflow-hidden rounded-2xl border border-border bg-surface">
            {products.map((product, index) => (
              <ListProdutCart
                key={product.id}
                product={product}
                removeProduct={() => removeProduct(product.id)}
                showBorder={index < products.length - 1}
                addQtd={() => addQtd?.(product.id)}
                rmQtd={() => rmQtd?.(product.id)}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};
