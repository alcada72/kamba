import { SQLiteDatabase } from "expo-sqlite";
import { Fatura } from "../types/indx";

export class FaturaRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(data: Omit<Fatura, "id">) {
    const result = await this.db.runAsync(
      `
   INSERT INTO faturas (
   venda_id,
   numero,
   fatura_json
   ) 
   VALUES (?,?,?)
    `,
      [data.venda_id, data.numero, data.fatura_json],
    );

    return result.lastInsertRowId;
  }

  async findById(id: number): Promise<Fatura | null> {
    const result = await this.db.getFirstAsync<Fatura>(
      `
    SELECT *
    FROM faturas 
    WHERE id = ? 
    LIMIT 1
    `,
      [id],
    );

    return result ?? null;
  }

  async findByVendaId(venda_id: number): Promise<Fatura | null> {
    const result = await this.db.getFirstAsync<Fatura>(
      `
    SELECT *
    FROM faturas 
    WHERE venda_id = ? 
    LIMIT 1
    `,
      [venda_id],
    );

    return result ?? null;
  }
}
