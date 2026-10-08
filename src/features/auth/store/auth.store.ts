import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isLogged: boolean;
  isTrunckedApp: boolean;
  inactiveAt: number | null;
  activeTrunckedApp: boolean;

  setInactiveAt: (value: number | null) => void;
  setActiveTrunckedApp: (value: boolean) => void;
  setLogged(value: boolean): void;
  setTruncked(value: boolean): void;
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

export const useAuthState = create<AuthState>()(
  persist(
    (set) => ({
      isLogged: false,
      isTrunckedApp: false,
      activeTrunckedApp: false,
      inactiveAt: null,

      setLogged: (value: boolean) => set({ isLogged: value }),

      setTruncked: (value: boolean) => set({ isTrunckedApp: value }),

      setInactiveAt: (value: number | null) => set({ inactiveAt: value }),
      setActiveTrunckedApp: (value: boolean) =>
        set({ activeTrunckedApp: value }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
    },
  ),
);
