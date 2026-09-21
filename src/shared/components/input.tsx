import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  required?: boolean;
};

export function Input({ label, required = false, ...rest }: Props) {
  return (
    <View className="mt-5">
      <Text className="mb-2 text-sm font-semibold text-text">
        {label}

        {required && <Text className="text-error"> *</Text>}
      </Text>

      <TextInput
        placeholderTextColor="#8A948F"
        {...rest}
        className="rounded-2xl border border-border bg-surface px-4 py-4 text-base text-text"
      />
    </View>
  );
}
