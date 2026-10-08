import { DadosFatura } from "@/features/print/types";

export type Fatura = {
  id: number;
  venda_id: number;
  numero: string;
  fatura_json: string;
};

export type FaturaParsed = Omit<Fatura, "fatura_json"> & {
  fatura_json: DadosFatura;
};

export type CreateFatura = {
  venda_id: number;
  numero: string;
  fatura_json: DadosFatura;
};
