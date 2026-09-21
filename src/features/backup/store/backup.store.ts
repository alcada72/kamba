import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface BackupState {
  downloadBackupIsCompleted: boolean;
  setDownloadBackupIsCompleted(value: boolean): void;
}

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },

  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useBackupStore = create<BackupState>()(
  persist(
    (set) => ({
      downloadBackupIsCompleted: false,
      setDownloadBackupIsCompleted: (value) =>
        set({ downloadBackupIsCompleted: value }),
    }),
    {
      name: "backup-store",
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
