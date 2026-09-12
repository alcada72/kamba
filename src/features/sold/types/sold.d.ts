import { PaymentMethod } from "@/shared/types/PaymentMethod";

export type SaleCartItem = {
  productId: number;
  quantity: number;
};

export type CreateSaleDTO = {
  items: SaleCartItem[];
  desconto?: number;
  pagamento: {
    metodo: PaymentMethod;
    valor: number;
  };
};

export type SaleResult = {
  saleId: number;
  total: number;
};

export type RecentSale = {
  id: number;
  total: number;
  desconto: number;
  status: string;
  data_venda: string;
};

export type CartProduct = {
  id: number;
  barcode: string | null;
  name: string;
  price: number;
  quantity: number;
};
