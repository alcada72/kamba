import { SQLiteDatabase } from "expo-sqlite";
import { UpadateUserDTO, User } from "../types/user";

export class UserRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(data: Omit<User, "id">) {
    if (!data.nome.trim()) {
      throw new Error("O nome é obrigatório.");
    }

    try {
      const result = await this.db.runAsync(
        `
        INSERT INTO  usuarios (
        nome,
        senha,
        telefone
        ) VALUES (?, ?, ?)
        `,
        [data.nome, data.senha, data.telefone ?? null],
      );

      return result.lastInsertRowId;
    } catch (error) {
      console.log(error);
    }
  }

  async getFrist(id: number | string = 1): Promise<User | null> {
    const result = await this.db.getFirstAsync<User>(
      `
        SELECT *
        FROM usuarios
        WHERE id = ?        
        `,
      [id],
    );
    return result;
  }

  async getAllUser(): Promise<User[] | null> {
    const result = await this.db.getAllAsync<User>(`
        SELECT * FROM usuarios         
        `);
    return result;
  }

  /**
   * update user
   */
  public async update(data: UpadateUserDTO, id: string | number = 1) {
    const fields: string[] = [];
    const values: unknown[] = [];

    Object.entries(data).forEach(([key, value]) => {
      if (key === "id" || value === undefined) {
        return;
      }

      fields.push(`${key} = ?`);
      values.push(value);
    });

    if (fields.length === 0) {
      return;
    }

    values.push(id);

    return await this.db.runAsync(
      `
      UPDATE usuarios
      SET ${fields.join(", ")}
      WHERE id = ?
    `,
      values as any,
    );
  }
}
