import { SQLiteDatabase } from "expo-sqlite";
import {
  CreateEmpresaDTO,
  Empresa,
  UpdateEmpresaDTO,
} from "../types/enterprise";

class EnterpriseRepository {
  constructor(private readonly db: SQLiteDatabase) {}
  /**
   * create
   * @param data
   */
  public async create(data: CreateEmpresaDTO) {
    if (!data.nome.trim()) {
      throw new Error("O nome da empresa é obrigatório.");
    }

    const result = await this.db.runAsync(
      `
        INSET INTO empresa (
        nome,
        nif,
        telefone,
        endereco
        )  
        VALUES (?,?,?,?) 
    `,
      [data.nome.trim(), data.nif ?? null, data.telefone, data.endereco],
    );

    return result.lastInsertRowId;
  }

  /**
   * update
   * @param id
   * @param data
   */
  public async update(id: number, data: UpdateEmpresaDTO) {
    const fields: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, v]) => {
      if (key === "id" || v === undefined) {
        return;
      }
      fields.push(`${key} = ?`);
      values.push(v);
    });

    if (fields.length === 0) {
      return;
    }

    values.push(id);

    const result = await this.db.runAsync(
      `
        UPDATE empresa
        SET ${fields.join(", ")}
        WHERE id = ?
      `,
      values as any,
    );

    return result.lastInsertRowId;
  }

  /**
   * getById
   * @param [id]
   */
  public async getById(id: number = 1): Promise<Empresa | null> {
    const result = await this.db.getFirstAsync<Empresa>(
      `
      SELECT * FROM empresa WHERE id = ?
    `,
      [id],
    );
    return result;
  }
}
export default EnterpriseRepository;
