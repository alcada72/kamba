import { SQLiteDatabase } from "expo-sqlite";

export async function migrateV2(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS faturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER NOT NULL,
      numero TEXT,
      fatura_json TEXT NOT NULL,
      criado_em TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (venda_id)
        REFERENCES vendas(id)
        ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX IF NOT EXISTS idx_faturas_venda_id_unique
      ON faturas(venda_id);
  `);
}
