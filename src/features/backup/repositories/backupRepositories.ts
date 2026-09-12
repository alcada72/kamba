import { SQLiteDatabase } from "expo-sqlite";
import { TBackup } from "../types/backup";

export default class BackupRepositories {
  constructor(private readonly db: SQLiteDatabase) {}

  public async getBackupDatabase(): Promise<string> {
    try {
      const [
        usuarios,
        categorias,
        produtos,
        faturas,
        vendas,
        itensVenda,
        pagamentos,
        movimentosEstoque,
      ] = await Promise.all([
        this.db.getAllAsync("SELECT * FROM usuarios"),
        this.db.getAllAsync("SELECT * FROM categorias"),
        this.db.getAllAsync("SELECT * FROM produtos"),
        this.db.getAllAsync("SELECT * FROM faturas"),
        this.db.getAllAsync("SELECT * FROM vendas"),
        this.db.getAllAsync("SELECT * FROM itens_venda"),
        this.db.getAllAsync("SELECT * FROM pagamentos"),
        this.db.getAllAsync("SELECT * FROM movimentos_estoque"),
      ]);

      const backup: TBackup = {
        version: 1,
        created_at: new Date().toISOString(),
        data: {
          usuarios,
          categorias,
          produtos,
          faturas,
          vendas,
          itens_venda: itensVenda,
          pagamentos,
          movimentos_estoque: movimentosEstoque,
        },
      };

      return JSON.stringify(backup);
    } catch (error) {
      console.error("Erro ao criar backup do banco de dados:", error);
      throw new Error("Erro ao criar backup do banco de dados: " + error);
    }
  }

  public async setBackupDatabease() {}
}

/* 
O que foi melhorado
Promise.all: as consultas independentes são executadas em paralelo, em vez de uma esperar a outra.
Tipo de retorno explícito: Promise<string> deixa claro que o método retorna uma string JSON.
throw error: quem chama getBackupDatabase() consegue tratar o erro. No código original, um erro faria o método terminar sem retornar nada.
console.error: mais apropriado para erros.
Mantive version: 1, o que é útil para futuramente fazer migrações de formato do backup.
Um ponto importante: se esse backup for usado para restaurar o banco depois, eu recomendaria
também incluir a estrutura/versão do schema e definir uma ordem de restauração baseada nas foreign keys. Isso evita problemas ao importar, por exemplo, itens_venda antes de vendas ou produtos ou ainda faturas antes da venda. */
