export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  photo?: string;
  provider: "google" | "facebook";
}

export interface AuthResult {
  user: AuthUser;
  accessToken?: string;
  idToken?: string;
}

export interface ExternalAuthProvider {
  signIn(): Promise<AuthResult | null>;
  signOut(): Promise<void>;
  isSignedIn(): Promise<boolean>;
  getCurrentUser(): Promise<AuthUser | null>;
}
