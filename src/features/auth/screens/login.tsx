import { UserRepository } from "@/features/profile/repositories/userRepositories";
import { assetsPath } from "@/shared/assets";
import { LoandingModal } from "@/shared/components/loading-modal";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { TesteAuthAdapter } from "../repositories/adapters/adpter.test";
import { AuthExternalService } from "../repositories/external.auth.service";
import { useAuthState } from "../store/auth.store";

export default function LoginScreen() {
  const { switchLanguage, lang } = useLanguageStore();
  const { setLogged } = useAuthState();
  const [isLoading, setisLoading] = useState(false);
  const [message, setmessage] = useState("");
  const isPortuguese = lang === "pt";

  const db = useSQLiteContext();

  const userRepository = new UserRepository(db);
  const externalAuthService = new AuthExternalService(new TesteAuthAdapter());

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

          <Pressable
            onPress={switchLanguage}
            className="flex-row items-center justify-between px-4 py-4"
          >
            <View className="flex-row items-center">
              <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl ">
                <Text className="text-2xl">{isPortuguese ? "🇵🇹" : "🇬🇧"}</Text>
              </View>

              <View>
                <Text className="text-lg font-semibold text-white">
                  {t("changelanguage", lang)}
                </Text>

                <Text className=" text-sm text-textSecondary">
                  {isPortuguese ? "Português" : "English"}
                </Text>
              </View>
            </View>
          </Pressable>
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
      <View className="pb-10 gap-2 items-center">
        <Link href={"/(public)/about"}>
          <Text className="text-xs text-white/50 text-center underline">
            {t("about", lang)}
          </Text>
        </Link>
        <Link href={"/(public)/terms"}>
          <Text className="text-xs text-white/50 text-center underline">
            {t("terms", lang)}
          </Text>
        </Link>
        <Link href={"/(public)/privacy"}>
          <Text className="text-xs text-white/50 text-center underline">
            {t("privacy", lang)}
          </Text>
        </Link>
      </View>

      <LoandingModal visible={isLoading} />
    </View>
  );
}
