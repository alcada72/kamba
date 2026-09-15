import { AuthResult, ExternalAuthProvider } from "../types/externalLogin";

export class AuthExternalService {
  constructor(private readonly provider: ExternalAuthProvider) {}

  public async login(): Promise<AuthResult | null> {
    return this.provider.signIn();
  }

  public async logout(): Promise<void> {
    return this.provider.signOut();
  }

  public async isAuthenticated(): Promise<boolean> {
    return this.provider.isSignedIn();
  }
}
