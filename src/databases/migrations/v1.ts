import { SQLiteDatabase } from "expo-sqlite";
import { seedDatabase } from "../seeds";

export async function migrateV1(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- =========================================
    -- USUÁRIOS
    -- =========================================
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT,
      nome TEXT NOT NULL,
      senha TEXT,
      email TEXT,
      photo TEXT,
      telefone TEXT
    );

    -- =========================================
    -- CATEGORIAS
    -- =========================================
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      ativo INTEGER NOT NULL DEFAULT 1
    );

    -- =========================================
    -- PRODUTOS
    -- =========================================
    CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria_id INTEGER,
      nome TEXT NOT NULL,
      descricao TEXT,
      preco REAL NOT NULL DEFAULT 0,
      preco_compra REAL NOT NULL DEFAULT 0,
      estoque INTEGER NOT NULL DEFAULT 0,
      estoque_minimo INTEGER NOT NULL DEFAULT 2,
      unit TEXT,
      imagem TEXT,
      codigo_barras TEXT,
      ativo INTEGER NOT NULL DEFAULT 1,
      data_cadastro TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE SET NULL
    );

    -- =========================================
    -- VENDAS
    -- =========================================
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total REAL NOT NULL DEFAULT 0,
      desconto REAL NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'concluida',
      data_venda TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    -- =========================================
    -- ITENS DA VENDA
    -- =========================================
    CREATE TABLE IF NOT EXISTS itens_venda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER NOT NULL,
      produto_id INTEGER NOT NULL,
      quantidade INTEGER NOT NULL,
      preco_unitario REAL NOT NULL,
      subtotal REAL NOT NULL,

      FOREIGN KEY (venda_id)
        REFERENCES vendas(id)
        ON DELETE CASCADE,

      FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE RESTRICT
    );

    -- =========================================
    -- PAGAMENTOS
    -- =========================================
    CREATE TABLE IF NOT EXISTS pagamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER NOT NULL,
      metodo TEXT NOT NULL,
      valor REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'pago',
      data_pagamento TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (venda_id)
        REFERENCES vendas(id)
        ON DELETE CASCADE
    );

    -- =========================================
    -- MOVIMENTOS DE ESTOQUE
    -- =========================================
    CREATE TABLE IF NOT EXISTS movimentos_estoque (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      quantidade INTEGER NOT NULL,
      motivo TEXT,
      data_movimento TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
        ON DELETE CASCADE
    );

    -- =========================================
    -- ÍNDICES
    -- =========================================

    CREATE INDEX IF NOT EXISTS idx_produtos_categoria
      ON produtos(categoria_id);

    CREATE INDEX IF NOT EXISTS idx_produtos_codigo_barras
      ON produtos(codigo_barras);

    CREATE INDEX IF NOT EXISTS idx_itens_venda_venda
      ON itens_venda(venda_id);

    CREATE INDEX IF NOT EXISTS idx_itens_venda_produto
      ON itens_venda(produto_id);

    CREATE INDEX IF NOT EXISTS idx_pagamentos_venda
      ON pagamentos(venda_id);

    CREATE INDEX IF NOT EXISTS idx_movimentos_produto
      ON movimentos_estoque(produto_id);
  `);

  await seedDatabase(db);
}
