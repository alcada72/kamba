import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useLanguageStore } from "@/store/i18n.store";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";

import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/header";
import { ProductItem } from "../components/product-item";
import { ProductRepository } from "../repositories/productRepository";
import { Product } from "../types/product";

export default function ProductsScreen() {
  const { lang } = useLanguageStore();

  const db = useSQLiteContext();

  const productRepository = useMemo(() => new ProductRepository(db), [db]);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const result = await productRepository.findAll();

        setProducts(result);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);

        setError(
          lang === "pt"
            ? "Não foi possível carregar os produtos."
            : "Could not load products.",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [productRepository, lang],
  );

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const name = product.nome?.toLowerCase() ?? "";

      const barcode = product.codigo_barras?.toLowerCase() ?? "";

      return name.includes(query) || barcode.includes(query);
    });
  }, [products, search]);

  const lowStockCount = useMemo(() => {
    return products.filter(
      (product) => product.estoque <= product.estoque_minimo,
    ).length;
  }, [products]);

  const handleProductPress = (product: Product) => {
    router.push(`/(private)/produtcs/${product.id}`);
  };

  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <ProductItem
        handleProductPress={(item) => handleProductPress(item)}
        lang={lang}
        item={item}
      />
    );
  };

  const ListHeader = () => {
    if (products.length === 0) {
      return null;
    }

    return (
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-textSecondary">
          {filteredProducts.length}{" "}
          {lang === "pt" ? "produto(s)" : "product(s)"}
        </Text>

        {lowStockCount > 0 && (
          <View className="flex-row items-center">
            <View className="mr-1.5 h-2 w-2 rounded-full bg-error" />

            <Text className="text-xs font-semibold text-error">
              {lowStockCount} {lang === "pt" ? "stock baixo" : "low stock"}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (error && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <StatusBar style="light" />

        <Header
          lang={lang}
          productsCount={products.length}
          search={search}
          setSearch={setSearch}
        />

        <View className="flex-1 items-center justify-center px-6">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
            <Feather name="alert-circle" size={30} color="#DC2626" />
          </View>

          <Text className="mt-4 text-center text-lg font-bold text-text">
            {lang === "pt" ? "Ocorreu um erro" : "Something went wrong"}
          </Text>

          <Text className="mt-2 text-center text-sm text-textSecondary">
            {error}
          </Text>

          <Pressable
            onPress={() => loadProducts()}
            className="mt-6 rounded-2xl bg-primary px-6 py-3"
          >
            <Text className="font-bold text-white">
              {lang === "pt" ? "Tentar novamente" : "Try again"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />

      <Header
        lang={lang}
        productsCount={products.length}
        search={search}
        setSearch={setSearch}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#063023" />

          <Text className="mt-3 text-sm text-textSecondary">
            {lang === "pt" ? "A carregar produtos..." : "Loading products..."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pt-5 pb-10"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadProducts(true)}
              tintColor="#063023"
            />
          }
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={
            <EmptyState
              lang={lang}
              search={search}
              onAdd={() => router.push("/(private)/produtcs/create")}
            />
          }
        />
      )}
    </View>
  );
}
