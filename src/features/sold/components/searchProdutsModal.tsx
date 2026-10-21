import { ProductRepository } from "@/features/produtcs/repositories/productRepository";
import { Product } from "@/features/produtcs/types/product";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
  selectProduct: (products: Product[]) => void;
  setisSarching: () => void;
}

export function SearchProdutsModal({
  visible,
  onClose,
  selectProduct,
  setisSarching,
}: Readonly<Props>) {
  const { lang } = useLanguageStore();
  const db = useSQLiteContext();

  const repository = useMemo(() => new ProductRepository(db), [db]);

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const isPortuguese = lang === "pt";

  // Limpa os estados quando o modal fecha.
  useEffect(() => {
    if (visible) return;

    setQuery("");
    setProducts([]);
    setSelectedProducts([]);
    setLoading(false);
  }, [visible]);

  // Pesquisa com debounce e proteção contra resultados antigos.
  useEffect(() => {
    if (!visible) return;

    let cancelled = false;

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const value = query.trim();

        const result = value
          ? await repository.search(value)
          : await repository.findWithLimit(20);

        if (!cancelled) {
          setProducts(result);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Erro ao carregar produtos:", error);
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [visible, query, repository]);

  const toggleProduct = (product: Product) => {
    Keyboard.dismiss();
    setSelectedProducts((current) => {
      const alreadySelected = current.some((item) => item.id === product.id);

      if (alreadySelected) {
        return current.filter((item) => item.id !== product.id);
      }

      return [...current, product];
    });
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  const handleConfirm = () => {
    if (selectedProducts.length === 0) return;

    Keyboard.dismiss();
    selectProduct(selectedProducts);
    handleClose();
  };

  const clearSearch = () => {
    setQuery("");
  };

  const renderEmpty = () => {
    if (loading) return null;

    const hasQuery = query.trim().length > 0;

    return (
      <View className="flex-1 items-center justify-center px-6 py-12">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Feather
            name={hasQuery ? "package" : "search"}
            size={34}
            color={colors.primary}
          />
        </View>

        <Text className="text-center text-lg font-bold text-secondary">
          {hasQuery
            ? isPortuguese
              ? "Produto não encontrado"
              : "Product not found"
            : isPortuguese
              ? "Nenhum produto disponível"
              : "No products available"}
        </Text>

        <Text className="mt-2 text-center text-sm text-gray-500">
          {hasQuery
            ? isPortuguese
              ? `Nenhum produto encontrado para "${query.trim()}".`
              : `No products found for "${query.trim()}".`
            : isPortuguese
              ? "Digite o nome, código ou código de barras do produto."
              : "Enter the product name, code or barcode."}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
      onShow={() => {
        // O TextInput com autoFocus abre o teclado ao mostrar o modal.
      }}
    >
      <SafeAreaView className="flex-1 bg-primary">
        {/* Cabeçalho */}
        <View className="my-3 flex-row items-center gap-2 mx-4">
          <View className="h-14 flex-1 flex-row items-center rounded-2xl bg-white px-4">
            <Feather name="search" size={20} color={colors.border} />

            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder={
                isPortuguese
                  ? "Nome, código ou código de barras..."
                  : "Name, code or barcode..."
              }
              placeholderTextColor="#9CA3AF"
              className="ml-3 h-14 flex-1 text-base text-gray-900"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              accessibilityLabel={
                isPortuguese ? "Pesquisar produtos" : "Search products"
              }
            />

            {query.length > 0 && (
              <TouchableOpacity
                onPress={clearSearch}
                accessibilityRole="button"
                accessibilityLabel={
                  isPortuguese ? "Limpar pesquisa" : "Clear search"
                }
                hitSlop={10}
              >
                <Feather name="x-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
          {selectedProducts.length === 0 && (
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setisSarching();
                handleClose();
              }}
              accessibilityRole="button"
              accessibilityLabel={
                isPortuguese ? "Pesquisar com câmera" : "Search with camera"
              }
              className="items-center justify-center rounded-2xl bg-secondary p-3"
            >
              <Feather name="camera" size={22} color={colors.borderDark} />
            </TouchableOpacity>
          )}
        </View>

        {/* Resultados */}
        <View className="flex-1">
          {loading && (
            <View className="flex-row items-center justify-center py-3">
              <ActivityIndicator color={colors.secondary} />
              <Text className="ml-2 text-sm text-secondary">
                {isPortuguese ? "A pesquisar..." : "Searching..."}
              </Text>
            </View>
          )}

          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
              paddingHorizontal: 10,
              flexGrow: 1,
            }}
            renderItem={({ item }) => {
              const isSelected = selectedProducts.some(
                (product) => product.id === item.id,
              );

              return (
                <ProductCardSearch
                  product={item}
                  onPress={() => toggleProduct(item)}
                  isSelected={isSelected}
                  lang={lang}
                />
              );
            }}
            ListEmptyComponent={renderEmpty}
          />
        </View>

        {/* Confirmação da seleção */}
        <View className="border-t border-gray-200 bg-white px-4 py-3">
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={selectedProducts.length === 0}
            accessibilityRole="button"
            accessibilityLabel={
              isPortuguese
                ? `Adicionar ${selectedProducts.length} produtos`
                : `Add ${selectedProducts.length} products`
            }
            className={`h-12 flex-row items-center justify-center rounded-xl ${
              selectedProducts.length > 0 ? "bg-secondary" : "bg-gray-300"
            }`}
          >
            <Feather name="check" size={19} color="#FFFFFF" />

            <Text className="ml-2 font-bold text-white">
              {isPortuguese
                ? `Adicionar (${selectedProducts.length})`
                : `Add (${selectedProducts.length})`}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
