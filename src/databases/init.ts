import { SQLiteDatabase } from "expo-sqlite";
import { migrateV1 } from "./migrations/v1";
import { migrateV2 } from "./migrations/v2";
import { migrateV3 } from "./migrations/v3";

const DATABASE_VERSION = 3;

export async function InitDatabase(db: SQLiteDatabase) {
  const { user_version } = (await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version;",
  )) ?? { user_version: 0 };

  let currentDbVersion = user_version;

  if (currentDbVersion < 1) {
    await migrateV1(db);
    currentDbVersion = 1;
  }

  if (currentDbVersion < 2) {
    await migrateV2(db);
    currentDbVersion = 2;
  }

  if (currentDbVersion < 3) {
    await migrateV3(db);
    currentDbVersion = 3;
  }

  if (currentDbVersion !== DATABASE_VERSION) {
    throw new Error(`Versão do banco inválida: ${currentDbVersion}`);
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);

  console.log(`Banco inicializado. Versão: ${DATABASE_VERSION}`);
}
