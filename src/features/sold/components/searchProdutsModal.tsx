import { ProductRepository } from "@/features/produtcs/repositories/productRepository";
import { Product } from "@/features/produtcs/types/product";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ProductCardSearch } from "./produtCartSearch";

interface Props {
  visible: boolean;
  onClose: () => void;
  selectProduct: (product: Product) => void;
  setisSarching: () => void;
}

export function SearchProdutsModal({
  visible,
  onClose,
  selectProduct,
  setisSarching,
}: Props) {
  const { lang } = useLanguageStore();
  const db = useSQLiteContext();

  const productRepository = new ProductRepository(db);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchProducts();
    }, 200);

    return () => clearTimeout(timeout);
  }, [query]);

  const searchProducts = async () => {
    const value = query.trim();

    if (!value) {
      setProducts([]);
      return;
    }

    try {
      setLoading(true);

      const result = await productRepository.search(value);

      setProducts(result);
    } catch (error) {
      console.error("Erro ao pesquisar produtos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: Product) => {
    Keyboard.dismiss();
    selectProduct(product);
    handleClose();
  };

  const clearSearch = () => {
    setQuery("");
    setProducts([]);
  };

  const handleClose = () => {
    onClose();
    clearSearch();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <SafeAreaView className="flex-col flex-1 bg-primary">
        <View className="flex-row pr-4 my-4 gap-2 items-center">
          <TouchableOpacity
            onPress={handleClose}
            className=" h-10 items-center justify-center rounded-full"
          >
            <Feather name="chevron-left" size={28} color={colors.secondary} />
          </TouchableOpacity>
          <View className="flex-row flex-1 items-center rounded-2xl bg-white px-4">
            <Feather name="search" size={21} color={colors.border} />

            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder={
                lang === "pt"
                  ? "Nome, código ou código de barras..."
                  : "Name, code or barcode..."
              }
              placeholderTextColor="#9CA3AF"
              className="ml-3 h-14 flex-1 text-base text-gray-900"
              returnKeyType="search"
            />

            {query.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Feather name="x-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            className="p-3 bg-secondary rounded-2xl items-center"
            onPress={setisSarching}
          >
            <Feather name={"camera"} size={22} color={colors.borderDark} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30,
            paddingHorizontal: 10,
            flexGrow: 1,
            backgroundColor: colors.primary,
          }}
          renderItem={({ item }) => (
            <ProductCardSearch
              product={item}
              onPress={() => handleSelectProduct(item)}
              lang={lang}
            />
          )}

          ListEmptyComponent={
            query.trim().length === 0 ? (
              <View className="flex-1 items-center justify-center">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Feather name="search" size={36} color={colors.primary} />
                </View>

                <Text className="text-center text-lg font-bold text-secondary">
                  {lang === "pt" ? "Pesquisar produto" : "Search product"}
                </Text>

                <Text className="mt-2 px-8 text-center text-sm text-gray-500">
                  {lang === "pt"
                    ? "Digite o nome, código ou código de barras do produto."
                    : "Enter the product name, code or barcode."}
                </Text>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                  <Feather name="package" size={36} color={colors.primary} />
                </View>

                <Text className="text-center text-lg font-bold text-secondary">
                  {lang === "pt"
                    ? "Produto não encontrado"
                    : "Product not found"}
                </Text>

                <Text className="mt-2 px-8 text-center text-sm text-gray-500">
                  {lang === "pt"
                    ? `Nenhum produto encontrado para "${query}".`
                    : `No products found for "${query}".`}
                </Text>
              </View>
            )
          }
        />
      </SafeAreaView>
    </Modal>
  );
}
