import { SQLiteDatabase } from "expo-sqlite";
import { CreateProductDTO, Product, UpdateProductDTO } from "../types/product";

export class ProductRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async create(data: CreateProductDTO): Promise<number> {
    if (!data.nome.trim()) {
      throw new Error("O nome do produto é obrigatório.");
    }

    if (data.preco < 0) {
      throw new Error("O preço de venda não pode ser negativo.");
    }

    if ((data.preco_compra ?? 0) < 0) {
      throw new Error("O preço de compra não pode ser negativo.");
    }

    if ((data.estoque ?? 0) < 0) {
      throw new Error("O estoque não pode ser negativo.");
    }

    const result = await this.db.runAsync(
      `
      INSERT INTO produtos (
        categoria_id,
        nome,
        descricao,
        preco,
        preco_compra,
        estoque,
        estoque_minimo,
        unit,
        imagem,
        codigo_barras
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        data.categoria_id ?? null,
        data.nome.trim(),
        data.descricao ?? null,
        data.preco,
        data.preco_compra ?? 0,
        data.estoque ?? 0,
        data.estoque_minimo ?? 2,
        data.unit ?? "Unidade",
        data.imagem ?? null,
        data.codigo_barras?.trim() || null,
      ],
    );

    return result.lastInsertRowId;
  }

  async findAll(): Promise<Product[]> {
    return await this.db.getAllAsync<Product>(
      `
        SELECT *
        FROM produtos
        WHERE ativo = 1
        ORDER BY nome ASC
      `,
    );
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.db.getFirstAsync<Product>(
      `
        SELECT *
        FROM produtos
        WHERE id = ?
        LIMIT 1
      `,
      [id],
    );

    return product ?? null;
  }

  async findByBarcode(codigoBarras: string): Promise<Product | null> {
    const product = await this.db.getFirstAsync<Product>(
      `
        SELECT *
        FROM produtos
        WHERE codigo_barras = ?
        LIMIT 1
      `,
      [codigoBarras],
    );

    return product ?? null;
  }

  async update(id: number, data: UpdateProductDTO): Promise<void> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (data.categoria_id !== undefined) {
      fields.push("categoria_id = ?");
      values.push(data.categoria_id);
    }

    if (data.nome !== undefined) {
      fields.push("nome = ?");
      values.push(data.nome);
    }

    if (data.descricao !== undefined) {
      fields.push("descricao = ?");
      values.push(data.descricao);
    }

    if (data.preco !== undefined) {
      fields.push("preco = ?");
      values.push(data.preco);
    }

    if (data.preco_compra !== undefined) {
      fields.push("preco_compra = ?");
      values.push(data.preco_compra);
    }

    if (data.estoque !== undefined) {
      fields.push("estoque = ?");
      values.push(data.estoque);
    }

    if (data.estoque_minimo !== undefined) {
      fields.push("estoque_minimo = ?");
      values.push(data.estoque_minimo);
    }

    if (data.unit !== undefined) {
      fields.push("unit = ?");
      values.push(data.unit);
    }

    if (data.imagem !== undefined) {
      fields.push("imagem = ?");
      values.push(data.imagem);
    }

    if (data.codigo_barras !== undefined) {
      fields.push("codigo_barras = ?");
      values.push(data.codigo_barras);
    }

    if (data.ativo !== undefined) {
      fields.push("ativo = ?");
      values.push(data.ativo);
    }

    if (fields.length === 0) {
      return;
    }

    values.push(id);

    await this.db.runAsync(
      `
        UPDATE produtos
        SET ${fields.join(", ")}
        WHERE id = ?
      `,
      values as any,
    );
  }

  async delete(id: number): Promise<void> {
    await this.db.runAsync(
      `
        UPDATE produtos
        SET ativo = 0
        WHERE id = ?
      `,
      [id],
    );
  }

  async restore(id: number): Promise<void> {
    await this.db.runAsync(
      `
        UPDATE produtos
        SET ativo = 1
        WHERE id = ?
      `,
      [id],
    );
  }

  async findLowStock(): Promise<Product[]> {
    return await this.db.getAllAsync<Product>(
      `
        SELECT *
        FROM produtos
        WHERE ativo = 1
          AND estoque <= estoque_minimo
        ORDER BY estoque ASC
      `,
    );
  }

  async search(query: string): Promise<Product[]> {
    const value = `%${query}%`;

    return await this.db.getAllAsync<Product>(
      `
        SELECT *
        FROM produtos
        WHERE ativo = 1
          AND (
            nome LIKE ?
            OR codigo_barras LIKE ?
          )
        ORDER BY nome ASC
      `,
      [value, value],
    );
  }
}
