import { t } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export const GeneralProfileHeader = () => {
  const lang = useLanguageStore((store) => store.lang);
  const [showOptions, setshowOptions] = useState(false);

  const exit = async () => {
    router.push("/(auth)/truncked");
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
        <View className="overflow-hidden rounded-full size-36 items-center justify-end bg-primaryAccent p-4 border border-secondary">
          <FontAwesome name="user" size={90} color={colors.secondary} />
        </View>

        <View className="w-full items-center mt-5 justify-center">
          <Text className="text-3xl text-center text-secondary font-bold">
            Alçada Kilundica
          </Text>
        </View>
      </View>
    </View>
  );
};
