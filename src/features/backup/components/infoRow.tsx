import { Text, View } from "react-native";

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-[7px]">
      <Text className="text-sm text-slate-500">{label}</Text>

      <Text className="max-w-[55%] text-right text-sm font-semibold text-slate-900">
        {value}
      </Text>
    </View>
  );
}
