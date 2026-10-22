import colors from "@/theme/colors";
import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  description?: string;
  info: string;
  onPress?: () => void;
};

export const BannerInfo = ({ description, info, onPress }: Props) => {
  const isInteractive = Boolean(onPress);

  return (
    <Pressable
      onPress={onPress}
      disabled={!isInteractive}
      accessibilityRole={isInteractive ? "button" : undefined}
      accessibilityLabel={isInteractive ? `Ver detalhes: ${info}` : undefined}
      className={`w-full overflow-hidden rounded-2xl bg-primary ${
        isInteractive ? "active:opacity-80" : ""
      }`}
    >
      <View className="flex-row items-center px-4 py-4">
        <View className="mr-4 h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/15">
          <Feather name="info" size={22} color={colors.secondary} />
        </View>

        <View className="flex-1 justify-center">
          <Text
            numberOfLines={2}
            className="text-base font-semibold leading-6 text-secondary"
          >
            {info}
          </Text>

          {!!description && (
            <Text
              numberOfLines={2}
              className="mt-1 text-sm leading-5 text-secondary/70"
            >
              {description}
            </Text>
          )}
        </View>

        {isInteractive && (
          <View className="ml-3 h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/15">
            <Feather name="arrow-up-right" size={20} color={colors.secondary} />
          </View>
        )}
      </View>
    </Pressable>
  );
};
