import { IAuth } from "./../types/login";

export class AuthService {
  constructor(private readonly iAuth: IAuth) {}

  /**
   * Metodo para fazer login
   * @param id
   * @param senha
   * @returns Promise<boolean>
   */
  public async login(id: number | string, senha: string) {
    if (!id || !senha) return false;

    return await this.iAuth.login(id, senha);
  }

  /**
   * logout
   */
  public async logout() {
    return await this.iAuth.logout();
  }
}
