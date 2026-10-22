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
    <View className="w-full overflow-hidden rounded-2xl bg-primary">
      <View className="flex-row items-center px-4 py-5">
        {/* Icon */}
        <View className="mr-4 h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15">
          <Feather name="info" size={23} color={colors.secondary} />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center pr-3">
          <Text
            numberOfLines={2}
            className="text-lg font-semibold text-secondary"
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

        {/* Action */}
        {isInteractive && (
          <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes: ${info}`}
            className="h-11 w-11 items-center justify-center rounded-full bg-secondary/15 active:opacity-60"
            hitSlop={8}
          >
            <Feather name="arrow-up-right" size={21} color={colors.secondary} />
          </Pressable>
        )}
      </View>
    </View>
  );
};
