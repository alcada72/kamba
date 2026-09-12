import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { assetsPath } from "@/shared/assets";
import { LoandingModal } from "@/shared/components/loading-modal";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { FontAwesome } from "@expo/vector-icons";
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
  const [message, setmessage] = useState("");

  const db = useSQLiteContext();

  const userRepository = new UserRepository(db);
  const externalAuthService = new AuthExternalService(new GoogleAuthAdapter());

  const handleLogin = async () => {
    setisLoading(true);
    setLogged(true);

    try {
      const res = await externalAuthService.login();
      console.log("Response", res);
      const user = res?.user;
      if (!user) return;
      const creted = await userRepository.update(
        {
          external_id: user.id,
          nome: user.name,
          photo: user.photo,
          email: user.email,
        },
        1,
      );
      console.log(creted);

      if (creted?.lastInsertRowId) {
        setLogged(true);
      }
    } catch (error) {
      console.log("Error login", error);
      setmessage("Verrifica a sua conexão a internet");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary px-6">
      <View className="flex-1 items-center justify-start">
        <View className="items-center pt-16">
          <Image
            source={assetsPath.kamba_logo_gold}
            style={{
              width: 200,
              height: 80,
            }}
            resizeMode="contain"
          />
        </View>

        <View className=" items-center justify-center">
          <Text className="text-center text-3xl font-bold text-white">
            {t("welcome", lang)}
          </Text>
        </View>
      </View>
      {/* Content */}
      <View className="flex-1 items-center justify-center px-5">
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={handleLogin}
          className="w-full bg-background rounded-2xl p-4 flex-row items-center justify-center"
        >
          <FontAwesome name="google" size={22} color={colors.blue} />

          <Text className="text-base font-bold text-gray-800 ml-3">
            {t("continueWithGoogle", lang)}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View className="pb-10 items-center">
        <Text className="text-xs text-white/50 text-center">
          {t("continueWithGoogle", lang)}
        </Text>
      </View>

      <LoandingModal visible={isLoading} />
    </View>
  );
}
