export interface User {
  id: string;
  nome: string;
  senha: string | null;
  telefone?: string;
  email?: string;
  photo?: string;
}

export interface UpadateUserDTO {
  id?: string;
  nome?: string;
  senha?: string | null;
  telefone?: string;
  email?: string;
  photo?: string;
  external_id?: string;
}
