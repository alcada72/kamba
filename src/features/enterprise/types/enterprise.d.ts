export type Empresa = {
  id: number;
  nome: string;
  nif: string | null;
  telefone: string;
  endereco: string;
};

export type CreateEmpresaDTO = {
  nome: string;
  nif: string | null;
  telefone: string;
  endereco: string;
};

export type UpdateEmpresaDTO = {
  nome?: string;
  nif?: string;
  telefone?: string;
  endereco?: string;
};
