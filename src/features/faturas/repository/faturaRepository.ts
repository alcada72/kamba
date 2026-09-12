import { DadosFatura } from "@/features/print/types";
import { SQLiteDatabase } from "expo-sqlite";
import { CreateFatura, Fatura, FaturaParsed } from "../types/indx";

export class FaturaRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(data: CreateFatura) {
    const result = await this.db.runAsync(
      `
   INSERT INTO faturas (
   venda_id,
   numero,
   fatura_json
   ) 
   VALUES (?,?,?)
    `,
      [data.venda_id, data.numero, JSON.stringify(data.fatura_json)],
    );

    return result.lastInsertRowId;
  }

  async findById(id: number): Promise<FaturaParsed | null> {
    const res = await this.db.getFirstAsync<Fatura>(
      `
    SELECT *
    FROM faturas 
    WHERE id = ? 
    LIMIT 1
    `,
      [id],
    );

    if (!res) return null;

    return {
      ...res,
      fatura_json: JSON.parse(res.fatura_json) as DadosFatura,
    };
  }

  async findByVendaId(venda_id: number): Promise<FaturaParsed | null> {
    const result = await this.db.getFirstAsync<Fatura>(
      `
      SELECT *
      FROM faturas
      WHERE venda_id = ?
      LIMIT 1
    `,
      [venda_id],
    );

    if (!result) return null;

    return {
      ...result,
      fatura_json: JSON.parse(result.fatura_json) as DadosFatura,
    };
  }
}
