import { GoogleSignin } from "@react-native-google-signin/google-signin";
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
    await GoogleSignin.hasPlayServices();

    const response = await GoogleSignin.signIn();

    const user = response.data?.user;
    if (!user) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? undefined,
        photo: user.photo ?? undefined,
        provider: "google",
      },
      idToken: response.data?.idToken ?? undefined,
    };
  }

  async signOut(): Promise<void> {
    await GoogleSignin.signOut();
  }

  async isSignedIn(): Promise<boolean> {
    return await GoogleSignin.hasPreviousSignIn();
  }
}
