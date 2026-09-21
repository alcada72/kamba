import { SQLiteBindValue, SQLiteDatabase } from "expo-sqlite";
import { TBackup } from "../types/backup";

type BackupRow = Record<string, unknown>;

export default class BackupRepositories {
  constructor(private readonly db: SQLiteDatabase) {}

  /**
   * ============================================================
   * BACKUP
   * ============================================================
   */
  public async getBackupDatabase(): Promise<string> {
    try {
      const [
        categorias,
        produtos,
        faturas,
        vendas,
        itensVenda,
        pagamentos,
        empresa,
        movimentosEstoque,
      ] = await Promise.all([
        this.db.getAllAsync<BackupRow>("SELECT * FROM categorias ORDER BY id"),

        this.db.getAllAsync<BackupRow>("SELECT * FROM produtos ORDER BY id"),

        this.db.getAllAsync<BackupRow>("SELECT * FROM faturas ORDER BY id"),

        this.db.getAllAsync<BackupRow>("SELECT * FROM vendas ORDER BY id"),

        this.db.getAllAsync<BackupRow>("SELECT * FROM itens_venda ORDER BY id"),

        this.db.getAllAsync<BackupRow>("SELECT * FROM pagamentos ORDER BY id"),

        this.db.getAllAsync<BackupRow>("SELECT * FROM empresa ORDER BY id"),

        this.db.getAllAsync<BackupRow>(
          "SELECT * FROM movimentos_estoque ORDER BY id",
        ),
      ]);

      const backup: TBackup = {
        version: 1,
        created_at: new Date().toISOString(),

        data: {
          categorias,
          produtos,
          faturas,
          vendas,
          itens_venda: itensVenda,
          pagamentos,
          empresa,
          movimentos_estoque: movimentosEstoque,
        },
      };

      return JSON.stringify(backup);
    } catch (error) {
      console.error("Erro ao criar backup do banco de dados:", error);

      throw new Error(
        `Erro ao criar backup do banco de dados: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * ============================================================
   * RESTAURAÇÃO
   * ============================================================
   * Com RollBack
   */
  public async setBackupDatabase(backupJson: string): Promise<void> {
    const backup = this.parseBackup(backupJson);

    await this.db.withTransactionAsync(async () => {
      await this.clearDatabase();

      await this.insertRows("categorias", backup.data.categorias);

      await this.insertRows("produtos", backup.data.produtos);

      await this.insertRows("vendas", backup.data.vendas);

      await this.insertRows("faturas", backup.data.faturas);

      await this.insertRows("itens_venda", backup.data.itens_venda);

      await this.insertRows("pagamentos", backup.data.pagamentos);

      await this.insertRows("empresa", backup.data.empresa);

      await this.insertRows(
        "movimentos_estoque",
        backup.data.movimentos_estoque,
      );

      const violations = await this.db.getAllAsync<{
        table: string;
        rowid: number;
        parent: string;
        fkid: number;
      }>("PRAGMA foreign_key_check");

      if (violations.length > 0) {
        throw new Error(
          `Foram encontradas ${violations.length} violações de foreign key.`,
        );
      }
    });
  }

  /**
   * ============================================================
   * LIMPAR BANCO
   * ============================================================
   *
   * A ordem é inversa à ordem de dependência.
   */
  private async clearDatabase(): Promise<void> {
    await this.db.runAsync("DELETE FROM movimentos_estoque");

    await this.db.runAsync("DELETE FROM pagamentos");

    await this.db.runAsync("DELETE FROM itens_venda");

    await this.db.runAsync("DELETE FROM faturas");

    await this.db.runAsync("DELETE FROM vendas");

    await this.db.runAsync("DELETE FROM produtos");

    await this.db.runAsync("DELETE FROM categorias");
  }

  /**
   * ============================================================
   * INSERT
   * ============================================================
   */
  private async insertRows(
    table:
      | "categorias"
      | "produtos"
      | "faturas"
      | "vendas"
      | "itens_venda"
      | "pagamentos"
      | "movimentos_estoque"
      | "empresa",
    rows: BackupRow[],
  ): Promise<void> {
    if (rows.length === 0) {
      return;
    }

    const columns = Object.keys(rows[0]);

    if (columns.length === 0) {
      return;
    }

    const quotedColumns = columns
      .map((column) => `"${this.escapeIdentifier(column)}"`)
      .join(", ");

    const placeholders = columns.map(() => "?").join(", ");

    const sql = `
      INSERT INTO "${table}"
      (${quotedColumns})
      VALUES (${placeholders})
    `;

    const statement = await this.db.prepareAsync(sql);

    try {
      for (const row of rows) {
        const values = columns.map((column) => row[column]);

        await statement.executeAsync(values as SQLiteBindValue[]);
      }
    } finally {
      await statement.finalizeAsync();
    }
  }

  /**
   * ============================================================
   * VALIDAÇÃO DO BACKUP
   * ============================================================
   */
  private parseBackup(backupJson: string): TBackup {
    let parsed: unknown;

    try {
      parsed = JSON.parse(backupJson);
    } catch {
      throw new Error("O backup não contém um JSON válido.");
    }

    if (!this.isObject(parsed)) {
      throw new Error("Formato de backup inválido.");
    }

    if (parsed.version !== 1) {
      throw new Error(
        `Versão de backup não suportada: ${String(parsed.version)}`,
      );
    }

    if (typeof parsed.created_at !== "string" || !parsed.created_at) {
      throw new Error("O backup não possui created_at válido.");
    }

    if (!this.isObject(parsed.data)) {
      throw new Error("O backup não possui a propriedade data.");
    }

    const tables = [
      "usuarios",
      "categorias",
      "produtos",
      "faturas",
      "vendas",
      "itens_venda",
      "pagamentos",
      "movimentos_estoque",
      "empresa",
    ] as const;

    for (const table of tables) {
      const rows = parsed.data[table];

      if (!Array.isArray(rows)) {
        throw new Error(`A tabela "${table}" precisa ser um array.`);
      }

      for (const row of rows) {
        if (!this.isObject(row)) {
          throw new Error(`Existe um registro inválido em "${table}".`);
        }
      }
    }

    return parsed as unknown as TBackup;
  }

  /**
   * ============================================================
   * HELPERS
   * ============================================================
   */
  private isObject(value: unknown): value is Record<string, any> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private escapeIdentifier(identifier: string): string {
    return identifier.replace(/"/g, '""');
  }
}
