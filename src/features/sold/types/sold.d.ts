export interface SaleCartItem {
  productId: number;
  quantity: number;
}

export type PaymentMethod = "dinheiro" | "cartao" | "transferencia" | "pix";

export interface CreateSaleDTO {
  items: SaleCartItem[];
  desconto?: number;
  pagamento: {
    metodo: PaymentMethod;
    valor: number;
  };
}

export interface SaleResult {
  saleId: number;
  total: number;
}

export interface RecentSale {
  id: number;
  total: number;
  desconto: number;
  status: string;
  data_venda: string;
}


export interface CartProduct {
  id: number;
  barcode: string | null;
  name: string;
  price: number;
  quantity: number;
}