import { SQLiteDatabase } from "expo-sqlite";

export async function seedDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    -- =========================================
    -- USUÁRIO
    -- =========================================

    INSERT OR IGNORE INTO usuarios (
      id,
      nome,
      telefone
    )
    VALUES (
      1,
      'Administrador',
      '+244900000000'
    );

    -- =========================================
    -- CATEGORIAS
    -- =========================================

    INSERT OR IGNORE INTO categorias (
      id,
      nome,
      descricao
    )
    VALUES
      (
        1,
        'Bebidas',
        'Refrigerantes, águas e outras bebidas'
      ),
      (
        2,
        'Alimentos',
        'Produtos alimentares'
      ),
      (
        3,
        'Higiene',
        'Produtos de higiene pessoal'
      ),
      (
        4,
        'Limpeza',
        'Produtos para limpeza'
      ),
      (
        5,
        'Eletrônicos',
        'Produtos eletrônicos e acessórios'
      );


    -- =========================================
    -- PRODUTOS
    -- =========================================

    INSERT OR IGNORE INTO produtos (
      id,
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
    VALUES
      (
        1,
        1,
        'Coca-Cola 2L',
        'Refrigerante Coca-Cola 2 litros',
        1500,
        1000,
        20,
        5,
        'Unidade',
        NULL,
        '7894900011517'
      ),

      (
        2,
        1,
        'Água Mineral 500ml',
        'Água mineral sem gás 500ml',
        500,
        300,
        50,
        10,
        'Unidade',
        NULL,
        '7891234567890'
      ),

      (
        3,
        2,
        'Arroz 5kg',
        'Arroz branco 5kg',
        4500,
        3500,
        15,
        5,
        'Unidade',
        NULL,
        '7891234567891'
      ),

      (
        4,
        2,
        'Açúcar 1kg',
        'Açúcar branco 1kg',
        1200,
        900,
        30,
        10,
        'Unidade',
        NULL,
        '7891234567892'
      ),

      (
        5,
        3,
        'Sabonete',
        'Sabonete corporal',
        800,
        500,
        40,
        10,
        'Unidade',
        NULL,
        '7891234567893'
      ),

      (
        6,
        4,
        'Detergente 500ml',
        'Detergente líquido 500ml',
        700,
        450,
        25,
        5,
        'Unidade',
        NULL,
        '7891234567894'
      ),

      (
        7,
        5,
        'Cabo USB-C',
        'Cabo USB-C para carregamento',
        2500,
        1500,
        12,
        3,
        'Unidade',
        NULL,
        '7891234567895'
      );
  `);

  console.log("Seed: dados iniciais inseridos.");
}
