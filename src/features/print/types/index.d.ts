import { PaymentMethod } from "@/shared/types/PaymentMethod";

export type FacturaLargura = "58mm" | "80mm";

export type ItemDaFatura = {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type DadosFatura = {
  saleId: number;
  date: string;
  items: ItemDaFatura[];
  total: number;
  discount?: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  change: number;
};

export interface IPrint<IPrinter> {
  print(data: DadosFatura, printer: IPrinter): Promise<void>;
  findAllDevicesPrint(): Promise<IPrinter[]>;
}
