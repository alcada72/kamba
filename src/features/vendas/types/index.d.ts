export interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export interface ItemVenda {
  id: number;
  quantidade: number;
  preco_unitario: number;
  subtotal: number;
  produto: Produto;
}

export interface Fatura {
  id: number;
  numero: string | null;
  fatura_json: string;
}

export interface Venda {
  id: number;
  total: number;
  desconto: number;
  status: string;
  data_venda: string;
  itens: ItemVenda[];
  fatura: Fatura | null;
}
