import { SQLiteDatabase } from "expo-sqlite";
import { Venda } from "../types";

export interface RecentSale {
  id: number;
  total: number;
  desconto: number;
  status: string;
  data_venda: string;
}

export class VendasRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async getSales(): Promise<RecentSale[]> {
    return await this.db.getAllAsync<RecentSale>(
      `
        SELECT
          id,
          total,
          desconto,
          status,
          data_venda
        FROM vendas
        WHERE status = 'concluida'
        ORDER BY datetime(data_venda) DESC
      `,
    );
  }

  async getSaleById(id: number): Promise<Venda | null> {
    const rows = await this.db.getAllAsync<any>(
      `
      SELECT
        vendas.id AS venda_id,
        vendas.total,
        vendas.desconto,
        vendas.status,
        vendas.data_venda,

        itens_venda.id AS item_id,
        itens_venda.quantidade,
        itens_venda.preco_unitario,
        itens_venda.subtotal,

        produtos.id AS produto_id,
        produtos.nome AS produto_nome,
        produtos.preco AS produto_preco,

        faturas.id AS fatura_id,
        faturas.numero AS fatura_numero,
        faturas.fatura_json

      FROM vendas

      LEFT JOIN itens_venda
        ON itens_venda.venda_id = vendas.id

      LEFT JOIN produtos
        ON produtos.id = itens_venda.produto_id

      LEFT JOIN faturas
        ON faturas.venda_id = vendas.id

      WHERE vendas.id = ?
    `,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    const first = rows[0];

    const venda: Venda = {
      id: first.venda_id,
      total: first.total,
      desconto: first.desconto,
      status: first.status,
      data_venda: first.data_venda,

      itens: rows
        .filter((row) => row.item_id !== null)
        .map((row) => ({
          id: row.item_id,
          quantidade: row.quantidade,
          preco_unitario: row.preco_unitario,
          subtotal: row.subtotal,

          produto: {
            id: row.produto_id,
            nome: row.produto_nome,
            preco: row.produto_preco,
          },
        })),

      fatura: first.fatura_id
        ? {
            id: first.fatura_id,
            numero: first.fatura_numero,
            fatura_json: JSON.parse(first.fatura_json),
          }
        : null,
    };

    return venda;
  }
}
