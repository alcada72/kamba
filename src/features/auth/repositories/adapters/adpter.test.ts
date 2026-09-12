import {
  AuthResult,
  AuthUser,
  ExternalAuthProvider,
} from "../../types/externalLogin";

export class TesteAuthAdapter implements ExternalAuthProvider {
  constructor() {}
  signIn(): Promise<AuthResult | null> {
    throw new Error("Method not implemented.");
  }
  signOut(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  isSignedIn(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getCurrentUser(): Promise<AuthUser | null> {
    throw new Error("Method not implemented.");
  }
}
