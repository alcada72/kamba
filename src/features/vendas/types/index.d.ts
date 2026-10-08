import { Fatura } from "@/features/faturas/types/indx";

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

export interface Venda {
  id: number;
  total: number;
  desconto: number;
  status: string;
  data_venda: string;
  itens: ItemVenda[];
  fatura: Fatura | null;
}
