import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { InfoRow } from "@/features/backup/components/infoRow";
import formatDate from "@/shared/formate-date";
import getErrorMessage from "@/shared/helpers/getErroMessage";
import { SafeAreaView } from "react-native-safe-area-context";
import { GoogleDriveAdapter } from "../adapters/googleAdapter/googleDriveAdater";
import BackupRepositories from "../repositories/backupRepositories";
import { BackupService } from "../services/backup.service";
import { useBackupStore } from "../store/backup.store";
import { TBackup } from "../types/backup";

export default function RestoreBackupScreen() {
  const db = useSQLiteContext();

  const [backup, setBackup] = useState<TBackup | null>(null);

  const [backupJson, setBackupJson] = useState<string | null>(null);
  const { setDownloadBackupIsCompleted } = useBackupStore();

  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const backupService = new BackupService(new GoogleDriveAdapter());

  const backupRepository = new BackupRepositories(db);

  async function handleLoadBackup() {
    setDownloadBackupIsCompleted(true);
    try {
      setLoading(true);

      const json = await backupService.restore("google_drive");

      if (!json) {
        Alert.alert(
          "Backup não encontrado",
          "Não foi encontrado nenhum backup para este usuário.",
        );

        return;
      }

      const parsed = JSON.parse(json);

      validateBackup(parsed);

      setBackup(parsed);
      setBackupJson(json);
    } catch (error) {
      console.error("Erro ao buscar backup:", error);

      setBackup(null);
      setBackupJson(null);

      Alert.alert("Erro", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  function handleRestore() {
    if (!backupJson) {
      return;
    }

    Alert.alert(
      "Restaurar backup?",
      "Os dados atuais do aplicativo serão substituídos pelos dados do backup. Essa operação não poderá ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Restaurar",
          style: "destructive",
          onPress: restoreDatabase,
        },
      ],
    );
  }

  async function restoreDatabase() {
    if (!backupJson) {
      return;
    }

    try {
      setRestoring(true);

      await backupRepository.setBackupDatabase(backupJson);

      Alert.alert("Sucesso", "O backup foi restaurado com sucesso.", [
        {
          text: "OK",
          onPress: () => {
            setBackup(null);
            setBackupJson(null);
          },
        },
      ]);
    } catch (error) {
      console.error("Erro ao restaurar banco:", error);

      Alert.alert("Erro na restauração", getErrorMessage(error));
    } finally {
      setRestoring(false);
    }
  }

  const totalRecords = backup ? getTotalRecords(backup) : 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-5">
          <Text className="mb-2 text-[28px] font-bold text-slate-900">
            Restaurar backup
          </Text>

          <Text className="text-[15px] leading-[22px] text-slate-500">
            Recupere os dados armazenados no Google Drive.
          </Text>
        </View>

        <View className="mb-5 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <Text className="mb-1.5 text-base font-bold text-orange-700">
            Atenção
          </Text>

          <Text className="text-sm leading-5 text-orange-800">
            A restauração substituirá os dados atuais do aplicativo pelos dados
            armazenados no backup.
          </Text>
        </View>

        {!backup && (
          <Pressable
            className={`min-h-[52px] items-center justify-center rounded-xl bg-blue-600 px-5 ${
              loading ? "opacity-60" : ""
            }`}
            onPress={handleLoadBackup}
            disabled={loading || restoring}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-bold text-white">
                Buscar backup no Google Drive
              </Text>
            )}
          </Pressable>
        )}

        {backup && (
          <>
            <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-[18px]">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-slate-900">
                  Backup encontrado
                </Text>

                <View className="rounded-full bg-green-100 px-2.5 py-1">
                  <Text className="text-xs font-bold text-green-700">
                    Válido
                  </Text>
                </View>
              </View>

              <InfoRow label="Versão" value={String(backup.version)} />

              <InfoRow
                label="Criado em"
                value={formatDate(backup.created_at)}
              />

              <InfoRow label="Registros" value={String(totalRecords)} />
            </View>

            <View className="mb-4 rounded-2xl border border-slate-200 bg-white p-[18px]">
              <Text className="mb-2 text-base font-bold text-slate-900">
                Dados do backup
              </Text>

              <InfoRow
                label="Categorias"
                value={String(backup.data.categorias.length)}
              />

              <InfoRow
                label="Produtos"
                value={String(backup.data.produtos.length)}
              />

              <InfoRow
                label="Vendas"
                value={String(backup.data.vendas.length)}
              />

              <InfoRow
                label="Faturas"
                value={String(backup.data.faturas.length)}
              />

              <InfoRow
                label="Itens de venda"
                value={String(backup.data.itens_venda.length)}
              />

              <InfoRow
                label="Pagamentos"
                value={String(backup.data.pagamentos.length)}
              />

              <InfoRow
                label="Movimentos de estoque"
                value={String(backup.data.movimentos_estoque.length)}
              />
            </View>

            <Pressable
              className={`min-h-[52px] flex-row items-center justify-center gap-2 rounded-xl bg-red-600 px-5 ${
                restoring ? "opacity-60" : ""
              }`}
              onPress={handleRestore}
              disabled={restoring}
            >
              {restoring ? (
                <>
                  <ActivityIndicator color="#fff" />

                  <Text className="text-base font-bold text-white">
                    Restaurando...
                  </Text>
                </>
              ) : (
                <Text className="text-base font-bold text-white">
                  Restaurar backup
                </Text>
              )}
            </Pressable>

            {!restoring && (
              <Pressable
                className="mt-2 min-h-12 items-center justify-center rounded-xl"
                onPress={() => {
                  setBackup(null);
                  setBackupJson(null);
                }}
              >
                <Text className="text-[15px] font-semibold text-blue-600">
                  Buscar novamente
                </Text>
              </Pressable>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function validateBackup(value: unknown): asserts value is TBackup {
  if (typeof value !== "object" || value === null) {
    throw new Error("Formato de backup inválido.");
  }

  const backup = value as Record<string, unknown>;

  if (backup.version !== 1) {
    throw new Error(
      `Versão de backup não suportada: ${String(backup.version)}`,
    );
  }

  if (typeof backup.created_at !== "string") {
    throw new Error("Data de criação do backup inválida.");
  }

  if (typeof backup.data !== "object" || backup.data === null) {
    throw new Error("Dados do backup inválidos.");
  }

  const data = backup.data as Record<string, unknown>;

  const tables = [
    "categorias",
    "produtos",
    "faturas",
    "vendas",
    "itens_venda",
    "pagamentos",
    "movimentos_estoque",
  ];

  for (const table of tables) {
    if (!Array.isArray(data[table])) {
      throw new Error(`A tabela "${table}" não é válida.`);
    }
  }
}

function getTotalRecords(backup: TBackup): number {
  return (
    backup.data.categorias.length +
    backup.data.produtos.length +
    backup.data.faturas.length +
    backup.data.vendas.length +
    backup.data.itens_venda.length +
    backup.data.pagamentos.length +
    backup.data.movimentos_estoque.length
  );
}
