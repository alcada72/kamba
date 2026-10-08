import colors from "@/theme/colos";
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from "react-native";

type Props = PressableProps & {
  label: string;
  variant?: "primary" | "secundary" | "outline";
  isLoading?: boolean;
};

export const GeneralButton = ({
  label,
  variant,
  isLoading,
  ...rest
}: Props) => {
  return (
    <Pressable
      className={`mt-4 w-full disabled:bg-primary items-center rounded-2xl py-4
        ${variant === undefined && " bg-primary"}
        ${variant === "primary" && " bg-primary"}
        ${variant === "secundary" && " bg-secondary"}
        ${variant === "outline" && " bg-transparent border border-gray-400"}
        `}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size={"large"} color={colors.border} />
      ) : (
        <Text className="font-bold text-white">{label}</Text>
      )}
    </Pressable>
  );
};
