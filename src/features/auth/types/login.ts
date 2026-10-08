export interface IAuth {
  login(id: number | string, senha: string): Promise<boolean>;
  logout(): Promise<void>;
}
