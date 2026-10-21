import { Product } from "@/features/produtcs/types/product";
import formatCurrency from "@/shared/format-currecy";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  isSelected?: boolean;
  lang: string;
}

export function ProductCardSearch({
  product,
  onPress,
  isSelected = false,
  lang,
}: Readonly<ProductCardProps>) {
  const isPortuguese = lang === "pt";
  const outOfStock = product.estoque <= 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={outOfStock}
      accessibilityRole="button"
      accessibilityState={{
        selected: isSelected,
        disabled: outOfStock,
      }}
      accessibilityLabel={`${product.nome}, ${formatCurrency(product.preco)}`}
      className={`mb-3 overflow-hidden rounded-2xl border p-4 ${
        outOfStock
          ? "border-gray-200 bg-gray-50 opacity-60"
          : isSelected
            ? "border-primary bg-gray-50"
            : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-center">
        {/* Ícone do produto */}
        <View
          className={`h-14 w-14 items-center justify-center rounded-xl ${
            isSelected ? "bg-primary/10" : "bg-gray-100"
          }`}
        >
          <Feather
            name="package"
            size={25}
            color={
              outOfStock
                ? "#9CA3AF"
                : isSelected
                  ? colors.primary
                  : colors.border
            }
          />
        </View>

        {/* Informações do produto */}
        <View className="ml-3 flex-1">
          <Text numberOfLines={2} className="text-base font-bold text-gray-900">
            {product.nome}
          </Text>

          <View className="mt-2 flex-row flex-wrap items-center gap-2">
            <Text className="text-base font-bold text-primary">
              {formatCurrency(product.preco)}
            </Text>

            <View
              className={`rounded-full px-2 py-1 ${
                outOfStock
                  ? "bg-red-50"
                  : product.estoque <= 5
                    ? "bg-amber-50"
                    : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  outOfStock
                    ? "text-red-600"
                    : product.estoque <= 5
                      ? "text-amber-700"
                      : "text-gray-600"
                }`}
              >
                {outOfStock
                  ? isPortuguese
                    ? "Sem stock"
                    : "Out of stock"
                  : `${product.estoque} ${
                      isPortuguese ? "em stock" : "in stock"
                    }`}
              </Text>
            </View>
          </View>
        </View>

        {/* Indicador de seleção */}
        <View
          className={`ml-3 h-10 w-10 items-center justify-center rounded-full ${
            outOfStock
              ? "bg-gray-200"
              : isSelected
                ? "bg-secondary"
                : "border border-gray-200 bg-white"
          }`}
        >
          <Feather
            name={isSelected ? "check" : "plus"}
            size={21}
            color={
              outOfStock
                ? "#9CA3AF"
                : isSelected
                  ? colors.white
                  : colors.primary
            }
          />
        </View>
      </View>
    </Pressable>
  );
}
