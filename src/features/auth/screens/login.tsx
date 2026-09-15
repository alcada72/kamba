import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { assetsPath } from "@/shared/assets";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { FontAwesome } from "@expo/vector-icons";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GoogleAuthAdapter } from "../repositories/adapters/GoogleAuthAdapter";
import { AuthExternalService } from "../repositories/external.auth.service";
import { useAuthState } from "../store/auth.store";

export default function LoginScreen() {
  const lang = useLanguageStore((stt) => stt.lang);
  const { setLogged } = useAuthState();
  const [isLoading, setisLoading] = useState(false);

  const db = useSQLiteContext();

  const userRepository = new UserRepository(db);
  const externalAuthService = new AuthExternalService(new GoogleAuthAdapter());

  const handleLogin = async () => {
    setisLoading(true);
    try {
      const res = await externalAuthService.login();
      console.log(res);
      const user = res?.user;
      if (user) {
        await userRepository.update(
          {
            external_id: user.id,
            nome: user.name,
            photo: user.photo,
            email: user.email,
          },
          1,
        );
        setLogged(true);
      }
    } catch (error) {
      console.log("Error login", error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary px-6">
      {/* Logo */}
      <View className="pt-16 items-center">
        <Image
          source={assetsPath.kamba_logo_green}
          style={{ width: 80, height: 80 }}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-bold text-white text-center">
          {t("welcome", lang)}
        </Text>
        <Text className="text-base text-white/70 text-center mt-3 mb-10">
          {t("signInWithGoogle", lang)}
        </Text>

        {/* Google Login */}
        <GoogleSigninButton
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={handleLogin}
          disabled={isLoading}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={handleLogin}
          className="w-full bg-white rounded-2xl p-4 flex-row items-center justify-center"
        >
          <FontAwesome name="google" size={22} color={colors.blue} />

          <Text className="text-base font-bold text-gray-800 ml-3">
            {t("signInWithGoogle", lang)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="pb-10 items-center">
        <Text className="text-xs text-white/50 text-center">
          {t("continueWithGoogle", lang)}
        </Text>
      </View>
    </View>
  );
}
