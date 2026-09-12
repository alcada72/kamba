import { useAuthState } from "@/features/auth/store/auth.store";
import { User } from "@/features/profile/types/user";
import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

interface Props {
  user: User | undefined;
}

export const GeneralProfileHeader = ({ user }: Props) => {
  const lang = useLanguageStore((store) => store.lang);
  const [showOptions, setshowOptions] = useState(false);
  const { setLogged } = useAuthState();
  const exit = async () => {
    setLogged(false);
  };

  return (
    <View className="w-full bg-primary h-96 rounded-b-3xl">
      <View className="flex-row absolute w-full top-11 px-4 left-0 items-center justify-between">
        <Pressable
          onPress={() => router.back()}
          className="rounded-full size-11 
         bg-primaryAccent items-center justify-center"
        >
          <Feather name="chevron-left" size={25} color={colors.secondary} />
        </Pressable>
        <View>
          <Pressable
            onPress={() => setshowOptions(!showOptions)}
            className="rounded-full size-11 
         bg-primaryAccent items-center justify-center"
          >
            <Feather
              name="more-horizontal"
              size={25}
              color={colors.secondary}
            />
          </Pressable>

          <View
            style={{ display: showOptions ? "flex" : "none" }}
            className="bg-background mt-12 right-0 w-48 z-40 p-2 absolute top-0 h-20 rounded-lg"
          >
            <TouchableOpacity
              onPress={exit}
              className="px-2 border-b-[0.5px] border-b-primary"
            >
              <Text className="text-lg font-medium text-red-700">
                {t("logout", lang)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-2 border-b border-b-primary">
              <Text className="text-lg font-medium text-gray-700">
                {t("editProfile", lang)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="w-full items-center justify-center h-full gap-2">
        <View
          className="overflow-hidden rounded-full size-40 items-center
         justify-center bg-primaryAccent  border-2 border-secondary"
        >
          {user?.photo ? (
            <Image
              source={{ uri: user?.photo }}
              width={200}
              height={200}
              resizeMode="cover"
              className="bg-gray-400 size-full rounded-full"
            />
          ) : (
            <FontAwesome name="user" size={160} color={colors.secondary} />
          )}
        </View>

        <View className="w-full items-center mt-5 justify-center">
          <Text className="text-3xl text-center text-secondary font-bold">
            {user?.nome}
          </Text>
          {user?.email && (
            <Text className="text-2xl text-center text-gold-400 font-bold">
              {user?.email}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};
