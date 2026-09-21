export type SaleReport = {
  periodo: string;
  faturamento: number;
  quantidade_vendas: number;
};

export type SaleQuantityByDay = {
  dia: string;
  quantidade_vendas: number;
  faturamento: number;
};

export type ProductPlusSale = {
  produto_id: number;
  nome: string;
  quantidade_vendida: number;
  numero_vendas: number;
  faturamento: number;
};

export type CategoryPlusSale = {
  categoria_id: number | null;
  categoria: string;
  quantidade_vendida: number;
  faturamento: number;
};

export type SalesSummary = {
  quantidade_vendas: number;
  faturamento: number;
  ticket_medio: number;
};
