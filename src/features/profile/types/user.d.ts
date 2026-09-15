export interface User {
  id: string;
  nome: string;
  senha: string;
  telefone?: string;
  email?: string;
  photo?: string;
}

export interface UpadateUserDTO {
  id?: string;
  nome?: string;
  senha?: string;
  telefone?: string;
  email?: string;
  photo?: string;
  external_id?: string;
}
