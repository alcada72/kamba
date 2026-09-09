import { t, TranslationKey } from "@/shared/i18n";
import { useLanguageStore } from "@/store/i18n.store";
import colors from "@/theme/colos";
import { Feather } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { type ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  link?: Href;
  showBorder?: boolean;
  label: TranslationKey;
  icon?: ComponentProps<typeof Feather>["name"];
  colorIcon?: string;
};

export const NavigationCard = ({
  link,
  showBorder = true,
  label,
  icon,
  colorIcon,
}: Props) => {
  const { lang } = useLanguageStore();

  const content = (
    <View className="flex-row items-center justify-between py-4">
      <View className="flex-1 flex-row items-center">
        {icon && (
          <View className="mr-4 h-10 w-10 items-center justify-center rounded-xl bg-green-50">
            <Feather name={icon} size={25} color={colorIcon || colors.text} />
          </View>
        )}

        <Text className="text-base font-semibold text-text">
          {t(label, lang)}
        </Text>
      </View>

      <Feather name="chevron-right" size={18} color={colors.border} />
    </View>
  );

  if (!link) {
    return (
      <>
        {content}
        {showBorder && <View className="h-px w-full bg-border" />}
      </>
    );
  }

  return (
    <>
      <Link href={link} asChild>
        <Pressable className="active:opacity-50">{content}</Pressable>
      </Link>

      {showBorder && <View className="h-px w-full bg-border" />}
    </>
  );
};
