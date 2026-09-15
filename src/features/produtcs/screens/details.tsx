import { ProductRepository } from "@/features/produtcs/repositories/productRepository";
import { Product } from "@/features/produtcs/types/product";
import formatCurrency from "@/shared/format-currecy";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  const db = useSQLiteContext();
  const lang = useLanguageStore((s) => s.lang);
  const productRepository = new ProductRepository(db);

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      if (!id) return;

      setLoading(true);

      const result = await productRepository.findById(Number(id));

      setProduct(result);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteProduct = () => {
    if (!id) return;
    try {
      Alert.alert(
        lang === "pt" ? "Deletar Produto" : "Delete Product",

        `${product?.nome}\n${formatCurrency(Number(product?.preco))}\n ${product?.estoque} ${product?.unit} em estoque`,

        [
          {
            text: t("cancel", lang),
            style: "cancel",
          },
          {
            text: t("delete", lang),
            onPress: async () => {
              await productRepository.delete(Number(id));
              router.back();
            },
          },
        ],
      );
    } catch (error) {
      console.log("Erro ao deletar", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#063023" />
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-5">
        <Text className="text-lg font-bold text-text">
          Produto não encontrado
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="mt-5 rounded-xl bg-primary px-6 py-3"
        >
          <Text className="font-bold text-white">Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex gap-2 pt-6 items-center w-full flex-row">
        <Pressable onPress={() => router.back()}>
          <Feather name="chevron-left" size={28} color={colors.primary} />
        </Pressable>
        <View>
          <Text className="text-2xl font-bold text-primary">
            {product.nome}
          </Text>

          <Text className="mt-2 text-textSecondary">
            Código: {product.codigo_barras || "Sem código"}
          </Text>
        </View>
      </View>

      <View className="px-5 ">
        <View className="mt-6 rounded-2xl bg-surface p-5">
          <Text className="text-sm text-textSecondary">Preço de venda</Text>

          <Text className="mt-1 text-2xl font-bold text-primary">
            {formatCurrency(product.preco)}
          </Text>

          <Text className="mt-5 text-sm text-textSecondary">Estoque</Text>

          <Text className="mt-1 text-xl font-bold text-text">
            {product.estoque} {product.unit ?? ""}
          </Text>
        </View>

        <Pressable
          onPress={() =>
            router.push({
              pathname: "/(private)/produtcs/create",
              params: {
                id,
              },
            })
          }
          className="mt-6 items-center rounded-2xl bg-primary py-4"
        >
          <Text className="font-bold text-white">
            {t("edit", lang)} {t("product", lang)}
          </Text>
        </Pressable>
        <Pressable
          onPress={handleDeleteProduct}
          className="mt-4 items-center rounded-2xl bg-red-700 py-4"
        >
          <Text className="font-bold text-white">
            {t("delete", lang)} {t("product", lang)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
