import { IAuth } from "./../types/login";

export class AuthService {
  constructor(private readonly iAuth: IAuth) {}

  async login(id: number | string, senha: string) {
    if (!id || !senha) return false;

    return await this.iAuth.login(id, senha);
  }
}
