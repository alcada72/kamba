import { useAuthState } from "@/features/auth/store/auth.store";
import { useBackupStore } from "@/features/backup/store/backup.store";
import { useLanguageStore } from "@/store/i18n.store";

export const hydrateStores = async () => {
  await Promise.all([
    useAuthState.persist.rehydrate(),
    useBackupStore.persist.rehydrate(),
    useLanguageStore.persist.rehydrate(),
  ]);
};
