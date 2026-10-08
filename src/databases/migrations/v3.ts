import { SQLiteDatabase } from "expo-sqlite";

export async function migrateV3(db: SQLiteDatabase) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS empresa (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,
      endereco TEXT NOT NULL,
      nif TEXT
    );
  `);
}
