export type ReceiptWidth = "58mm" | "80mm";

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface ReceiptData {
  saleId: number;
  date: string;
  items: ReceiptItem[];
  total: number;
  discount?: number;
  paymentMethod: string;
  paidAmount: number;
  change: number;
}

interface PrintOptions {
  width?: ReceiptWidth;
}