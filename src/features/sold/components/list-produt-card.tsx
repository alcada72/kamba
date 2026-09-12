import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { CartProduct } from "../types/sold";

type Props = {
  product: CartProduct;

  removeProduct: () => void;
  showBorder: boolean;
  addQtd?: () => void;
  rmQtd?: () => void;
};

export default function ListProdutCart({
  product,
  removeProduct,
  showBorder,
  addQtd,
  rmQtd,
}: Props) {
  const lang = useLanguageStore((state) => state.lang);

  return (
    <View>
      <View className="flex-row items-center px-4 py-4 bg-green-200">
        <View className="mr-3 h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-green-200">
          <Text className="text-xl">📦</Text>
        </View>

        <View className="flex-1">
          <Text numberOfLines={1} className="font-semibold text-text">
            {product.name}
          </Text>

          <Text className="mt-1 text-xs text-textMuted">
            {product.barcode ?? "-"}
          </Text>

          <Text className="mt-1 text-sm text-textSecondary">
            {product.quantity} × {formatCurrency(product.price)}
          </Text>
        </View>

        <View className="flex-row justify-between gap-2 items-center mr-4 rounded-full ">
          <TouchableOpacity onPress={() => addQtd?.()}>
            <Feather color={colors.success} name="plus-circle" size={20} />
          </TouchableOpacity>
          <Text className="text-secondary border rounded-full bg-primary items-center px-3 text-lg font-black ">
            {product.quantity}
          </Text>
          <TouchableOpacity onPress={() => rmQtd?.()}>
            <Feather color={colors.error} name="minus-circle" size={20} />
          </TouchableOpacity>
        </View>

        <View className="items-end">
          <Text className="font-bold text-primary">
            {formatCurrency(product.price * product.quantity)}
          </Text>

          <Pressable onPress={removeProduct} className="mt-2">
            <Text className="text-xs font-semibold text-error">
              {t("remove", lang)}
            </Text>
          </Pressable>
        </View>
      </View>

      {showBorder && <View className="ml-4 h-px bg-border" />}
    </View>
  );
}
