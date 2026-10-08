import { Product } from "@/features/produtcs/types/product";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  lang: string;
}

export function ProductCardSearch({
  product,
  onPress,
  lang,
}: ProductCardProps) {
  const outOfStock = product.estoque <= 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={outOfStock}
      className={`mb-3 rounded-2xl border bg-white p-4 ${
        outOfStock ? "border-gray-200 opacity-50" : "border-gray-200"
      }`}
    >
      <View className="flex-row items-center">
        {/* PRODUCT ICON */}
        <View className="h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
          <Feather
            name="package"
            size={26}
            color={outOfStock ? "#9CA3AF" : colors.primary}
          />
        </View>

        {/* PRODUCT INFO */}
        <View className="ml-3 flex-1">
          <Text numberOfLines={2} className="text-base font-bold text-gray-900">
            {product.nome}
          </Text>

          <Text className="mt-1 text-xs text-gray-500">
            {product.codigo_barras}
          </Text>

          <View className="mt-2 flex-row items-center">
            <Text className="text-base font-bold text-primary">
              {product.preco.toFixed(2)} Kz
            </Text>

            <View className="ml-3 rounded-full bg-gray-100 px-2 py-1">
              <Text className="text-xs text-gray-500">
                {product.estoque > 0
                  ? `${product.estoque} ${lang === "pt" ? "em estoque" : "in stock"}`
                  : lang === "pt"
                    ? "Sem estoque"
                    : "Out of stock"}
              </Text>
            </View>
          </View>
        </View>

        {/* ADD */}
        {!outOfStock && (
          <View className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-primary">
            <Feather name="plus" size={22} color={colors.white} />
          </View>
        )}
      </View>
    </Pressable>
  );
}
