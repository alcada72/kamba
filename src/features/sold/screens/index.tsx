import { useLanguageStore } from "@/store/i18n.store";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, Text, TouchableOpacity, View } from "react-native";

import { FaturaRepository } from "@/features/faturas/repository/faturaRepository";
import { DadosFatura } from "@/features/print/types";
import { ProductRepository } from "@/features/produtcs/repositories/productRepository";
import { Product } from "@/features/produtcs/types/product";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { ListProdutsCart } from "../components/list-produts";
import { SearchProdutsModal } from "../components/searchProdutsModal";
import { TotalCard } from "../components/total-card";
import { SaleRepository } from "../repositories/saleRepository";
import { CartProduct } from "../types/sold";

export default function SoldScreen() {
  const { lang } = useLanguageStore();

  const db = useSQLiteContext();

  const productRepository = new ProductRepository(db);
  const saleRepository = new SaleRepository(db);
  const faturaRepository = new FaturaRepository(db);

  const [permission, requestPermission] = useCameraPermissions();

  const [products, setProducts] = useState<CartProduct[]>([]);
  const [query, setQuery] = useState("");

  const [scanning, setScanning] = useState(true);

  const [finishingSale, setFinishingSale] = useState(false);
  const [torch, setTorch] = useState(false);
  const [isSarching, setisSarching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const total = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  const handleBarcodeScanned = async ({
    data,
    type,
  }: {
    data: string;
    type: string;
  }) => {
    if (!scanning || finishingSale) {
      return;
    }

    setScanning(false);

    try {
      const product = await productRepository.findByBarcode(data);

      if (!product) {
        Alert.alert(
          lang === "pt" ? "Produto não encontrado" : "Product not found",

          lang === "pt"
            ? `Nenhum produto foi encontrado para o código:\n${data}`
            : `No product was found for barcode:\n${data}`,

          [
            {
              text: "OK",
              onPress: () => {
                setTimeout(() => {
                  setScanning(true);
                }, 500);
              },
            },
          ],
        );

        return;
      }

      handleSelectProduct(product);

      Alert.alert(
        lang === "pt" ? "Produto adicionado" : "Product added",

        `${product.nome}\n${product.preco.toFixed(2)} Kz`,

        [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                setScanning(true);
              }, 500);
            },
          },
        ],
      );
    } catch (error) {
      console.error("Erro ao procurar produto:", error);

      Alert.alert(
        lang === "pt" ? "Erro" : "Error",

        lang === "pt"
          ? "Não foi possível consultar o produto."
          : "Could not find the product.",

        [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                setScanning(true);
              }, 500);
            },
          },
        ],
      );
    }
  };

  useEffect(() => {
    handleRequestPermtion();
    return () => {
      setTorch(false);
    };
  }, []);

  const handleRequestPermtion = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
  };

  const removeProduct = (id: number) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  const handleSelectProduct = (product: Product) => {
    if (product.ativo !== 1) {
      Alert.alert(
        lang === "pt" ? "Produto indisponível" : "Product unavailable",

        lang === "pt"
          ? `${product.nome} está desativado.`
          : `${product.nome} is inactive.`,

        [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                setScanning(true);
              }, 500);
            },
          },
        ],
      );

      return;
    }

    if (product.estoque <= 0) {
      Alert.alert(
        lang === "pt" ? "Sem estoque" : "Out of stock",

        lang === "pt"
          ? `${product.nome} não possui estoque disponível.`
          : `${product.nome} is out of stock.`,

        [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                setScanning(true);
              }, 500);
            },
          },
        ],
      );

      return;
    }
    setProducts((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        if (existing.quantity >= product.estoque) {
          return current;
        }

        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        );
      }

      return [
        ...current,
        {
          id: product.id,
          barcode: product.codigo_barras,
          name: product.nome,
          price: product.preco,
          quantity: 1,
        },
      ];
    });
  };

  const addQdt = async (id: number | string) => {
    const product = await productRepository.findById(Number(id));
    if (!product) return;

    setProducts((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (!existing) {
        return [
          ...current,
          {
            id: product.id,
            barcode: product.codigo_barras,
            name: product.nome,
            price: product.preco,
            quantity: 1,
          },
        ];
      }

      if (existing.quantity >= product.estoque) {
        return current;
      }

      return current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item,
      );
    });
  };

  const rmQdt = async (id: number | string) => {
    const product = await productRepository.findById(Number(id));
    if (!product) return;

    setProducts((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (!existing) {
        return current;
      }

      if (existing.quantity <= 1) {
        return current.filter((item) => item.id !== product.id);
      }

      return current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item,
      );
    });
  };

  const clearCart = () => {
    setProducts([]);
  };

  const clearSearch = () => {
    setQuery("");
  };

  const handleFinishSale = async () => {
    if (products.length === 0 || finishingSale) {
      return;
    }

    try {
      setFinishingSale(true);

      setScanning(false);

      const result = await saleRepository.createSale({
        items: products.map((product) => ({
          productId: product.id,
          quantity: product.quantity,
          price: product.price,
        })),

        desconto: 0,

        pagamento: {
          metodo: "dinheiro",
          valor: total,
        },
      });

      const sale: DadosFatura = {
        saleId: result.saleId,
        date: new Date().toLocaleString("pt-AO"),

        items: products.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
          subtotal: product.price * product.quantity,
        })),

        total,

        paymentMethod: "dinheiro",
        paidAmount: total,
        change: 0,
      };

      const fId = await faturaRepository.create({
        venda_id: sale.saleId,
        numero: `00${sale.saleId}`,
        fatura_json: sale,
      });

      setProducts([]);
      setScanning(true);

      router.replace({
        pathname: "/(private)/sold/finish",
        params: {
          id: String(fId),
        },
      });
    } catch (error) {
      console.error("Erro ao finalizar venda:", error);

      Alert.alert(
        lang === "pt"
          ? "Não foi possível finalizar"
          : "Could not complete sale",

        error instanceof Error
          ? error.message
          : lang === "pt"
            ? "Ocorreu um erro ao finalizar a venda."
            : "An error occurred while completing the sale.",

        [
          {
            text: "OK",
            onPress: () => {
              setScanning(true);
            },
          },
        ],
      );
    } finally {
      setFinishingSale(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-textSecondary">
          {lang === "pt"
            ? "A verificar permissões..."
            : "Checking permissions..."}
        </Text>
      </View>
    );
  }

  /*   if (!permission.granted) {
    return <NopermissionCamera />;
  } */

  return (
    <View className="flex-1 bg-background">
      <View
        style={{ display: isSarching ? "none" : "flex" }}

        className="flex-row items-center justify-between w-full px-6 absolute top-2 left-0 z-10"
      >
        <TouchableOpacity
          className="p-3 bg-primary rounded-full items-center"
          onPress={() => setTorch(!torch)}
        >
          <Feather
            name={torch ? "sun" : "zap"}
            size={22}
            color={torch ? colors.secondary : colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 bg-primary rounded-full items-center"

          onPress={() => setisSarching(!isSarching)}
        >
          <Feather name={"search"} size={22} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View className="overflow-hidden rounded-b-3xl bg-primary">
        {isSarching ? (
          <View className="flex-row px-4 pb-4 gap-2">
            <Pressable
              onPress={() => setShowModal(true)}
              className="flex-row flex-1 items-center h-14  rounded-2xl bg-white px-4"
            >
              <Feather name="search" size={21} color={colors.border} />

              <Text className="ml-3 flex-1 text-base  text-gray-900">
                Pesquisar
              </Text>
            </Pressable>

            <TouchableOpacity
              className="p-3 bg-secondary rounded-2xl items-center"
              onPress={() => setisSarching(!isSarching)}
            >
              <Feather name={"camera"} size={22} color={colors.borderDark} />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="h-56">
            <CameraView
              style={{ flex: 1 }}
              enableTorch={torch}
              facing="back"

              barcodeScannerSettings={{
                barcodeTypes: [
                  "ean13",
                  "ean8",
                  "upc_a",
                  "upc_e",
                  "code128",
                  "code39",
                ],
              }}
              onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
            />

            <View className="absolute inset-0 items-center justify-center gap-2">
              <View
                style={{
                  borderColor: torch ? colors.secondary : colors.white,
                }}

                className="h-40 w-72 rounded-2xl border-2 "
              >
                <View className="absolute left-4 right-4 top-1/2 h-0.5 bg-secondary" />
              </View>
            </View>
          </View>
        )}
      </View>

      {/* PRODUTOS */}
      <ListProdutsCart
        removeProduct={(id) => removeProduct(Number(id))}
        rmQtd={(id) => rmQdt(id)}
        addQtd={(id) => addQdt(id)}
        products={products}
      />

      {/* TOTAL */}
      <TotalCard
        handleFinishSale={handleFinishSale}
        clearCart={clearCart}
        productsLength={products.length}
        finishingSale={finishingSale}
        total={total}
      />

      <SearchProdutsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        selectProduct={(product) => handleSelectProduct(product)}
        setisSarching={() => {
          setShowModal(false);
          setisSarching(false);
        }}
      />
    </View>
  );
}
