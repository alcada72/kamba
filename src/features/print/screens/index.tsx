import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { useLocalSearchParams } from "expo-router";
import { ThermalPrinterDevice } from "react-native-thermal-pos-printer";
import { ThermalPosPrinterAdapter } from "../repositories/adpters/thermalPosPrinterAdapter";
import { PrinterService } from "../repositories/services/printer.service";
import { DadosFatura } from "../types";

const printerService = new PrinterService(new ThermalPosPrinterAdapter());

export const saleMock: DadosFatura = {
  saleId: 123,
  date: "11/09/2026 17:22",
  items: [
    {
      name: "Produto A",
      quantity: 2,
      price: 1500,
      subtotal: 3000,
    },
    {
      name: "Produto B",
      quantity: 1,
      price: 2500,
      subtotal: 2500,
    },
  ],
  total: 5500,
  discount: 0,
  paymentMethod: "dinheiro",
  paidAmount: 6000,
  change: 500,
};

interface PrinterItem {
  device: ThermalPrinterDevice;
}

export default function PrintersScreen() {
  const { fatura_json } = useLocalSearchParams<{ fatura_json: string }>();
  const [printers, setPrinters] = useState<PrinterItem[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<PrinterItem | null>(
    null,
  );

  const [loading, setLoading] = useState(false);
  const [printing, setPrinting] = useState(false);
  const { lang } = useLanguageStore();

  useEffect(() => {
    loadPrinters();
  }, []);

  const loadPrinters = async () => {
    try {
      setLoading(true);

      const devices = await printerService.findAllPrinters();

      const printerItems: PrinterItem[] = devices.map((device) => ({
        device,
      }));

      setPrinters(printerItems);
    } catch (error) {
      console.error("Erro ao procurar impressoras:", error);

      setPrinters([]);

      Alert.alert(
        "Erro",
        error instanceof Error
          ? error.message
          : t("Couldnotfindtheprinters", lang),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrinter = (printer: PrinterItem) => {
    setSelectedPrinter(printer);
  };

  const printFatura = async () => {
    if (!selectedPrinter) {
      Alert.alert(t("Print", lang), t("SelectPrinter", lang));

      return;
    }

    try {
      setPrinting(true);
      await printerService.print(
        JSON.parse(fatura_json) as DadosFatura,
        selectedPrinter.device,
      );

      Alert.alert(t("success", lang), "Documento impresso com sucesso.");
    } catch (error) {
      console.error("Erro de impressão:", error);

      Alert.alert(
        "Erro de impressão",
        error instanceof Error
          ? error.message
          : "Não foi possível imprimir o documento.",
      );
    } finally {
      setPrinting(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-gray-200 bg-primary px-5 pb-4 pt-5">
        <Text className="text-xl font-bold text-secondary">
          {t("Print", lang)}
        </Text>

        <Text className="mt-1 text-sm text-gray-500">
          {t("SelectPrinter", lang)}
        </Text>
      </View>

      <View className="flex-1 p-4">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary} />

            <Text className="mt-4 text-base font-medium text-gray-600">
              {t("LookingPrinters", lang)}
            </Text>
          </View>
        ) : printers.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-center text-base font-semibold text-gray-700">
              {t("NoPrinterFound", lang)}
            </Text>

            <TouchableOpacity
              className="mt-4 rounded-xl bg-primary px-6 py-3"
              onPress={loadPrinters}
              activeOpacity={0.8}
            >
              <Text className="font-bold text-white">
                {t("SearchAgain", lang)}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={printers}
            keyExtractor={(item) =>
              item.device.getAddress() + (item.device.getName() || "")
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            renderItem={({ item }) => {
              const isSelected =
                selectedPrinter?.device.getAddress() ===
                item.device.getAddress();

              return (
                <TouchableOpacity
                  className={`mb-3 flex-row items-center justify-between rounded-2xl border-2 bg-white p-4 ${
                    isSelected ? "border-primary" : "border-gray-200"
                  }`}
                  onPress={() => handleSelectPrinter(item)}
                  activeOpacity={0.8}
                >
                  <View className="flex-1">
                    <Text className="text-base font-bold text-gray-900">
                      {item.device.getName() || "Impressora"}
                    </Text>

                    <Text className="mt-1 text-xs text-gray-500">
                      {item.device.getAddress()}
                    </Text>

                    <Text className="mt-1 text-xs text-gray-400">
                      {item.device.getType()}
                    </Text>
                  </View>

                  {isSelected && (
                    <View className="ml-3 h-7 w-7 items-center justify-center rounded-full bg-primary">
                      <Text className="text-base font-bold text-white">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* Print button */}
        <TouchableOpacity
          onPress={printFatura}
          disabled={!selectedPrinter || printing}
          activeOpacity={0.8}
          className={`mt-4 items-center rounded-2xl p-4 ${
            selectedPrinter && !printing ? "bg-primary" : "bg-gray-300"
          }`}
        >
          {printing ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color={colors.blue} />

              <Text className="ml-2 text-base font-bold text-white">
                {t("Printing", lang)}
              </Text>
            </View>
          ) : (
            <Text className="text-base font-bold text-white">
              {t("Print", lang)}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
