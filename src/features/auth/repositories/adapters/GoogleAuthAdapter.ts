import {
  GoogleSignin,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import {
  AuthResult,
  AuthUser,
  ExternalAuthProvider,
} from "../../types/externalLogin";

export class GoogleAuthAdapter implements ExternalAuthProvider {
  async getCurrentUser(): Promise<AuthUser | null> {
    const currentUser = await GoogleSignin.getCurrentUser();
    const user = currentUser?.user;

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      photo: user.photo ?? undefined,
      provider: "google",
    };
  }

  async signIn(): Promise<AuthResult | null> {
    try {
      await this.hasPlayService();
      const response = await GoogleSignin.signIn();

      if (!isSuccessResponse(response)) {
        return null;
      }

      const user = response.data.user;

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          photo: user.photo ?? undefined,
          provider: "google",
        },
        idToken: response.data.idToken ?? undefined,
      };
    } catch (error: any) {
      console.log("Erro ao fazer login com Google", error);

      if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error("Google Play Services não disponível");
      }

      throw new Error("Erro ao fazer login com Google");
    }
  }

  async getAccessToken(): Promise<string> {
    const { accessToken } = await GoogleSignin.getTokens();

    return accessToken;
  }

  async signOut(): Promise<void> {
    await GoogleSignin.signOut();
  }

  async isSignedIn(): Promise<boolean> {
    return await GoogleSignin.hasPreviousSignIn();
  }

  async hasPlayService() {
    return await GoogleSignin.hasPlayServices();
  }
}
