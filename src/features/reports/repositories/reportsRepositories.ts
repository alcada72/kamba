import { SQLiteDatabase } from "expo-sqlite";
import {
  CategoryPlusSale,
  ProductPlusSale,
  SaleQuantityByDay,
  SaleReport,
  SalesSummary,
} from "../types/reports";

class ReportsRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  /**
   * Faturamento agrupado por dia.
   */
  public async getSaleDay(): Promise<SaleReport[]> {
    return await this.db.getAllAsync<SaleReport>(
      ` SELECT DATE(data_venda) AS periodo,
       COALESCE(SUM(total), 0) AS faturamento,
       COUNT(*) AS quantidade_vendas 
       FROM vendas 
       WHERE status = 'concluida' 
       GROUP BY DATE(data_venda) 
       ORDER BY periodo; `,
    );
  }

  /** Vendas por semana
   *  strftime('%Y-%W', data_venda)
   *  retorna:
   *  2026-37
   *  2026-38
   *  2026-39
   */

  public async getSaleWeek(): Promise<SaleReport[]> {
    return await this.db.getAllAsync<SaleReport>(
      ` SELECT strftime('%Y-%W', data_venda) AS periodo, 
        COALESCE(SUM(total), 0) AS faturamento,
        COUNT(*) AS quantidade_vendas
        FROM vendas 
        WHERE status = 'concluida'
        GROUP BY strftime('%Y-%W', data_venda)
        ORDER BY periodo; `,
    );
  }

  /** Vendas por mês
   *  Retorna:
   *  2026-01
   *  2026-02
   *  2026-03
   */
  public async getSaleMonth(): Promise<SaleReport[]> {
    return await this.db.getAllAsync<SaleReport>(
      ` SELECT strftime('%Y-%m', data_venda) AS periodo,
       COALESCE(SUM(total), 0) AS faturamento,
       COUNT(*) AS quantidade_vendas
       FROM vendas
       WHERE status = 'concluida'
       GROUP BY strftime('%Y-%m', data_venda)
       ORDER BY periodo; `,
    );
  }

  /**
   * Quantidade de vendas e faturamento agrupados por dia.
   */
  public async getQtdSaleDay(): Promise<SaleQuantityByDay[]> {
    return await this.db.getAllAsync<SaleQuantityByDay>(`
      SELECT
        DATE(data_venda) AS dia,
        COUNT(*) AS quantidade_vendas,
        COALESCE(SUM(total), 0) AS faturamento
      FROM vendas
      WHERE status = 'concluida'
      GROUP BY DATE(data_venda)
      ORDER BY dia;
    `);
  }

  /**
   * Produtos mais vendidos.
   *
   * quantidade_vendida:
   * quantidade total de unidades vendidas.
   *
   * numero_vendas:
   * quantidade de vendas diferentes onde o produto apareceu.
   *
   * faturamento:
   * valor total gerado pelo produto.
   */
  public async getProductsPlusSale(): Promise<ProductPlusSale[]> {
    return await this.db.getAllAsync<ProductPlusSale>(`
      SELECT
        p.id AS produto_id,
        p.nome,
        SUM(iv.quantidade) AS quantidade_vendida,
        COUNT(DISTINCT iv.venda_id) AS numero_vendas,
        COALESCE(SUM(iv.subtotal), 0) AS faturamento
      FROM itens_venda iv
      INNER JOIN produtos p
        ON p.id = iv.produto_id
      INNER JOIN vendas v
        ON v.id = iv.venda_id
      WHERE v.status = 'concluida'
      GROUP BY
        p.id,
        p.nome
      ORDER BY quantidade_vendida DESC;
    `);
  }

  /**
   * Vendas agrupadas por categoria.
   */
  public async getCategoriesPlusSale(): Promise<CategoryPlusSale[]> {
    return await this.db.getAllAsync<CategoryPlusSale>(`
      SELECT
        c.id AS categoria_id,
        COALESCE(c.nome, 'Sem categoria') AS categoria,
        SUM(iv.quantidade) AS quantidade_vendida,
        COALESCE(SUM(iv.subtotal), 0) AS faturamento
      FROM itens_venda iv
      INNER JOIN produtos p
        ON p.id = iv.produto_id
      INNER JOIN vendas v
        ON v.id = iv.venda_id
      LEFT JOIN categorias c
        ON c.id = p.categoria_id
      WHERE v.status = 'concluida'
      GROUP BY
        c.id,
        c.nome
      ORDER BY faturamento DESC;
    `);
  }

  /**
   * Resumo geral das vendas.
   */
  public async getSalesSummary(): Promise<SalesSummary> {
    const result = await this.db.getFirstAsync<SalesSummary>(`
      SELECT
        COUNT(*) AS quantidade_vendas,
        COALESCE(SUM(total), 0) AS faturamento,
        COALESCE(AVG(total), 0) AS ticket_medio
      FROM vendas
      WHERE status = 'concluida';
    `);

    return (
      result ?? {
        quantidade_vendas: 0,
        faturamento: 0,
        ticket_medio: 0,
      }
    );
  }
}

export default ReportsRepository;
